# Database: Vendor Dashboard

> **Last updated:** 2026-07-11
> **Affects collections:** `users`, `products`
> **New collections:** none (V1 uses vendor ref on Product)

---

## Changes to existing collections

### `users` (model: `Register`)

| Field | Type | Default | Required | Why added |
|-------|------|---------|----------|-----------|
| `vendorStatus` | `String` enum `['none','pending','approved','rejected']` | `'none'` | no | Tracks vendor application lifecycle |
| `shopName` | `String`, maxlength 100 | `null` | no | Vendor's shop display name |
| `shopDescription` | `String`, maxlength 500 | `null` | no | Short description shown on shop page |

**Migration:** existing users unaffected — new fields have defaults.

---

### `products` (model: `Product`)

| Field | Type | Default | Required | Why added |
|-------|------|---------|----------|-----------|
| `vendor` | `ObjectId` ref `Register` | `null` | no | Which vendor owns this listing (null = admin-created) |
| `images` | `[String]` | `[]` | no | Cloudinary URLs; replaces single `image` string if one exists |
| `listingStatus` | `String` enum `['pending','approved','rejected']` | `'approved'` | no | Default `'approved'` so existing admin-added products stay live |
| `rejectionReason` | `String` | `null` | no | Admin fills on reject; shown to vendor |

**Migration:**
- Existing products need `listingStatus: 'approved'` set in the seeder — add it there.
- `user` field stays as-is (ref to creator). `vendor` is a second optional ref pointing to the same user when created by a vendor (could merge in V2).

---

## New discriminators

### `Clothing` — `backend/models/product/types/Clothing.js`

```js
{
  name:      { type: String, required: true, trim: true },   // e.g. "Tricou oversize"
  size:      { type: [String], default: [] },                 // ["XS","S","M","L","XL","XXL"] or ["36","37","38"]
  material:  { type: String },                                // "100% bumbac", "poliester", etc.
  gender:    { type: String, enum: ['Barbati','Femei','Unisex','Copii'] },
  culoare:   { type: [String], default: [] },
}
```

Indexes: `name: 'text'`, `gender: 1`

---

### `Books` — `backend/models/product/types/Books.js`

```js
{
  title:     { type: String, required: true, trim: true },
  author:    { type: String, required: true },
  isbn:      { type: String },                // ISBN-13
  publisher: { type: String },
  genre:     { type: String },                // "Roman", "SF", "Non-fiction", etc.
  format:    { type: String, enum: ['Fizic','Digital','Audio'] },
  language:  { type: String, default: 'Română' },
  pages:     { type: Number },
}
```

Indexes: `title: 'text'`, `author: 1`, `isbn: 1` (sparse)

---

## Existing discriminators (no changes needed)

### `Electronics` — `backend/models/product/types/Electronics.js`

Fields: `model`, `tip`, `stocare`, `RAM`, `procesor`, `GPU`, `display`, `camera`, `baterie`, `OS`, `conectivitate`, `culoare: [String]`

### `Furniture` — `backend/models/product/types/Furniture.js`

Fields: `name`, `material`, `dimensiuni`, `culoare`, `stil`, `nrLocuri`

> Note: `culoare` here is `String`, not `[String]`. Consider migrating to array for consistency, but out of V1 scope.

### `HomeGarden` — `backend/models/product/types/HomeGarden.js`

Fields: `name`, `material`, `dimensiuni`, `culoare`, `tip`

---

## Indexes

```js
// Product — new indexes
ProductSchema.index({ vendor: 1, listingStatus: 1 });   // vendor's products list
ProductSchema.index({ listingStatus: 1, createdAt: -1 }); // admin pending queue

// Register — new indexes
RegisterSchema.index({ vendorStatus: 1 });               // admin pending vendors queue

// Clothing
ClothingSchema.index({ gender: 1 });
ClothingSchema.index({ name: 'text' });

// Books
BooksSchema.index({ author: 1 });
BooksSchema.index({ isbn: 1 }, { sparse: true });
BooksSchema.index({ title: 'text' });
```

---

## Seed / test data

Add to `backend/seeder.js` (or a dedicated `vendorSeeder.js`):

```js
// 1. Create a vendor user
{ name: "TechVendor SRL", email: "vendor@test.com", password: "test123",
  role: "vendor", vendorStatus: "approved", shopName: "TechVendor", shopDescription: "Electronice și gadgeturi" }

// 2. Add listingStatus: 'approved' to all existing products in seeder
// In each product object, add: listingStatus: 'approved'

// 3. A pending product (to test admin approval UI)
{ kind: "Electronics", brand: "Xiaomi", model: "14 Pro", price: 999,
  vendor: <vendorId>, listingStatus: "pending", ... }
```
