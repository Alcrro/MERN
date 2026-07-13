# Backend TODOs: Vendor Profile

> **Last updated:** 2026-07-13
> **Stack:** Node.js, Express, Mongoose

---

## Phase 1 — Model update

- [x] Adaugă `VendorProfileSchema` în `backend/models/auth/register.js`
  ```js
  const VendorProfileSchema = new mongoose.Schema({
    cui:           { type: String, default: null },
    denumireFirma: { type: String, maxlength: 150, default: null },
    tipEntitate:   { type: String, enum: ["SRL", "PFA", "SA", "RA", "II", "ONG"], default: null },
    orasDepozit:   { type: String, maxlength: 100, default: null },
    zileLivrare: {
      min: { type: Number, min: 0, default: null },
      max: { type: Number, min: 0, default: null },
    },
    returZile:     { type: Number, min: 0, default: 30 },
    telefon:       { type: String, default: null },
    emailContact:  { type: String, default: null },
  }, { _id: false });
  ```
- [x] Adaugă `vendorProfile: { type: VendorProfileSchema, default: () => ({}) }` în `RegisterSchema`
- [x] Documentele existente nu necesită migrare (default gol, backwards compatible)

---

## Phase 2 — Controller vendor

- [x] Adaugă handler `updateVendorProfile` în `backend/controllers/vendor/vendor.js`
  - Validează `cui` — `/^\d{2,10}$/.test(cui)` → `400` dacă invalid
  - Validează `tipEntitate` — din enum `["SRL", "PFA", "SA", "RA", "II", "ONG"]`
  - Validează `zileLivrare.min <= zileLivrare.max` — `400` dacă min > max
  - `User.findByIdAndUpdate(req.user._id, { $set: { "vendorProfile.X": val } }, { new: true })`
  - Returnează `{ success: true, vendorProfile: updatedUser.vendorProfile }`
- [x] Adaugă ruta în `backend/routes/vendor/vendor.js`:
  ```js
  router.put("/vendor/profile", updateVendorProfile);
  ```

---

## Phase 3 — getSellers populate update

- [x] Modifică `getSellers` în `backend/controllers/products/products.js`:
  ```js
  .populate("vendor", "shopName vendorProfile")
  ```
  Înlocuiește `.populate("vendor", "shopName")` existent
- [x] Verifică că response-ul include `vendor.vendorProfile.zileLivrare`, `orasDepozit`, `tipEntitate`, `returZile`

---

## Phase 4 — Admin endpoint

- [x] Adaugă handler `getAdminVendors` în `backend/controllers/admin/admin.js`
  ```js
  const vendors = await Register.find({ role: "vendor" })
    .select("name email shopName vendorStatus vendorProfile createdAt")
    .sort("-createdAt");
  res.json({ success: true, vendors, count: vendors.length });
  ```
- [x] Adaugă ruta în `backend/routes/admin/admin.js`:
  ```js
  router.get("/admin/vendors", protect, authorize("admin"), getAdminVendors);
  ```

---

## Phase 5 — Guards & edge cases

- [ ] `updateVendorProfile` — doar vendori cu `vendorStatus: "approved"` pot actualiza? (sau oricine cu role vendor)
  - Decizie: orice vendor poate completa profilul (chiar și pending, ca să fie pregătit la aprobare)
- [ ] `emailContact` — nu trebuie să fie același cu `email` contului; fără validare unicitate
- [ ] `telefon` — validare format RO opțională (`/^(\+40|0)[0-9]{9}$/`)
- [ ] `console.log` — zero în cod final

---

## Files touched

| File | Status | Notes |
|------|--------|-------|
| `models/auth/register.js` | [x] | `VendorProfileSchema` + câmp pe `RegisterSchema` |
| `controllers/vendor/vendor.js` | [x] | `updateVendorProfile` adăugat |
| `routes/vendor/vendor.js` | [x] | `PUT /vendor/profile` |
| `controllers/products/products.js` | [x] | populate extins în `getSellers` |
| `controllers/admin/admin.js` | [x] | `getAdminVendors` adăugat |
| `routes/admin/admin.js` | [x] | `GET /admin/vendors` |
