const mongoose = require("mongoose");

const PhoneCategorySchema = new mongoose.Schema({
  phoneCategoryName: {
    type: String,
    required: [true, "Please add a phone category number"],
  },
  reviewsCat: [{ type: String, required: [true, "Please add a review category"] }],
});

PhoneCategorySchema.pre("save", function (next) {
  console.log("Successfully saved", this.phoneCategoryName);
  next();
});

const PhoneCategory = mongoose.model("PhoneCategory", PhoneCategorySchema);
module.exports = PhoneCategory;
