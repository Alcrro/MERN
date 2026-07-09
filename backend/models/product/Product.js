const mongoose = require("mongoose");
const slugify = require("slugify");
const RatingSchema = require("./rating/Rating");
const { StockSchema, AVAILABILITY } = require("./stock/Stock");

const ProductSchema = new mongoose.Schema(
  {
    brand: {
      type: String,
      required: [true, "Please add a brand"],
      trim: true,
      maxlength: [50, "Brand can not be more than 50 characters"],
    },
    price: {
      type: Number,
      required: [true, "Please add a price"],
    },
    description: {
      type: String,
    },
    slug: {
      type: String,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "Register",
      required: true,
    },
    rating: RatingSchema,
    stock: StockSchema,
  },
  {
    timestamps: true,
    discriminatorKey: "kind",
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

ProductSchema.pre("save", function (next) {
  const identifier = this.model || this.name || "";
  this.slug = slugify((this.brand + (identifier ? " " + identifier : "")).trim(), { lower: true });

  if (!this.description) {
    this.description = `${this.brand} ${identifier}`.trim();
  }

  if (this.isModified("stock.quantity")) {
    if (this.stock.quantity === 0) {
      this.stock.availability = AVAILABILITY.OUT_OF_STOCK;
    } else if (this.stock.availability === AVAILABILITY.OUT_OF_STOCK) {
      this.stock.availability = AVAILABILITY.IN_STOCK;
    }
  }

  next();
});

// sort("-createdAt") — default "Newest"
ProductSchema.index({ createdAt: -1 });

// sort("price") / sort("-price")
ProductSchema.index({ price: 1 });

// sort("rating.average") + find({ "rating.average": { $gte: N } })
ProductSchema.index({ "rating.average": -1 });

// find({ brand }) + sort("-createdAt")
ProductSchema.index({ brand: 1, createdAt: -1 });

// find({ brand }) + sort("price")
ProductSchema.index({ brand: 1, price: 1 });

// find({ brand }) + find({ "rating.average": { $gte: N } })
ProductSchema.index({ brand: 1, "rating.average": -1 });

// find({ kind }) — filter by product type
ProductSchema.index({ kind: 1 });

// text search pe brand + description
ProductSchema.index(
  { brand: "text", description: "text" },
  { weights: { brand: 3, description: 1 }, name: "ProductTextIndex" }
);

const Product = mongoose.model("Products", ProductSchema);
module.exports = Product;
