<!-- Reverse-engineered from existing models — verify against DB -->

# Database: Product Listing

> **Collection:** `products`
> **Models:** `backend/models/product/`

---

## Product (base schema)

`Product.js` — discriminatorKey: `"kind"`

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| `brand` | String | required, trim | |
| `price` | Number | required, min: 0 | |
| `description` | String | required | |
| `slug` | String | unique | Auto-generated pre-save from `brand + model` (lowercase, spaces → hyphens) |
| `user` | ObjectId | ref: `User`, required | Admin who created the product |
| `rating` | RatingSchema | embedded | See below |
| `stock` | StockSchema | embedded | See below |
| `kind` | String | discriminatorKey | Set by Mongoose; value: `"Electronics"` etc. |
| `createdAt` | Date | auto | `timestamps: true` |
| `updatedAt` | Date | auto | `timestamps: true` |

### Pre-save hook
1. Auto-generates `slug` from `brand + model` (or `brand + name`) — lowercase, spaces → `-`
2. Updates `stock.availability` to `"Stoc Epuizat"` if `stock.quantity === 0`

---

## RatingSchema (embedded)

`backend/models/product/rating/Rating.js`

| Field | Type | Constraints |
|-------|------|-------------|
| `average` | Number | min: 0, max: 5, default: 0, rounded to 1 decimal |
| `count` | Number | default: 0, integer |

---

## StockSchema (embedded)

`backend/models/product/stock/Stock.js`

| Field | Type | Constraints |
|-------|------|-------------|
| `quantity` | Number | integer, min: 0, required |
| `availability` | String | enum: `["In Stoc", "Promotii", "Nou", "Resigilat", "Precomanda", "Stoc Epuizat"]` |

**Virtual:** `isAvailable` → `this.quantity > 0`

---

## Electronics (discriminator)

`backend/models/product/types/Electronics.js`

Extends Product base schema with:

| Field | Type | Notes |
|-------|------|-------|
| `model` | String | Device model name |
| `tip` | String | Sub-type (e.g. "Smartphone", "Laptop", "Tableta") |
| `stocare` | String | e.g. "128GB", "256GB", "1TB" |
| `RAM` | String | e.g. "8GB", "16GB" |
| `procesor` | String | CPU description |
| `GPU` | String | Graphics chip |
| `display` | String | e.g. `"6.1 inch Super Retina XDR"` |
| `camera` | String | e.g. `"12+12+12"` (MP, `+` separated lenses) |
| `baterie` | String | e.g. "4000 mAh" |
| `OS` | String | Operating system |
| `conectivitate` | String | e.g. "5G, WiFi 6, Bluetooth 5.2" |
| `culoare` | String | Color |
| `material` | String | Body material |

---

## Indexes

Defined on base `ProductSchema`:

| Fields | Options | Purpose |
|--------|---------|---------|
| `{ slug: 1 }` | unique | Fast single-product lookup by slug |
| `{ brand: 1 }` | — | Filter by brand |
| `{ price: 1 }` | — | Sort by price |
| `{ "rating.average": -1 }` | — | Sort / filter by rating |
| `{ "stock.availability": 1 }` | — | Filter by availability |
| `{ kind: 1 }` | — | Discriminator queries |
| `{ brand: 1, "rating.average": -1 }` | compound | Brand + sort combo |
| `{ brand: 1, price: 1 }` | compound | Brand + price sort |
