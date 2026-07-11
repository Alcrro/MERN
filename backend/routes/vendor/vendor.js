const express = require("express");
const {
  applyAsVendor,
  getVendorMe,
  getVendorProducts,
  createVendorProduct,
  updateVendorProduct,
  deleteVendorProduct,
  getVendorOrders,
  getVendorAnalytics,
} = require("../../controllers/vendor/vendor");
const { protect, authorize } = require("../../middleware/auth/auth");

const router = express.Router();

router.post("/vendor/apply", protect, applyAsVendor);

router.use("/vendor", protect, authorize("vendor"));
router.get("/vendor/me", getVendorMe);
router.route("/vendor/products").get(getVendorProducts).post(createVendorProduct);
router.route("/vendor/products/:id").put(updateVendorProduct).delete(deleteVendorProduct);
router.get("/vendor/orders", getVendorOrders);
router.get("/vendor/analytics", getVendorAnalytics);

module.exports = router;
