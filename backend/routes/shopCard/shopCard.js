const express = require("express");
const {
  getMyCard,
  getTransactions,
  topUp,
  redeemPoints,
  applyReferral,
} = require("../../controllers/shopCard/shopCard");
const { protect } = require("../../middleware/auth/auth");

const router = express.Router();

router.use(protect);

router.get("/my", getMyCard);
router.get("/transactions", getTransactions);
router.post("/top-up", topUp);
router.post("/redeem-points", redeemPoints);
router.post("/referral/apply", applyReferral);

module.exports = router;
