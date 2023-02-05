const ErrorResponse = require("../../utilitis/errorResponse");
const asyncHandler = require("express-async-handler");

exports.index = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    data: "Welcome to the index page",
  });
});
