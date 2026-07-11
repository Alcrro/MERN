# Tech Spec: Vendor Dashboard

> **Status:** `Draft`
> **Author:** Alexandru Roventa
> **Last updated:** 2026-07-11
> **Related PRD:** [PRD.md](./PRD.md)

---

## Overview

### What we're building

A marketplace vendor layer on top of the existing product catalog. Vendors register, apply for approval, then manage product listings from a dedicated `/vendor/dashboard` route. Products created by vendors start as `pending` and only appear in the public catalog after admin approval. The profile sidebar gains a conditional vendor section when `user.role === 'vendor'`.

### Architecture decision log

| Decision | Options considered | Why we chose this |
|----------|--------------------|-------------------|
| Vendor–product ownership | Separate `Listing` model vs `vendor` field on `Product` | V1: `vendor` ref + `listingStatus` on Product. Full Listing model deferred to V2 when true shared-catalog is needed. |
| Product variety | Dynamic `specs: Map` vs Mongoose discriminators | Discriminators — already in use for Electronics. Type-safe, IDE-friendly. New: Clothing, Books. |
| Image upload | URL input vs Cloudinary | Cloudinary — vendor UX needs real file upload; URL input is brittle for external sellers. |
| Vendor auth | New `vendorStatus` field vs separate VendorProfile model | `vendorStatus` + `shopName` / `shopDescription` added to `Register` schema. Keeps the user document as the single source of truth. |
| Dashboard route | Tab in `/profile` vs `/vendor/dashboard` | Separate `/vendor/dashboard` — vendor experience is distinct enough to warrant its own layout and nav. Profile sidebar gets a conditional "Vendor" NavLink when `role === 'vendor'`. |

### Risks & trade-offs

- **Risk:** Editing a live listing resets status to `pending`, causing temporary catalog gap. **Mitigation:** Show a warning in the UI before save; consider keeping old version live until re-approved (V2 concern).
- **Risk:** Cloudinary credentials in `.env` — must never be committed. **Mitigation:** Use server-side signed upload; never expose secret on frontend.
- **Risk:** `getProducts` currently returns all products. Adding `listingStatus` filter could break existing seeds. **Mitigation:** Seeder sets `listingStatus: 'approved'` on all existing products.

---

## Implementation

### Data flow

```
Vendor apply:
  VendorApplyForm → POST /api/vendor/apply → Register.vendorStatus = 'pending'

Admin approves vendor:
  Admin panel → PUT /api/admin/vendors/:id/approve → Register.role = 'vendor', vendorStatus = 'approved'

Vendor creates product:
  VendorProductForm → POST /api/vendor/products → Product (listingStatus: 'pending', vendor: req.user._id)

Admin approves listing:
  Admin panel → PUT /api/admin/products/:id/approve → Product.listingStatus = 'approved'

Public catalog:
  GET /api/products?... → filters by listingStatus: 'approved' → RTK cache → ProductGrid
```

### API contracts

---

#### `POST /api/vendor/apply`
Auth: `protect` (any logged-in user)

**Body:**
```json
{ "shopName": "string", "shopDescription": "string" }
```
**Response `200`:**
```json
{ "message": "Application submitted", "vendorStatus": "pending" }
```
**Error cases:**
- `400` — already applied or already a vendor
- `401` — not logged in

---

#### `GET /api/vendor/me`
Auth: `protect, authorize('vendor')`

**Response `200`:**
```json
{
  "_id": "string",
  "name": "string",
  "email": "string",
  "role": "vendor",
  "vendorStatus": "approved",
  "shopName": "string",
  "shopDescription": "string"
}
```

---

#### `GET /api/vendor/products`
Auth: `protect, authorize('vendor')`

Returns only this vendor's products (all statuses).

**Query params:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | number | 1 | |
| `limit` | number | 20 | |
| `status` | string | — | Filter by `pending` / `approved` / `rejected` |

**Response `200`:**
```json
{
  "products": [...],
  "count": 12,
  "numberOfPages": 1
}
```

---

#### `POST /api/vendor/products`
Auth: `protect, authorize('vendor')`

**Body:** same fields as existing `postProduct`, plus `kind` (discriminator key).
```json
{
  "kind": "Electronics | Clothing | Furniture | HomeGarden | Books",
  "brand": "string",
  "price": 299,
  "description": "string",
  "images": ["https://res.cloudinary.com/..."],
  "stock": { "quantity": 10, "availability": "In Stoc" },
  "...category-specific fields..."
}
```
**Response `201`:** created product document.
**Error cases:**
- `400` — missing required fields
- `403` — vendor not approved

---

#### `PUT /api/vendor/products/:id`
Auth: `protect, authorize('vendor')`

Vendor can only update their own product. Resets `listingStatus` to `'pending'`.

**Response `200`:** updated product document.
**Error cases:**
- `403` — product belongs to a different vendor
- `404` — product not found

---

#### `DELETE /api/vendor/products/:id`
Auth: `protect, authorize('vendor')`

**Response `200`:** `{ "message": "Product deleted" }`
**Error cases:**
- `403` — not the owner
- `404` — not found

---

#### `GET /api/vendor/orders`
Auth: `protect, authorize('vendor')`

Returns orders containing at least one item whose `product` ref belongs to this vendor.

**Response `200`:** array of Order documents (populated).

---

#### `GET /api/vendor/analytics`
Auth: `protect, authorize('vendor')`

**Response `200`:**
```json
{
  "totalListings": 12,
  "approvedListings": 8,
  "pendingListings": 3,
  "rejectedListings": 1,
  "totalUnitsSold": 47,
  "estimatedRevenue": 14200
}
```

