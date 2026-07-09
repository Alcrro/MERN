const asyncHandler = require("express-async-handler");
const Product = require("../../models/product/Product");
const { AVAILABILITY } = require("../../models/product/stock/Stock");
const ErrorResponse = require("../../utilitis/errorResponse");

// @desc    Get stock for a product
// @route   GET /api/product/:productId/stock
// @access  Public
exports.getStock = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.productId).select("stock brand model");

  if (!product) {
    return next(new ErrorResponse("Product not found", 404));
  }

  res.status(200).json({ success: true, stock: product.stock });
});

// @desc    Update stock for a product
// @route   PUT /api/admin/product/:productId/stock
// @access  Private/Admin
exports.updateStock = asyncHandler(async (req, res, next) => {
  const { quantity, availability } = req.body;

  if (availability && !Object.values(AVAILABILITY).includes(availability)) {
    return next(new ErrorResponse(`Invalid availability status: ${availability}`, 400));
  }

  const product = await Product.findById(req.params.productId);

  if (!product) {
    return next(new ErrorResponse("Product not found", 404));
  }

  if (quantity !== undefined) product.stock.quantity = quantity;
  if (availability) product.stock.availability = availability;

  await product.save();

  res.status(200).json({ success: true, stock: product.stock });
});
