const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "../../.env") });

const Product = require("../models/product/Product");
const CatalogProduct = require("../models/catalog/CatalogProduct");

const main = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected");

  const [products, catalogs] = await Promise.all([
    Product.find({}),
    CatalogProduct.find({}),
  ]);

  console.log(`Found ${products.length} products, ${catalogs.length} catalog entries`);

  let updated = 0;
  let skipped = 0;

  for (const product of products) {
    const p = product.toObject();
    const match = catalogs.find((c) => {
      if (c.brand !== p.brand) return false;
      const modelMatch = c.specs?.model && c.specs.model === p.model;
      const nameMatch  = c.specs?.name  && c.specs.name  === p.name;
      return modelMatch || nameMatch;
    });

    if (match) {
      await Product.updateOne({ _id: p._id }, { catalogRef: match._id });
      console.log(`  ✓  ${p.brand} ${p.model || p.name} → ${match._id}`);
      updated++;
    } else {
      console.log(`  –  no match: ${p.brand} ${p.model || p.name}`);
      skipped++;
    }
  }

  console.log(`\nDone. Updated: ${updated}, No match: ${skipped}`);
  await mongoose.disconnect();
  process.exit(0);
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
