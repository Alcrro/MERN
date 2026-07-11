# Backend TODOs: Product Catalog

> **Last updated:** 2026-07-11
> **Stack:** Node.js, Express, MongoDB/Mongoose
> **Conventions:** controllers în `controllers/[resource]/`, routes în `routes/`

---

## Phase 1 — Model & seed

> Goal: colecția există în MongoDB și poate fi interogată.

- [x] Crează `backend/models/catalog/CatalogProduct.js` (vezi `database.md`)
  - [x] Schema cu: `kind`, `brand`, `specs` (Mixed), `images`, timestamps
  - [x] Text index pe `brand` + `specs.model` + `specs.name`
  - [x] Index simplu pe `kind`
- [x] Adaugă date de seed în `backend/seeder.js`
  - [x] Minim 20 Electronics (telefoane populare + câteva laptopuri)
  - [x] Minim 10 Clothing
  - [ ] Testează: `node seeder.js` → verify în MongoDB Compass că documentele au forma corectă

---

## Phase 2 — Controller & routes

> Goal: `GET /api/catalog?q=iphone` returnează rezultate corecte.

- [x] Crează `backend/controllers/catalog/catalog.js`
  - [x] `searchCatalog` handler:
    - Validează `q` (required, min 2 chars) → `400` dacă lipsă
    - Parsează `kind` (opțional), `limit` (default 10, max 20)
    - Query: `CatalogProduct.find({ $text: { $search: q }, ...(kind && { kind }) }).limit(limit)`
    - Returnează `{ results, count }`
  - [x] `createCatalogEntry` handler (admin) — crează document nou
  - [x] `updateCatalogEntry` handler (admin) — `findByIdAndUpdate`
  - [x] `deleteCatalogEntry` handler (admin) — `findByIdAndDelete`
- [x] Crează `backend/routes/catalog/catalog.js`
  - [x] `GET /` → `searchCatalog` (public)
  - [x] `POST /` → `createCatalogEntry` (protect + admin middleware)
  - [x] `PUT /:id` → `updateCatalogEntry` (protect + admin middleware)
  - [x] `DELETE /:id` → `deleteCatalogEntry` (protect + admin middleware)
- [x] Înregistrează în `server.js`: `app.use("/api/catalog", catalogRouter)`
- [ ] Test cu curl:
  ```bash
  curl "http://localhost:5000/api/catalog?q=iphone"
  curl "http://localhost:5000/api/catalog?q=samsung&kind=Electronics&limit=5"
  ```

---

## Phase 3 — Auth, guards & edge cases

> Goal: production-ready. Secure, validat, fără crash-uri.

- [ ] `POST/PUT/DELETE` — verifică că middleware-ul `protect` + `admin` e aplicat
- [ ] `q` < 2 caractere → `400 { message: "Query prea scurt" }`
- [ ] `kind` invalid (nu e în enum) → ignorat sau `400`
- [ ] `limit` > 20 → clampat la 20
- [ ] ObjectId invalid pe `PUT/DELETE /:id` → `400` nu crash
- [ ] Zero rezultate → `{ results: [], count: 0 }` nu `404`
- [ ] `console.log` — zero în cod final

---

## Files touched

| File | Status | Notes |
|------|--------|-------|
| `models/catalog/CatalogProduct.js` | [x] | nou |
| `controllers/catalog/catalog.js` | [x] | nou |
| `routes/catalog/catalog.js` | [x] | nou |
| `server.js` | [x] | `app.use("/api/catalog", ...)` |
| `seeder.js` | [x] | adaugă catalogData + import model |
