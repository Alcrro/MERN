const ErrorResponse = require("../../utilitis/errorResponse");
const asyncHandler = require("express-async-handler");
const { Register, ROLES } = require("../../models/auth/register");
const { createCardForUser } = require("../shopCard/shopCardService");

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return next(new ErrorResponse("Please provide name, email and password", 400));
  }

  const userExists = await Register.findOne({ email });
  if (userExists) {
    return next(new ErrorResponse("Email already registered", 400));
  }

  const safeRole = Object.values(ROLES).includes(role) ? role : ROLES.CLIENT;

  const user = await Register.create({ name, email, password, role: safeRole });

  createCardForUser(user._id).catch(() => {});

  sendTokenResponse(user, 201, res);
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorResponse("Please provide email and password", 400));
  }

  const user = await Register.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  sendTokenResponse(user, 200, res);
});

// @desc    Logout user
// @route   GET /api/auth/logout
// @access  Private
exports.logoutUser = asyncHandler(async (req, res) => {
  res.cookie("token", "none", { ...cookieOptions(), expires: new Date(Date.now() + 5000) });
  res.status(200).json({ success: true, data: {} });
});

// @desc    Get current logged-in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res) => {
  const user = await Register.findById(req.user._id).select("-password");
  res.status(200).json({ success: true, user });
});

// @desc    Update current user (name, phone, avatar)
// @route   PUT /api/auth/me
// @access  Private
exports.updateMe = asyncHandler(async (req, res, next) => {
  const allowed = ["name", "phone", "avatar"];
  const updates = {};
  allowed.forEach((key) => { if (req.body[key] !== undefined) updates[key] = req.body[key]; });

  if (Object.keys(updates).length === 0) {
    return next(new ErrorResponse("No valid fields to update", 400));
  }

  const user = await Register.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  }).select("-password");

  res.status(200).json({ success: true, user });
});

const cookieOptions = () => ({
  expires:  new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  httpOnly: true,
  secure:   process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
});

const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();

  res.status(statusCode).cookie("token", token, cookieOptions()).json({
    success: true,
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar ?? null },
  });
};
