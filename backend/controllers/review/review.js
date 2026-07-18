const asyncHandler = require("express-async-handler");
const Review = require("../../models/review/Review");
const Product = require("../../models/product/Product");
const ErrorResponse = require("../../utilitis/errorResponse");

// @desc    Get all reviews for a product
// @route   GET /api/product/:productId/reviews
// @access  Public
exports.getReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ product: req.params.productId })
    .populate("user", "name")
    .sort("-createdAt");

  res.status(200).json({ success: true, count: reviews.length, reviews });
});

// @desc    Add a review
// @route   POST /api/product/:productId/reviews
// @access  Private
exports.addReview = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.productId);
  if (!product) return next(new ErrorResponse("Product not found", 404));

  const alreadyReviewed = await Review.findOne({ product: req.params.productId, user: req.user.id });
  if (alreadyReviewed) return next(new ErrorResponse("Ai lăsat deja o recenzie pentru acest produs", 400));

  const reviewCount = await Review.countDocuments({ user: req.user.id });
  if (reviewCount >= 20) return next(new ErrorResponse("Maximum 20 recenzii per cont", 400));

  const review = await Review.create({
    product: req.params.productId,
    user: req.user.id,
    value: req.body.value,
    comment: req.body.comment,
  });

  res.status(201).json({ success: true, review });
});

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private
exports.deleteReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new ErrorResponse("Review not found", 404));
  }

  if (review.user.toString() !== req.user.id) {
    return next(new ErrorResponse("Not authorized to delete this review", 401));
  }

  await Review.findOneAndDelete({ _id: req.params.id });

  res.status(200).json({ success: true, message: "Review deleted" });
});
