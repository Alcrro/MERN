<!-- Reverse-engineered from existing models — verify against DB -->

# Database: Product Listing

> **Collection:** `products`
> **Models:** `backend/models/product/`

---

## Product (base schema)

`Product.js` — `discriminatorKey: "kind"`, `timestamps: true`

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| `brand` | String | required, trim, maxlength: 50 | |
| `price` | Number | required | |
| `description` | String | — | Auto-filled by pre-save hook if empty: `"${brand} ${model}"` |
| `slug` | String | — | Auto-generated pre-save from `brand + model/name`, lowercase |
| `user` | ObjectId | ref: Register, required | Admin who created the product |
| `vendor` | ObjectId | ref: Register, default: null | Vendor who owns the listing |
| `images` | [String] | default: [] | Array of image URLs |
| `listingStatus` | String | enum: pending/approved/rejected, default: `"approved"` | Admin-managed for vendor listings |
| `rejectionReason` | String | default: null | Set by admin when rejected |
| `rating` | RatingSchema | embedded | |
| `stock` | StockSchema | embedded | |
| `kind` | String | discriminatorKey | Set by Mongoose: `"Electronics"`, `"Clothing"`, etc. |
| `createdAt` | Date | auto | timestamps |
| `updatedAt` | Date | auto | timestamps |

### Pre-save hook
1. Generates `slug` from `brand + model` (or `brand + name`) — lowercased
2. Sets `stock.availability = "Stoc Epuizat"` when `stock.quantity === 0`
3. Resets `stock.availability = "In Stoc"` when qty > 0 and was previously out of stock

---

## RatingSchema (embedded)

`backend/models/product/rating/Rating.js`

| Field | Type | Constraints |
|-------|------|-------------|
| `average` | Number | min: 0, max: 5, default: 0 |
| `count` | Number | default: 0 |

---

## StockSchema (embedded)

`backend/models/product/stock/Stock.js`

| Field | Type | Constraints |
|-------|------|-------------|
| `quantity` | Number | min: 0, required |
| `availability` | String | enum: `["In Stoc", "Promotii", "Nou", "Resigilat", "Precomanda", "Stoc Epuizat"]` |

**Virtual:** `isAvailable` → `this.quantity > 0`

---

## Electronics (discriminator)

`backend/models/product/types/Electronics.js` — `kind: "Electronics"`

| Field | Type | Notes |
|-------|------|-------|
| `model` | String | required, trim |
| `tip` | String | Sub-type: "Telefon", "Laptop", "Tabletă", "Desktop PC", "Server", etc. |
| `stocare` | String | e.g. "128GB", "256GB", "1TB" |
| `RAM` | String | e.g. "8GB", "16GB" |
| `procesor` | String | CPU description |
| `GPU` | String | Graphics chip |
| `display` | String | e.g. "6.1 inch Super Retina XDR" |
| `camera` | String | e.g. "12+12+12" |
| `baterie` | String | e.g. "4000 mAh" |
| `OS` | String | |
| `conectivitate` | String | e.g. "5G, WiFi 6, Bluetooth 5.2" |
| `culoare` | [String] | default: [] — color variants |

**Electronics indexes:** `{ model: 1 }`, `{ tip: 1 }`, `{ model: "text" }`

---

## Indexes (base ProductSchema)

| Fields | Options | Purpose |
|--------|---------|---------|
| `{ createdAt: -1 }` | — | Default sort "Newest" |
| `{ price: 1 }` | — | Sort by price |
| `{ "rating.average": -1 }` | — | Sort + filter by rating |
| `{ brand: 1, createdAt: -1 }` | compound | Brand filter + newest sort |
| `{ brand: 1, price: 1 }` | compound | Brand filter + price sort |
| `{ brand: 1, "rating.average": -1 }` | compound | Brand filter + rating sort |
| `{ kind: 1 }` | — | Discriminator filter |
| `{ vendor: 1, listingStatus: 1 }` | compound | Vendor dashboard listing queries |
| `{ listingStatus: 1, createdAt: -1 }` | compound | Admin approval queue |
| `{ brand: "text", description: "text" }` | weights: brand×3 | Full-text search (`$search`) |
