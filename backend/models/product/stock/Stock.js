const mongoose = require("mongoose");

const AVAILABILITY = Object.freeze({
  IN_STOCK: "In Stoc",
  PROMOTII: "Promotii",
  NOU: "Nou",
  RESIGILAT: "Resigilat",
  PRECOMANDA: "Precomanda",
  OUT_OF_STOCK: "Stoc Epuizat",
});

const StockSchema = new mongoose.Schema(
  {
    quantity: {
      type: Number,
      default: 0,
      min: [0, "Stock quantity cannot be negative"],
      validate: {
        validator: Number.isInteger,
        message: "Stock quantity must be a whole number",
      },
    },
    availability: {
      type: String,
      enum: {
        values: Object.values(AVAILABILITY),
        message: "{VALUE} is not a valid availability status",
      },
      default: AVAILABILITY.IN_STOCK,
    },
  },
  {
    _id: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

StockSchema.virtual("isAvailable").get(function () {
  return this.quantity > 0;
});

module.exports = { StockSchema, AVAILABILITY };
