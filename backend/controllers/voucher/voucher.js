const asyncHandler = require("express-async-handler");
const ErrorResponse = require("../../utilitis/errorResponse");
const Voucher = require("../../models/Voucher");
const VendorVoucherRule = require("../../models/VendorVoucherRule");

// @desc    Validate a voucher code against the current cart
// @route   POST /api/vouchers/validate
// @access  Public
exports.validateVoucher = asyncHandler(async (req, res, next) => {
  const { code, orderTotal, cartItems = [] } = req.body;
  if (!code) return next(new ErrorResponse("Cod lipsă", 400));

  const voucher = await Voucher.findOne({ code: code.toUpperCase().trim(), active: true });

  if (!voucher) return res.json({ valid: false, message: "Cod invalid sau expirat" });
  if (voucher.expiresAt && voucher.expiresAt < new Date())
    return res.json({ valid: false, message: "Codul a expirat" });
  if (voucher.isRedeemed)
    return res.json({ valid: false, message: "Codul a fost deja folosit" });

  // reward vouchers are personal — validate ownership
  if (voucher.scope === "reward" && voucher.issuedTo) {
    const userId = req.user?._id ?? req.user?.id;
    if (!userId || voucher.issuedTo.toString() !== userId.toString())
      return res.json({ valid: false, message: "Codul nu îți aparține" });
  }

  // ── Vendor-specific voucher ──────────────────────────────────
  if (voucher.vendorId) {
    const vendorStr = voucher.vendorId.toString();
    const pinned    = voucher.productIds.map((id) => id.toString());

    const eligibleItems = cartItems.filter((item) => {
      const itemVendor = item.vendorId?.toString?.() ?? item.vendorId;
      if (itemVendor !== vendorStr) return false;
      if (pinned.length > 0 && !pinned.includes(item.productId?.toString?.())) return false;
      return true;
    });

    if (eligibleItems.length === 0)
      return res.json({ valid: false, message: "Codul nu e valabil pentru produsele din coș" });

    const eligibleSubtotal = eligibleItems.reduce((s, i) => s + (i.price * (i.quantity ?? 1)), 0);

    if (eligibleSubtotal < voucher.minOrder)
      return res.json({ valid: false, message: `Valoare minimă eligibilă: ${voucher.minOrder} RON` });

    const discount = voucher.type === "percent"
      ? Math.round(eligibleSubtotal * voucher.value) / 100
      : Math.min(voucher.value, eligibleSubtotal);

    return res.json({
      valid: true,
      scope: "vendor",
      code: voucher.code,
      type: voucher.type,
      value: voucher.value,
      discount,
      eligibleSubtotal,
      eligibleProductIds: eligibleItems.map((i) => i.productId),
      description: voucher.type === "percent" ? `-${voucher.value}%` : `-${voucher.value} RON`,
    });
  }

  // ── Global voucher ───────────────────────────────────────────
  const total = Number(orderTotal) || 0;
  if (total < voucher.minOrder)
    return res.json({ valid: false, message: `Comandă minimă: ${voucher.minOrder} RON` });

  const discount = voucher.type === "percent"
    ? Math.round(total * voucher.value) / 100
    : voucher.value;

  res.json({
    valid: true,
    scope: "global",
    code: voucher.code,
    type: voucher.type,
    value: voucher.value,
    discount,
    eligibleProductIds: [],
    description: voucher.type === "percent" ? `-${voucher.value}%` : `-${voucher.value} RON`,
  });
});

