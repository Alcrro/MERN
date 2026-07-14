# Backend TODOs: Vendor Page

> **Last updated:** 2026-07-13
> **Stack:** Node.js, Express, MongoDB/Mongoose
> **Conventions:** controllers în `controllers/[resource]/`, routes în `routes/`

---

## Phase 1 — Model & validare

> Goal: datele pot fi stocate și recuperate corect din MongoDB.

- [x] Creează `backend/models/vendorReview/VendorReview.js`
  - [x] Câmpuri: `vendor` (ObjectId → Register, required), `user` (ObjectId → Register, required), `value` (Number 1–5, required), `comment` (String, maxlength 500)
  - [x] `{ timestamps: true }` — `createdAt` automat
  - [x] Index unic: `{ vendor: 1, user: 1 }` — 1 recenzie per user per vendor
  - [x] Index de sortare: `{ vendor: 1, createdAt: -1 }`
  - [x] Static `calcAverageRating(vendorId)` — agregare `$avg` pe `value`, actualizează `Register.vendorRating`
  - [x] Hook `post("save")` → apelează `calcAverageRating`
  - [x] Hook `post("findOneAndDelete")` → apelează `calcAverageRating`
- [x] Adaugă `vendorRating: { average: Number (default 0), count: Number (default 0) }` în `backend/models/auth/register.js`
- [ ] Test în MongoDB Compass: creează un VendorReview și verifică că `vendorRating` se actualizează pe user

---

## Phase 2 — Controller & rute

> Goal: endpoint-urile funcționează și returnează shape-ul din `tech-spec.md`.

- [x] Creează `backend/controllers/vendor/publicVendor.js`
  - [x] `getPublicVendor(req, res, next)`
  - [x] `getPublicVendorProducts(req, res, next)`
  - [x] `getVendorReviews(req, res, next)`
  - [x] `addVendorReview(req, res, next)` — cu 409 pe duplicate
- [x] Adaugă rute în `backend/routes/vendor/vendor.js` (înainte de protect middleware)
- [ ] Test cu curl / Postman: verifică toate cele 4 endpoints

---

## Phase 3 — Auth, guards & edge cases

- [ ] Verifică că GET-urile `/public/` sunt accesibile fără token
- [ ] POST recenzie returnează `401` fără token
- [ ] Duplicate review → `409` cu mesaj clar (nu crash nehandled)
- [ ] `vendorId` invalid → `400` (nu `500`)
- [ ] Vendor cu `vendorStatus !== "approved"` → `404` (nu expune date despre pending/rejected)
- [ ] Câmpurile `email`, `password`, `phone` ale vendorului nu apar în response — selectează explicit câmpurile
- [ ] Zero `console.log` în cod final

---

## Files touched

| File | Status | Notes |
|------|--------|-------|
| `models/vendorReview/VendorReview.js` | [x] | model nou |
| `models/auth/register.js` | [x] | adaugă `vendorRating` |
| `controllers/vendor/publicVendor.js` | [x] | controller nou |
| `routes/vendor/vendor.js` | [x] | 4 rute noi `/public/` |
