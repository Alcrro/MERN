# PRD: Vendor Dashboard

> **Status:** `Shipped`
> **Owner:** Alexandru Roventa
> **Last updated:** 2026-07-11
> **Related tech spec:** [tech-spec.md](./tech-spec.md)

---

## Problem Statement

**Current state:** Only admin can add products via `POST /api/admin/product`. There is no way for external sellers to list products on the platform. The catalog is managed entirely by one person.

**Pain point:** The platform cannot scale to a wide catalog (electronics, clothing, furniture, books, etc.) without an external seller layer. Adding a new product requires admin access.

**Why now:** The product model already supports discriminators (Electronics, Furniture, HomeGarden). The user model already has a `vendor` role defined. The infrastructure for a marketplace exists — it just needs to be wired up.

---

## User Stories

| # | Role | Want to | So that |
|---|------|---------|---------|
| 1 | user | apply to become a vendor | I can start selling on the platform |
| 2 | vendor | create a product listing (electronics, clothing, furniture, books) | customers can find and buy my products |
| 3 | vendor | edit or delete my own product listings | I can keep my catalog up to date |
| 4 | vendor | upload images for my products | customers can see what I'm selling |
| 5 | vendor | see which of my listings are pending / approved / rejected | I know what's live in the catalog |
| 6 | vendor | see orders that contain my products | I know what to ship |
| 7 | vendor | see basic analytics (views, units sold, revenue) | I can track my shop performance |
| 8 | vendor | manage stock quantity per product | I can prevent overselling |
| 9 | admin | review and approve or reject vendor applications | I control who can sell on the platform |
| 10 | admin | review and approve or reject individual product listings | I control what appears in the catalog |
| 11 | client | see only approved listings in the product catalog | I never see incomplete or fraudulent products |

---

## Acceptance Criteria

- [x] `#1` — A logged-in user can submit a vendor application with shop name and description
- [x] `#1` — After submission, user sees status "Pending approval"
- [x] `#9` — Admin can list all pending vendor applications at `GET /api/admin/vendors/pending`
- [x] `#9` — Admin can approve or reject a vendor; approved vendors get `role: 'vendor'` on their account
- [x] `#2` — An approved vendor can access `/vendor/dashboard` (unapproved users are redirected)
- [x] `#2` — Vendor can create listings for: Electronics, Clothing, Furniture, HomeGarden, Books
- [x] `#2` — New listings default to `listingStatus: 'pending'` and are NOT visible in public catalog
- [x] `#4` — Vendor can upload product images via Cloudinary; images are stored as URLs on the product
- [x] `#10` — Admin can approve/reject individual listings; approved listings appear in public catalog
- [x] `#3` — Vendor can edit only their own products; editing a live listing resets it to `pending`
- [x] `#3` — Vendor can delete their own products
- [x] `#5` — Vendor dashboard products page shows listing status badges (pending / approved / rejected)
- [x] `#6` — Vendor orders page shows orders where at least one item is the vendor's product
- [x] `#7` — Vendor analytics shows: total listings, approved count, total units sold, estimated revenue
- [x] `#8` — Vendor can update stock quantity per product; quantity 0 auto-sets availability to Out of Stock
- [x] `#11` — Public `GET /api/products` returns only `listingStatus: 'approved'` products

---

## Out of Scope (V1)

- Shared product catalog (multiple vendors per identical product page) — V1 uses one product doc per vendor
- Payout / commission system
- Vendor rating / shop reviews
- Shipping label generation
- Bulk product import (CSV)
- Product variants (e.g. size S in red vs size M in blue as separate SKUs — handled via `culoare[]` + `size[]` arrays, not as separate documents)
- Real-time notifications (order received, listing approved)
- Admin analytics (platform-wide revenue)
