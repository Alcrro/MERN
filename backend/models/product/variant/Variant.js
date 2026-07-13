const mongoose = require("mongoose");
const { StockSchema } = require("../stock/Stock");

const VariantSchema = new mongoose.Schema(
  {
    attributes: {
      type: Map,
      of: String,
      default: {},
    },
    price: {
      type: Number,
      required: [true, "Varianta trebuie să aibă un preț"],
      min: [0, "Prețul nu poate fi negativ"],
    },
    stock: {
      type: StockSchema,
      default: () => ({}),
    },
    images: {
      type: [String],
      default: [],
    },
    sku: {
      type: String,
      default: null,
    },
  },
  { _id: true }
);

module.exports = VariantSchema;
