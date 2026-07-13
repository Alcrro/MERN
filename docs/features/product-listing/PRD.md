# PRD: Product Listing

> **Status:** `Shipped`
> **Owner:** Alexandru Roventa
> **Last updated:** 2026-07-13
> **Related tech spec:** [tech-spec.md](./tech-spec.md)

---

## Problem Statement

**Current state:** Clients can browse a paginated list of products at `/products/:categorySlug/:tipSlug`, filter by brand, model, rating, availability, storage, and RAM, sort by price/name/rating, switch between grid and list card views. Sort and availability sync to URL query params; other filters are component-local state.

**Scope:** Frontend-driven filtering — every filter is passed as a query param to the backend; no client-side filtering. The backend `getProducts` controller handles all 9 filter params and returns paginated results.

**Why it exists:** Core discovery surface — without it, clients have no way to find or compare products.

---

## User Stories

| # | Role | Want to | So that |
|---|------|---------|---------|
| 1 | client | see all products paginated | I can browse without loading everything at once |
| 2 | client | filter by brand and model | I can narrow results to what I'm considering |
| 3 | client | filter by minimum star rating | I can avoid poorly-reviewed products |
| 4 | client | filter by availability (In Stoc, Promotii, Nou…) | I can find products I can actually buy |
| 5 | client | filter by storage (stocare) and RAM | I can find the specs I need |
| 6 | client | search by keyword | I can find a product I already know |
| 7 | client | sort by price, name, or rating | I can compare options in the order that matters to me |
| 8 | client | switch between grid and list view | I can see more or fewer details per product |
| 9 | client | change how many results appear per page | I can control the density of results |
| 10 | client | see active filters as chips and remove them one by one | I can refine my search without starting over |

---

## Acceptance Criteria

- [x] `#1` — Products page fetches paginated results from `/api/products`; Pagination component lets client navigate pages
- [x] `#2` — Brand and model filters update URL params and re-fetch; results reflect selection
- [x] `#3` — Rating filter sends `rating=N` param; backend returns only products with `rating.average >= N`
- [x] `#4` — Availability filter sends `availability=X`; maps to `stock.availability` field in DB
- [x] `#5` — Storage chips (sorted by GB, TB converted) and RAM chips update filter state
- [x] `#6` — Keyword search box dispatches `search=` param with 500 ms debounce
- [x] `#7` — Sort dropdown sends `sort=` param (price_asc, price_desc, name, rating)
- [x] `#8` — Grid / List toggle persists in Redux (`cardView` slice), changes card layout
- [x] `#9` — Limit dropdown (30 / 60 / 90 / 100) updates `limit=` param
- [x] `#10` — ListingPanel shows active filter chips; clicking × removes individual filter
- [x] Mobile — filter sidebar collapses into a slide-in MobileFilterSheet
- [x] Empty state — shows "Niciun produs găsit" when results are empty

---

## Out of Scope

- Price range slider — no min/max price filter implemented
- Saved / pinned filters
- Compare products side-by-side
- Infinite scroll — pagination only
- Search input în sidebar — backend-ul suportă `search=` dar nu există input UI conectat
- Filter state URL-sync complet — doar sort + availability sunt în URL; brand/model/stocare/RAM/culoare nu sunt shareabile
