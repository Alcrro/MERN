const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Products",
      required: true,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "Register",
      required: true,
    },
    value: {
      type: Number,
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating must be at most 5"],
      required: [true, "Please add a rating"],
    },
    comment: {
      type: String,
      maxlength: [500, "Comment can not be more than 500 characters"],
    },
  },
  { timestamps: true }
);

// un user poate da un singur review per produs
ReviewSchema.index({ product: 1, user: 1 }, { unique: true });

// getReviews: find({ product }) + sort("-createdAt")
ReviewSchema.index({ product: 1, createdAt: -1 });

// recalculeaza media si numarul de review-uri pe produs
ReviewSchema.statics.calcAverageRating = async function (productId) {
  const stats = await this.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: "$product",
        average: { $avg: "$value" },
        count: { $sum: 1 },
      },
    },
  ]);

  const update =
    stats.length > 0
      ? { "rating.average": Math.round(stats[0].average * 10) / 10, "rating.count": stats[0].count }
      : { "rating.average": 0, "rating.count": 0 };

  await this.model("Products").findByIdAndUpdate(productId, update);
};

ReviewSchema.post("save", function () {
  this.constructor.calcAverageRating(this.product);
});

ReviewSchema.post("findOneAndDelete", function (doc) {
  if (doc) doc.constructor.calcAverageRating(doc.product);
});

const Review = mongoose.model("Review", ReviewSchema);
module.exports = Review;
