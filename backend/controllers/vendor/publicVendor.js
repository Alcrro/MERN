const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const { Register } = require("../../models/auth/register");
const Products = require("../../models/product/Product");
const VendorReview = require("../../models/vendorReview/VendorReview");

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// @desc    Get public vendor profile
// @route   GET /api/vendor/public/:vendorId
// @access  Public
exports.getPublicVendor = asyncHandler(async (req, res) => {
  const { vendorId } = req.params;
  if (!isValidId(vendorId)) {
    res.status(400);
    throw new Error("Invalid vendorId");
  }

  const vendor = await Register.findOne(
    { _id: vendorId, role: "vendor", vendorStatus: "approved" },
    "shopName shopDescription avatar createdAt vendorProfile vendorRating"
  );

  if (!vendor) {
    res.status(404);
    throw new Error("Vendor not found");
  }

  res.status(200).json({ success: true, vendor });
});

// @desc    Get public vendor's active products
// @route   GET /api/vendor/public/:vendorId/products
// @access  Public
exports.getPublicVendorProducts = asyncHandler(async (req, res) => {
  const { vendorId } = req.params;
  if (!isValidId(vendorId)) {
    res.status(400);
    throw new Error("Invalid vendorId");
  }

  const page  = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Number(req.query.limit) || 12);
  const skip  = (page - 1) * limit;

  const filter = {
    vendor: vendorId,
    listingStatus: "approved",
    publishStatus: "published",
  };

  const [products, count] = await Promise.all([
    Products.find(filter)
      .sort({ price: 1 })
      .skip(skip)
      .limit(limit)
      .populate("catalogRef", "name brand slug"),
    Products.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    products,
    count,
    totalPages: Math.ceil(count / limit),
  });
});

// @desc    Get reviews for a vendor
// @route   GET /api/vendor/public/:vendorId/reviews
// @access  Public
exports.getVendorReviews = asyncHandler(async (req, res) => {
  const { vendorId } = req.params;
  if (!isValidId(vendorId)) {
    res.status(400);
    throw new Error("Invalid vendorId");
  }

  const reviews = await VendorReview.find({ vendor: vendorId })
    .populate("user", "name avatar")
    .sort("-createdAt");

  res.status(200).json({ success: true, reviews, count: reviews.length });
});

// @desc    Add a review for a vendor
// @route   POST /api/vendor/public/:vendorId/reviews
// @access  Private
exports.addVendorReview = asyncHandler(async (req, res) => {
  const { vendorId } = req.params;
  if (!isValidId(vendorId)) {
    res.status(400);
    throw new Error("Invalid vendorId");
  }

  const { value, comment } = req.body;
  if (!value || value < 1 || value > 5) {
    res.status(400);
    throw new Error("value must be between 1 and 5");
  }

  const vendor = await Register.findOne(
    { _id: vendorId, role: "vendor", vendorStatus: "approved" },
    "_id"
  );
  if (!vendor) {
    res.status(404);
    throw new Error("Vendor not found");
  }

  try {
    const review = await VendorReview.create({
      vendor: vendorId,
      user: req.user.id,
      value,
      comment: comment ?? "",
    });
    const populated = await review.populate("user", "name avatar");
    res.status(201).json({ success: true, review: populated });
  } catch (err) {
    if (err.code === 11000) {
      res.status(409);
      throw new Error("Ai lăsat deja o recenzie pentru acest vânzător");
    }
    throw err;
  }
});
