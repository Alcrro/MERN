const asyncHandler = require("express-async-handler");

// @desc   Upload a single image to Cloudinary
// @route  POST /api/upload/image
// @access Private
exports.uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error("No image file provided");
  }

  res.status(200).json({ success: true, url: req.file.path });
});
