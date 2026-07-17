const mongoose = require("mongoose");
const Vendor = require("../vendor/Vendor");

const VendorReviewSchema = new mongoose.Schema(
  {
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: "Register", required: true },
    user:   { type: mongoose.Schema.Types.ObjectId, ref: "Register", required: true },
    value:  { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, maxlength: 500, default: "" },
  },
  { timestamps: true }
);

VendorReviewSchema.index({ vendor: 1, user: 1 }, { unique: true });
VendorReviewSchema.index({ vendor: 1, createdAt: -1 });

VendorReviewSchema.statics.calcAverageRating = async function (userId) {
  const stats = await this.aggregate([
    { $match: { vendor: userId } },
    { $group: { _id: "$vendor", average: { $avg: "$value" }, count: { $sum: 1 } } },
  ]);

  const update = stats.length > 0
    ? { "rating.average": Math.round(stats[0].average * 10) / 10, "rating.count": stats[0].count }
    : { "rating.average": 0, "rating.count": 0 };

  await Vendor.findOneAndUpdate({ user: userId }, update);
};

VendorReviewSchema.post("save", function () {
  this.constructor.calcAverageRating(this.vendor);
});

VendorReviewSchema.post("findOneAndDelete", function (doc) {
  if (doc) doc.constructor.calcAverageRating(doc.vendor);
});

const VendorReview = mongoose.model("VendorReview", VendorReviewSchema);
module.exports = VendorReview;
