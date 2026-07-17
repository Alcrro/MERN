const express = require("express");
const { handleStripeWebhook, getStripeConfig } = require("../../controllers/stripe/stripeWebhook");

const router = express.Router();

// raw body necesar pentru verificarea semnăturii Stripe
router.post("/webhook", express.raw({ type: "application/json" }), handleStripeWebhook);
router.get("/config", getStripeConfig);

module.exports = router;
