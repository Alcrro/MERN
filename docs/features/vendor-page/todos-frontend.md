# Frontend TODOs: Vendor Page

> **Last updated:** 2026-07-13
> **Stack:** React 18, RTK Query, Redux Toolkit, React Router v6, plain CSS
> **Conventions:** CLAUDE.md — atomic design, one hook = one action, co-located CSS

---

## Phase 1 — Setup & data layer

- [x] Adaugă 4 endpoints în `features/vendor/rtkVendor.js`
- [x] Adaugă tagTypes: `"VendorPublic"`, `"VendorReviews"`
- [x] Exportă hooks: `useGetPublicVendorQuery`, `useGetPublicVendorProductsQuery`, `useGetVendorReviewsQuery`, `useAddVendorReviewMutation`
- [ ] Test în browser: `useGetPublicVendorQuery(vendorId)` returnează shape din `tech-spec.md`

---

## Phase 2 — Core UI

- [x] Creează `src/pages/VendorPage/VendorPage.jsx`
- [x] Adaugă rută în `App.js`: `/vendor/:vendorId`

### VendorPageHeader organism
- [x] Creează `VendorPageHeader.jsx` + `VendorPageHeader.css`
- [x] shopName, denumireFirma, tipEntitate, cui, emailContact
- [x] `createdAt` formatat → „Activ din Ianuarie 2024"
- [x] Badge „Depozit: {orasDepozit}" / „Dropshipping"
- [x] zileLivrare, returZile
- [x] vendorRating (stele + count)
- [x] Skeleton loading

### VendorPageProducts organism
- [x] Creează `VendorPageProducts.jsx` + `VendorPageProducts.css`
- [x] Reutilizează `Cards`, `CardSkeleton`
- [x] Paginare proprie (state local `page`)
- [x] Empty state

### VendorReviews organism
- [x] Creează `VendorReviews.jsx` + `VendorReviews.css`
- [x] Lista recenzii: Stars, nume trunchiat, dată, comentariu
- [x] Formular: StarPicker + textarea + submit
- [x] Neautentificat → mesaj dezactivat
- [x] Recenzie deja lăsată → ascunde formularul
- [x] Empty state

### SellerRow
- [x] shopName împachetat în `<Link to="/vendor/:vendorId">` cu `e.stopPropagation()`
- [x] `.seller-row__shop--link` în CSS

---

## Phase 3 — Polish & edge cases

- [x] Dark mode — overrides la finalul fiecărui CSS (inclus în faza 2)
- [x] Mobile — media queries în toate CSS-urile
- [x] 404 state — `VendorNotFound` inline în `VendorPage.jsx`
- [ ] Breadcrumb — `Acasă → {shopName}`
- [x] Accessibility — `type="button"` pe toate butoanele
- [x] CSS — fără culori hardcodate, BEM class naming
- [x] Zero `console.log`
- [ ] `npm run build` — zero warnings / errors

---

## Files touched

| File | Status | Notes |
|------|--------|-------|
| `features/vendor/rtkVendor.js` | [x] | 4 endpoints noi |
| `pages/VendorPage/VendorPage.jsx` | [x] | pagina nouă |
| `pages/VendorPage/VendorPage.css` | [x] | |
| `Components/vendor/public/VendorPageHeader/` | [x] | organism nou |
| `Components/vendor/public/VendorPageProducts/` | [x] | organism nou |
| `Components/vendor/public/VendorReviews/` | [x] | organism nou |
| `Components/vendor/shared/SellerRow/SellerRow.jsx` | [x] | link adăugat |
| `Components/vendor/shared/SellerRow/SellerRow.css` | [x] | .shop--link adăugat |
| `App.js` | [x] | rută `/vendor/:vendorId` |
