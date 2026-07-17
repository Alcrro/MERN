const asyncHandler = require("express-async-handler");
const ErrorResponse = require("../../utilitis/errorResponse");
const { Register } = require("../../models/auth/register");
const Vendor = require("../../models/vendor/Vendor");
const Product = require("../../models/product/Product");

// @desc   Get pending vendor applications
// @route  GET /api/admin/vendors/pending
// @access Private/Admin
exports.getPendingVendors = asyncHandler(async (req, res) => {
  const users = await Register.find({ vendorStatus: "pending" })
    .select("-password")
    .sort("-createdAt")
    .lean();
  const ids = users.map((u) => u._id);
  const vendorDocs = await Vendor.find({ user: { $in: ids } }).select("user shopDescription profile locations").lean();
  const vMap = Object.fromEntries(vendorDocs.map((v) => [v.user.toString(), v]));
  const vendors = users.map((u) => ({ ...u, ...vMap[u._id.toString()] }));
  res.status(200).json({ success: true, vendors, count: vendors.length });
});

// @desc   Approve or reject a vendor application
// @route  PUT /api/admin/vendors/:id
// @access Private/Admin
exports.updateVendorStatus = asyncHandler(async (req, res, next) => {
  const { action } = req.body;

  if (!["approve", "reject"].includes(action)) {
    return next(new ErrorResponse("Action must be 'approve' or 'reject'", 400));
  }

  const user = await Register.findById(req.params.id);
  if (!user) {
    return next(new ErrorResponse("User not found", 404));
  }

  if (action === "approve") {
    user.role = "vendor";
    user.vendorStatus = "approved";
  } else {
    user.vendorStatus = "rejected";
  }

  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: `Vendor application ${action === "approve" ? "approved" : "rejected"}`,
    user: { _id: user._id, name: user.name, role: user.role, vendorStatus: user.vendorStatus },
  });
});

// @desc   Get all vendors
// @route  GET /api/admin/vendors
// @access Private/Admin
exports.getAdminVendors = asyncHandler(async (req, res) => {
  const users = await Register.find({ role: "vendor" })
    .select("name email shopName vendorStatus createdAt")
    .sort("-createdAt")
    .lean();
  const ids = users.map((u) => u._id);
  const vendorDocs = await Vendor.find({ user: { $in: ids } }).select("user profile locations rating").lean();
  const vMap = Object.fromEntries(vendorDocs.map((v) => [v.user.toString(), v]));
  const vendors = users.map((u) => ({
    ...u,
    profile:   vMap[u._id.toString()]?.profile   ?? {},
    locations: vMap[u._id.toString()]?.locations ?? [],
    rating:    vMap[u._id.toString()]?.rating    ?? { average: 0, count: 0 },
  }));
  res.status(200).json({ success: true, vendors, count: vendors.length });
});

// @desc   Get pending product listings
// @route  GET /api/admin/products/pending
// @access Private/Admin
exports.getPendingListings = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Number(req.query.limit) || 20);
  const skip = (page - 1) * limit;

  const [products, count] = await Promise.all([
    Product.find({ listingStatus: "pending" })
      .populate("vendor", "name email shopName")
      .populate("catalogRef", "brand specs")
      .sort("-createdAt")
      .skip(skip)
      .limit(limit),
    Product.countDocuments({ listingStatus: "pending" }),
  ]);

  const productsWithDupCheck = await Promise.all(
    products.map(async (p) => {
      const obj = p.toObject();
      if (p.catalogRef && p.vendor) {
        const dupExists = await Product.exists({
          vendor: p.vendor._id || p.vendor,
          catalogRef: p.catalogRef._id || p.catalogRef,
          publishStatus: "published",
          _id: { $ne: p._id },
        });
        obj.hasDuplicate = !!dupExists;
      } else {
        obj.hasDuplicate = false;
      }
      return obj;
    })
  );

  res.status(200).json({
    success: true,
    products: productsWithDupCheck,
    count,
    numberOfPages: Math.ceil(count / limit),
  });
});

// @desc   Approve or reject a product listing
// @route  PUT /api/admin/products/:id/status
// @access Private/Admin
exports.updateListingStatus = asyncHandler(async (req, res, next) => {
  const { action, reason } = req.body;

  if (!["approve", "reject"].includes(action)) {
    return next(new ErrorResponse("Action must be 'approve' or 'reject'", 400));
  }

  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorResponse("Product not found", 404));
  }

  product.listingStatus = action === "approve" ? "approved" : "rejected";
  product.rejectionReason = action === "reject" ? (reason || null) : null;
  await product.save();

  res.status(200).json({ success: true, product });
});
