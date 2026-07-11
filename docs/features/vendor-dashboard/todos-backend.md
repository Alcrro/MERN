# Backend TODOs — Vendor Dashboard

## Faza 1 — Apply
- [x] `POST /api/vendor/apply` — protect, validare shopName, guard duplicate apply
- [x] Setează `vendorStatus: "pending"`, `shopName`, `shopDescription` pe user

## Faza 1 — Vendor products CRUD
- [x] `GET /api/vendor/products` — filtrare `vendor: req.user._id`, opțional `listingStatus`
- [x] `GET /api/vendor/products` — paginare cu `page`/`limit` (cap 50)
- [x] `POST /api/vendor/products` — validare `kind` din VALID_KINDS, `listingStatus: "pending"` automat
- [x] `POST /api/vendor/products` — dispatch pe discriminator corect (Electronics, Clothing, etc.)
- [x] `PUT /api/vendor/products/:id` — ownership check (vendor === req.user._id)
- [x] `PUT /api/vendor/products/:id` — reset `listingStatus: "pending"`, `rejectionReason: null`
- [x] `DELETE /api/vendor/products/:id` — ownership check + 404 handling

## Faza 1 — Orders + Analytics
- [x] `GET /api/vendor/orders` — filtrare comenzi după produsele vânzătorului, populate user
- [x] `GET /api/vendor/analytics` — aggregate statusCounts + orderItems (units + revenue)
- [x] `GET /api/vendor/me` — returnează profilul fără parolă

## Faza 1 — Routes + Auth
- [x] `POST /api/vendor/apply` — `protect` (orice user autentificat)
- [x] Toate celelalte rute vendor — `protect + authorize("vendor")`
- [x] Înregistrat în `server.js`

## Gaps found
- [ ] `applyAsVendor` — nicio validare lungime `shopName` (există pe model dar nu în controller)
- [ ] `getVendorOrders` — fără paginare; returnează toate comenzile odată (poate fi lent)
- [ ] Nu există endpoint `POST /api/admin/vendor/:id/approve` — aprobarea vendor se face manual în DB
- [ ] `createVendorProduct` — nu validează că `price` > 0 sau că `stock` e valid
- [ ] `updateVendorProduct` — nu verifică dacă produsul e `approved` înainte de a permite editarea (vendor poate edita produse respinse direct)
- [ ] Nicio rate limiting pe `POST /api/vendor/apply` (poate fi spam)
