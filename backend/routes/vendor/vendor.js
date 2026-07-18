const express = require("express");
const {
  applyAsVendor,
  getVendorMe,
  updateVendorProfile,
  getVendorProducts,
  createVendorProduct,
  updateVendorProduct,
  deleteVendorProduct,
  publishVendorProduct,
  getVendorOrders,
  getVendorAnalytics,
  shipOrder,
} = require("../../controllers/vendor/vendor");
const {
  getPublicVendor,
  getPublicVendorProducts,
  getVendorReviews,
  addVendorReview,
} = require("../../controllers/vendor/publicVendor");
const { protect, authorize } = require("../../middleware/auth/auth");

const router = express.Router();

// Public vendor profile routes — must be before protect middleware
router.get("/vendor/public/:vendorId", getPublicVendor);
router.get("/vendor/public/:vendorId/products", getPublicVendorProducts);
router.get("/vendor/public/:vendorId/reviews", getVendorReviews);
router.post("/vendor/public/:vendorId/reviews", protect, addVendorReview);

router.post("/vendor/apply", protect, applyAsVendor);

router.use("/vendor", protect, authorize("vendor"));
router.get("/vendor/me", getVendorMe);
router.put("/vendor/profile", updateVendorProfile);
router.route("/vendor/products").get(getVendorProducts).post(createVendorProduct);
router.put("/vendor/products/:id/publish", publishVendorProduct);
router.route("/vendor/products/:id").put(updateVendorProduct).delete(deleteVendorProduct);
router.get("/vendor/orders", getVendorOrders);
router.put("/vendor/orders/:id/ship", shipOrder);
router.get("/vendor/analytics", getVendorAnalytics);

module.exports = router;
