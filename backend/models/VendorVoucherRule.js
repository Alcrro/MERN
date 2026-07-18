const mongoose = require("mongoose");

// One rule per vendor — upserted, not inserted multiple times
const VendorVoucherRuleSchema = new mongoose.Schema(
  {
    vendorId:       { type: mongoose.Schema.ObjectId, ref: "Register", required: true, unique: true },
    enabled:        { type: Boolean, default: false },
    type:           { type: String, enum: ["percent", "fixed"], default: "percent" },
    value:          { type: Number, default: 10, min: 1 },
    minOrderAmount: { type: Number, default: 0, min: 0 },
    validDays:      { type: Number, default: 30, min: 1 },
    // empty = all vendor products; populated = only these products
    productIds:     [{ type: mongoose.Schema.ObjectId, ref: "Product" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("VendorVoucherRule", VendorVoucherRuleSchema);
