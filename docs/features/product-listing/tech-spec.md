# Tech Spec: Product Listing

> **Last updated:** 2026-07-11
> **Stack:** React 18, RTK Query, Redux Toolkit, React Router v6, Express, Mongoose

---

## Data Flow

```
/products route → Products.jsx
  └─► useProductFilters()               — thin composition hook
        ├─► useFilterState()            — 11 filter useState vars + cardView from Redux
        └─► useProductsData(params)     — two RTK calls
              ├─► useGetAllProductsQuery()       GET /api/products (unfiltered, for filter option context)
              └─► useGetProductsQuery(params)    GET /api/products?{all 10 filter params}
                    └─► RTK cache → { queryProducts, pagesArray, isFetching }

Filter state is plain useState — NOT stored in URL query params.
cardView (grid/list) persists in Redux (cardViewSlice).
```

### Per-filter context pattern

`useProductsData` runs `applyFilters` against the unfiltered `totalProducts` list once per filter, excluding that filter's own active value. Each sidebar filter receives only the options valid in the context of all other active filters.

```js
culoareContext      = applyFilters(displayAllProducts, { ...base, culoare: [] });
availabilityContext = applyFilters(displayAllProducts, { ...base, availability: [] });
stocareContext      = applyFilters(displayAllProducts, { ...base, stocare: [] });
ramContext          = applyFilters(displayAllProducts, { ...base, ram: [] });
ratingContext       = applyFilters(displayAllProducts, base);  // rating not in applyFilters
```

---

## API Contracts

### GET /api/products

**Controller:** `backend/controllers/products/products.js` → `getProducts`

**Query params:**

| Param | Type | Default | Notes |
|-------|------|---------|-------|
| `search` | string | — | MongoDB `$text` search on `brand` + `description` (text index) |
| `sort` | string | `"Newest"` → `-createdAt` | See sort map below |
| `brand` | string[] | — | `$in` match |
| `rating` | number | — | `rating.average >= N` (parseFloat) |
| `model` | string[] | — | `$in` match |
| `kind` | string | — | Mongoose discriminator key (e.g. `Electronics`) |
| `tip` | string | — | Sub-type within discriminator |
| `availability` | string[] | — | Maps to `stock.availability` ($in) |
| `stocare` | string[] | — | `$in` match on `stocare` field |
| `ram` | string[] | — | `$in` match on `RAM` field |
| `culoare` | string[] | — | `$in` match on `culoare` field |
| `page` | number | `1` | Clamped to min 1 |
| `limit` | number | `30` | Capped at 100 |

**Sort map:**

| Client value | Mongoose sort |
|---|---|
| `"Newest"` | `-createdAt` |
| `"Oldest"` | `createdAt` |
| `"Price: Low to High"` | `price` |
| `"Price: High to Low"` | `-price` |
| `"Rating: Low to High"` | `rating.average` |
| `"Rating: High to Low"` | `-rating.average` |

**Response:**
```json
{
  "success": true,
  "totalProductsNumberQuery": 12,
  "numberOfPages": 1,
  "currentPage": 1,
  "limit": 30,
  "queryProducts": [ /* Product[] — filtered + paginated */ ],
  "totalProducts": [ /* Product[] — all approved, unfiltered */ ]
}
```

Note: `queryProducts` is the filtered page; `totalProducts` is used client-side for filter option context.

### GET /api/product/:id

**Controller:** `getProduct`  
**Response:** `{ success, product }` — full document or 404.

### GET /api/products/slug/:slug

**Controller:** `getProductBySlug`  
**Response:** `{ success, product }` or 404.

### POST /api/admin/product

**Controller:** `postProduct`  
**Auth:** `protect` + `authorize("admin")`  
**Note:** No input validation middleware; Mongoose error bubbles up on missing required fields.

---

## Component Tree

```
App.js → Route "products" → Products.jsx         [organism, 39 lines]
  ├─► useProductFilters()
  ├─► useSeo() + buildProductSeo()
  ├─► MobileFilterSheet.jsx                       [molecule, 34 lines]
  │     └─► FilterContent.jsx (as children prop)
  ├─► FilterContent.jsx                           [molecule, 50 lines]
  │     ├─► AllCategories.jsx                     [organism]
  │     │     ├─► BrandCategory.jsx               [molecule]
  │     │     └─► ModelCategory.jsx               [molecule]
  │     │           └─► FilterSection.jsx         [molecule — collapsible list]
  │     ├─► AvailabilityFilter.jsx                [atom]
  │     ├─► StorageFilter.jsx                     [atom — sorts by GB, handles TB]
  │     ├─► RamFilter.jsx                         [atom]
  │     ├─► ColorFilter.jsx                       [atom — color swatches via COLOR_MAP]
  │     └─► RatingSideBarFilter.jsx               [atom]
  └─► ProductGrid.jsx                             [organism, 59 lines]
        ├─► ListingPanel.jsx                      [organism, 82 lines — sort, limit, chips, mobile btn]
        ├─► Cards.jsx[]                           [organism per card — grid/list layout]
        │     └─► CardSkeleton.jsx               [atom — shown when isFetching]
        └─► Pagination.jsx                        [molecule]
```

### Utility files

| File | Purpose |
|------|---------|
| `utils/filterUtils.js` → `getUniqueValues`, `countByField` | Pure helpers for filter option generation in AllCategories |
| `utils/seoHelpers.js` → `buildProductSeo` | Builds `<title>` + meta from active brand/model |
| `utils/constants.js` → `COLOR_MAP` | `{ "Negru": "#111", "Alb": "#fff", ... }` — swatch colors |

---

## RTK Endpoints

`features/product/rtkProducts.js`:

```js
getProducts(params)     // useGetProductsQuery — paginated + filtered
getAllProducts()         // useGetAllProductsQuery — unfiltered; used for filter context only
getSingleProduct(id)    // useGetSingleProductQuery
```

tagTypes: `["Products", "Reviews", "Categories"]`

---

## Redux State

```js
// cardViewSlice — grid vs list toggle
{
  cardViewGridClassName: string,   // e.g. "card-view-grid"
  cardViewListClassName: string,
}

// addToCartSlice
{
  card: [ { data, itemQuantity, itemAmountPrice } ],
  cartTotalQuantity: number,
  cartTotalAmount: number,
}
```
