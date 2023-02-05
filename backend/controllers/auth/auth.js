const ErrorResponse = require("../../utilitis/errorResponse");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Register = require("../../models/auth/Register");
const Login = require("../../models/auth/login");

//	@description					register user
//	@route								POST /api/auth/register
// 	@access								Public
exports.registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;
  console.log(req.body);

  // Validate  email and password
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please provide an email and password");
  }

  //Check if email exists
  const userExist = await Register.findOne({ email });
  if (userExist) {
    res.status(400);
    throw new Error("User already exists");
  }

  // hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  //Create user
  const register = await Register.create({
    name,
    email,
    password: hashedPassword,
  });

  if (register) {
    res.status(201).json({
      success: true,
      _id: register._id,
      name: register.name,
      email: register.email,
      token: generateToken(register._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }

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
  const { email, password } = req.body;

  // Validate  email and password
  if (!email || !password) {
    res.status(400);
    throw new Error("Please provide an email and password");
  }

  //Check if email exists in db
  const user = await Register.findOne({ email }).select("+password");
  // const isMatch = await user.matchPassword(password);
  // if (user) {
  //   return next(new ErrorResponse("Invalid credentials", 401));
  // }

  //Check user and password  matches

  if (user && (await bcrypt.compare(password, user.password))) {
    res.status(200).json({
      success: true,
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  // sendTokenResponse(user, 200, res);
});

//	@description					Get current logged in user
//	@route								POST /api/auth/me
// 	@access								Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = {
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
  };
  res.status(200).json(user);
});

//Generate token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

const logoutUser = asyncHandler(async (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      return next(new ErrorResponse("Error logging out", 500));
    }
    res.status(200).clearCookie("token").json({
      success: true,
      data: {},
    });
  });
});

// // Get token from model, create cookie and send response
// const sendTokenResponse = (user, statusCode, res) => {
//   // Create token

//   const token = user.getSignedJwtToken();

//   const expireSession = new Date(Date.now() + 86400000);

//   const options = {
//     expires: expireSession,
//     httpOnly: true,
//   };

//   res.status(statusCode).cookie("token", token, options).json({
//     success: true,
//     token,
//   });
// };
