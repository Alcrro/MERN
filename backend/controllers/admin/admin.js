const asyncHandler = require("express-async-handler");
const { Register } = require("../../models/auth/register");
const Product = require("../../models/product/Product");

// @desc   Get pending vendor applications
// @route  GET /api/admin/vendors/pending
// @access Private/Admin
exports.getPendingVendors = asyncHandler(async (req, res) => {
  const vendors = await Register.find({ vendorStatus: "pending" }).select("-password").sort("-createdAt");
  res.status(200).json({ success: true, vendors, count: vendors.length });
});

// @desc   Approve or reject a vendor application
// @route  PUT /api/admin/vendors/:id
// @access Private/Admin
exports.updateVendorStatus = asyncHandler(async (req, res) => {
  const { action } = req.body;

  if (!["approve", "reject"].includes(action)) {
    res.status(400);
    throw new Error("Action must be 'approve' or 'reject'");
  }

  const user = await Register.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
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
      .sort("-createdAt")
      .skip(skip)
      .limit(limit),
    Product.countDocuments({ listingStatus: "pending" }),
  ]);

  res.status(200).json({
    success: true,
    products,
    count,
    numberOfPages: Math.ceil(count / limit),
  });
});

// @desc   Approve or reject a product listing
// @route  PUT /api/admin/products/:id/status
// @access Private/Admin
exports.updateListingStatus = asyncHandler(async (req, res) => {
  const { action, reason } = req.body;

  if (!["approve", "reject"].includes(action)) {
    res.status(400);
    throw new Error("Action must be 'approve' or 'reject'");
  }

  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  product.listingStatus = action === "approve" ? "approved" : "rejected";
  product.rejectionReason = action === "reject" ? (reason || null) : null;
  await product.save();

  res.status(200).json({ success: true, product });
});
