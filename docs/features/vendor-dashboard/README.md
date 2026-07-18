# Vendor Dashboard

Multi-vendor marketplace with an apply/approve flow, 6-section vendor dashboard, and vendor-scoped order management.

---

## What's technically interesting

### Apply → Approve flow

Vendors register as a regular client, then submit a vendor application (business name, CUI, entity type). The application creates a `VendorApplication` document with `status: pending`. Admin reviews from the admin panel; on approval, the user's `role` is updated to `vendor` and a `VendorProfile` is created. The frontend unlocks the vendor dashboard on role change.

### Role-based route protection

Three protection layers:
1. **JWT middleware** (`protect`) — validates cookie on every request
2. **Role middleware** (`authorize("vendor")`) — checks `req.user.role`
3. **Frontend guards** — RTK `skip` param omits queries if role doesn't match, route redirects in `App.js`

### Vendor-scoped data isolation

All vendor queries filter by `vendor: req.user.id`. A vendor cannot read or modify another vendor's products, orders, or vouchers. The seller picker on the product page fetches listings with `vendor` populated, but only exposes `name`, `price`, `stock` — never internal vendor data.

### Seller picker architecture

`/api/products/:productId/sellers` returns all vendor listings for a canonical product. The frontend `SellerPicker` organism:
- Renders price/availability per vendor
- Updates the cart item's `vendorId` on selection
- Uses a stable `sellers ?? null` reference (not `?? []`) to avoid `useMemo` dependency loops

---

## Dashboard sections

| Section | What it does |
|---------|-------------|
| Overview | Revenue, order count, active products |
| Products | List/add/edit own listings, color variants, Cloudinary upload |
| Orders | All orders containing vendor's products, status updates |
| Vouchers | Create promo codes, set vendor reward rule |
| Business Profile | CUI, entity type, delivery windows, return policy, logo |
| Vendor Page | Public-facing storefront preview |

---

## Key files

| File | Role |
|------|------|
| `backend/controllers/vendor/vendor.js` | Vendor CRUD, apply, profile update |
| `backend/controllers/admin/admin.js` | Approve/reject vendors, admin order management |
| `backend/models/vendor/VendorProfile.js` | Business profile schema |
| `frontend/src/Components/vendor/dashboard/` | All 6 dashboard sections |
| `frontend/src/Components/vendor/shared/SellerPicker/` | Multi-vendor comparison UI |
| `frontend/src/features/vendor/rtkVendor.js` | Vendor RTK endpoints |

---

See [tech-spec.md](tech-spec.md) for full API contracts.
