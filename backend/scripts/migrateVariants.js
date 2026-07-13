const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

const DRY_RUN = process.argv.includes("--dry");

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const col = mongoose.connection.db.collection("products");

  const toMigrate = await col.find({
    price: { $exists: true },
    variants: { $exists: false },
  }).toArray();

  console.log(`Found ${toMigrate.length} products to migrate${DRY_RUN ? " (dry run)" : ""}`);

  if (DRY_RUN) {
    toMigrate.slice(0, 5).forEach((p) => {
      console.log(`  → ${p.brand} ${p.model || p.name || ""} · price=${p.price}`);
    });
    if (toMigrate.length > 5) console.log(`  ... and ${toMigrate.length - 5} more`);
    await mongoose.disconnect();
    return;
  }

  const result = await col.updateMany(
    { price: { $exists: true }, variants: { $exists: false } },
    [
      {
        $set: {
          variants: [
            {
              attributes: {},
              price: "$price",
              stock: {
                $ifNull: ["$stock", { quantity: 0, availability: "In Stoc" }],
              },
              images: { $ifNull: ["$images", []] },
              sku: null,
            },
          ],
          minPrice: "$price",
        },
      },
      { $unset: ["price", "stock"] },
    ]
  );

  console.log(`Migrated ${result.modifiedCount} / ${result.matchedCount} products`);
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
