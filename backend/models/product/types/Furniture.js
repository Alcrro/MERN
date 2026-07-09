const mongoose = require("mongoose");
const Product = require("../Product");

const FurnitureSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a product name"],
    trim: true,
  },
  material: { type: String },
  dimensiuni: { type: String },
  culoare: { type: String },
  stil: { type: String },
  nrLocuri: { type: Number },
});

FurnitureSchema.index({ name: "text" });

const Furniture = Product.discriminator("Furniture", FurnitureSchema);
module.exports = Furniture;
