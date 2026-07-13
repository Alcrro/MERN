/**
 * seedImages.js — upload product images to Cloudinary and store URLs in MongoDB
 * Targets: phones (tip="Telefon") + phone accessories from phoneAccessoriesData
 *
 * Usage: node backend/scripts/seedImages.js
 */

const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

const mongoose = require("mongoose");
const cloudinary = require("../configs/cloudinary");

require("../models/product/Product");
require("../models/product/types/Electronics");
const Product = mongoose.model("Products");

// ─────────────────────────────────────────────────────────────────────────────
// Image map: "Brand|Model" → public source URL
// Cloudinary fetches the URL and re-hosts it, so source URLs only need to work
// at seed time. All Apple CDN URLs are stable press/store images.
// ─────────────────────────────────────────────────────────────────────────────

const APPLE_CDN = (name) =>
  `https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/${name}?wid=940&hei=1112&fmt=jpeg&qlt=90`;

const UNSPLASH = (id) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=800&q=80`;

// Picsum: seed-based consistent photos, always accessible, no auth
const PICSUM = (seed, w = 600, h = 900) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

const IMAGE_MAP = {
  // ── iPhones (Apple Store CDN — confirmed working) ──────────────────────────
  "Apple|iPhone 15 Pro Max":
    APPLE_CDN("iphone-15-pro-max-naturaltitanium-select"),
  "Apple|iPhone 15 Pro":
    APPLE_CDN("iphone-15-pro-naturaltitanium-select"),
  "Apple|iPhone 15":
    UNSPLASH("1510557880182-3d4d3cba35a5"),
  "Apple|iPhone 14":
    PICSUM("apple-iphone14", 600, 900),

  // ── Samsung phones ─────────────────────────────────────────────────────────
  "Samsung|Galaxy S24 Ultra":
    UNSPLASH("1592750475338-74b7b21085ab"),
  "Samsung|Galaxy S24":
    PICSUM("samsung-s24", 600, 900),
  "Samsung|Galaxy A55":
    UNSPLASH("1556656793-08538906a9f8"),
  "Samsung|Galaxy Z Flip 5":
    UNSPLASH("1598327105666-5b89351aff97"),

  // ── Xiaomi phones ──────────────────────────────────────────────────────────
  "Xiaomi|14":
    UNSPLASH("1567581935884-3349723552ca"),
  "Xiaomi|Redmi Note 13 Pro":
    UNSPLASH("1511707171634-5f897ff02aa9"),
  "Xiaomi|Poco X6 Pro":
    PICSUM("xiaomi-poco-x6", 600, 900),

  // ── Google Pixel ───────────────────────────────────────────────────────────
  "Google|Pixel 8 Pro":
    UNSPLASH("1580910051074-3eb694886505"),
  "Google|Pixel 8a":
    UNSPLASH("1616348436168-de43ad0db179"),

  // ── OnePlus ────────────────────────────────────────────────────────────────
  "OnePlus|12":
    PICSUM("oneplus-12", 600, 900),
  "OnePlus|Nord CE 4":
    UNSPLASH("1511707171634-5f897ff02aa9"),

  // ── Motorola ───────────────────────────────────────────────────────────────
  "Motorola|Edge 50 Pro":
    UNSPLASH("1598327105666-5b89351aff97"),

  // ── Chargers ───────────────────────────────────────────────────────────────
  "Anker|Nano Pro 65W GaN":
    PICSUM("anker-nano", 800, 800),
  "Samsung|EP-T4510 45W Super Fast Charger":
    PICSUM("samsung-charger", 800, 800),
  "Apple|MHJA3ZM/A USB-C 20W":
    PICSUM("apple-charger", 800, 800),

  // ── Cases ──────────────────────────────────────────────────────────────────
  "Spigen|Tough Armor MagFit":
    PICSUM("spigen-tough", 800, 900),
  "UGREEN|Frosted Shield Pro":
    PICSUM("ugreen-case", 800, 900),
  "Ringke|Fusion Clear":
    PICSUM("ringke-fusion", 800, 900),

  // ── Screen protectors ──────────────────────────────────────────────────────
  "Spigen|GlassTR Slim":
    PICSUM("spigen-glass", 800, 800),
  "3MK|HardGlass Max":
    PICSUM("3mk-glass", 800, 800),

  // ── Cables ─────────────────────────────────────────────────────────────────
  "Anker|Bio-Braided USB-C 3A 100W":
    PICSUM("anker-cable", 800, 800),
  "Baseus|Superior Series 100W Fast Data Cable":
    PICSUM("baseus-cable", 800, 800),

  // ── Power banks ────────────────────────────────────────────────────────────
  "Anker|737 PowerCore 24000":
    PICSUM("anker-powerbank", 800, 600),
  "Xiaomi|Power Bank 3 Ultra Compact 10000mAh":
    PICSUM("xiaomi-powerbank", 800, 600),

  // ── Photography ────────────────────────────────────────────────────────────
  "Joby|GorillaPod 3K":
    PICSUM("joby-gorilla", 800, 800),
  "DJI|OM 6":
    PICSUM("dji-om6", 800, 800),
  "Rode|Wireless GO II":
    PICSUM("rode-mic", 800, 800),
  "Moment|Wide 18mm Lens":
    PICSUM("moment-lens", 800, 800),

  // ── Gaming ─────────────────────────────────────────────────────────────────
  "GameSir|T4 Mini":
    PICSUM("gamesir-t4", 800, 800),
  "Black Shark|FunCooler 3 Pro":
    PICSUM("blackshark-cooler", 800, 800),
  "HyperX|Cloud Alpha Wireless":
    PICSUM("hyperx-cloud", 800, 800),

  // ── Productivity ───────────────────────────────────────────────────────────
  "Logitech|K380 Multi-Device":
    PICSUM("logitech-k380", 900, 600),
  "Anker|565 USB-C Hub 7-in-1":
    PICSUM("anker-hub", 800, 800),

  // ── Travel ─────────────────────────────────────────────────────────────────
  "Baseus|MagSafe Dashboard Mount":
    PICSUM("baseus-mount", 800, 800),
  "Anker|PowerDrive Speed+ 2 40W":
    PICSUM("anker-cardrive", 800, 800),
};

// ─────────────────────────────────────────────────────────────────────────────

async function uploadAndSave(brand, model, sourceUrl) {
  const key = `${brand}|${model}`;
  try {
    const result = await cloudinary.uploader.upload(sourceUrl, {
      folder: "alcrro/products",
      public_id: `${brand}-${model}`.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      overwrite: true,
      resource_type: "image",
    });

    await Product.updateOne(
      { brand, model },
      { $set: { images: [result.secure_url] } }
    );

    console.log(`  ✓ ${key}`);
    return true;
  } catch (err) {
    console.error(`  ✗ ${key} — ${err.message}`);
    return false;
  }
}

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB\n");

  let ok = 0;
  let fail = 0;

  for (const [key, url] of Object.entries(IMAGE_MAP)) {
    const [brand, model] = key.split("|");
    const success = await uploadAndSave(brand, model, url);
    if (success) ok++; else fail++;
  }

  console.log(`\nDone: ${ok} uploaded, ${fail} failed`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
