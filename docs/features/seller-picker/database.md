# Database: Seller Picker

> **Last updated:** 2026-07-11
> **Affects collections:** `Product` (câmp nou), `CatalogProduct` (din feature product-catalog, referit)

---

## New collection(s)

Nicio colecție nouă. Seller Picker folosește `Product` (existent) și `CatalogProduct` (creat în feature `product-catalog`).

---

## Changes to existing collections

### `Product`

| Field | Type | Default | Required | Why added |
|-------|------|---------|----------|-----------|
| `catalogRef` | `ObjectId` ref `CatalogProduct` | `null` | no | Leagă listarea unui vendor de produsul master din catalog. Null = produs legacy fără catalog. |

```js
// Adaugă în backend/models/product/Product.js
catalogRef: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "CatalogProduct",
  default: null,
},
```

**Migration needed:** no — `default: null`, documentele existente rămân valide și funcționează fără `catalogRef`.

---

## Indexes

```js
// backend/models/product/Product.js
// Suportă aggregation-ul din GET /api/products + GET /api/products/sellers/:catalogRef
ProductSchema.index({ catalogRef: 1, listingStatus: 1, price: 1 });
```

**Why:** Query-ul de grupare face `{ catalogRef: { $ne: null }, listingStatus: "approved" }` + sort după `price`. Indexul compus acoperă filtrul + sort-ul fără collection scan.

---

## Aggregation pipeline — GET /api/products (grupare)

```js
// Pseudocod pentru controller
// 1. Produse fără catalogRef — query normal existent
// 2. Produse cu catalogRef — aggregation:
Product.aggregate([
  { $match: { catalogRef: { $ne: null }, listingStatus: "approved" } },
  { $sort: { price: 1 } },
  { $group: {
    _id: "$catalogRef",
    listingId: { $first: "$_id" },   // listing-ul cu prețul minim
    price:     { $first: "$price" },
    brand:     { $first: "$brand" },
    images:    { $first: "$images" },
    rating:    { $first: "$rating" },
    sellersCount: { $sum: 1 },
  }},
  // $lookup pe CatalogProduct pentru specs dacă e necesar
])
// Merge rezultatele celor 2 query-uri înainte de a returna
```

---

## Seed / test data

```js
// După implementarea product-catalog, adaugă catalogRef pe câteva produse test:
// Exemplu: 3 vendori vând același iPhone 15 Pro
await Product.create([
  { ...iphoneSpecs, price: 4299, vendor: vendor1._id, catalogRef: iphone15CatalogId },
  { ...iphoneSpecs, price: 4499, vendor: vendor2._id, catalogRef: iphone15CatalogId },
  { ...iphoneSpecs, price: 4199, vendor: vendor3._id, catalogRef: iphone15CatalogId },
]);
// Pe listing trebuie să apară un singur card cu price: 4199, sellersCount: 3
```
