const mongoose = require("mongoose");
const slugify = require("slugify");

const ProductsSchema = new mongoose.Schema({
  brand: {
    type: String,
    required: [true, "Please add a name"],
    trim: true,
    maxlength: [50, "Name can not be more than 50 characters"],
    unique: false,
  },
  model: {
    type: String,
    required: [true, "Please add a brand name"],
  },

  stock: {
    type: Number,
  },

  memorieInterna: {
    type: String,
    required: [true, "Please add a memorie interna"],
  },

  rating: {
    type: String,
    maxlength: [5, "Rating can not be more than 5 characters"],
    required: [true, "Please add a rating"],
  },

  price: {
    type: Number,
    required: [true, "Please add a price"],
  },

  description: {
    type: String,
  },

  slug: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "Register",
    required: true,
  },

  // availability: {
  //   type: String,
  //   enum: ["In Stoc", "Promotii", "Nou", "Resigilate", "Precomanda"],
  // },
});

// Create  slug from the brand + model
ProductsSchema.pre("save", function (next) {
  console.log("Slugify ran", this.brand + " " + this.model);
  this.slug = slugify(this.brand + " " + this.model, { lower: true });
  next();
});

// Create description from the brand + model
ProductsSchema.pre("save", function (next) {
  console.log("Description ran", this.brand + " " + this.model);
  this.description = this.brand + " " + this.model;
  next();
});

const Products = mongoose.model("Products", ProductsSchema);
module.exports = Products;
