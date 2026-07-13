/**
 * One-time migration: generates SKU for all products that don't have one yet.
 * Run with: node backend/scripts/generateMissingSkus.js
 */
require("dotenv").config({ path: require("path").join(__dirname, "../../.env") });
const mongoose = require("mongoose");
const Product  = require("../models/product/Product");
const { Register } = require("../models/auth/register");
const { generateSku } = require("../utils/skuGenerator");

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");

  const products = await Product.find({ sku: { $in: [null, undefined, ""] } });
  console.log(`Found ${products.length} products without SKU`);

  let updated = 0;
  for (const product of products) {
    let city = "";
    if (product.vendor) {
      const vendor = await Register.findById(product.vendor).select("vendorProfile").lean();
      city = vendor?.vendorProfile?.orasDepozit || "";
    }

    const model = product.get?.("model") || product.get?.("name") || product.get?.("title") || "";
    let sku;
    let attempts = 0;
    do {
      sku = generateSku(product.brand || "", city, model);
      attempts++;
    } while (attempts < 5 && (await Product.exists({ sku })));

    await Product.updateOne({ _id: product._id }, { $set: { sku } });
    updated++;
    process.stdout.write(`\rUpdated ${updated}/${products.length}`);
  }

  console.log(`\nDone. ${updated} products updated.`);
  process.exit(0);
};

run().catch((err) => { console.error(err); process.exit(1); });
