const express = require("express");
const { loginUser, registerUser, logoutUser, getMe, updateMe } = require("../../controllers/auth/auth");
const { protect } = require("../../middleware/auth/auth");

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logoutUser);
router.route("/me").get(protect, getMe).put(protect, updateMe);

module.exports = router;
