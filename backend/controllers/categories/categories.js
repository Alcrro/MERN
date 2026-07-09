const asyncHandler = require("express-async-handler");
const Category = require("../../models/category/Category");

// @desc    Get all nav categories (ordered)
// @route   GET /api/categories
// @access  Public
exports.getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({}).sort("order").lean();
  res.status(200).json({ success: true, categories });
});
