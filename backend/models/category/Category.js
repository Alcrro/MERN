const mongoose = require("mongoose");

const SubItemSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    icon:  { type: String },
    tip:   { type: String },   // filtru tip produs (ex: "Telefon", "Laptop")
    kind:  { type: String },   // suprascrie kind-ul părintelui (ex: sub-item Furniture în cat Casă)
  },
  { _id: false }
);

const CategorySchema = new mongoose.Schema(
  {
    label: { type: String, required: true, trim: true },
    icon:  { type: String, required: true },
    kind:  { type: String, default: null }, // null = categorie cu mai multe kind-uri (ex: Casă & Grădină)
    order: { type: Number, default: 0 },
    sub:   [SubItemSchema],
  },
  { timestamps: false }
);

CategorySchema.index({ order: 1 });

const Category = mongoose.model("Category", CategorySchema);
module.exports = Category;
