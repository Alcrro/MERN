# Tech Spec: Vendor Page

> **Status:** `Draft`
> **Author:** Alexandru Roventa
> **Last updated:** 2026-07-13
> **Related PRD:** [PRD.md](./PRD.md)

---

## Overview

### What we're building

O pagină publică `/vendor/:vendorId` care expune profilul unui vânzător aprobat: informații firmă, produsele active, și recenzii lăsate de cumpărători despre vânzător ca entitate (separat de recenziile de produs). Se conectează la Register model (date firmă), Products (listinguri active), și un nou model VendorReview.

### Architecture decision log

| Decision | Options considered | Why we chose this |
|----------|--------------------|-------------------|
| URL slug | `/vendor/:vendorId` vs `/vendor/:shopSlug` | ObjectId e mai simplu — shopName nu e garantat unic |
| Recenzii vendor | extinde Review.js vs model nou | Review.js e legat de `product` (required). Model nou e mai curat și nu rupe indexul existent |
| RTK endpoint | în `rtkVendor.js` vs `rtkProducts.js` | `rtkVendor.js` — toate datele vin de la entitatea vendor |
| Produse vendor | reutilizează `getVendorProducts` (privat) vs endpoint nou public | endpoint nou public — `getVendorProducts` e protejat cu auth |

### Risks & trade-offs

- **Risk:** Vendor cu multe produse face pagina lentă — **Mitigation:** paginare server-side (12/pagină)
- **Risk:** Recenzii false pentru a boosta/distruge un seller — **Mitigation:** 1 recenzie per user (index unic), același pattern ca Review.js

---

## Implementation

### Data flow

```
/vendor/:vendorId
  → useGetPublicVendorQuery(vendorId)      → afișează header + info firmă
  → useGetPublicVendorProductsQuery(...)   → afișează grid produse
  → useGetVendorReviewsQuery(vendorId)     → afișează recenzii firmă
  → useAddVendorReviewMutation()           → formular recenzie (user autentificat)
```

### API contracts

#### `GET /api/vendor/public/:vendorId`

Returnează profilul public al unui vendor aprobat. Nu necesită autentificare.

**Response `200`:**
```json
{
  "success": true,
  "vendor": {
    "_id": "...",
    "shopName": "TechZone SRL",
    "shopDescription": "...",
    "avatar": null,
    "createdAt": "2024-01-15T...",
    "vendorProfile": {
      "denumireFirma": "TechZone SRL Cluj-Napoca",
      "tipEntitate": "SRL",
      "cui": "RO12345678",
      "orasDepozit": "Cluj-Napoca",
      "zileLivrare": { "min": 1, "max": 3 },
      "returZile": 30,
      "emailContact": "contact@techzone.ro"
    },
    "vendorRating": {
      "average": 4.5,
      "count": 12
    }
  }
}
```

**Error cases:**
- `400` — vendorId invalid (nu e ObjectId valid)
- `404` — vendor nu există sau `vendorStatus !== "approved"`

---

#### `GET /api/vendor/public/:vendorId/products`

Produsele active ale vânzătorului. Paginare server-side.

**Query params:**
| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `page` | `number` | no | default `1` |
| `limit` | `number` | no | default `12` |

**Response `200`:**
```json
{
  "success": true,
  "products": [...],
  "count": 24,
  "totalPages": 2
}
```

---

#### `GET /api/vendor/public/:vendorId/reviews`

Recenzii despre vendor ca firmă.

**Response `200`:**
```json
{
  "success": true,
  "reviews": [
    {
      "_id": "...",
      "vendor": "...",
      "user": { "_id": "...", "name": "Ion P.", "avatar": null },
      "value": 5,
      "comment": "Livrare rapidă, produs conform descrierii.",
      "createdAt": "2026-06-10T..."
    }
  ],
  "count": 12
}
```

---

#### `POST /api/vendor/public/:vendorId/reviews`

Adaugă recenzie vendor. Necesită autentificare. 1 recenzie per user per vendor.

**Body:**
```json
{ "value": 5, "comment": "Livrare excelentă." }
```

**Error cases:**
- `400` — `value` lipsă sau în afara [1, 5]
- `401` — neautentificat
- `409` — user a mai lăsat deja o recenzie pentru acest vendor

---

### Frontend — component tree

```
pages/VendorPage/VendorPage.jsx                ← NEW page (compoziție, zero logică)
  Components/vendor/public/
    VendorPageHeader/                           ← NEW organism (< 150 linii)
      VendorPageHeader.jsx                      — shopName, tipEntitate, badge depozit, rating
      VendorPageHeader.css
    VendorPageProducts/                         ← NEW organism
      VendorPageProducts.jsx                    — grid produse paginate
      VendorPageProducts.css
        Cards (REUSE)                           ← Components/products/cards/Cards.jsx
        Pagination (REUSE)                      ← Components/UI/pagination/Pagination.jsx
        CardSkeleton (REUSE)                    ← Components/products/cards/CardSkeleton.jsx
    VendorReviews/                              ← NEW organism
      VendorReviews.jsx                         — lista + formular adaugare recenzie
      VendorReviews.css
        Stars (REUSE)                           ← Components/products/singleProducts/Stars.jsx
        StarPicker (REUSE)                      ← Components/products/singleProducts/StarPicker.jsx
```

### Redux / RTK Query changes

Toate în `features/vendor/rtkVendor.js` — adăugăm endpoints în `vendorApi` existent:

| Type | Name | Description |
|------|------|-------------|
| RTK endpoint | `useGetPublicVendorQuery(vendorId)` | profil public vendor |
| RTK endpoint | `useGetPublicVendorProductsQuery({ vendorId, page, limit })` | produsele active |
| RTK endpoint | `useGetVendorReviewsQuery(vendorId)` | recenzii firmă |
| RTK endpoint | `useAddVendorReviewMutation()` | adaugă recenzie firmă |

Tag nou: `"VendorPublic"`, `"VendorReviews"` — separat de `"VendorMe"` (privat).

### SellerRow — legătura cu VendorPage

`SellerRow.jsx` are deja `seller.vendor._id`. Se adaugă un `<Link to={/vendor/${seller.vendor._id}}>` pe shopName.

### Key types / shapes

```js
// Vendor public profile
{
  _id: string,
  shopName: string,
  shopDescription: string | null,
  avatar: string | null,
  createdAt: string,            // ISO date — "activ din"
  vendorProfile: {
    denumireFirma: string | null,
    tipEntitate: "SRL" | "PFA" | "SA" | "RA" | "II" | "ONG",
    cui: string | null,
    orasDepozit: string | null, // null → dropshipping
    zileLivrare: { min: number | null, max: number | null },
    returZile: number,
    emailContact: string | null,
  },
  vendorRating: { average: number, count: number },
}

// VendorReview
{
  _id: string,
  vendor: string,
  user: { _id: string, name: string, avatar: string | null },
  value: 1 | 2 | 3 | 4 | 5,
  comment: string,
  createdAt: string,
}
```

### Edge cases to handle

- [ ] Vendor inexistent sau `vendorStatus !== "approved"` → 404 page
- [ ] Loading state — skeleton pentru header + grid produse
- [ ] Vânzător fără produse active → mesaj „Momentan niciun produs disponibil"
- [ ] Vânzător fără recenzii → mesaj „Fii primul care lasă o recenzie"
- [ ] `orasDepozit: null` → badge „Dropshipping" în loc de „Depozit: Cluj-Napoca"
- [ ] Mobile — header stacked vertical sub 768px