// @desc    Create a voucher (vendor = own products; admin = global or any vendor)
// @route   POST /api/vouchers
// @access  Private (vendor | admin)
exports.createVoucher = asyncHandler(async (req, res, next) => {
  const { code, type, value, minOrder, expiresAt, productIds } = req.body;
  const isAdmin = req.user.role === "admin";

  if (!code || !type || value == null)
    return next(new ErrorResponse("code, type și value sunt obligatorii", 400));
  if (!["percent", "fixed"].includes(type))
    return next(new ErrorResponse("type trebuie să fie percent sau fixed", 400));
  if (type === "percent" && (value <= 0 || value > 100))
    return next(new ErrorResponse("Procentul trebuie să fie între 1 și 100", 400));
  if (type === "fixed" && value <= 0)
    return next(new ErrorResponse("Valoarea fixă trebuie să fie pozitivă", 400));

  const vendorId = isAdmin ? (req.body.vendorId ?? null) : req.user._id;

  const existing = await Voucher.findOne({ code: code.toUpperCase().trim() });
  if (existing) return next(new ErrorResponse("Codul există deja", 409));

  const voucher = await Voucher.create({
    code,
    type,
    value,
    minOrder:   minOrder   ?? 0,
    expiresAt:  expiresAt  ?? null,
    vendorId,
    productIds: productIds ?? [],
  });

  res.status(201).json({ success: true, data: voucher });
});

// @desc    List own vouchers (vendor) or all (admin)
// @route   GET /api/vouchers
// @access  Private (vendor | admin)
exports.listVouchers = asyncHandler(async (req, res) => {
  const isAdmin = req.user.role === "admin";
  const filter  = isAdmin ? {} : { vendorId: req.user._id };
  const vouchers = await Voucher.find(filter).sort("-createdAt");
  res.json({ success: true, count: vouchers.length, data: vouchers });
});

// @desc    Toggle active status
// @route   PATCH /api/vouchers/:id/toggle
// @access  Private (owner vendor | admin)
exports.toggleVoucher = asyncHandler(async (req, res, next) => {
  const voucher = await Voucher.findById(req.params.id);
  if (!voucher) return next(new ErrorResponse("Voucher negăsit", 404));

  const isAdmin = req.user.role === "admin";
  const isOwner = voucher.vendorId?.toString() === req.user._id.toString();
  if (!isAdmin && !isOwner) return next(new ErrorResponse("Acces interzis", 403));

  voucher.active = !voucher.active;
  await voucher.save();
  res.json({ success: true, data: voucher });
});

// @desc    Get buyer's own reward vouchers
// @route   GET /api/vouchers/my
// @access  Private (any authenticated user)
exports.getMyVouchers = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const vouchers = await Voucher.find({ issuedTo: userId, scope: "reward" })
    .sort("-createdAt")
    .populate("vendorId", "shopName name");
  res.json({ success: true, count: vouchers.length, data: vouchers });
});

// @desc    Get vendor's auto-reward rule
// @route   GET /api/vouchers/vendor-rule
// @access  Private (vendor)
exports.getVendorRule = asyncHandler(async (req, res) => {
  const rule = await VendorVoucherRule.findOne({ vendorId: req.user._id });
  res.json({ success: true, data: rule ?? null });
});

// @desc    Upsert vendor's auto-reward rule
// @route   PUT /api/vouchers/vendor-rule
// @access  Private (vendor)
exports.upsertVendorRule = asyncHandler(async (req, res) => {
  const { enabled, type, value, minOrderAmount, validDays, productIds } = req.body;

  if (type && !["percent", "fixed"].includes(type))
    return res.status(400).json({ success: false, message: "type invalid" });
  if (value != null && Number(value) < 1)
    return res.status(400).json({ success: false, message: "value trebuie să fie ≥ 1" });

  const rule = await VendorVoucherRule.findOneAndUpdate(
    { vendorId: req.user._id },
    {
      $set: {
        ...(enabled    != null ? { enabled }       : {}),
        ...(type               ? { type }           : {}),
        ...(value      != null ? { value }          : {}),
        ...(minOrderAmount != null ? { minOrderAmount } : {}),
        ...(validDays  != null ? { validDays }      : {}),
        ...(productIds         ? { productIds }     : {}),
        vendorId: req.user._id,
      },
    },
    { upsert: true, new: true, runValidators: true }
  );
  res.json({ success: true, data: rule });
});
