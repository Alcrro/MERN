# Frontend TODOs: Product Listing

> **Last updated:** 2026-07-11
> **Stack:** React 18, Redux Toolkit, RTK Query, React Router v6, plain CSS

---

## Phase 1 — Data layer

- [x] RTK endpoint `useGetProductsQuery` — `features/product/rtkProducts.js`
- [x] RTK endpoint `useGetAllProductsQuery` — fetches unfiltered product list for filter option context
- [x] `cardViewSlice` — Redux slice for grid/list toggle
- [x] Both registered in `app/store.js`

---

## Phase 2 — Core UI

- [x] `/products` route registered in `App.js`
- [x] `Products.jsx` — 39 lines, uses `useProductFilters` + `useSeo`, renders sidebar + listing
- [x] `ProductGrid.jsx` — listing area: ListingPanel + skeleton/Cards + Pagination
- [x] `ListingPanel.jsx` — sort dropdown, limit dropdown, active filter chips with × remove, mobile filter toggle
- [x] `FilterContent.jsx` — sidebar: AllCategories + AvailabilityFilter + StorageFilter + RamFilter + ColorFilter + RatingSideBarFilter
- [x] `MobileFilterSheet.jsx` — slide-in drawer for mobile, wraps `FilterContent`
- [x] `AllCategories.jsx` → `BrandCategory` + `ModelCategory` via `FilterSection` molecule
- [x] `AvailabilityFilter.jsx` — availability chips, clears on re-click
- [x] `StorageFilter.jsx` — storage chips sorted by GB (handles TB conversion)
- [x] `RamFilter.jsx` — RAM chips
- [x] `ColorFilter.jsx` — color swatch buttons via `COLOR_MAP`; inactive (out-of-context) state
- [x] `RatingSideBarFilter.jsx` — star rating filter (1–5)
- [x] `Cards.jsx` — product card with grid/list layout variants
- [x] `CardSkeleton.jsx` — shown during `isFetching`
- [x] `Pagination.jsx` — page number links
- [x] Empty state — "Niciun produs găsit" message when 0 results
- [x] `filterUtils.js` — `getUniqueValues`, `countByField`
- [x] `utils/seoHelpers.js` → `buildProductSeo` — dynamic `<title>` from active brand/model

---

## Phase 3 — Polish

- [x] Mobile responsive — `MobileFilterSheet` hides sidebar on mobile, shows slide-in
- [x] Dark mode — all filter CSS uses CSS variables exclusively; theme system handles it
- [x] A11y — all filter atoms use `type="button"` + `onClick` (no `href="#!"`)
- [x] `RatingSideBarFilter.jsx` — removed `/* eslint-disable */` and unused `import React`

---

## Hooks structure

- [x] `useFilterState.js` — co-located with Products.jsx; 11 `useState` + 2 `useSelector`
- [x] `useProductsData.js` — in `features/product/`; two RTK calls + per-filter context computation
- [x] `useProductFilters.js` — thin composition: calls `useFilterState` + `useProductsData`, adds `activeFilterCount`

---

## Gaps found

- [x] **`useProductFilters.js`** — split into `useFilterState.js` + `features/product/useProductsData.js`
- [x] **`Products.jsx`** — refactored from 107 → 39 lines; SEO extracted to `utils/seoHelpers.js`; listing extracted to `ProductGrid.jsx`
- [x] **`AvailabilityFilter.jsx`** — fixed `href="#!"` → `type="button"`
- [x] **`StorageFilter.jsx`** — fixed `href="#!"` → `type="button"`
- [x] **`RamFilter.jsx`** — fixed `href="#!"` → `type="button"`
- [x] **`RatingSideBarFilter.jsx`** — fixed `href="#"`, removed `/* eslint-disable */`
- [x] **Dead code deleted** — `BrandFilter.jsx`, `ModelFilter.jsx`, `SideBarTree.jsx`, `Pages/Products/Products.jsx`, `BrandFilterPanel.jsx`
- [ ] **`useProductFilters.js`** — still technically violates one-hook-one-action (composes two hooks + adds count); acceptable as thin composition but worth noting
- [ ] **Pagination** — `pagesFilterArray` (legacy prop) passed as `[]` to Pagination — Pagination API has dead param
- [ ] **`colorFilter` context** — `ratingContext` in `useProductsData` uses `applyFilters` which doesn't filter by rating, so rating doesn't restrict color options
