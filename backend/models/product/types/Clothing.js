const mongoose = require("mongoose");
const Product = require("../Product");

// Covers: clothing, footwear, accessories, sportswear, kids' apparel, etc.
const ClothingSchema = new mongoose.Schema({
  name:     { type: String, required: [true, "Please add a product name"], trim: true },
  size:     { type: [String], default: [] },  // ["XS","S","M","L","XL","XXL"] or ["36","37","38","39","40"]
  material: { type: String },                  // "100% bumbac", "poliester", "piele", etc.
  gender:   { type: String, enum: ["Barbati", "Femei", "Unisex", "Copii"] },
  culoare:  { type: [String], default: [] },
});

ClothingSchema.index({ name: "text" });
ClothingSchema.index({ gender: 1 });

const Clothing = Product.discriminator("Clothing", ClothingSchema);
module.exports = Clothing;
