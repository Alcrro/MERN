const mongoose = require("mongoose");
const Product = require("../Product");

// Covers: phones, laptops, desktop PCs, servers, gaming consoles, tablets, etc.
const ElectronicsSchema = new mongoose.Schema({
  model: {
    type: String,
    required: [true, "Please add a model"],
    trim: true,
  },
  tip: { type: String },            // "Telefon" | "Laptop" | "Desktop PC" | "Server" | "Consolă Gaming" | "Tabletă" | …
  stocare: { type: String },        // 128GB SSD, 1TB HDD, etc.
  RAM: { type: String },
  procesor: { type: String },
  GPU: { type: String },
  display: { type: String },
  camera: { type: String },
  baterie: { type: String },
  OS: { type: String },
  conectivitate: { type: String },  // Wi-Fi 6, Bluetooth 5.3, USB-C, etc.
  culoare:       { type: [String], default: [] },
});

ElectronicsSchema.index({ model: 1 });
ElectronicsSchema.index({ tip: 1 });
ElectronicsSchema.index({ model: "text" });

const Electronics = Product.discriminator("Electronics", ElectronicsSchema);
module.exports = Electronics;
