const express = require("express");
const {
  setupIntent,
  listPaymentMethods,
  deletePaymentMethod,
  setDefaultPaymentMethod,
} = require("../../controllers/paymentMethods/paymentMethods");
const { protect } = require("../../middleware/auth/auth");

const router = express.Router();

router.use(protect);

router.post("/setup", setupIntent);
router.get("/", listPaymentMethods);
router.delete("/:pmId", deletePaymentMethod);
router.put("/:pmId/default", setDefaultPaymentMethod);

module.exports = router;
