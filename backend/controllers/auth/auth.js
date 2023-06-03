const ErrorResponse = require("../../utilitis/errorResponse");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");

const Register = require("../../models/auth/register");

//	@description					register user
//	@route								POST /api/auth/register
// 	@access								Public
exports.registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password, admin } = req.body;
  // console.log(req.body);

  // Validate  email and password
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please provide an email and password");
  }

  //Check if email exists
  const userExist = await Register.findOne({ name });
  if (userExist) {
    res.status(400);
    throw new Error("User already exists");
  }

  // hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  //Create user
  const user = await Register.create({
    name,
    email,
    isAdmin: admin,
    password: hashedPassword,
  });

  sendTokenResponse(user, 200, res);

  // const token = register.getSignedJwtToken();

  // res.status(200).json({
  //   success: true,
  //   token: token,
  // });
});
//	@description					Auth user
//	@route								POST /api/auth/login
// 	@access								Public
exports.loginUser = asyncHandler(async (req, res, next) => {
  const { name, password } = req.body;

  // Validate  email and password
  if (!name || !password) {
    res.status(400);
    throw new Error("Please provide an email and password");
  }

  //Check if email exists in db
  const user = await Register.findOne({ name }).select("+password");

  const isMatch = await user.matchPassword(password);
  if (!user) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  //Check user and password  matches
  const token = user.getSignedJwtToken();

  sendTokenResponse(user, 200, res);
});

//	@description					Get current logged in user
//	@route								POST /api/auth/me
// 	@access								Private
exports.logoutUser = asyncHandler(async (req, res, next) => {
  await req.session.destroy((err) => {
    if (err) {
      return next(err);
    }
    res.clearCookie("token");
    res.status(200).json({
      success: true,
      data: {},
    });
  });
});

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token

  const token = user.getSignedJwtToken();

  const expireSession = new Date(Date.now() + 86400000);

  const options = {
    expires: expireSession,
    httpOnly: true,
  };

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
  });
};

//	@description					Delete user
//	@route								DELETE /api/auth/delete/:id
// 	@access								Public

exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await Register.findById(req.params.id);
  if (user) {
    await user.remove();
    res.status(200).json({
      success: true,
      message: `User removed ${user.name} successfully`,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});
