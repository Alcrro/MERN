<!-- Reverse-engineered from backend/models/auth/register.js și backend/models/product/Product.js — verify against DB -->

# Database — Vendor Dashboard

## Câmpuri vendor pe colecția `users` (model `Register`)

| Câmp | Tip | Constrângeri | Default |
|------|-----|-------------|---------|
| `role` | String | enum: user / vendor / admin | `"user"` |
| `vendorStatus` | String | enum: none / pending / approved / rejected | `"none"` |
| `shopName` | String | maxlength: 100 | `null` |
| `shopDescription` | String | maxlength: 500 | `null` |

### Index
```js
{ vendorStatus: 1 }  // pentru filtrare admin
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
| `vendor` | ObjectId | ref: Register | — |
| `listingStatus` | String | enum: pending / approved / rejected | `"pending"` |
| `rejectionReason` | String | — | `null` |
| `culoare` | [String] | — | `[]` |

### Comportament `listingStatus`
- Creat via `POST /api/vendor/products` → întotdeauna `pending`
- Editat via `PUT /api/vendor/products/:id` → resetat la `pending`, `rejectionReason: null`
- Modificat de admin via `PUT /api/admin/products/:id/status` → `approved` sau `rejected`

### Filter în `GET /api/vendor/products`
```js
{ vendor: req.user._id, listingStatus?: "pending"|"approved"|"rejected" }
```

### Analytics aggregate
```js
// statusCounts
Product.aggregate([
  { $match: { vendor: req.user._id } },
  { $group: { _id: "$listingStatus", count: { $sum: 1 } } },
])

// revenue
Order.aggregate([
  { $unwind: "$items" },
  { $match: { "items.product": { $in: productIds } } },
  { $group: { _id: null, totalUnitsSold: { $sum: "$items.quantity" },
               estimatedRevenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } } } },
])
```
