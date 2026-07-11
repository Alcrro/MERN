require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { Register } = require("../models/auth/register");
const Product = require("../models/product/Product");

const VENDORS = [
  {
    name: "TechZone Cluj",
    email: "techzone@alcrro.ro",
    shopName: "TechZone",
    shopDescription: "Electronice de calitate din inima Clujului.",
    vendorProfile: {
      cui: "38201456",
      denumireFirma: "TECHZONE DISTRIBUTION SRL",
      tipEntitate: "SRL",
      orasDepozit: "Cluj-Napoca",
      zileLivrare: { min: 2, max: 4 },
      returZile: 14,
      telefon: "0741987654",
      emailContact: "comenzi@techzone.ro",
    },
  },
  {
    name: "MobileHub Timișoara",
    email: "mobilehub@alcrro.ro",
    shopName: "MobileHub",
    shopDescription: "Telefoane și accesorii, livrare în toată România.",
    vendorProfile: {
      cui: "31509872",
      denumireFirma: "MOBILE HUB",
      tipEntitate: "PFA",
      orasDepozit: "Timișoara",
      zileLivrare: { min: 3, max: 5 },
      returZile: 30,
      telefon: "0755123456",
      emailContact: "shop@mobilehub.ro",
    },
  },
];

// catalogRef → array of listings to create per vendor
// Each entry: { vendor: "techzone"|"mobilehub", price, stock, culoare, availability }
const LISTINGS = [
  // Samsung Galaxy S24 Ultra
  {
    model: "Galaxy S24 Ultra", brand: "Samsung",
    entries: [
      { vendor: "techzone",  price: 5199, avail: "In Stoc",     qty: 8,  culoare: ["Negru", "Gri", "Titan"] },
      { vendor: "mobilehub", price: 4849, avail: "Promotii",    qty: 3,  culoare: ["Violet", "Galben"] },
    ],
  },
  // iPhone 15 Pro Max
  {
    model: "iPhone 15 Pro Max", brand: "Apple",
    entries: [
      { vendor: "techzone",  price: 7099, avail: "In Stoc",     qty: 6,  culoare: ["Negru", "Alb", "Titan"] },
      { vendor: "mobilehub", price: 6499, avail: "Resigilat",   qty: 2,  culoare: ["Albastru"] },
    ],
  },
  // iPhone 15
  {
    model: "iPhone 15", brand: "Apple",
    entries: [
      { vendor: "techzone",  price: 4499, avail: "In Stoc",     qty: 12, culoare: ["Negru", "Albastru", "Verde"] },
      { vendor: "mobilehub", price: 4099, avail: "Promotii",    qty: 20, culoare: ["Galben", "Roz", "Negru"] },
    ],
  },
  // iPhone 14
  {
    model: "iPhone 14", brand: "Apple",
    entries: [
      { vendor: "mobilehub", price: 3099, avail: "Stoc Epuizat", qty: 0, culoare: ["Negru", "Albastru"] },
    ],
  },
  // Galaxy A55
  {
    model: "Galaxy A55", brand: "Samsung",
    entries: [
      { vendor: "techzone",  price: 1999, avail: "In Stoc",     qty: 30, culoare: ["Negru", "Albastru"] },
      { vendor: "mobilehub", price: 1799, avail: "Promotii",    qty: 50, culoare: ["Roz", "Auriu", "Negru"] },
    ],
  },
  // Galaxy Z Flip 5
  {
    model: "Galaxy Z Flip 5", brand: "Samsung",
    entries: [
      { vendor: "techzone",  price: 4099, avail: "In Stoc",     qty: 5,  culoare: ["Negru", "Auriu"] },
    ],
  },
  // Redmi Note 13 Pro
  {
    model: "Redmi Note 13 Pro", brand: "Xiaomi",
    entries: [
      { vendor: "techzone",  price: 1499, avail: "Promotii",    qty: 40, culoare: ["Negru", "Alb"] },
      { vendor: "mobilehub", price: 1349, avail: "In Stoc",     qty: 60, culoare: ["Verde", "Roz", "Negru"] },
    ],
  },
  // Xiaomi 14
  {
    model: "14", brand: "Xiaomi",
    entries: [
      { vendor: "techzone",  price: 3999, avail: "In Stoc",     qty: 10, culoare: ["Negru", "Alb"] },
      { vendor: "mobilehub", price: 3699, avail: "Nou",          qty: 7,  culoare: ["Verde"] },
    ],
  },
  // Poco X6 Pro
  {
    model: "Poco X6 Pro", brand: "Xiaomi",
    entries: [
      { vendor: "mobilehub", price: 1549, avail: "Promotii",    qty: 35, culoare: ["Negru", "Galben"] },
    ],
  },
  // Google Pixel 8 Pro
  {
    model: "Pixel 8 Pro", brand: "Google",
    entries: [
      { vendor: "techzone",  price: 4199, avail: "In Stoc",     qty: 7,  culoare: ["Negru", "Albastru"] },
      { vendor: "mobilehub", price: 3849, avail: "Promotii",    qty: 4,  culoare: ["Gri"] },
    ],
  },
  // Google Pixel 8a
  {
    model: "Pixel 8a", brand: "Google",
    entries: [
      { vendor: "techzone",  price: 2499, avail: "Nou",          qty: 15, culoare: ["Negru", "Albastru", "Verde"] },
    ],
  },
  // OnePlus 12
  {
    model: "12", brand: "OnePlus",
    entries: [
      { vendor: "mobilehub", price: 3449, avail: "In Stoc",     qty: 9,  culoare: ["Negru"] },
    ],
  },
  // Motorola Edge 50 Pro
  {
    model: "Edge 50 Pro", brand: "Motorola",
    entries: [
      { vendor: "techzone",  price: 2199, avail: "In Stoc",     qty: 6,  culoare: ["Negru", "Gri"] },
      { vendor: "mobilehub", price: 1999, avail: "Stoc Epuizat", qty: 0,  culoare: ["Roz"] },
    ],
  },
];

