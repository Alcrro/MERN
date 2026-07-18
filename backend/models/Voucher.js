const mongoose = require("mongoose");

const VoucherSchema = new mongoose.Schema(
  {
    code:       { type: String, required: true, unique: true, uppercase: true, trim: true },
    type:       { type: String, enum: ["percent", "fixed"], required: true },
    value:      { type: Number, required: true },
    minOrder:   { type: Number, default: 0 },
    active:     { type: Boolean, default: true },
    expiresAt:  { type: Date, default: null },
    // null = global (admin); populated = vendor-specific
    vendorId:   { type: mongoose.Schema.ObjectId, ref: "Register", default: null },
    // empty = all vendor products; populated = only these products
    productIds: [{ type: mongoose.Schema.ObjectId, ref: "Product" }],

    // reward vouchers — auto-issued to buyer after order paid
    scope:        { type: String, enum: ["global", "vendor", "reward"], default: "global" },
    issuedTo:     { type: mongoose.Schema.ObjectId, ref: "Register", default: null },
    sourceOrderId:{ type: mongoose.Schema.ObjectId, ref: "Order",    default: null },
    isRedeemed:   { type: Boolean, default: false },
    usedOnOrderId:{ type: mongoose.Schema.ObjectId, ref: "Order",    default: null },
  },
  { timestamps: true }
);

VoucherSchema.index({ vendorId: 1, active: 1 });
VoucherSchema.index({ issuedTo: 1, isRedeemed: 1 });

module.exports = mongoose.model("Voucher", VoucherSchema);
