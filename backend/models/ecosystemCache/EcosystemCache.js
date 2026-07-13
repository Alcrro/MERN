const mongoose = require("mongoose");

const EcosystemCacheSchema = new mongoose.Schema(
  {
    tip: {
      type:     String,
      required: true,
      unique:   true,
      index:    true,
    },
    data: {
      type:     mongoose.Schema.Types.Mixed,
      required: true,
    },
    source: {
      type:    String,
      enum:    ["openai", "static"],
      default: "openai",
    },
    expiresAt: {
      type:     Date,
      required: true,
    },
  },
  { timestamps: true }
);

EcosystemCacheSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("EcosystemCache", EcosystemCacheSchema);
