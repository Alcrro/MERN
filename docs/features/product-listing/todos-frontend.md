# Frontend TODOs: Product Listing

> **Last updated:** 2026-07-13
> **Stack:** React 18, Redux Toolkit, RTK Query, React Router v6, plain CSS

---

## Phase 1 — Data layer

- [x] RTK endpoint `useGetProductsQuery` — `features/product/rtkProducts.js`
- [x] RTK endpoint `useGetAllProductsQuery` — fetches unfiltered product list for filter option context
- [x] `cardViewSlice` — Redux slice for grid/list toggle
- [x] Both registered in `app/store.js`

---

## Phase 2 — Core UI

- [x] `/products` route → `ProductsDiscover.jsx` (hub landing page, 8 produse per categorie)
- [x] `/products/:categorySlug` și `/products/:categorySlug/:tipSlug` → `Products.jsx`
- [x] `Products.jsx` — 49 lines, uses `useProductFilters` + `useSeo`, renders sidebar + listing + EcosystemCarousels + ProductConfigurator
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
- [x] `Cards.jsx` — product card: grid/list layout, favorites heart button, `sellersCount` badge, low stock warning ("Ultimul produs în stoc"), SKU-based URL
- [x] `CardSkeleton.jsx` — shown during `isFetching`
- [x] `Pagination.jsx` — page number links
- [x] Empty state — "Niciun produs găsit" message when 0 results
- [x] `filterUtils.js` — `getUniqueValues`, `countByField`
- [x] `utils/seoHelpers.js` → `buildProductSeo` — dynamic `<title>` from active brand/model
- [x] `utils/categorySlugMap.js` — `CATEGORY_SLUG_TO_KIND`, `TIP_SLUG_TO_TIP` și reverse maps
- [x] `Breadcrumb.jsx` — breadcrumb dinamic cu `buildCrumbs`, Redux `lastLabel`, sticky pe mobile
- [x] `favoritesSlice` — Redux slice wishlist (localStorage-backed)
- [x] `breadcrumbSlice` — Redux slice pentru `lastLabel` dinamic pe pagina de produs

---

## Phase 3 — Polish

- [x] Mobile responsive — `MobileFilterSheet` hides sidebar on mobile, shows slide-in
- [x] Dark mode — all filter CSS uses CSS variables exclusively; theme system handles it
- [x] A11y — all filter atoms use `type="button"` + `onClick` (no `href="#!"`)
- [x] `RatingSideBarFilter.jsx` — removed `/* eslint-disable */` and unused `import React`

---

## Hooks structure

- [x] `useFilterState.js` — co-located cu Products.jsx; 10 `useState`; derivă `kind`/`tip` din `useParams` + `categorySlugMap`; sincronizează `sort` + `availability` din `useSearchParams`
- [x] `useProductsData.js` — în `features/product/`; două RTK calls + calcul context per filtru
- [x] `useProductFilters.js` — thin composition: cheamă `useFilterState` + `useProductsData`, adaugă `activeFilterCount`

---

## Gaps found

- [x] **`useProductFilters.js`** — split în `useFilterState.js` + `features/product/useProductsData.js`
- [x] **`Products.jsx`** — refactored; SEO extras în `utils/seoHelpers.js`; listing extras în `ProductGrid.jsx`
- [x] **`AvailabilityFilter.jsx`** — fixed `href="#!"` → `type="button"`
- [x] **`StorageFilter.jsx`** — fixed `href="#!"` → `type="button"`
- [x] **`RamFilter.jsx`** — fixed `href="#!"` → `type="button"`
- [x] **`RatingSideBarFilter.jsx`** — fixed `href="#"`, removed `/* eslint-disable */`
- [x] **Dead code deleted** — `BrandFilter.jsx`, `ModelFilter.jsx`, `SideBarTree.jsx`, `Pages/Products/Products.jsx`, `BrandFilterPanel.jsx`
- [ ] **`useProductFilters.js`** — thin composition acceptabilă dar tehnic violează one-hook-one-action
- [ ] **Pagination** — `pagesFilterArray` (legacy prop) passed as `[]` to Pagination — param mort
- [ ] **`colorFilter` context** — `ratingContext` în `useProductsData` nu filtrează după rating, deci ratingul nu restrânge opțiunile de culoare
- [ ] **`search` param** — backend-ul suportă `search=`, dar nicio intrare de search în sidebar; nu este wired în `useFilterState`
- [ ] **Filter state URL-sync parțial** — doar `sort` și `availability` citite din `useSearchParams`; brand/model/stocare/RAM/culoare sunt `useState` pur (nu sunt shareabile prin URL)
