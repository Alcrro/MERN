const asyncHandler = require("express-async-handler");
const ErrorResponse = require("../../utilitis/errorResponse");

// @desc   Upload a single image to Cloudinary
// @route  POST /api/upload/image
// @access Private
exports.uploadImage = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(new ErrorResponse("No image file provided", 400));
  }

  res.status(200).json({ success: true, url: req.file.path });
});
