const express = require("express");
const { loginUser, registerUser, getMe } = require("../../controllers/auth/auth");

const router = express.Router();
const { protect } = require("../../middleware/auth/auth");

router.route("/login").post(loginUser);
router.route("/register").post(registerUser);
router.route("/me").get(protect, getMe);

module.exports = router;
