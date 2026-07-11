# Backend TODOs: Seller Picker

> **Last updated:** 2026-07-11
> **Stack:** Node.js, Express, MongoDB/Mongoose
> **Conventions:** controllers în `controllers/[resource]/`, routes în `routes/`
> **Requires:** feature `product-catalog` implementat (CatalogProduct model + seeder)

---

## Phase 1 — Model update

> Goal: `Product` are `catalogRef`, indexul compus există.

- [x] Adaugă câmpul `catalogRef` în `backend/models/product/Product.js`
  ```js
  catalogRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CatalogProduct",
    default: null,
  }
  ```
- [x] Adaugă index compus:
  ```js
  ProductSchema.index({ catalogRef: 1, listingStatus: 1, price: 1 });
  ```
- [ ] Verifică în MongoDB Compass că indexul apare după restart

---

## Phase 2 — Endpoint sellers

> Goal: `GET /api/products/sellers/:catalogRef` returnează sellers sortat după preț.

- [x] Adaugă handler `getSellers` în `backend/controllers/products/products.js`
  - Validează `catalogRef` — dacă nu e ObjectId valid → `400`
  - Query: `Product.find({ catalogRef, listingStatus: "approved" }).sort({ price: 1 }).populate("vendor", "shopName")`
  - Returnează `{ sellers, count }`
  - Zero sellers → `{ sellers: [], count: 0 }` (nu 404)
- [x] Adaugă ruta în `backend/routes/products/products.js`:
  ```js
  router.route("/products/sellers/:catalogRef").get(getSellers);
  ```
  > Ruta a fost adăugată înainte de `/product/:id` pentru evitarea conflictelor
- [ ] Test cu curl:
  ```bash
  curl "http://localhost:5000/api/products/sellers/<catalogRefId>"
  # → { sellers: [...], count: N }
  curl "http://localhost:5000/api/products/sellers/invalid-id"
  # → 400
  ```

---

## Phase 3 — Grupare în GET /api/products

> Goal: listing-ul returnează un card per `catalogRef` cu `MIN(price)` și `sellersCount`.

- [x] Modifică handler-ul `getProducts` în `backend/controllers/products/products.js`:
  - Aggregation pipeline unificat — `$group: { _id: { $ifNull: ["$catalogRef", "$_id"] } }`
  - Produse fără catalogRef: grupate by propriu `_id` (comportament unchanged)
  - Produse cu catalogRef: grupate împreună; `$first` după pre-sort `price: 1` → cheapest listing
  - `$replaceRoot` cu `$mergeObjects: ["$doc", { sellersCount }]`
  - Paginare separată: count aggregation + skip/limit pe pipeline
- [x] `sellersCount` inclus în fiecare document din response
- [ ] Test: 2+ produse cu același `catalogRef` → listing returnează 1 card cu `sellersCount: N`, `price: MIN`

---

## Phase 4 — VendorProductForm: salvare catalogRef

> Goal: când un vendor selectează un produs din catalog (`CatalogSearch`), `catalogRef` se salvează pe listare.

- [x] `createVendorProduct` și `updateVendorProduct` pasează `catalogRef` automat prin spread `...fields` / `...updates` — nicio modificare necesară
- [x] Nicio whitelist explicită în vendor controller — câmpul trece prin

---

## Phase 5 — Auth, guards & edge cases

- [x] `getSellers` — public (nu necesită autentificare)
- [x] `catalogRef` inexistent în DB → `{ sellers: [], count: 0 }` (nu 404)
- [x] Listing-uri cu `listingStatus !== "approved"` — excluse prin `listingStatus: "approved"` în query
- [x] `console.log` — zero în cod final

---

## Files touched

| File | Status | Notes |
|------|--------|-------|
| `models/product/Product.js` | [x] | adaugă `catalogRef` + index |
| `controllers/products/products.js` | [x] (partial) | `getSellers` ✓; `getProducts` grouping — Phase 3 |
| `routes/products/products.js` | [x] (partial) | `/products/sellers/:catalogRef` ✓ |
| `controllers/vendor/vendor.js` | [x] | `catalogRef` trece prin spread `...fields` / `...updates` — nicio modificare necesară |
