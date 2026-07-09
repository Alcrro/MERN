const express = require("express");
const { loginUser, registerUser, logoutUser } = require("../../controllers/auth/auth");
const { protect } = require("../../middleware/auth/auth");

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logoutUser);

module.exports = router;
