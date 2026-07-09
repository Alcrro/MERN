const mongoose = require("mongoose");

const RatingSchema = new mongoose.Schema(
  {
    average: {
      type: Number,
      default: 0,
      min: [0, "Rating average cannot be negative"],
      max: [5, "Rating average cannot exceed 5"],
      set: (val) => Math.round(val * 10) / 10,
    },
    count: {
      type: Number,
      default: 0,
      min: [0, "Rating count cannot be negative"],
    },
  },
  {
    _id: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

RatingSchema.virtual("hasRatings").get(function () {
  return this.count > 0;
});

module.exports = RatingSchema;
