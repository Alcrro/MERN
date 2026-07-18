const asyncHandler = require("express-async-handler");
const { Address } = require("../../models/address/Address");
const ErrorResponse = require("../../utilitis/errorResponse");

// @desc    Get my addresses
// @route   GET /api/addresses
// @access  Private
exports.getAddresses = asyncHandler(async (req, res) => {
  const addresses = await Address.find({ user: req.user.id }).sort("-isDefault -createdAt");
  res.status(200).json({ success: true, count: addresses.length, addresses });
});

// @desc    Add address
// @route   POST /api/addresses
// @access  Private
exports.addAddress = asyncHandler(async (req, res, next) => {
  const count = await Address.countDocuments({ user: req.user.id });
  if (count >= 5) return next(new ErrorResponse("Maximum 5 adrese salvate", 400));
  const address = await Address.create({ ...req.body, user: req.user.id });
  res.status(201).json({ success: true, address });
});

// @desc    Update address
// @route   PUT /api/addresses/:id
// @access  Private
exports.updateAddress = asyncHandler(async (req, res, next) => {
  const address = await Address.findOne({ _id: req.params.id, user: req.user.id });

  if (!address) return next(new ErrorResponse("Address not found", 404));

  Object.assign(address, req.body);
  await address.save();

  res.status(200).json({ success: true, address });
});

// @desc    Delete address
// @route   DELETE /api/addresses/:id
// @access  Private
exports.deleteAddress = asyncHandler(async (req, res, next) => {
  const address = await Address.findOne({ _id: req.params.id, user: req.user.id });

  if (!address) return next(new ErrorResponse("Address not found", 404));

  await address.deleteOne();

  res.status(200).json({ success: true, message: "Address deleted" });
});
