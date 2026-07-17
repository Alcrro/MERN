const mongoose = require("mongoose");

const TRANSACTION_TYPES = Object.freeze([
  "credit-purchase",
  "points-earned",
  "points-redeemed",
  "credits-spent",
  "referral-bonus",
  "welcome-bonus",
]);

const CardTransactionSchema = new mongoose.Schema(
  {
    card: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ShopCard",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Register",
      required: true,
    },
    type: {
      type: String,
      enum: TRANSACTION_TYPES,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      default: null,
    },
    stripePaymentIntentId: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

CardTransactionSchema.index({ user: 1, createdAt: -1 });
CardTransactionSchema.index({ card: 1, createdAt: -1 });
CardTransactionSchema.index({ stripePaymentIntentId: 1 }, { sparse: true });
CardTransactionSchema.index({ orderId: 1 }, { sparse: true });

const CardTransaction = mongoose.model("CardTransaction", CardTransactionSchema);
module.exports = { CardTransaction, TRANSACTION_TYPES };
