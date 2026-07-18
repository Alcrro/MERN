const Stripe = require("stripe");

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn("[stripe] STRIPE_SECRET_KEY not set — Stripe features will fail at runtime");
}

module.exports = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_placeholder");
