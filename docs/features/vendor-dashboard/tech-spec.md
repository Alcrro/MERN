# Tech Spec — Vendor Dashboard

- **Status:** Shipped
- **Last updated:** 2026-07-13

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
          <aside> VendorSidebar (VENDOR_LINKS × 6) </aside>
          <main>  <Outlet />                        </main>
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
    status: published | draft | pending | rejected | (undefined = toate)
  → VendorProductRowSkeleton × 3 (loading)
  → VendorProductRow × N
      ListingStatusBadge (status + tooltip rejectionReason)
      getIssues(p) → validare locală imagine/descriere/preț/stoc
      badge "Publicat" | badge "Gata de publicare" | listă issues
      buton "Publică" → usePublishVendorProductMutation → PUT /api/vendor/products/:id/publish
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
                CatalogSearch → useCatalogSearch
                CatalogTable / CatalogRow
                CatalogBrowserModal
                CatalogVariantTable
```

### Orders
```
orders → VendorOrdersPanel
  useGetVendorOrdersQuery → GET /api/vendor/orders
  → VendorOrderRowSkeleton × 3 (loading)
  → table: ID, dată, client (populate user.name), total, status colorat
```

### Analytics
```
analytics → VendorAnalyticsPanel
  useGetVendorAnalyticsQuery → GET /api/vendor/analytics
  → secțiune "Status listări": StatCard × 4 (total, aprobate, pending, respinse)
  → secțiune "Vânzări": StatCard × 2 (unități vândute, venit estimat)
  → VendorAnalyticsCardSkeleton (loading, structurat pe 2 secțiuni)
```

### Profile
```
profile → VendorProfilePanel
  useVendorProfileForm (co-located hook)
    useGetVendorMeQuery → GET /api/vendor/me → populează form din vendorProfile
    useUpdateVendorProfileMutation → PUT /api/vendor/profile
  → secțiune "Informații legale": CUI, denumireFirma, tipEntitate
  → secțiune "Informații operaționale": orasDepozit, zileLivrare min/max, returZile
  → secțiune "Contact public": telefon, emailContact
```

## API Contracts

Toate rutele vendor (exceptând `/apply`) sunt protejate cu `protect + authorize("vendor")`.

### `POST /api/vendor/apply` — `protect`
Body: `{ shopName, shopDescription? }`.
Response: `{ message, vendorStatus: "pending" }` sau `400` dacă deja vendor/pending/approved.

### `GET /api/vendor/me` — `vendor`
Response: `{ success, user }` (fără parolă, include `vendorProfile`).

### `PUT /api/vendor/profile` — `vendor`
Body: câmpuri parțiale din `{ cui, denumireFirma, tipEntitate, orasDepozit, zileLivrare: { min, max }, returZile, telefon, emailContact }`.
Validări: CUI 2–10 cifre, tipEntitate enum, zileLivrare.min ≤ max.
Response: `{ success, vendorProfile }` sau `400`.

### `GET /api/vendor/products` — `vendor`
Params: `page`, `limit` (cap 50), `status` (published|draft|pending|rejected).
Mapare `status → filter`:
- `published` → `listingStatus: "approved", publishStatus: "published"`
- `draft`     → `listingStatus: "approved", publishStatus: "draft"`
- `pending`   → `listingStatus: "pending"`
- `rejected`  → `listingStatus: "rejected"`
Response: `{ success, products: [Product], count, numberOfPages }`.

### `POST /api/vendor/products` — `vendor`
Body: `{ kind, brand, price, stock, images, ...categoryFields }`.
Creează cu `listingStatus: "pending"`, `publishStatus: "draft"`, `vendor: req.user._id`, `sku` generat automat.
Response: `201 { success, product }`.

### `PUT /api/vendor/products/:id` — `vendor` + ownership check
Body: câmpuri parțiale (fără `kind`, `user`, `vendor`).
Resetează automat `listingStatus: "pending"`, `publishStatus: "draft"`, `rejectionReason: null`.
Response: `{ success, product }` sau `403/404`.

### `PUT /api/vendor/products/:id/publish` — `vendor` + ownership check
Condiții: `listingStatus === "approved"`, `publishStatus !== "published"`, produs complet (imagine, descriere, preț, stoc).
Guard duplicat: un singur produs publicat per `catalogRef` per vendor (409).
Setează `publishStatus: "published"`.
Response: `{ success, product }` sau `400/403/404/409`.

### `DELETE /api/vendor/products/:id` — `vendor` + ownership check
Response: `{ success, message }` sau `403/404`.

### `GET /api/vendor/orders` — `vendor`
Returnează comenzi care conțin produsele vânzătorului. Populate `user.name + email`.
Response: `{ success, orders: [Order] }`.

### `GET /api/vendor/analytics` — `vendor`
Aggregate MongoDB: statusCounts + publishCounts + orderItems aggregate.
Response:
```json
{
  "success": true,
  "totalListings": 5,
  "approvedListings": 2,
  "pendingListings": 2,
  "rejectedListings": 1,
  "publishedListings": 1,
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

    VendorProductsPanel/VendorProductsPanel.jsx        [organism, 64 linii]
      VendorProductRowSkeleton                         [inline, 3 rânduri]
      products/VendorProductRow/VendorProductRow.jsx   [molecule, 93 linii]
        shared/ListingStatusBadge/ListingStatusBadge.jsx [atom, 9 linii]

    VendorOrdersPanel/VendorOrdersPanel.jsx            [organism, 77 linii]
      VendorOrderRowSkeleton                           [inline, 5 coloane]

    VendorAnalyticsPanel/VendorAnalyticsPanel.jsx      [organism, 60 linii]
      VendorAnalyticsCardSkeleton                      [inline]
      shared/StatCard/StatCard.jsx                     [atom]

    VendorProfilePanel/VendorProfilePanel.jsx          [organism, 85 linii]
      useVendorProfileForm.js                          [hook co-located]

Pages/Vendor/VendorCatalog/VendorCatalog.jsx           [page, 11 linii]
  Components/vendor/catalog/
    VendorCatalogPanel/VendorCatalogPanel.jsx          [organism]
      CatalogTable.jsx / CatalogRow.jsx                [molecule]
      CatalogVariantTable.jsx                          [molecule]
      useCatalogDraft.js                               [hook co-located]
    CatalogSearch/CatalogSearch.jsx                    [molecule]
      useCatalogSearch.js                              [hook co-located]
    CatalogBrowserModal/CatalogBrowserModal.jsx        [organism]
```

### Constants (utils/constants.js)
| Constantă | Valori |
|-----------|--------|
| `VENDOR_LINKS` | 6 linkuri sidebar: Prezentare generală / Produsele mele / Comenzi / Analytics / Catalog produse / Profil firmă |
| `VENDOR_STATUS_TABS` | `[{ key: undefined\|"published"\|"draft"\|"pending"\|"rejected", label }]` — 5 tab-uri |
| `TIP_ENTITATE_OPTIONS` | `[SRL, PFA, SA, RA, II, ONG]` — pentru select în VendorProfilePanel |
| `ORDER_STATUS_COLORS` | `{ Pending, Processing, Shipped, Delivered, Cancelled }` → hex |
| `LISTING_STATUS_LABELS` | `{ pending: "În așteptare", approved: "Aprobat", rejected: "Respins" }` |
