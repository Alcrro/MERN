const mongoose = require("mongoose");

const ProductsSchema = new mongoose.Schema({
  brand: {
    type: String,
    required: true,
  },
  count: {
    type: Number,
    required: true,
  },
});

const LaptopProducts = mongoose.model("LaptopProducts", ProductsSchema);
module.exports = LaptopProducts;
