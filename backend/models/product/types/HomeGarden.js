const mongoose = require("mongoose");
const Product = require("../Product");

const HomeGardenSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "Please add a product name"],
		trim: true,
	},
	material: { type: String },
	dimensiuni: { type: String },
	culoare: { type: String },
	tip: { type: String },
});

HomeGardenSchema.index({ name: "text" });

const HomeGarden = Product.discriminator("HomeGarden", HomeGardenSchema);
module.exports = HomeGarden;
