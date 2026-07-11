# Tech Spec — Vendor Dashboard

- **Status:** Shipped
- **Last updated:** 2026-07-11

## Data flow

### Apply flow
```
/vendor/apply
  → VendorApply (page)
      useSelector(auth) → redirect dacă !user sau role === "vendor"
      → VendorApplyForm
          useApplyAsVendorMutation → POST /api/vendor/apply
          → isSuccess → success state (fără redirect)
```

### Dashboard shell
```
/vendor/dashboard/*
  → VendorDashboard (page, 3 linii) → VendorLayout
      useSelector(auth.user)
        → !user              → Navigate /auth/login
        → role !== "vendor"  → Navigate /vendor/apply
      → <div.vlayout>
          <aside> VendorSidebar (VENDOR_LINKS) </aside>
          <main>  <Outlet />                   </main>
```

### Overview
```
index → VendorOverview
  useGetVendorAnalyticsQuery → GET /api/vendor/analytics
  → StatCard × 6 (total, aprobate, pending, respinse, unități, venit)
```

### Products
```
products → VendorProductsPanel
  [tab status] → useGetVendorProductsQuery({ status })
    GET /api/vendor/products?status=&page=&limit=
  → VendorProductRow × N
      ListingStatusBadge (status + tooltip rejectionReason)
      edit → navigate /vendor/dashboard/products/:id/edit
      delete → useDeleteVendorProductMutation → DELETE /api/vendor/products/:id

products/:id/edit → VendorProductForm (isEdit=true)
  useVendorProductForm(isEdit)
    useGetVendorProductsQuery (skip: !isEdit) → populează form
    useUpdateVendorProductMutation → PUT /api/vendor/products/:id
    → success → navigate /vendor/dashboard/products
```

### Catalog → publish
```
catalog → VendorCatalog
  ?view=add → VendorProductForm (isEdit=false)
               useCreateVendorProductMutation → POST /api/vendor/products
  default   → VendorCatalogPanel (vezi docs product-catalog)
```

### Orders
```
orders → VendorOrdersPanel
  useGetVendorOrdersQuery → GET /api/vendor/orders
  → table: ID, dată, client (populate user.name), total, status colorat
```

### Analytics
```
analytics → VendorAnalyticsPanel
  useGetVendorAnalyticsQuery → GET /api/vendor/analytics
  → StatCard × 6
```

## API Contracts

Toate rutele vendor (exceptând `/apply`) sunt protejate cu `protect + authorize("vendor")`.

### `POST /api/vendor/apply` — `protect`
Body: `{ shopName, shopDescription? }`.
Response: `{ message, vendorStatus: "pending" }` sau `400` dacă deja vendor/pending/approved.

### `GET /api/vendor/me` — `vendor`
Response: `{ success, user }` (fără parolă).

### `GET /api/vendor/products` — `vendor`
Params: `page`, `limit` (cap 50), `status` (pending|approved|rejected).
Response: `{ success, products: [Product], count, numberOfPages }`.

### `POST /api/vendor/products` — `vendor`
Body: `{ kind, brand, price, stock, images, ...categoryFields }`.
Creează cu `listingStatus: "pending"`, `vendor: req.user._id`.
Response: `201 { success, product }`.

### `PUT /api/vendor/products/:id` — `vendor` + ownership check
Body: câmpuri parțiale (fără `kind`, `user`, `vendor`).
Resetează automat `listingStatus: "pending"`, `rejectionReason: null`.
Response: `{ success, product }` sau `403/404`.

### `DELETE /api/vendor/products/:id` — `vendor` + ownership check
Response: `{ success, message }` sau `403/404`.

### `GET /api/vendor/orders` — `vendor`
Returnează comenzi care conțin produsele vânzătorului. Populate `user.name + email`.
Response: `{ success, orders: [Order] }`.

### `GET /api/vendor/analytics` — `vendor`
Aggregate MongoDB: statusCounts + orderItems aggregate.
Response:
```json
{
  "success": true,
  "totalListings": 5,
  "approvedListings": 2,
  "pendingListings": 2,
  "rejectedListings": 1,
  "totalUnitsSold": 14,
  "estimatedRevenue": 34986
}
```

## Component Tree

```
Pages/Vendor/VendorApply/VendorApply.jsx              [page, 19 linii]
  Components/vendor/apply/VendorApplyForm/             [organism, 50 linii]

Pages/Vendor/VendorDashboard/VendorDashboard.jsx       [page, 3 linii]
  Components/vendor/dashboard/
    VendorLayout/VendorLayout.jsx                      [organism, 24 linii]
      VendorSidebar/VendorSidebar.jsx                  [molecule, 21 linii]

    VendorOverview/VendorOverview.jsx                  [organism, 44 linii]
      shared/StatCard/StatCard.jsx                     [atom]

    VendorProductsPanel/VendorProductsPanel.jsx        [organism, 49 linii]
      products/VendorProductRow/VendorProductRow.jsx   [molecule, 52 linii]
        shared/ListingStatusBadge/ListingStatusBadge.jsx [atom, 9 linii]

    VendorOrdersPanel/VendorOrdersPanel.jsx            [organism, 50 linii]
    VendorAnalyticsPanel/VendorAnalyticsPanel.jsx      [organism, 37 linii]
      shared/StatCard/StatCard.jsx                     [atom]

Pages/Vendor/VendorCatalog/VendorCatalog.jsx           [page, 11 linii]
  → vezi docs/features/product-catalog/
```

### Constants (utils/constants.js)
| Constantă | Valori |
|-----------|--------|
| `VENDOR_LINKS` | 5 linkuri sidebar cu `to`, `label`, `end` |
| `VENDOR_STATUS_TABS` | `[{ key: undefined\|"approved"\|"pending"\|"rejected", label }]` |
| `ORDER_STATUS_COLORS` | `{ Pending, Processing, Shipped, Delivered, Cancelled }` → hex |
| `LISTING_STATUS_LABELS` | `{ pending: "În așteptare", approved: "Aprobat", rejected: "Respins" }` |
