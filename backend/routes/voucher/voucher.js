const express = require("express");
const router  = express.Router();
const { protect, authorize, optionalProtect } = require("../../middleware/auth/auth");
const {
  validateVoucher,
  createVoucher,
  listVouchers,
  toggleVoucher,
  getMyVouchers,
  getVendorRule,
  upsertVendorRule,
} = require("../../controllers/voucher/voucher");

router.post("/validate", optionalProtect, validateVoucher);

// buyer — own reward vouchers
router.get("/my", protect, getMyVouchers);

// vendor/admin — manage vouchers
router.use(protect);
router.use(authorize("vendor", "admin"));

router.route("/")
  .get(listVouchers)
  .post(createVoucher);

router.patch("/:id/toggle", toggleVoucher);

// vendor rule
router.route("/vendor-rule")
  .get(getVendorRule)
  .put(upsertVendorRule);

module.exports = router;
