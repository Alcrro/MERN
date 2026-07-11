# Backend TODOs — Product Catalog

## Faza 1 — Model + Seeder
- [x] `CatalogProduct.js` — schema cu kind, brand, specs (Mixed), images, culoare, refPrice
- [x] Index `{ kind: 1 }` pentru filtrare
- [x] Text index pe brand + specs.model + specs.name cu weights
- [x] `seeder.js` — 31 intrări cu culoare[] și refPrice

## Faza 1 — Controller
- [x] `listCatalog` — filtrare kind/brand(regex)/tip, paginare, cap limit la 50
- [x] `searchCatalog` — full-text MongoDB, validare q >= 2 chars, cap limit la 20
- [x] `createCatalogEntry` — insert simplu
- [x] `updateCatalogEntry` — findByIdAndUpdate cu runValidators, 404 handling
- [x] `deleteCatalogEntry` — findByIdAndDelete, 404 handling

## Faza 1 — Routes
- [x] `GET /api/catalog/all` — public, `listCatalog`
- [x] `GET /api/catalog/` — public, `searchCatalog`
- [x] `POST /api/catalog/` — `protect + authorize("admin")`
- [x] `PUT /api/catalog/:id` — `protect + authorize("admin")`
- [x] `DELETE /api/catalog/:id` — `protect + authorize("admin")`
- [x] Înregistrat în `server.js` la `/api/catalog`

## Gaps found
- [ ] `createCatalogEntry` — fără validare explicită a body-ului (no express-validator); se bazează doar pe Mongoose required
- [ ] `searchCatalog` — fără paginare (`page`/`limit` parțial implementat, dar nu în răspuns)
- [ ] `listCatalog` — `brand` filter e regex brut fără sanitizare (ReDoS vector dacă input e necontrolat)
- [ ] `culoare` și `refPrice` nu au validare de tip (orice valoare e acceptată în specs Mixed)
- [ ] Nicio rată de limitare (rate limiting) pe rutele publice GET
