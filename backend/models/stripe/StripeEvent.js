const mongoose = require("mongoose");

const StripeEventSchema = new mongoose.Schema(
  {
    eventId:     { type: String, required: true, unique: true },
    type:        { type: String, required: true },
    orderId:     { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
    processedAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

StripeEventSchema.index({ orderId: 1 });

module.exports = mongoose.model("StripeEvent", StripeEventSchema);
