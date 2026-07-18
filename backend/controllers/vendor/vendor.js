const asyncHandler = require("express-async-handler");
const ErrorResponse = require("../../utilitis/errorResponse");
const Product = require("../../models/product/Product");
const { generateSku } = require("../../utils/skuGenerator");
const Electronics = require("../../models/product/types/Electronics");
const Clothing = require("../../models/product/types/Clothing");
const Furniture = require("../../models/product/types/Furniture");
const HomeGarden = require("../../models/product/types/HomeGarden");
const Books = require("../../models/product/types/Books");
const { Register } = require("../../models/auth/register");
const Vendor = require("../../models/vendor/Vendor");
const { Order } = require("../../models/order/Order");

const VALID_KINDS = ["Electronics", "Clothing", "Furniture", "HomeGarden", "Books"];

const KIND_MODEL = {
  Electronics,
  Clothing,
  Furniture,
  HomeGarden,
  Books,
};

// @desc   Apply to become a vendor
// @route  POST /api/vendor/apply
// @access Private
exports.applyAsVendor = asyncHandler(async (req, res, next) => {
  const user = await Register.findById(req.user._id);

  if (user.role === "vendor") {
    return next(new ErrorResponse("You are already a vendor", 400));
  }
  if (user.vendorStatus === "pending") {
    return next(new ErrorResponse("Your application is already pending review", 400));
  }
  if (user.vendorStatus === "approved") {
    return next(new ErrorResponse("Your vendor application has already been approved", 400));
  }

  const { shopName, shopDescription } = req.body;
  if (!shopName || !shopName.trim()) {
    return next(new ErrorResponse("Shop name is required", 400));
  }

  user.vendorStatus = "pending";
  user.shopName = shopName.trim();
  await user.save();

  await Vendor.findOneAndUpdate(
    { user: user._id },
    { shopDescription: shopDescription?.trim() || null },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  res.status(200).json({ message: "Application submitted", vendorStatus: "pending" });
});

// @desc   Get vendor profile
// @route  GET /api/vendor/me
// @access Private/Vendor
exports.getVendorMe = asyncHandler(async (req, res) => {
  const [user, vendorDoc] = await Promise.all([
    Register.findById(req.user._id).select("-password"),
    Vendor.findOne({ user: req.user._id }),
  ]);
  res.status(200).json({
    success: true,
    user: {
      ...user.toObject(),
      shopDescription: vendorDoc?.shopDescription ?? null,
      profile:         vendorDoc?.profile ?? {},
      locations:       vendorDoc?.locations ?? [],
      rating:          vendorDoc?.rating ?? { average: 0, count: 0 },
    },
  });
});

// @desc   Update vendor profile (legal + operational info)
// @route  PUT /api/vendor/profile
// @access Private/Vendor
exports.updateVendorProfile = asyncHandler(async (req, res, next) => {
  const { shopDescription, profile = {}, locations } = req.body;

  const VALID_TIP = ["SRL", "PFA", "SA", "RA", "II", "ONG"];

  if (profile.cui != null && !/^\d{2,10}$/.test(String(profile.cui))) {
    return next(new ErrorResponse("CUI invalid — trebuie să conțină 2–10 cifre", 400));
  }
  if (profile.tipEntitate != null && !VALID_TIP.includes(profile.tipEntitate)) {
    return next(new ErrorResponse(`tipEntitate invalid. Valori acceptate: ${VALID_TIP.join(", ")}`, 400));
  }
  if (locations != null) {
    for (const loc of locations) {
      const { min, max } = loc.zileLivrare ?? {};
      if (min != null && max != null && Number(min) > Number(max)) {
        return next(new ErrorResponse(`zileLivrare.min nu poate depăși max pentru ${loc.oras}`, 400));
      }
    }
  }

  const updateFields = {};
  if (shopDescription !== undefined) updateFields.shopDescription = shopDescription;
  if (Object.keys(profile).length) {
    for (const [k, v] of Object.entries(profile)) {
      updateFields[`profile.${k}`] = v;
    }
  }
  if (locations != null) updateFields.locations = locations;

  const vendorDoc = await Vendor.findOneAndUpdate(
    { user: req.user._id },
    { $set: updateFields },
    { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
  );

  res.status(200).json({ success: true, profile: vendorDoc.profile, locations: vendorDoc.locations });
});

// @desc   Get vendor's own products
// @route  GET /api/vendor/products
// @access Private/Vendor
exports.getVendorProducts = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Number(req.query.limit) || 20);
  const skip = (page - 1) * limit;

  const filter = { vendor: req.user._id };
  const { status } = req.query;
  if (status === "published") {
    filter.listingStatus = "approved";
    filter.publishStatus = "published";
  } else if (status === "draft") {
    filter.listingStatus = "approved";
    filter.publishStatus = "draft";
  } else if (status === "pending") {
    filter.listingStatus = "pending";
  } else if (status === "rejected") {
    filter.listingStatus = "rejected";
  }

  const [products, count] = await Promise.all([
    Product.find(filter).sort("-createdAt").skip(skip).limit(limit),
    Product.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    products,
    count,
    numberOfPages: Math.ceil(count / limit),
  });
});

