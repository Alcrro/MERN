# Backend TODOs: Seller Picker

> **Last updated:** 2026-07-11
> **Stack:** Node.js, Express, MongoDB/Mongoose
> **Conventions:** controllers în `controllers/[resource]/`, routes în `routes/`
> **Requires:** feature `product-catalog` implementat (CatalogProduct model + seeder)

---

## Phase 1 — Model update

> Goal: `Product` are `catalogRef`, indexul compus există.

- [ ] Adaugă câmpul `catalogRef` în `backend/models/product/Product.js`
  ```js
  catalogRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CatalogProduct",
    default: null,
  }
  ```
- [ ] Adaugă index compus:
  ```js
  ProductSchema.index({ catalogRef: 1, listingStatus: 1, price: 1 });
  ```
- [ ] Verifică în MongoDB Compass că indexul apare după restart

---

## Phase 2 — Endpoint sellers

> Goal: `GET /api/products/sellers/:catalogRef` returnează sellers sortat după preț.

- [ ] Adaugă handler `getSellers` în `backend/controllers/products/products.js`
  - Validează `catalogRef` — dacă nu e ObjectId valid → `400`
  - Query: `Product.find({ catalogRef, listingStatus: "approved" }).sort({ price: 1 }).populate("vendor", "shopName")`
  - Returnează `{ sellers, count }`
  - Zero sellers → `{ sellers: [], count: 0 }` (nu 404)
- [ ] Adaugă ruta în `backend/routes/products/products.js`:
  ```js
  router.route("/products/sellers/:catalogRef").get(getSellers);
  ```
  > **Atenție:** rutele cu path params specifici (`/sellers/:id`) trebuie adăugate **înainte** de rute generice (`/product/:id`) ca să nu fie interceptate greșit
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

- [ ] Modifică handler-ul `getProducts` în `backend/controllers/products/products.js`:
  - **Produse fără catalogRef** — query existent, nemodificat
  - **Produse cu catalogRef** — aggregation pipeline:
    1. `$match`: `{ catalogRef: { $ne: null }, listingStatus: "approved" }`
    2. `$sort`: `{ price: 1 }`
    3. `$group`: pe `catalogRef`, `$first` pentru `_id` (listing cu prețul minim), `price`, `brand`, `images`, `rating`; `$sum: 1` pentru `sellersCount`
    4. `$project`: redenumește `_id` → `catalogRef`, `listingId` → `_id`
  - Merge rezultatele + aplică paginare pe totalul combinat
- [ ] Adaugă `sellersCount` în response shape (0 pentru produsele fără catalogRef)
- [ ] Test: 3 produse cu același `catalogRef` → listing returnează 1 card cu `sellersCount: 3`, `price: MIN`

---

## Phase 4 — VendorProductForm: salvare catalogRef

> Goal: când un vendor selectează un produs din catalog (`CatalogSearch`), `catalogRef` se salvează pe listare.

- [ ] Verifică că `createVendorProduct` și `updateVendorProduct` din `backend/controllers/vendor/vendor.js` pasează `catalogRef` din body la creare/update
- [ ] Adaugă `catalogRef` la lista de câmpuri permise (whitelist) dacă există validare explicită
- [ ] Test: crează listing cu `catalogRef` → verifică în DB că câmpul e salvat

---

## Phase 5 — Auth, guards & edge cases

- [ ] `getSellers` — public (nu necesită autentificare)
- [ ] `catalogRef` inexistent în DB → `{ sellers: [], count: 0 }` (nu 404, catalog poate fi șters)
- [ ] Listing-uri cu `listingStatus !== "approved"` — excluse din sellers (filtru explicit în query)
- [ ] `console.log` — zero în cod final

---

## Files touched

| File | Status | Notes |
|------|--------|-------|
| `models/product/Product.js` | [ ] | adaugă `catalogRef` + index |
| `controllers/products/products.js` | [ ] | adaugă `getSellers`, modifică `getProducts` |
| `routes/products/products.js` | [ ] | adaugă `/products/sellers/:catalogRef` |
| `controllers/vendor/vendor.js` | [ ] | pasează `catalogRef` la create/update |
