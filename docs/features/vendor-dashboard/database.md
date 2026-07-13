<!-- Reverse-engineered from backend/models/auth/register.js și backend/models/product/Product.js — verify against DB -->

# Database — Vendor Dashboard

- **Last updated:** 2026-07-13

## Câmpuri vendor pe colecția `users` (model `Register`)

### Câmpuri de bază

| Câmp | Tip | Constrângeri | Default |
|------|-----|-------------|---------|
| `role` | String | enum: client / vendor / admin | `"client"` |
| `vendorStatus` | String | enum: none / pending / approved / rejected | `"none"` |
| `shopName` | String | maxlength: 100 | `null` |
| `shopDescription` | String | maxlength: 500 | `null` |

> Nota: rolul default a fost redenumit din `"user"` în `"client"` (definit prin constanta `ROLES.CLIENT`).

### Subdocument `vendorProfile` (VendorProfileSchema, `_id: false`)

| Câmp | Tip | Constrângeri | Default |
|------|-----|-------------|---------|
| `cui` | String | — | `null` |
| `denumireFirma` | String | maxlength: 150 | `null` |
| `tipEntitate` | String | enum: SRL / PFA / SA / RA / II / ONG | — |
| `orasDepozit` | String | maxlength: 100 | `null` |
| `zileLivrare.min` | Number | min: 0 | `null` |
| `zileLivrare.max` | Number | min: 0 | `null` |
| `returZile` | Number | min: 0 | `30` |
| `telefon` | String | — | `null` |
| `emailContact` | String | — | `null` |

Populat via `PUT /api/vendor/profile` cu patch parțial (`$set` pe câmpuri individuale).

### Indexuri
```js
{ email: 1 }        // unique
{ role: 1 }
{ vendorStatus: 1 } // pentru filtrare admin
```

### Flux de stare `vendorStatus`
```
none → (apply) → pending → (admin approve) → approved
                          → (admin reject)  → rejected
```
Schimbarea `role` la `"vendor"` se face manual sau de admin — nu există endpoint de aprobare în UI încă.

---

## Câmpuri vendor pe colecția `products` (model `Product`)

| Câmp | Tip | Constrângeri | Default |
|------|-----|-------------|---------|
| `vendor` | ObjectId | ref: Register | `null` |
| `listingStatus` | String | enum: pending / approved / rejected | `"approved"` |
| `rejectionReason` | String | — | `null` |
| `publishStatus` | String | enum: draft / published | `"draft"` |
| `sku` | String | unique (sparse) | — |
| `catalogRef` | ObjectId | ref: CatalogProduct, sparse | `null` |

### Comportament `listingStatus`
- Creat via `POST /api/vendor/products` → întotdeauna `"pending"`
- Editat via `PUT /api/vendor/products/:id` → resetat la `"pending"`, `rejectionReason: null`
- Modificat de admin via `PUT /api/admin/products/:id/status` → `"approved"` sau `"rejected"`

### Comportament `publishStatus`
- Creat via `POST /api/vendor/products` → `"draft"`
- Editat via `PUT /api/vendor/products/:id` → resetat la `"draft"`
- Publicat via `PUT /api/vendor/products/:id/publish` → `"published"` (doar dacă `listingStatus === "approved"`)

### SKU
Generat automat la creare via `generateSku(brand, orasDepozit, model)`. Unic per produs (index unique sparse).

### Filter în `GET /api/vendor/products`
```js
// status=published
{ vendor: req.user._id, listingStatus: "approved", publishStatus: "published" }

// status=draft
{ vendor: req.user._id, listingStatus: "approved", publishStatus: "draft" }

// status=pending
{ vendor: req.user._id, listingStatus: "pending" }

// status=rejected
{ vendor: req.user._id, listingStatus: "rejected" }

// fără status (toate)
{ vendor: req.user._id }
```

### Analytics aggregate
```js
// statusCounts
Product.aggregate([
  { $match: { vendor: req.user._id } },
  { $group: { _id: "$listingStatus", count: { $sum: 1 } } },
])

// publishCounts
Product.aggregate([
  { $match: { vendor: req.user._id } },
  { $group: { _id: "$publishStatus", count: { $sum: 1 } } },
])

// revenue
Order.aggregate([
  { $unwind: "$items" },
  { $match: { "items.product": { $in: productIds } } },
  { $group: { _id: null, totalUnitsSold: { $sum: "$items.quantity" },
               estimatedRevenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } } } },
])
```

### Indexuri relevante pentru vendor
```js
{ vendor: 1, listingStatus: 1 }
{ catalogRef: 1, listingStatus: 1, price: 1 }
{ sku: 1 }  // unique sparse
// Unicitate: un produs publicat per vendor per catalogRef
{ vendor: 1, catalogRef: 1 }  // unique sparse, partialFilter: publishStatus="published" + catalogRef != null
```
