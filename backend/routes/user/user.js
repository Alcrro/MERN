const express = require("express");
const {
  getMe,
  updateMe,
  updatePassword,
  getAllUsers,
  updateUserRole,
  deleteUser,
} = require("../../controllers/user/user");
const { protect, authorize } = require("../../middleware/auth/auth");

const router = express.Router();

router.use(protect);

router.route("/me").get(getMe).put(updateMe);
router.route("/me/password").put(updatePassword);

router.route("/admin/all").get(authorize("admin"), getAllUsers);
router.route("/admin/:id/role").put(authorize("admin"), updateUserRole);
router.route("/admin/:id").delete(authorize("admin"), deleteUser);

module.exports = router;
