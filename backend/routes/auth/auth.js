const express = require("express");
const { loginUser, registerUser, logoutUser, deleteUser } = require("../../controllers/auth/auth");

const router = express.Router();
const { protect } = require("../../middleware/auth/auth");

router.route("/login").post(loginUser);
router.route("/register").post(registerUser);
router.route("/logout").get(protect, logoutUser);
router.route("/delete/:id").delete(protect, deleteUser);

module.exports = router;
