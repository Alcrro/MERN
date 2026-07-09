const express = require("express");
const {
  getMyOrders,
  getOrder,
  createOrder,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
} = require("../../controllers/order/order");
const { protect, authorize } = require("../../middleware/auth/auth");

const router = express.Router();

router.use(protect);

router.route("/").get(getMyOrders).post(createOrder);
router.route("/:id").get(getOrder);
router.route("/:id/cancel").put(cancelOrder);

router.route("/admin/all").get(authorize("admin"), getAllOrders);
router.route("/admin/:id/status").put(authorize("admin"), updateOrderStatus);

module.exports = router;
