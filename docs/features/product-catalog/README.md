# Product Catalog

Multi-vendor product listings with 8+ simultaneous URL-persistent filters, Mongoose discriminator variants, and a seller comparison view.

---

## What's technically interesting

### URL-persistent filter state

All active filters are serialized into URL search params (`?brand=Apple&ram=8&minPrice=1000`). This means:
- Filters survive page refresh
- Shareable/bookmarkable filter combinations
- Browser back/forward works correctly
- No Redux needed for filter state — URL is the source of truth

The `useProductFilters` hook reads from `useSearchParams`, derives the query object, and passes it to the RTK `useGetProductsQuery` hook.

### Mongoose discriminator pattern

Products are stored in a single `products` collection using Mongoose discriminators. The base `Product` schema holds fields common to all categories (brand, model, price, stock, images, vendor). Category-specific schemas (`ElectronicsProduct`, etc.) extend it with their own fields (RAM, storage, color, battery).

This allows a single `/api/products` endpoint to return heterogeneous products while keeping schema validation per category.

### Multi-vendor seller comparison

Each canonical product can have listings from multiple vendors. `GET /api/products/:id/sellers` returns all `ProductListing` documents for a product, joined with the vendor's public profile (name, delivery window, return policy). The `SellerPicker` organism on the product page lets buyers compare and select a vendor before adding to cart.

### Filter architecture

8 filter dimensions handled simultaneously:
- Brand, Model — exact match (enum)
- RAM, Storage — multi-select array (`$in`)
- Price range — `$gte / $lte`
- Availability — `stock > 0` boolean
- Rating — `averageRating >= N`
- Color — variant-level filter (nested array query)

All filters compose into a single MongoDB query object. Pagination uses cursor-based approach with `sort + skip + limit`.

---

## Key files

| File | Role |
|------|------|
| `backend/models/product/Product.js` | Base schema + discriminator setup |
| `backend/controllers/product/product.js` | Filter query builder, pagination |
| `frontend/src/features/product/rtkProducts.js` | RTK Query with filter params |
| `frontend/src/Components/organisms/SidebarFilters/` | 8-filter sidebar UI |
| `frontend/src/Components/products/singleProducts/hero/` | Product hero + SellerPicker |
| `frontend/src/utils/constants.js` | Filter option constants |

---

See [tech-spec.md](tech-spec.md) for full API contracts and [database.md](database.md) for schema.
