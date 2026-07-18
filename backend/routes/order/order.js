const express = require("express");
const {
  getMyOrders,
  getOrder,
  createOrder,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
  assignOrderVendor,
  getOrderPayIntent,
  confirmPayment,
} = require("../../controllers/order/order");
const { protect, authorize } = require("../../middleware/auth/auth");

const router = express.Router();

router.use(protect);

router.route("/").get(getMyOrders).post(createOrder);
router.route("/:id").get(getOrder);
router.route("/:id/cancel").put(cancelOrder);
router.route("/:id/pay-intent").get(getOrderPayIntent);
router.route("/:id/confirm-payment").post(confirmPayment);

router.route("/admin/all").get(authorize("admin"), getAllOrders);
router.route("/admin/:id/status").put(authorize("admin"), updateOrderStatus);
router.route("/admin/:id/vendor").put(authorize("admin"), assignOrderVendor);

module.exports = router;
