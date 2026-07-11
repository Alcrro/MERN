const mongoose = require("mongoose");

const CatalogProductSchema = new mongoose.Schema(
  {
    kind: {
      type: String,
      required: true,
      enum: ["Electronics", "Clothing", "Furniture", "HomeGarden", "Books"],
    },
    brand: {
      type: String,
      required: true,
      trim: true,
    },
    specs: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    images: {
      type: [String],
      default: [],
    },
    culoare: {
      type: [String],
      default: [],
    },
    refPrice: {
      type: Number,
      default: null,
    },
  },
  { timestamps: true }
);

CatalogProductSchema.index({ kind: 1 });
CatalogProductSchema.index(
  { brand: "text", "specs.model": "text", "specs.name": "text" },
  { weights: { brand: 3, "specs.model": 2, "specs.name": 2 }, name: "CatalogTextIndex" }
);

module.exports = mongoose.model("CatalogProduct", CatalogProductSchema);
