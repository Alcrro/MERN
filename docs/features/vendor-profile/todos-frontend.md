# Frontend TODOs: Vendor Profile

> **Last updated:** 2026-07-11
> **Stack:** React 18, RTK Query, Redux Toolkit, React Router v6, plain CSS

---

## Phase 1 — Data layer

- [x] Adaugă `updateVendorProfile` mutation în `features/vendor/rtkVendor.js`
  - `PUT /api/vendor/profile`
  - `invalidatesTags: ["VendorMe"]`
- [x] Adaugă `TIP_ENTITATE_OPTIONS` în `utils/constants.js`
- [x] Adaugă link "Profil firmă" în `VENDOR_LINKS` din `utils/constants.js`
  - `{ to: "/vendor/dashboard/profile", label: "Profil firmă", end: false }`

---

## Phase 2 — VendorProfilePanel organism

- [x] Crează `Components/vendor/dashboard/VendorProfilePanel/VendorProfilePanel.jsx` (organism, ≤ 150 linii)
  - Apelează `useGetVendorMeQuery()` pentru date existente
  - `useUpdateVendorProfileMutation()` la submit
  - Câmpuri: `cui`, `denumireFirma`, `tipEntitate` (select), `orasDepozit`, `zileLivrare.min`, `zileLivrare.max`, `returZile`, `telefon`, `emailContact`
  - Pre-populează din `vendorMe.user.vendorProfile`
  - Loading state — "Se încarcă profilul…"
  - Error state — mesaj din API
  - Success state — "Profil salvat"
- [x] `VendorProfilePanel.css` + `index.js`
- [x] Extrage form state în `useVendorProfileForm.js` (co-located) dacă depășești 80 linii

---

## Phase 3 — Integrare în dashboard

- [x] Adaugă ruta `/vendor/dashboard/profile` în `App.js`
  - `<Route path="profile" element={<VendorProfilePanel />} />`
- [x] Verifică că `VendorSidebar` afișează noul link din `VENDOR_LINKS`

---

## Phase 4 — SellerRow update

- [ ] Modifică `Components/vendor/shared/SellerRow/SellerRow.jsx`:
  - Dacă `seller.vendor.vendorProfile.zileLivrare` există → afișează `{min}-{max} zile`
  - Dacă `seller.vendor.vendorProfile.orasDepozit` → afișează orașul
  - Dacă `seller.vendor.vendorProfile.returZile` → afișează "retur N zile"
  - Dacă `seller.vendor.vendorProfile.tipEntitate` → afișează badge tip (SRL / PFA etc.)
- [ ] Adaugă CSS pentru noile elemente în `SellerRow.css`

---

## Phase 5 — Polish

- [ ] Dark mode — `html[data-theme="dark"]` în `VendorProfilePanel.css`
- [ ] Mobile — 768px + 375px breakpoints (form stacked vertical)
- [ ] A11y — `<label>` explicit pe fiecare câmp, `type="button"` pe cancel
- [ ] Validare client-side: CUI format (2–10 cifre), min ≤ max pentru zileLivrare
- [ ] `npm run build` — zero warnings

---

## Files touched

| File | Status | Notes |
|------|--------|-------|
| `features/vendor/rtkVendor.js` | [ ] | adaugă `updateVendorProfile` |
| `utils/constants.js` | [ ] | `TIP_ENTITATE_OPTIONS`, link în `VENDOR_LINKS` |
| `Components/vendor/dashboard/VendorProfilePanel/` | [ ] | nou organism |
| `App.js` | [ ] | rută `/vendor/dashboard/profile` |
| `Components/vendor/shared/SellerRow/SellerRow.jsx` | [ ] | date profil vendor |
| `Components/vendor/shared/SellerRow/SellerRow.css` | [ ] | stiluri date noi |
