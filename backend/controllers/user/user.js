const asyncHandler = require("express-async-handler");
const { Register, ROLES } = require("../../models/auth/register");
const ErrorResponse = require("../../utilitis/errorResponse");

// @desc    Get current logged-in user
// @route   GET /api/users/me
// @access  Private
exports.getMe = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

// @desc    Update name, email, phone, avatar
// @route   PUT /api/users/me
// @access  Private
exports.updateMe = asyncHandler(async (req, res, next) => {
  const allowed = ["name", "email", "phone", "avatar"];
  const updates = Object.fromEntries(
    Object.entries(req.body).filter(([key]) => allowed.includes(key))
  );

  const user = await Register.findByIdAndUpdate(req.user.id, updates, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, user });
});

// @desc    Update password
// @route   PUT /api/users/me/password
// @access  Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return next(new ErrorResponse("Please provide currentPassword and newPassword", 400));
  }

  const user = await Register.findById(req.user.id).select("+password");

  const isMatch = await user.matchPassword(currentPassword);
  if (!isMatch) {
    return next(new ErrorResponse("Current password is incorrect", 401));
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json({ success: true, message: "Password updated" });
});

// @desc    Get all users
// @route   GET /api/users/admin/all
// @access  Admin
exports.getAllUsers = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(50, parseInt(req.query.limit) || 20);
  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    Register.find().skip(skip).limit(limit).sort("-createdAt"),
    Register.countDocuments(),
  ]);

  res.status(200).json({
    success: true,
    total,
    page,
    pages: Math.ceil(total / limit),
    users,
  });
});

// @desc    Update user role
// @route   PUT /api/users/admin/:id/role
// @access  Admin
exports.updateUserRole = asyncHandler(async (req, res, next) => {
  const { role } = req.body;

  if (!Object.values(ROLES).includes(role)) {
    return next(new ErrorResponse(`'${role}' is not a valid role`, 400));
  }

  const user = await Register.findByIdAndUpdate(
    req.params.id,
    { role },
    { new: true, runValidators: true }
  );

  if (!user) return next(new ErrorResponse("User not found", 404));

  res.status(200).json({ success: true, user });
});

// @desc    Delete user
// @route   DELETE /api/users/admin/:id
// @access  Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await Register.findByIdAndDelete(req.params.id);

  if (!user) return next(new ErrorResponse("User not found", 404));

  res.status(200).json({ success: true, message: `User '${user.name}' deleted` });
});
