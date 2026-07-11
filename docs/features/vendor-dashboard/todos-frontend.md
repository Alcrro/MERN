# Frontend TODOs: Vendor Dashboard

> **Last updated:** 2026-07-11
> **Stack:** React 18, RTK Query, Redux Toolkit, React Router v6, plain CSS
> **Conventions:** CLAUDE.md — atomic design, one hook = one action, co-located CSS

---

## Phase 1 — RTK Query layer

- [x] Create `features/vendor/rtkVendor.js` with endpoints:
  - [x] `useApplyAsVendorMutation` → `POST /api/vendor/apply`
  - [x] `useGetVendorMeQuery` → `GET /api/vendor/me`
  - [x] `useGetVendorProductsQuery` → `GET /api/vendor/products`
  - [x] `useCreateVendorProductMutation` → `POST /api/vendor/products`
  - [x] `useUpdateVendorProductMutation` → `PUT /api/vendor/products/:id`
  - [x] `useDeleteVendorProductMutation` → `DELETE /api/vendor/products/:id`
  - [x] `useGetVendorOrdersQuery` → `GET /api/vendor/orders`
  - [x] `useGetVendorAnalyticsQuery` → `GET /api/vendor/analytics`
- [x] Create `features/upload/rtkUpload.js`:
  - [x] `useUploadImageMutation` → `POST /api/upload/image` (multipart)
- [x] Create `features/admin/rtkAdmin.js` with endpoints:
  - [x] `useGetAdminPendingVendorsQuery` → `GET /api/admin/vendors/pending`
  - [x] `useApproveVendorMutation` → `PUT /api/admin/vendors/:id`
  - [x] `useGetAdminPendingListingsQuery` → `GET /api/admin/products/pending`
  - [x] `useApproveListingMutation` → `PUT /api/admin/products/:id/status`
- [x] Register all new APIs in Redux store
- [ ] Test: endpoints return expected shapes in Network tab

---

## Phase 2 — Vendor Apply flow

- [x] Create `Pages/Vendor/VendorApply/VendorApply.jsx` (page shell, < 60 lines)
- [x] Create `Components/vendor/VendorApplyForm/` (`.jsx` + `.css` + `index.js`)
  - [x] Fields: shopName, shopDescription
  - [x] On submit: call `useApplyAsVendorMutation`
  - [x] Success state: "Application submitted, pending review"
  - [x] Error state: "Already applied" / generic error
- [x] Add route `/vendor/apply` in `App.js`
- [x] Add conditional NavLink in profile sidebar: "Devino Vendor" if `vendorStatus === 'none'`

---

## Phase 3 — Vendor Dashboard layout

- [x] Create `Pages/Vendor/VendorDashboard/VendorDashboard.jsx` (layout page, < 60 lines)
- [x] Create `Components/vendor/VendorLayout/` (sidebar + `<Outlet>`)
  - [x] `VendorLayout.jsx` + `VendorLayout.css` + `index.js`
- [x] Create `Components/vendor/VendorSidebar/` (nav links)
  - [x] Links: Overview, Produsele mele, Comenzi, Analytics
- [x] Add nested routes in `App.js` under `/vendor/dashboard`:
  - [x] `/vendor/dashboard` → `VendorOverview`
  - [x] `/vendor/dashboard/products` → `VendorProductsPanel`
  - [x] `/vendor/dashboard/products/add` → `VendorProductForm` (new)
  - [x] `/vendor/dashboard/products/:id/edit` → `VendorProductForm` (edit)
  - [x] `/vendor/dashboard/orders` → `VendorOrdersPanel`
  - [x] `/vendor/dashboard/analytics` → `VendorAnalyticsPanel`
- [x] Guard: redirect to `/vendor/apply` if `user.role !== 'vendor'`
- [x] Add "Vendor Dashboard" NavLink in Profile sidebar (visible only when `role === 'vendor'`)

---

## Phase 4 — Vendor Overview page

- [x] Create `Components/vendor/VendorOverview/` (< 150 lines)
  - [x] Connects to `useGetVendorAnalyticsQuery`
  - [x] Shows stat cards: Total listări, Aprobate, În așteptare, Respinse
  - [x] Shows stat cards: Unități vândute, Venit estimat
- [x] Create `Components/vendor/StatCard/` (< 50 lines) — label + value + optional sub
- [ ] Loading skeleton state (shows spinner text only — no true skeleton)
- [x] Empty/zero state handled via StatCard showing 0

---

## Phase 5 — Vendor Products panel

- [x] Create `Components/vendor/VendorProductsPanel/` (< 150 lines)
  - [x] Connects to `useGetVendorProductsQuery`
  - [x] List of vendor's products
  - [x] Status filter tabs: Toate / Aprobate / În așteptare / Respinse
  - [x] "Adaugă produs" CTA button → `/vendor/dashboard/products/add`
