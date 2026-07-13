# Backend TODOs: Product Listing

> **Last updated:** 2026-07-13
> **Stack:** Node.js, Express, Mongoose, asyncHandler

---

## Phase 1 — Model & schema

- [x] `Product` base schema — `backend/models/product/Product.js`
- [x] `Electronics` discriminator — `backend/models/product/types/Electronics.js`
- [x] `StockSchema` embedded — `backend/models/product/stock/Stock.js`
- [x] `RatingSchema` embedded — `backend/models/product/rating/Rating.js`
- [x] Pre-save hook — auto-slug from `brand + model`, auto `stock.availability = "Stoc Epuizat"` when qty = 0
- [x] 10 indexes (createdAt, price, rating.average, brand compounds, kind, vendor+listingStatus, listingStatus+createdAt, text)

---

## Phase 2 — Controller

- [x] `getProducts` — `backend/controllers/products/products.js`
- [x] 11 filter params: `search`, `sort`, `brand`, `rating`, `model`, `kind`, `tip`, `availability`, `stocare`, `ram`, `culoare` + `tips[]` (multi-tip array)
- [x] `getProducts` folosește **aggregation pipeline** pentru deduplicare multi-vendor: group by `catalogRef`, MIN(price), `sellersCount` — produse fără `catalogRef` tratate individual
- [x] `publishStatus` filter: `$or: [published, {$exists:false}, vendor:null]` — exclude listinguri draft
- [x] `totalProductsNumberQuery` — din `$count` aggregation separată (nu `.length`)
- [x] `search` — MongoDB `$text` search (requires text index on brand + description)
- [x] `sort` — mapped to Mongoose sort strings (6 named sort options)
- [x] `limit` capped at 100; `page` clamped to min 1
- [x] `rating` param uses `parseFloat()` guard
- [x] Returns `{ success, totalProductsNumberQuery, numberOfPages, currentPage, limit, queryProducts, totalProducts }`
- [x] `totalProducts` — all approved products (unfiltered, used client-side for filter context)
- [x] `getProduct` — find by `_id`, 404 via `ErrorResponse`
- [x] `postProduct` — create product, `protect` + `authorize("vendor", "admin")` (vendor allowed)
- [x] `postProduct` — auto-generează `sku` via `generateSku()`
- [x] `getProductBySlug` — find by `slug`, `GET /api/products/slug/:slug`
- [x] `getProductBySku` — find by `sku`, `GET /api/product/sku/:sku`
- [x] `getSellers` — `GET /api/products/sellers/:catalogRef` — lista vendorilor aprobați per catalogRef

---

## Phase 3 — Routes & middleware

- [x] Routes registered in `backend/routes/products/products.js`
- [x] `GET /api/products` — public
- [x] `GET /api/product/:id` — public
- [x] `GET /api/product/sku/:sku` — public
- [x] `GET /api/products/slug/:slug` — public
- [x] `GET /api/products/sellers/:catalogRef` — public
- [x] `POST /api/admin/product` — `protect` + `authorize("vendor", "admin")`

---

## Gaps found

- [ ] **`postProduct`** — no input validation middleware; required fields missing → raw Mongoose error exposed
- [ ] **`postProduct`** — no duplicate slug guard; concurrent inserts with same brand+model not handled
- [ ] **No PUT/PATCH route** — no admin endpoint to update product fields after creation
- [ ] **No DELETE route** — admin cannot remove products via API
- [ ] **`stock.quantity` updates** — no dedicated `PATCH /api/products/:id/stock` endpoint
- [x] **`getProducts` — `totalProductsNumberQuery`** — acum din `$count` aggregation separată (nu `.length`)
- [ ] **`getProducts` — `totalProducts`** — fetch ALL approved products la fiecare request paginated; scump la scară; `$count` separată e implementată doar pentru `numberOfPages`, nu și pentru `totalProducts`
- [ ] **Rating param** — `rating` accepts multi-value in query string but `parseFloat` only takes first value; if client sends `rating[]=3&rating[]=4`, only first is used
