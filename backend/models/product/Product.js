const mongoose = require("mongoose");
const slugify = require("slugify");
const RatingSchema = require("./rating/Rating");
const VariantSchema = require("./variant/Variant");

const ProductSchema = new mongoose.Schema(
  {
    brand: {
      type: String,
      required: [true, "Please add a brand"],
      trim: true,
      maxlength: [50, "Brand can not be more than 50 characters"],
    },
    minPrice: {
      type: Number,
      default: 0,
    },
    variants: {
      type: [VariantSchema],
      default: [],
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
    vendor: {
      type: mongoose.Schema.ObjectId,
      ref: "Register",
      default: null,
    },
    images: {
      type: [String],
      default: [],
    },
    listingStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "approved",
    },
    rejectionReason: {
      type: String,
      default: null,
    },
    publishStatus: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    sku: {
      type: String,
      sparse: true,
    },
    catalogRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CatalogProduct",
      default: null,
    },
    rating: RatingSchema,
  },
  {
    timestamps: true,
    discriminatorKey: "kind",
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

ProductSchema.pre("save", function (next) {
  const identifier = this.get("model") || this.get("name") || this.get("title") || "";

  const slugParts = [
    this.brand,
    identifier,
    this.get("stocare") || this.get("memorieInterna"),
    this.get("RAM"),
    this.get("culoare"),
    this.get("tip"),
  ].filter(Boolean);
  this.slug = slugify(slugParts.join(" "), { lower: true, strict: true });

  if (!this.description) {
    this.description = `${this.brand} ${identifier}`.trim();
  }

  if (this.isModified("variants") && this.variants?.length > 0) {
    this.minPrice = Math.min(...this.variants.map((v) => v.price));
  }

  next();
});

// sort("-createdAt") — default "Newest"
ProductSchema.index({ createdAt: -1 });

// sort("minPrice") / sort("-minPrice")
ProductSchema.index({ minPrice: 1 });

// sort("rating.average") + find({ "rating.average": { $gte: N } })
ProductSchema.index({ "rating.average": -1 });

// find({ brand }) + sort("-createdAt")
ProductSchema.index({ brand: 1, createdAt: -1 });

// find({ brand }) + sort("minPrice")
ProductSchema.index({ brand: 1, minPrice: 1 });

// find({ brand }) + find({ "rating.average": { $gte: N } })
ProductSchema.index({ brand: 1, "rating.average": -1 });

// find({ kind }) — filter by product type
ProductSchema.index({ kind: 1 });

// vendor's listings + admin approval queue
ProductSchema.index({ vendor: 1, listingStatus: 1 });

// seller picker: group by catalogRef + filter approved + sort minPrice
ProductSchema.index({ catalogRef: 1, listingStatus: 1, minPrice: 1 });
ProductSchema.index({ listingStatus: 1, createdAt: -1 });

// sku lookup — unique per product, used in public URL
ProductSchema.index({ sku: 1 }, { unique: true, sparse: true });

// text search pe brand + description
ProductSchema.index(
  { brand: "text", description: "text" },
  { weights: { brand: 3, description: 1 }, name: "ProductTextIndex" }
);

// variants.price — filter by price range across variant values
ProductSchema.index({ "variants.price": 1 });

// one published listing per vendor per catalog entry
ProductSchema.index(
  { vendor: 1, catalogRef: 1 },
  {
    unique: true,
    sparse: true,
    partialFilterExpression: {
      publishStatus: "published",
      catalogRef: { $ne: null },
    },
  }
);

const Product = mongoose.model("Products", ProductSchema);
module.exports = Product;
