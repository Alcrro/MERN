const mongoose = require("mongoose");

const SubscriberSchema = new mongoose.Schema(
  {
    email:           { type: String, required: true, unique: true, lowercase: true, trim: true },
    active:          { type: Boolean, default: true },
    unsubscribedAt:  { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Subscriber", SubscriberSchema);
