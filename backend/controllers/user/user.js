const ErrorResponse = require("../../utilitis/errorResponse");
const asyncHandler = require("express-async-handler");
const Register = require("../../models/auth/Register");

//@desc					Get all user
//@route 				GET
//@access 			Public

exports.getUsers = asyncHandler(async (req, res, next) => {
  const user = await Register.find();

  res.status(200).json({ success: true, totalUsers: user.length, data: user });
});

//@desc					Delete an user
//@route 				Delete
//@access 			Public

exports.deleteUser = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const user = await Register.findByIdAndDelete(id).exec();

  if (!user) {
    return res.status(400).json({
      success: false,
      message: "Acest user nu exista in baza de date",
    });
  }

  res.status(201).json({ success: true, message: "You have removed user " });
});
