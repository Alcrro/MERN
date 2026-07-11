const express = require("express");
const {
  getPendingVendors,
  updateVendorStatus,
  getAdminVendors,
  getPendingListings,
  updateListingStatus,
} = require("../../controllers/admin/admin");
const { protect, authorize } = require("../../middleware/auth/auth");

const router = express.Router();

router.use(protect, authorize("admin"));

router.get("/vendors", getAdminVendors);
router.get("/vendors/pending", getPendingVendors);
router.put("/vendors/:id", updateVendorStatus);
router.get("/products/pending", getPendingListings);
router.put("/products/:id/status", updateListingStatus);

module.exports = router;
