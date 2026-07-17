const mongoose = require("mongoose");
const crypto = require("crypto");

const TIERS = Object.freeze({ STANDARD: "standard", SILVER: "silver", GOLD: "gold" });
const TIER_MULTIPLIERS = { standard: 1.0, silver: 1.1, gold: 1.25 };

const ShopCardSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Register",
      required: true,
      unique: true,
    },
    cardNumber: {
      type: String,
      required: true,
      unique: true,
    },
    credits: {
      type: Number,
      default: 0,
      min: 0,
    },
    points: {
      type: Number,
      default: 0,
      min: 0,
    },
    tier: {
      type: String,
      enum: Object.values(TIERS),
      default: TIERS.STANDARD,
    },
    referralCode: {
      type: String,
      required: true,
      unique: true,
    },
    referredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Register",
      default: null,
    },
    hasUsedReferral: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

ShopCardSchema.index({ referralCode: 1 }, { unique: true });

ShopCardSchema.pre("save", function (next) {
  if (this.isModified("points")) {
    if (this.points >= 2000) this.tier = TIERS.GOLD;
    else if (this.points >= 500) this.tier = TIERS.SILVER;
    else this.tier = TIERS.STANDARD;
  }
  next();
});

ShopCardSchema.statics.generateCardNumber = function () {
  const part = () => crypto.randomBytes(2).toString("hex").toUpperCase();
  return `ALCRRO-${part()}-${part()}`;
};

ShopCardSchema.statics.generateReferralCode = function () {
  return crypto.randomBytes(3).toString("hex").toUpperCase();
};

const ShopCard = mongoose.model("ShopCard", ShopCardSchema);
module.exports = { ShopCard, TIERS, TIER_MULTIPLIERS };