// @desc   Create a product listing
// @route  POST /api/vendor/products
// @access Private/Vendor
exports.createVendorProduct = asyncHandler(async (req, res, next) => {
  const { kind, ...fields } = req.body;

  if (!kind || !VALID_KINDS.includes(kind)) {
    return next(new ErrorResponse(`Invalid product kind. Must be one of: ${VALID_KINDS.join(", ")}`, 400));
  }

  const productCount = await Product.countDocuments({ vendor: req.user._id });
  if (productCount >= 15) return next(new ErrorResponse("Maximum 15 produse per cont vendor", 400));

  // Bridge: old form sends price + stock; new form sends variants array
  if (!fields.variants?.length && fields.price != null) {
    fields.variants = [{
      attributes: {},
      price: Number(fields.price),
      stock: fields.stock || { quantity: 0, availability: "In Stoc" },
      images: fields.images || [],
    }];
  }
  delete fields.price;
  delete fields.stock;

  const Model = KIND_MODEL[kind];
  const vendorDoc = await Vendor.findOne({ user: req.user._id }).select("locations").lean();
  const city = vendorDoc?.locations?.[0]?.oras || "";
  const model = fields.model || fields.name || fields.title || "";
  const product = await Model.create({
    ...fields,
    user: req.user._id,
    vendor: req.user._id,
    listingStatus: "pending",
    rating: { average: 0, count: 0 },
    sku: generateSku(fields.brand || "", city, model),
  });

  res.status(201).json({ success: true, product });
});

// @desc   Update vendor's own product
// @route  PUT /api/vendor/products/:id
// @access Private/Vendor
exports.updateVendorProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorResponse("Product not found", 404));
  }
  if (product.vendor?.toString() !== req.user._id.toString()) {
    return next(new ErrorResponse("Not authorized to update this product", 403));
  }

  const { kind, user, vendor, ...updates } = req.body;

  // Bridge: old form sends price + stock; new form sends variants array
  if (!updates.variants?.length && updates.price != null) {
    updates.variants = [{
      attributes: {},
      price: Number(updates.price),
      stock: updates.stock || { quantity: 0, availability: "In Stoc" },
      images: updates.images || [],
    }];
  }
  delete updates.price;
  delete updates.stock;

  Object.assign(product, updates, { listingStatus: "pending", publishStatus: "draft", rejectionReason: null });
  await product.save();

  res.status(200).json({ success: true, product });
});

// @desc   Delete vendor's own product
// @route  DELETE /api/vendor/products/:id
// @access Private/Vendor
exports.deleteVendorProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorResponse("Product not found", 404));
  }
  if (product.vendor?.toString() !== req.user._id.toString()) {
    return next(new ErrorResponse("Not authorized to delete this product", 403));
  }

  await product.deleteOne();
  res.status(200).json({ success: true, message: "Product deleted" });
});

// @desc   Get orders containing vendor's products
// @route  GET /api/vendor/orders
// @access Private/Vendor
exports.getVendorOrders = asyncHandler(async (req, res) => {
  const vendorProducts = await Product.find({ vendor: req.user._id }).select("_id");
  const productIds = vendorProducts.map((p) => p._id);

  const filter = productIds.length > 0
    ? { $or: [{ "items.vendor": req.user._id }, { "items.product": { $in: productIds } }] }
    : { "items.vendor": req.user._id };

  const orders = await Order.find(filter)
    .populate("user", "name email")
    .sort("-createdAt");

  res.status(200).json({ success: true, orders });
});

