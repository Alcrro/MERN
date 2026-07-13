# Tech Spec — Product Catalog

- **Status:** Shipped
- **Last updated:** 2026-07-13

## Data flow

### Vendor (browse + publish)
```
/vendor/dashboard/catalog
  → VendorCatalog (useSearchParams)
      → ?view=add  → VendorProductForm (isEdit=false)
      → default    → VendorCatalogPanel
                       [kind pill] → CatalogTable (key=`${kind}-${tip}`)
                         useListCatalogQuery({ kind, tip, brand, page, limit:20 })
                           GET /api/catalog/all?kind=&tip=&brand=&page=&limit=
                         → CatalogRow (expandable)
                             → CatalogVariantTable
                                 useCatalogDraft.publishColor(entry, color)
                                   useCreateVendorProductMutation
                                     POST /api/vendor/products
```

### Vendor (search in form)
```
VendorProductForm → CatalogSearch
  useCatalogSearch(kind, onSelect)
    useSearchCatalogQuery({ q, kind, limit:10 }, skip: q.length < 2)
      GET /api/catalog/?q=&kind=&limit=
    → select entry → populează brand, specs, images în form
```

### Admin (manage)
```
/admin/catalog
  → AdminCatalog (redirect dacă !admin)
      → PendingListingsAdmin
          useGetAdminPendingListingsQuery({ page, limit:20 })
            GET /api/admin/products/pending
          useApproveListingMutation → PUT /api/admin/products/:id/status
          [badge ⚠ Duplicat publicat / ✓ Unic / Fără ref catalog]
      ── <hr> ──
      → CatalogAdmin
          useListCatalogQuery({ kind, page, limit:20 })
            GET /api/catalog/all
          useDeleteCatalogEntryMutation → DELETE /api/catalog/:id
          → CatalogEntryModal (add/edit)
              useCreateCatalogEntryMutation → POST /api/catalog/
              useUpdateCatalogEntryMutation → PUT /api/catalog/:id
```

## API Contracts

### `GET /api/catalog/all`
Public. Parametri: `kind`, `brand` (regex case-insensitive), `tip` (specs.tip), `page`, `limit` (cap 50).
```json
{
  "results": [CatalogProduct],
  "total": 31,
  "page": 1,
  "pages": 2
}
```

### `GET /api/catalog/`
Public. Full-text search MongoDB. Parametri: `q` (min 2 chars, required), `kind`, `limit` (cap 20).
```json
{ "results": [CatalogProduct], "count": 5 }
```

### `POST /api/catalog/` — `protect + authorize("admin")`
Body: `{ kind, brand, specs: {}, images: [], culoare: [], refPrice }`.
Response: `201 CatalogProduct`.

### `PUT /api/catalog/:id` — `protect + authorize("admin")`
Body: parțial sau complet. Response: `CatalogProduct` actualizat sau `404`.

### `DELETE /api/catalog/:id` — `protect + authorize("admin")`
Response: `{ message: "Șters cu succes" }` sau `404`.

## API Contracts (admin listing review)

### `GET /api/admin/products/pending` — `protect + authorize("admin")`
Params: `page`, `limit` (cap 50).
Response: `{ success: true, products: [Product populated vendor + catalogRef], count, numberOfPages }`
Fiecare produs include `hasDuplicate: Boolean` (există alt listing publicat cu același vendor + catalogRef).

### `PUT /api/admin/products/:id/status` — `protect + authorize("admin")`
Body: `{ action: "approve"|"reject", reason?: string }`
Response: `{ success: true, product }`

---

## Component Tree

```
Pages/Admin/AdminCatalog/AdminCatalog.jsx          [page, 20 linii]
  Components/administrator/catalog/
    PendingListingsAdmin/PendingListingsAdmin.jsx   [organism, ~142 linii]
    CatalogAdmin/CatalogAdmin.jsx                  [organism, ~137 linii]
      CatalogEntryModal/CatalogEntryModal.jsx      [organism, 102 linii]

Pages/Vendor/VendorCatalog/VendorCatalog.jsx       [page, 11 linii]
  Components/vendor/catalog/
    VendorCatalogPanel/VendorCatalogPanel.jsx      [organism, 67 linii]
      VendorCatalogPanel/CatalogTable.jsx          [organism, 102 linii]
        VendorCatalogPanel/CatalogRow.jsx          [organism, 56 linii]
          VendorCatalogPanel/CatalogVariantTable.jsx [molecule, 68 linii]
    CatalogSearch/CatalogSearch.jsx                [organism, 70 linii]
      CatalogSearch/useCatalogSearch.js            [hook]
    CatalogBrowserModal/CatalogBrowserModal.jsx    [organism, 68 linii] ⚠ nefolosit
```

### Hooks co-located
| Hook | Locație | Face |
|------|---------|------|
| `useCatalogDraft` | VendorCatalogPanel/ | draft per entry (price/stock/publish state per culoare) |
| `useCatalogSearch` | CatalogSearch/ | query state, RTK call, keyboard nav, select/reset |
| `useVendorProductForm` | VendorProductForm/ | form state + submit |

### RTK endpoints admin
| Endpoint | Fișier | Route |
|----------|--------|-------|
| `useGetAdminPendingListingsQuery` | `features/admin/rtkAdmin.js` | GET /api/admin/products/pending |
| `useApproveListingMutation` | `features/admin/rtkAdmin.js` | PUT /api/admin/products/:id/status |

### Constants (utils/constants.js)
| Constantă | Utilizare |
|-----------|-----------|
| `CATALOG_TREE` | kind → `[{ label, tip }]` pentru pills secundare |
| `CATALOG_KINDS` | `["Electronics","Clothing","Furniture","HomeGarden","Books"]` |
| `CATALOG_SPEC_FIELDS` | kind → câmpuri specs pentru CatalogEntryModal |
| `COL_HEADERS` / `SPEC_COLS` | co-located în `catalogCols.js` — headere și accessori coloană tabel |
| `COLOR_MAP` | culoare → hex pentru dot colorat în CatalogVariantTable |
| `DEFAULT_STOCK` | `{ quantity: 0, availability: "In Stoc" }` |
| `CLOTHING_SIZES` | array mărimi pentru size chips |

## Key Types

### CatalogProduct (Mongoose)
```js
{
  kind:     String, enum: ["Electronics","Clothing","Furniture","HomeGarden","Books"]
  brand:    String, required, trim
  specs:    Mixed, default: {}
  images:   [String], default: []
  culoare:  [String], default: []
  refPrice: Number, default: null
  // timestamps: createdAt, updatedAt
}
```

### Draft variant shape (useCatalogDraft)
```js
{
  variants: {
    [colorName]: { price: "", stock: DEFAULT_STOCK, publishing: false, published: false, error: null }
  },
  sizes: []  // doar Clothing
}
```
