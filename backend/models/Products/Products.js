const mongoose = require("mongoose");
const slugify = require("slugify");
const ProductsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a name"],
    trim: true,
    maxlength: [50, "Name can not be more than 50 characters"],
  },
  price: {
    type: Number,
    required: [true, "Please add a price"],
  },
  description: {
    type: String,
    required: [true, "Please add a description"],
  },
  slug: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
// pre run before operation
ProductsSchema.pre("save", function (next) {
  console.log("Slugify ran", this.name);
  this.slug = slugify(this.description, { lower: true });
  next();
});

const Products = mongoose.model("Products", ProductsSchema);
module.exports = Products;
