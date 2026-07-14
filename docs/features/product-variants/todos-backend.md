# Backend TODOs: Product Variants

> **Last updated:** 2026-07-13
> **Stack:** Node.js, Express, MongoDB/Mongoose
> **Conventions:** controllers in `controllers/[resource]/`, routes in `routes/`

---

## Phase 1 — Model & migration

> Goal: schema actualizata, datele existente migrate corect.

- [x] Creaza `VariantSchema` in `backend/models/product/variant/Variant.js`
  - [x] Campuri: `attributes (Map<String>)`, `price (Number, required)`, `stock (StockSchema)`, `images ([String])`, `sku (String)`
- [x] Modifica `backend/models/product/Product.js`
  - [x] Adauga `variants: { type: [VariantSchema], default: [] }`
  - [x] Adauga `minPrice: { type: Number, default: 0 }`
  - [x] Elimina `price` din schema
  - [x] Elimina `stock` din schema
  - [x] Actualizeaza pre-save hook: calculeaza `minPrice = Math.min(...variants.map(v => v.price))`
  - [x] Actualizeaza pre-save hook: elimina logica `this.stock.availability` (acum e per varianta)
  - [x] Inlocuieste indexul `{ price: 1 }` cu `{ minPrice: 1 }`
  - [x] Inlocuieste indexul `{ brand: 1, price: 1 }` cu `{ brand: 1, minPrice: 1 }`
  - [x] Adauga index `{ "variants.price": 1 }`
- [x] Creeaza script de migrare `backend/scripts/migrateVariants.js`
  - [x] Gaseste toate documentele cu `price` existent si `variants` absent
  - [x] Construieste `variants[0]` din `{ attributes: {}, price, stock, images }`
  - [x] Seteaza `minPrice = price`
  - [x] Unset `price`, `stock`
  - [x] Ruleaza dry-run cu log inainte de commit real
- [x] Ruleaza migrarea in dev — 78/78 produse migrate

---

## Phase 2 — Controller & routes

> Goal: API-ul accepta variante la creare/editare, le returneaza la citire.

- [x] Modifica `backend/controllers/products/products.js`
  - [x] `postProduct`: accepta `variants` in body cu fallback din price/stock
  - [x] `getProducts`: sort pe `minPrice` in loc de `price`
  - [x] `getProducts`: filtrul `availability` pe `variants.stock.availability`
  - [x] `getSellers`: `sort("minPrice")`, select include `minPrice variants`
- [x] Modifica `backend/controllers/vendor/vendor.js`
  - [x] `createVendorProduct`: bridge price/stock → variants pentru formul vechi
  - [x] `updateVendorProduct`: bridge price/stock → variants pentru formul vechi
- [x] Verifica ca `GET /product/:id` returneaza `variants` automat

---

## Phase 3 — Validare & edge cases

- [ ] Validare in `postProduct`: `variants` lipsa sau gol → `400 "Produsul trebuie sa aiba cel putin o varianta"`
- [ ] Validare: orice varianta cu `price < 0` → `400`
- [ ] Validare: `attributes` poate fi `{}` (produs simplu fara optiuni) — permis
- [ ] Elimina `console.log` din scriptul de migrare dupa testare

---

## Files touched

| File | Status | Notes |
|------|--------|-------|
| `models/product/variant/Variant.js` | [x] | fisier nou |
| `models/product/Product.js` | [x] | MODIFY — schema, hooks, indexuri |
| `scripts/migrateVariants.js` | [x] | script nou, rulat 78/78 |
| `controllers/products/products.js` | [x] | MODIFY — postProduct, getProducts, getSellers |
| `controllers/vendor/vendor.js` | [x] | MODIFY — bridge price→variants |
| `seeder.js` | [x] | MODIFY — toVariants helper |
| `scripts/seedMultiVendor.js` | [x] | MODIFY — variants inline |