// @desc   Mark order as Shipped (vendor)
// @route  PUT /api/vendor/orders/:id/ship
// @access Private/Vendor
exports.shipOrder = asyncHandler(async (req, res, next) => {
  const { awb } = req.body;

  const vendorProducts = await Product.find({ vendor: req.user._id }).select("_id");
  const productIds = vendorProducts.map((p) => p._id);

  const order = await Order.findOne({
    _id: req.params.id,
    $or: [{ "items.vendor": req.user._id }, { "items.product": { $in: productIds } }],
  });

  if (!order) return next(new ErrorResponse("Comanda nu a fost găsită", 404));
  if (order.status !== "Processing") return next(new ErrorResponse("Comanda trebuie să fie în procesare pentru a fi expediată", 400));

  order.status = "Shipped";
  order.shippedAt = new Date();
  if (awb) order.awb = awb;
  await order.save();

  res.status(200).json({ success: true, order });
});

// @desc   Publish an approved product listing
// @route  PUT /api/vendor/products/:id/publish
// @access Private/Vendor
exports.publishVendorProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorResponse("Produsul nu a fost găsit", 404));
  }
  if (product.vendor?.toString() !== req.user._id.toString()) {
    return next(new ErrorResponse("Nu ești autorizat să publici acest produs", 403));
  }
  if (product.listingStatus !== "approved") {
    return next(new ErrorResponse("Produsul trebuie aprobat de admin înainte de publicare", 400));
  }
  if (product.publishStatus === "published") {
    return next(new ErrorResponse("Produsul este deja publicat", 400));
  }

  const issues = [];
  if (!product.images || product.images.length === 0) issues.push("cel puțin o imagine");
  if (!product.description || product.description.trim().length < 10) issues.push("descriere (minim 10 caractere)");
  if (product.price == null || product.price <= 0) issues.push("preț valid (> 0)");
  if (product.stock == null || product.stock.quantity == null) issues.push("cantitate stoc");

  if (issues.length > 0) {
    return next(new ErrorResponse(`Produsul nu este complet. Lipsește: ${issues.join(", ")}`, 400));
  }

  if (product.catalogRef) {
    const existing = await Product.findOne({
      vendor: req.user._id,
      catalogRef: product.catalogRef,
      publishStatus: "published",
      _id: { $ne: product._id },
    });
    if (existing) {
      return next(new ErrorResponse("Ai deja un produs publicat pentru acest articol din catalog. Un vânzător poate apărea o singură dată per produs.", 409));
    }
  }

  product.publishStatus = "published";
  await product.save();

  res.status(200).json({ success: true, product });
});

// @desc   Get vendor analytics
// @route  GET /api/vendor/analytics
// @access Private/Vendor
exports.getVendorAnalytics = asyncHandler(async (req, res) => {
  const [statusCounts, publishCounts, vendorProducts] = await Promise.all([
    Product.aggregate([
      { $match: { vendor: req.user._id } },
      { $group: { _id: "$listingStatus", count: { $sum: 1 } } },
    ]),
    Product.aggregate([
      { $match: { vendor: req.user._id } },
      { $group: { _id: "$publishStatus", count: { $sum: 1 } } },
    ]),
    Product.find({ vendor: req.user._id }).select("_id price"),
  ]);

  const productIds = vendorProducts.map((p) => p._id);

  const orderItems = await Order.aggregate([
    { $unwind: "$items" },
    { $match: { "items.product": { $in: productIds } } },
    {
      $group: {
        _id: null,
        totalUnitsSold: { $sum: "$items.quantity" },
        estimatedRevenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
      },
    },
  ]);

  const counts = { pending: 0, approved: 0, rejected: 0 };
  statusCounts.forEach(({ _id, count }) => { counts[_id] = count; });

  const pubCounts = { draft: 0, published: 0 };
  publishCounts.forEach(({ _id, count }) => { if (_id) pubCounts[_id] = count; });

  const { totalUnitsSold = 0, estimatedRevenue = 0 } = orderItems[0] || {};

  res.status(200).json({
    success: true,
    totalListings: counts.pending + counts.approved + counts.rejected,
    approvedListings: counts.approved,
    pendingListings: counts.pending,
    rejectedListings: counts.rejected,
    publishedListings: pubCounts.published,
    totalUnitsSold,
    estimatedRevenue,
  });
});
