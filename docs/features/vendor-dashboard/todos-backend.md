# Backend TODOs: Vendor Dashboard

> **Last updated:** 2026-07-11
> **Stack:** Node.js, Express, MongoDB/Mongoose
> **Conventions:** controllers in `controllers/[resource]/`, routes in `routes/`

---

## Phase 1 — Model changes

- [x] `backend/models/auth/register.js` — add fields:
  - [x] `vendorStatus: { type: String, enum: ['none','pending','approved','rejected'], default: 'none' }`
  - [x] `shopName: { type: String, maxlength: 100, default: null }`
  - [x] `shopDescription: { type: String, maxlength: 500, default: null }`
  - [x] Index: `RegisterSchema.index({ vendorStatus: 1 })`
- [x] `backend/models/product/Product.js` — add fields:
  - [x] `vendor: { type: mongoose.Schema.ObjectId, ref: 'Register', default: null }`
  - [x] `images: { type: [String], default: [] }`
  - [x] `listingStatus: { type: String, enum: ['pending','approved','rejected'], default: 'approved' }`
  - [x] `rejectionReason: { type: String, default: null }`
  - [x] Index: `ProductSchema.index({ vendor: 1, listingStatus: 1 })`
  - [x] Index: `ProductSchema.index({ listingStatus: 1, createdAt: -1 })`
- [x] Create `backend/models/product/types/Clothing.js`
  - [x] Fields: `name (required)`, `size: [String]`, `material`, `gender (enum)`, `culoare: [String]`
  - [x] `Product.discriminator('Clothing', ClothingSchema)`
  - [x] Indexes: `name: 'text'`, `gender: 1`
- [x] Create `backend/models/product/types/Books.js`
  - [x] Fields: `title (required)`, `author (required)`, `isbn`, `publisher`, `genre`, `format (enum)`, `language`, `pages: Number`
  - [x] `Product.discriminator('Books', BooksSchema)`
  - [x] Indexes: `title: 'text'`, `author: 1`, `isbn: 1 (sparse)`
- [x] Update `backend/seeder.js` — add `listingStatus: 'approved'` to all existing product seeds

---

## Phase 2 — Vendor routes & controller

- [x] Create `backend/controllers/vendor/vendor.js`:
  - [x] `applyAsVendor` — sets `vendorStatus: 'pending'`, validates not already vendor/pending
  - [x] `getVendorMe` — returns vendor user profile
  - [x] `getVendorProducts` — finds products where `vendor: req.user._id`, supports `?status=` filter + pagination
  - [x] `createVendorProduct` — creates product with `vendor: req.user._id`, `listingStatus: 'pending'`, validates `kind` is one of the 5 discriminators
  - [x] `updateVendorProduct` — updates product, verifies ownership, resets `listingStatus: 'pending'`
  - [x] `deleteVendorProduct` — deletes product, verifies ownership
  - [x] `getVendorOrders` — finds orders where `items.product` in vendor's product IDs
  - [x] `getVendorAnalytics` — aggregates: listing counts by status, units sold, revenue
- [x] Create `backend/routes/vendor/vendor.js`:
  - [x] All routes use `protect, authorize('vendor')`
  - [x] `POST   /api/vendor/apply` → `applyAsVendor` (protect only, not vendor role)
  - [x] `GET    /api/vendor/me` → `getVendorMe`
  - [x] `GET    /api/vendor/products` → `getVendorProducts`
  - [x] `POST   /api/vendor/products` → `createVendorProduct`
  - [x] `PUT    /api/vendor/products/:id` → `updateVendorProduct`
  - [x] `DELETE /api/vendor/products/:id` → `deleteVendorProduct`
  - [x] `GET    /api/vendor/orders` → `getVendorOrders`
  - [x] `GET    /api/vendor/analytics` → `getVendorAnalytics`
- [x] Register router in `server.js`: `app.use('/api', vendorRouter)`

