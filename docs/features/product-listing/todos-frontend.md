# Frontend TODOs: Product Listing

> **Last updated:** 2026-07-11
> **Stack:** React 18, Redux Toolkit, RTK Query, React Router v6, plain CSS

---

## Phase 1 — Data layer

- [x] RTK endpoint `useGetProductsQuery` — `features/product/rtkProducts.js`
- [x] RTK endpoint `useGetAllProductsQuery` — fetches unfiltered product list for filter option generation
- [x] `cardViewSlice` — Redux slice for grid/list toggle
- [x] Both registered in `app/store.js`

---

## Phase 2 — Core UI

- [x] `/products` route registered in `App.js`
- [x] `Products.jsx` reads filter state from `useProductFilters` and renders sidebar + listing
- [x] `ListingPanel.jsx` — sort dropdown, limit dropdown, active filter chips, mobile filter toggle
- [x] `FilterContent.jsx` — sidebar: AllCategories + AvailabilityFilter + StorageFilter + RamFilter + RatingSideBarFilter
- [x] `MobileFilterSheet.jsx` — slide-in drawer for mobile, wraps `FilterContent`
- [x] `AllCategories.jsx` → `BrandCategory` + `ModelCategory` via `FilterSection` molecule
- [x] `AvailabilityFilter.jsx` — availability chips, clears on re-click
- [x] `StorageFilter.jsx` — storage chips sorted by GB (handles TB conversion)
- [x] `RamFilter.jsx` — RAM chips
- [x] `RatingSideBarFilter.jsx` — star rating filter (1–5)
- [x] `Cards.jsx` — product card with grid/list layout variants
- [x] `Pagination.jsx` — page number links
- [x] Empty state — "Niciun produs găsit" message when 0 results
- [x] `filterUtils.js` — `getUniqueValues`, `countByField`

---

## Phase 3 — Polish

- [x] Mobile responsive — `MobileFilterSheet` hides sidebar on mobile, shows slide-in
- [x] Dark mode — all filter CSS uses CSS variables exclusively; theme system handles it automatically
- [x] A11y — `AvailabilityFilter`, `StorageFilter`, `RamFilter`, `RatingSideBarFilter` fixed from `href="#!"` to `type="button"` + `onClick`
- [x] `RatingSideBarFilter.jsx` — removed `/* eslint-disable */` and `import React`

---

## Gaps found

- [x] **`useProductFilters.js`** — split into `useFilterState.js` (co-located) + `features/product/useProductsData.js`; `useProductFilters` is now a thin composition
- [x] **`Products.jsx`** — refactored from 107 → 39 lines; `buildProductSeo` extracted to `utils/seoHelpers.js`; listing section extracted to `ProductGrid.jsx`
- [x] **`ListingPanel.jsx`** — 82 lines, within organism limit; no change needed
- [x] **`AvailabilityFilter.jsx`** — fixed `href="#!"` → `type="button"`
- [x] **`StorageFilter.jsx`** — fixed `href="#!"` → `type="button"`
- [x] **`RamFilter.jsx`** — fixed `href="#!"` → `type="button"`
- [x] **`RatingSideBarFilter.jsx`** — fixed `href="#"`, removed `/* eslint-disable */`, simplified open state (no `active` string state)
- [x] **`BrandFilter.jsx`** — deleted (dead code)
- [x] **`ModelFilter.jsx`** — deleted (dead code)
- [x] **`SideBarTree.jsx`** — deleted (dead code)
- [x] **`Pages/Products/Products.jsx`** — deleted (dead page)
- [x] **`BrandFilterPanel.jsx`** — deleted (dead code)
- [x] **Pagination** — `pagesFilterArray` removed from `useProductFilters`; `ProductGrid` passes `[]` to satisfy Pagination API