async function run() {
  await mongoose.connect(process.env.MONGO_URI);

  // 1. Create vendor users
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash("Vendor123!", salt);
  const vendorMap = {};

  for (const v of VENDORS) {
    let user = await Register.findOne({ email: v.email });
    if (!user) {
      user = await Register.create({
        name: v.name,
        email: v.email,
        password: hash,
        role: "vendor",
        vendorStatus: "approved",
        shopName: v.shopName,
        shopDescription: v.shopDescription,
        vendorProfile: v.vendorProfile,
      });
      console.log("Created vendor:", v.email);
    } else {
      await Register.findByIdAndUpdate(user._id, {
        $set: {
          role: "vendor",
          vendorStatus: "approved",
          shopName: v.shopName,
          vendorProfile: v.vendorProfile,
        },
      });
      console.log("Updated vendor:", v.email);
    }
    const key = v.email.split("@")[0]; // "techzone" or "mobilehub"
    vendorMap[key] = user._id;
  }

  // 2. For each LISTINGS entry, find the canonical product and clone it per vendor
  let created = 0;
  for (const item of LISTINGS) {
    const canonical = await Product.findOne({
      brand: item.brand,
      model: item.model,
      listingStatus: "approved",
    }).lean();

    if (!canonical) {
      console.warn("Not found:", item.brand, item.model);
      continue;
    }

    for (const entry of item.entries) {
      const vendorId = vendorMap[entry.vendor];
      // skip if this vendor already has a listing for this catalogRef
      const exists = await Product.findOne({ catalogRef: canonical.catalogRef, vendor: vendorId });
      if (exists) {
        console.log("Skip (exists):", item.brand, item.model, entry.vendor);
        continue;
      }

      const { _id, slug, createdAt, updatedAt, __v, rating, ...base } = canonical;

      await Product.create({
        ...base,
        price: entry.price,
        culoare: entry.culoare,
        stock: { quantity: entry.qty, availability: entry.avail },
        vendor: vendorId,
        user: vendorId,
        listingStatus: "approved",
        rejectionReason: null,
        rating: { average: 0, count: 0 },
      });
      created++;
      console.log(`  + ${entry.vendor} → ${item.brand} ${item.model} · ${entry.price} RON · ${entry.avail}`);
    }
  }

  console.log(`\nDone. Created ${created} new listings.`);
  await mongoose.disconnect();
}

run().catch(console.error);
