# Backend TODOs: Product Listing

> **Last updated:** 2026-07-11
> **Stack:** Node.js, Express, Mongoose, asyncHandler

---

## Phase 1 — Model & schema

- [x] `Product` base schema — `backend/models/product/Product.js`
- [x] `Electronics` discriminator — `backend/models/product/types/Electronics.js`
- [x] `StockSchema` embedded — `backend/models/product/stock/Stock.js`
- [x] `RatingSchema` embedded — `backend/models/product/rating/Rating.js`
- [x] Pre-save hook — auto-slug from `brand + model`, auto `stock.availability = "Stoc Epuizat"` when qty = 0
- [x] 8 indexes (slug unique, brand, price, rating.average, stock.availability, kind, two compounds)

---

## Phase 2 — Controller

- [x] `getProducts` — `backend/controllers/products/products.js`
- [x] 9 filter params: `search`, `sort`, `brand`, `rating`, `model`, `kind`, `tip`, `availability`, `stocare`, `ram`
- [x] `search` — regex on `brand` + `model`
- [x] `sort` maps to Mongoose sort objects (price_asc, price_desc, name, rating)
- [x] `limit` capped at 100
- [x] Returns `{ queryProducts, totalProducts, numberOfPages }`
- [x] `getProduct` — find by `_id`
- [x] `postProduct` — create product, `protect` + `authorize("admin")`
- [x] `getProductBySlug` — find by `slug`, `GET /api/products/slug/:slug`
- [x] `rating` param — `parseFloat()` guard added

---

## Phase 3 — Routes & middleware

- [x] Routes registered in `backend/routes/products/products.js`
- [x] `GET /api/products` — public
- [x] `GET /api/products/:id` — public
- [x] `POST /api/products` — `protect` + `authorize("admin")`
- [x] `GET /api/products/slug/:slug` — public

---

## Gaps found

- [x] **`getProductBySlug`** — added `GET /api/products/slug/:slug` handler and route
- [x] **`getProducts` — `rating` param** — fixed `Number()` → `parseFloat()` guard
- [ ] **`postProduct`** — no input validation middleware; required fields missing → unformatted Mongoose error
- [ ] **`postProduct`** — no duplicate check before insert; concurrent requests with same slug not handled
- [ ] **No PUT/PATCH route** for updating product fields — no admin edit endpoint
- [ ] **No DELETE route** for products — admin cannot remove via API
- [ ] **`stock.quantity`** updates — no dedicated `PATCH /api/products/:id/stock` endpoint
- [ ] **Rating update** — `rating.average` and `rating.count` must be updated from the review feature; verify that link exists