---

## Phase 3 — Admin routes & controller (vendor management)

- [x] Create or extend `backend/controllers/admin/admin.js`:
  - [x] `getPendingVendors` — finds users with `vendorStatus: 'pending'`
  - [x] `updateVendorStatus` — approve → `role='vendor', vendorStatus='approved'`; reject → `vendorStatus='rejected'`
  - [x] `getPendingListings` — finds products with `listingStatus: 'pending'`, populated with vendor info
  - [x] `updateListingStatus` — approve/reject + optional `rejectionReason`
- [x] Create `backend/routes/admin/admin.js`:
  - [x] All routes use `protect, authorize('admin')`
  - [x] `GET /api/admin/vendors/pending` → `getPendingVendors`
  - [x] `PUT /api/admin/vendors/:id` → `updateVendorStatus`
  - [x] `GET /api/admin/products/pending` → `getPendingListings`
  - [x] `PUT /api/admin/products/:id/status` → `updateListingStatus`
- [x] Register router in `server.js`

---

## Phase 4 — Image upload (Cloudinary)

- [x] Install `cloudinary`, `multer`, `multer-storage-cloudinary`
- [x] Add to `.env`: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- [x] Create `backend/configs/cloudinary.js` — configure SDK
- [x] Create `backend/middleware/upload/upload.js` — multer + cloudinary storage, max 5MB, images only
- [x] Create `backend/controllers/upload/upload.js`:
  - [x] `uploadImage` — receives file via multer, returns `{ url: secure_url }`
- [x] Create `backend/routes/upload/upload.js`:
  - [x] `POST /api/upload/image` → `protect`, multer middleware, `uploadImage`
- [x] Register router in `server.js`

---

## Phase 5 — Public catalog fix

- [x] `backend/controllers/products/products.js` — `getProducts`:
  - [x] Add `listingStatus: 'approved'` to the base filter (so pending/rejected listings are invisible to the public)
  - [ ] Exception: vendor can see their own pending products via `GET /api/vendor/products` (separate route — public catalog stays strict)
- [ ] `GET /api/products/slug/:slug` — only return if approved (vendor previews pending via dashboard, not via public slug)

---

## Phase 6 — Auth & guards

- [x] `updateVendorProduct` / `deleteVendorProduct`: verify `product.vendor.toString() === req.user._id.toString()` — never trust the ID from client
- [x] `createVendorProduct`: validate `kind` is one of `['Electronics','Clothing','Furniture','HomeGarden','Books']` — reject unknown discriminators
- [x] Image upload: validate MIME type server-side (not just client-side) — accept only `image/jpeg`, `image/png`, `image/webp`
- [x] Remove any `console.log` from all new controllers
- [ ] Vendor routes: verify `req.user.vendorStatus === 'approved'` in controller (the `authorize('vendor')` middleware checks role, but vendorStatus could be 'approved' while role changed — belt-and-suspenders)

---

## Files to create / modify

| File | Action |
|------|--------|
| `models/auth/register.js` | MODIFY — add vendorStatus, shopName, shopDescription |
| `models/product/Product.js` | MODIFY — add vendor, images, listingStatus, rejectionReason |
| `models/product/types/Clothing.js` | NEW |
| `models/product/types/Books.js` | NEW |
| `controllers/vendor/vendor.js` | NEW |
| `routes/vendor/vendor.js` | NEW |
| `controllers/admin/admin.js` | NEW |
| `routes/admin/admin.js` | NEW |
| `config/cloudinary.js` | NEW |
| `middleware/upload/upload.js` | NEW |
| `controllers/upload/upload.js` | NEW |
| `routes/upload/upload.js` | NEW |
| `controllers/products/products.js` | MODIFY — filter by listingStatus: 'approved' |
| `seeder.js` | MODIFY — add listingStatus: 'approved' to existing products |
| `server.js` | MODIFY — register 3 new routers |
