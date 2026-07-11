const asyncHandler = require("express-async-handler");
const Product = require("../../models/product/Product");
const Electronics = require("../../models/product/types/Electronics");
const Clothing = require("../../models/product/types/Clothing");
const Furniture = require("../../models/product/types/Furniture");
const HomeGarden = require("../../models/product/types/HomeGarden");
const Books = require("../../models/product/types/Books");
const { Register } = require("../../models/auth/register");
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
exports.applyAsVendor = asyncHandler(async (req, res) => {
  const user = await Register.findById(req.user._id);

  if (user.role === "vendor") {
    res.status(400);
    throw new Error("You are already a vendor");
  }
  if (user.vendorStatus === "pending") {
    res.status(400);
    throw new Error("Your application is already pending review");
  }
  if (user.vendorStatus === "approved") {
    res.status(400);
    throw new Error("Your vendor application has already been approved");
  }

  const { shopName, shopDescription } = req.body;
  if (!shopName || !shopName.trim()) {
    res.status(400);
    throw new Error("Shop name is required");
  }

  user.vendorStatus = "pending";
  user.shopName = shopName.trim();
  user.shopDescription = shopDescription?.trim() || null;
  await user.save();

  res.status(200).json({ message: "Application submitted", vendorStatus: "pending" });
});

// @desc   Get vendor profile
// @route  GET /api/vendor/me
// @access Private/Vendor
exports.getVendorMe = asyncHandler(async (req, res) => {
  const user = await Register.findById(req.user._id).select("-password");
  res.status(200).json({ success: true, user });
});

// @desc   Get vendor's own products
// @route  GET /api/vendor/products
// @access Private/Vendor
exports.getVendorProducts = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Number(req.query.limit) || 20);
  const skip = (page - 1) * limit;

  const filter = { vendor: req.user._id };
  if (req.query.status && ["pending", "approved", "rejected"].includes(req.query.status)) {
    filter.listingStatus = req.query.status;
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
exports.createVendorProduct = asyncHandler(async (req, res) => {
  const { kind, ...fields } = req.body;

  if (!kind || !VALID_KINDS.includes(kind)) {
    res.status(400);
    throw new Error(`Invalid product kind. Must be one of: ${VALID_KINDS.join(", ")}`);
  }

  const Model = KIND_MODEL[kind];
  const product = await Model.create({
    ...fields,
    user: req.user._id,
    vendor: req.user._id,
    listingStatus: "pending",
    rating: { average: 0, count: 0 },
  });

  res.status(201).json({ success: true, product });
});

// @desc   Update vendor's own product
// @route  PUT /api/vendor/products/:id
// @access Private/Vendor
exports.updateVendorProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  if (product.vendor?.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to update this product");
  }

  const { kind, user, vendor, ...updates } = req.body;

  Object.assign(product, updates, { listingStatus: "pending", rejectionReason: null });
  await product.save();

  res.status(200).json({ success: true, product });
});

// @desc   Delete vendor's own product
// @route  DELETE /api/vendor/products/:id
// @access Private/Vendor
exports.deleteVendorProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  if (product.vendor?.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to delete this product");
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

  const orders = await Order.find({ "items.product": { $in: productIds } })
    .populate("user", "name email")
    .sort("-createdAt");

  res.status(200).json({ success: true, orders });
});

// @desc   Get vendor analytics
// @route  GET /api/vendor/analytics
// @access Private/Vendor
exports.getVendorAnalytics = asyncHandler(async (req, res) => {
  const [statusCounts, vendorProducts] = await Promise.all([
    Product.aggregate([
      { $match: { vendor: req.user._id } },
      { $group: { _id: "$listingStatus", count: { $sum: 1 } } },
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

  const { totalUnitsSold = 0, estimatedRevenue = 0 } = orderItems[0] || {};

  res.status(200).json({
    success: true,
    totalListings: counts.pending + counts.approved + counts.rejected,
    approvedListings: counts.approved,
    pendingListings: counts.pending,
    rejectedListings: counts.rejected,
    totalUnitsSold,
    estimatedRevenue,
  });
});