---

#### `POST /api/upload/image`
Auth: `protect`

Multipart form-data with `image` field. Server signs and uploads to Cloudinary.

**Response `200`:** `{ "url": "https://res.cloudinary.com/..." }`

---

#### `GET /api/admin/vendors/pending`
Auth: `protect, authorize('admin')`

**Response `200`:** array of users with `vendorStatus: 'pending'`.

---

#### `PUT /api/admin/vendors/:id`
Auth: `protect, authorize('admin')`

**Body:** `{ "action": "approve" | "reject", "reason": "string (optional)" }`

Approve: sets `role = 'vendor'`, `vendorStatus = 'approved'`.
Reject: sets `vendorStatus = 'rejected'`.

---

#### `GET /api/admin/products/pending`
Auth: `protect, authorize('admin')`

**Response `200`:** products with `listingStatus: 'pending'`.

---

#### `PUT /api/admin/products/:id/status`
Auth: `protect, authorize('admin')`

**Body:** `{ "action": "approve" | "reject", "reason": "string (optional)" }`

---

### Frontend — component tree

```
Pages/Vendor/VendorApply/              ← NEW page — vendor application form
Pages/Vendor/VendorDashboard/          ← NEW page — layout shell only

  organisms/VendorLayout/              ← NEW — sidebar + <Outlet>
    molecules/VendorSidebar/           ← NEW — nav links (Products, Orders, Analytics)

  organisms/VendorOverview/            ← NEW — stats cards row
    atoms/StatCard/                    ← NEW — single stat (label + number)

  organisms/VendorProductsPanel/       ← NEW — products table + actions
    molecules/VendorProductRow/        ← NEW — one product row with status badge + edit/delete
    atoms/ListingStatusBadge/          ← NEW — pending / approved / rejected chip

  organisms/VendorProductForm/         ← NEW — dynamic form, switches fields per `kind`
    molecules/CategoryPicker/          ← NEW — radio/select for Electronics|Clothing|etc.
    molecules/ImageUploader/           ← NEW — Cloudinary upload with preview
    molecules/StockInput/              ← NEW — quantity + availability select

  organisms/VendorOrdersPanel/         ← NEW — orders table filtered to vendor
  organisms/VendorAnalyticsPanel/      ← NEW — simple metrics

Components/profile/profileConstants    ← MODIFY — add vendor NavLink (conditional on role)
App.js                                 ← MODIFY — add /vendor/dashboard nested routes
features/vendor/rtkVendor.js          ← NEW — RTK Query endpoints for vendor
```

**REUSE:**
- `Pagination` organism
- `CardSkeleton` atom
- `filter-v2-container` CSS pattern
- `protect` auth middleware pattern

---

### Redux / RTK Query changes

| Type | Name | File | Description |
|------|------|------|-------------|
| RTK endpoint | `useGetVendorProductsQuery` | `features/vendor/rtkVendor.js` | vendor's own products |
| RTK endpoint | `useCreateVendorProductMutation` | same | create listing |
| RTK endpoint | `useUpdateVendorProductMutation` | same | edit listing |
| RTK endpoint | `useDeleteVendorProductMutation` | same | delete listing |
| RTK endpoint | `useGetVendorOrdersQuery` | same | orders with vendor products |
| RTK endpoint | `useGetVendorAnalyticsQuery` | same | analytics stats |
| RTK endpoint | `useApplyAsVendorMutation` | same | vendor application |
| RTK endpoint | `useUploadImageMutation` | `features/upload/rtkUpload.js` | Cloudinary upload |
| RTK endpoint | `useGetAdminPendingVendorsQuery` | `features/admin/rtkAdmin.js` | admin vendor queue |
| RTK endpoint | `useApproveVendorMutation` | same | approve/reject vendor |
| RTK endpoint | `useGetAdminPendingListingsQuery` | same | admin listing queue |
| RTK endpoint | `useApproveListingMutation` | same | approve/reject listing |

---

### Key types / shapes

```js
// User (with vendor fields added)
{
  _id: string,
  name: string,
  email: string,
  role: 'client' | 'vendor' | 'admin',
  vendorStatus: 'none' | 'pending' | 'approved' | 'rejected',
  shopName: string,
  shopDescription: string,
}

// Product (with vendor fields added)
{
  _id: string,
  kind: 'Electronics' | 'Clothing' | 'Furniture' | 'HomeGarden' | 'Books',
  brand: string,
  price: number,
  description: string,
  images: string[],          // Cloudinary URLs
  vendor: ObjectId,          // ref Register
  listingStatus: 'pending' | 'approved' | 'rejected',
  rejectionReason: string,
  slug: string,
  rating: { average: number, count: number },
  stock: { quantity: number, availability: string },
}

// Analytics response
{
  totalListings: number,
  approvedListings: number,
  pendingListings: number,
  rejectedListings: number,
  totalUnitsSold: number,
  estimatedRevenue: number,
}
```

### Edge cases to handle

- [ ] User tries to access `/vendor/dashboard` without `role: 'vendor'` → redirect to `/vendor/apply`
- [ ] Vendor applies twice → `400` from backend, show "already submitted" message in UI
- [ ] Image upload fails (Cloudinary error) → show inline error, don't block form submit
- [ ] Vendor edits approved product → warn that it will go back to pending review
- [ ] `listingStatus: 'rejected'` product → show `rejectionReason` in dashboard
- [ ] Empty vendor products list → EmptyState component with CTA to add first product
- [ ] Cloudinary env vars missing → backend returns 500 with clear message
