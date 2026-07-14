# Database: Vendor Page

> **Last updated:** 2026-07-13
> **Affects collections:** `users` (read-only), `products` (read-only), `vendorreviews` (new)

---

## New collection(s)

### `VendorReview`

```js
// models/vendorReview/VendorReview.js
{
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: "Register", required: true },
  user:   { type: mongoose.Schema.Types.ObjectId, ref: "Register", required: true },
  value:  { type: Number, min: 1, max: 5, required: true },
  comment: { type: String, maxlength: 500 },
  createdAt: Date,  // auto via { timestamps: true }
}
```

**Why this collection exists:** Review.js are câmpul `product` required — nu poate fi refolosit pentru recenzii despre vânzători ca entitate. Model separat păstrează indexul unic product+user intact și permite rating mediu independent per vendor.

**Static method `calcAverageRating`** — același pattern ca Review.js:
- Agregare `$avg` pe `value` pentru `vendor` dat
- Stochează rezultatul în... **atenție**: nu există un câmp `vendorRating` pe Register. Opțiuni:
  - **Opțiunea A (simplă):** calculează live la GET — acceptabil pentru volume mici
  - **Opțiunea B (recomandată):** adaugă `vendorRating: { average, count }` pe RegisterSchema și actualizează post-save (același pattern ca `rating` din Product.js)

---

## Changes to existing collections

### `Register` (users)

Dacă se alege Opțiunea B pentru rating mediu:

| Field | Type | Default | Required | Why added |
|-------|------|---------|----------|-----------|
| `vendorRating.average` | `Number` | `0` | no | rating mediu calculat din VendorReview |
| `vendorRating.count` | `Number` | `0` | no | număr total de recenzii |

```js
vendorRating: {
  average: { type: Number, default: 0 },
  count:   { type: Number, default: 0 },
}
```

**Migration needed:** no — câmpurile au default, documentele existente le primesc la prima scriere.

### `Product` — fără modificări

Query-ul public pentru produsele unui vendor filtrează pe `vendor + listingStatus + publishStatus` — câmpuri existente.

---

## Indexes

```js
// VendorReview — în fișierul modelului
VendorReviewSchema.index({ vendor: 1, user: 1 }, { unique: true }); // 1 recenzie per user per vendor
VendorReviewSchema.index({ vendor: 1, createdAt: -1 });              // lista recenzii sortată
```

**Why:** Indexul unic previne recenzii duplicate. Indexul `vendor + createdAt` suportă query-ul `find({ vendor }).sort("-createdAt")`.

---

## Seed / test data

```js
// Rulat manual după ce TechZone și MobileHub sunt în DB
// Asigură că VendorPage are recenzii de afișat în dev
[
  { vendor: "<techzone_id>", user: "<any_client_id>", value: 5, comment: "Livrare în 24h, ambalaj excelent." },
  { vendor: "<techzone_id>", user: "<another_client_id>", value: 4, comment: "Produsul conform descrierii." },
  { vendor: "<mobilehub_id>", user: "<any_client_id>", value: 3, comment: "Livrare OK, comunicare puțin înceată." },
]
```
