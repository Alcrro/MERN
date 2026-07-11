# Tech Spec: Product Listing

> **Last updated:** 2026-07-10
> **Stack:** React 18, RTK Query, Redux Toolkit, React Router v6, Express, Mongoose

---

## Data Flow

```
URL query params
  └─► useProductFilters.js (reads + writes URLSearchParams)
        ├─► useGetAllProductsQuery()   — fetches unfiltered brand/model lists for filter options
        └─► useGetProductsQuery(params) — fetches paginated/filtered results
              └─► RTK cache → useSelector → Products.jsx → Cards + Pagination
```

Filter changes write back to `window.history` (pushState) and re-trigger the RTK query. `cardView` (grid vs list) lives in Redux `cardViewSlice`.

---

## API Contracts

### GET /api/products

**Controller:** `backend/controllers/products/products.js` → `getProducts`

**Query params:**

| Param | Type | Default | Notes |
|-------|------|---------|-------|
| `search` | string | — | Regex on `brand` + `model` fields |
| `sort` | string | `createdAt` | `price_asc` → `{price:1}`, `price_desc` → `{price:-1}`, `name` → `{brand:1}`, `rating` → `{rating.average:-1}` |
| `brand` | string | — | Exact match |
| `rating` | number | — | `rating.average >= N` |
| `model` | string | — | Exact match |
| `kind` | string | — | Mongoose discriminator key (e.g. `Electronics`) |
| `tip` | string | — | Sub-type within discriminator |
| `availability` | string | — | Maps to `stock.availability` |
| `stocare` | string | — | Exact match on `stocare` field |
| `ram` | string | — | Exact match on `RAM` field |
| `page` | number | `1` | Pagination offset |
| `limit` | number | `30` | Capped at 100 |

**Response:**
```json
{
  "queryProducts": [ /* Product[] */ ],
  "totalProducts": 142,
  "numberOfPages": 5
}
```

### GET /api/products/:id

**Controller:** `getProduct`

**Response:** Single product document (full schema, including Electronics discriminator fields).

### POST /api/products

**Controller:** `postProduct`  
**Auth:** `protect` + `authorize("admin")`

**Body:** Product fields. Pre-save hook auto-generates `slug` from `brand + model` and updates `stock.availability`.

---

## Component Tree

```
pages/
  ProductsList (App.js route "/products")  [107 lines — OVER 60-line limit]
    └─► Components/products/products/Products.jsx   [organism, 107 lines]
          ├─► useProductFilters.js                  [hook — violates one-hook rule]
          ├─► useSeo.js                             [shared hook]
          ├─► MobileFilterSheet.jsx                 [molecule, 34 lines]
          │     └─► FilterContent.jsx
          ├─► FilterContent.jsx                     [molecule, 54 lines]
          │     ├─► AllCategories.jsx               [organism]
          │     │     ├─► BrandCategory.jsx         [molecule]
          │     │     └─► ModelCategory.jsx         [molecule]
          │     ├─► AvailabilityFilter.jsx          [atom — uses href="#!"]
          │     ├─► StorageFilter.jsx               [atom — uses href="#!"]
          │     ├─► RamFilter.jsx                   [atom — uses href="#!"]
          │     └─► RatingSideBarFilter.jsx         [atom — eslint-disable, href="#"]
          ├─► ListingPanel.jsx                      [organism, 82 lines]
          │     └─► active filter chips, sort, limit, mobile toggle
          ├─► Cards.jsx[]                           [organism per card]
          └─► Pagination.jsx                        [molecule]

DEAD (not imported anywhere):
  Components/UI/sideBarFilters/brandFilter/BrandFilter.jsx
  Components/UI/sideBarFilters/modelFilter/ModelFilter.jsx
  Components/UI/filtersAndProduct/SideBarTree.jsx
  Pages/Products/Products.jsx
  Components/UI/sideBarFilters/brandFilterPanel/BrandFilterPanel.jsx
```

### FilterSection (shared molecule)
`Components/UI/category/filterSection/FilterSection.jsx` — generic collapsible list used by BrandCategory and ModelCategory. Receives `title`, `items[]`, `selectedValue`, `onChange`.

### filterUtils.js
`Components/UI/category/filterUtils.js` — two pure functions:
- `getUniqueValues(products, key)` — deduplicates field values
- `countByField(products, key, value)` — counts matching products

---

## RTK Endpoints (frontend)

`features/product/rtkProducts.js`:

```js
getProducts(params)      // useGetProductsQuery
getAllProducts()          // useGetAllProductsQuery — for filter option lists
getProduct(id)           // useGetProductQuery
```

---

## Redux State

```js
// cardViewSlice
{
  cardView: "grid" | "list"
}

// addToCartSlice (cart — for AddToCartV2Button on product cards)
{
  card: [ { data, itemQuantity, itemAmountPrice } ],
  cartTotalQuantity: number,
  cartTotalAmount: number
}
```

---

## Pagination Logic

```js
const numberOfPages = Math.ceil(totalProducts / limit);
// pagesArray = Array.from({ length: numberOfPages }, (_, i) => i + 1)
// pagesFilterArray exists in code but is never used (limit never goes below 30)
```