- [x] Create `Components/vendor/VendorProductRow/` (< 80 lines)
  - [x] Product name + image thumbnail
  - [x] Price, quantity, kind
  - [x] `ListingStatusBadge`
  - [x] Edit button → `/vendor/dashboard/products/:id/edit`
  - [x] Delete button → calls `useDeleteVendorProductMutation` with confirm dialog
- [x] Create `Components/vendor/ListingStatusBadge/` (< 50 lines)
  - [x] pending → yellow chip
  - [x] approved → green chip
  - [x] rejected → red chip + title tooltip for rejection reason
- [x] Empty state: "Nu ai niciun produs în această categorie"

---

## Phase 6 — Vendor Product Form

- [x] Create `Components/vendor/VendorProductForm/` (< 150 lines main + CategoryFields)
  - [x] Works for both CREATE and EDIT (detect via `isEdit` prop)
  - [x] On edit load: `useGetVendorProductsQuery` to pre-fill
  - [x] On create submit: `useCreateVendorProductMutation`
  - [x] On edit submit: `useUpdateVendorProductMutation` + warn "listing will go back to pending"
- [x] Create `Components/vendor/CategoryPicker/` (pill buttons, < 80 lines)
  - [x] Buttons for: Electronics, Clothing, Furniture, HomeGarden, Books
  - [x] Switching category clears category-specific fields
- [x] Create `Components/vendor/ImageUploader/` (< 80 lines)
  - [x] File input → calls `useUploadImageMutation` on select
  - [x] Shows preview thumbnails
  - [x] Remove individual image
  - [x] Max 5 images
- [x] Create `Components/vendor/StockInput/` (< 80 lines)
  - [x] Quantity number input
  - [x] Availability select: Nou / In Stoc / Promotii / Resigilat / Precomanda
- [x] Dynamic fields per category (in co-located `CategoryFields.jsx`):
  - [x] **Electronics**: model, tip, stocare, RAM, procesor, GPU, display, camera, baterie, OS, conectivitate, culoare (color swatches)
  - [x] **Clothing**: name, size (multi-select chips: XS/S/M/L/XL/XXL), material, gender, culoare (swatches)
  - [x] **Furniture**: name, material, dimensiuni, culoare, stil, nrLocuri
  - [x] **HomeGarden**: name, material, dimensiuni, culoare, tip
  - [x] **Books**: title, author, isbn, publisher, genre, format, language, pages
- [x] Color swatch UI with `aria-label` + `aria-pressed` for a11y

---

## Phase 7 — Vendor Orders panel

- [x] Create `Components/vendor/VendorOrdersPanel/` (< 150 lines)
  - [x] Connects to `useGetVendorOrdersQuery`
  - [x] Table: order ID, date, client name (masked), items, total, status
  - [x] Loading state, empty state

---

## Phase 8 — Vendor Analytics panel

- [x] Create `Components/vendor/VendorAnalyticsPanel/` (< 150 lines)
  - [x] Connects to `useGetVendorAnalyticsQuery`
  - [x] Shows 6 stat metrics (reuses `StatCard`)

---

## Phase 9 — Polish

- [x] Dark mode — `html[data-theme="dark"]` at bottom of every new CSS file
- [x] Mobile — 768px (VendorLayout sidebar collapses), 480px breakpoints throughout
- [x] Accessibility — `type="button"` on all buttons, labels on all inputs, no `href="#"`, `aria-pressed` + `aria-label` on swatches
- [x] CSS — BEM naming throughout
- [x] No `console.log` in any vendor file
- [x] No prop drilling > 2 levels — all server state in RTK cache

---

## Files to create / modify

| File | Action |
|------|--------|
| `features/vendor/rtkVendor.js` | NEW |
| `features/upload/rtkUpload.js` | NEW |
| `features/admin/rtkAdmin.js` | NEW |
| `Pages/Vendor/VendorApply/` | NEW |
| `Pages/Vendor/VendorDashboard/` | NEW |
| `organisms/VendorLayout/` | NEW |
| `molecules/VendorSidebar/` | NEW |
| `organisms/VendorOverview/` | NEW |
| `atoms/StatCard/` | NEW |
| `organisms/VendorProductsPanel/` | NEW |
| `molecules/VendorProductRow/` | NEW |
| `atoms/ListingStatusBadge/` | NEW |
| `organisms/VendorProductForm/` | NEW |
| `molecules/CategoryPicker/` | NEW |
| `molecules/ImageUploader/` | NEW |
| `molecules/StockInput/` | NEW |
| `organisms/VendorOrdersPanel/` | NEW |
| `organisms/VendorAnalyticsPanel/` | NEW |
| `Components/profile/profileConstants.js` | MODIFY — add vendor NavLink |
| `App.js` | MODIFY — add /vendor routes |
| `store.js` | MODIFY — register new APIs |
