# Tech Spec: Profile Summary Dashboard

> **Status:** `Approved`
> **Author:** Alexandru Roventa
> **Last updated:** 2026-07-17
> **Related PRD:** [PRD.md](./PRD.md)

---

## Overview

### What we're building

Înlocuim `ProfileInfo.jsx` (formular simplu) cu un dashboard de summary care agregă date din 5 surse existente: comenzi, adrese, shop card, payment methods și (condiționat) vendor analytics. Toate endpoint-urile și hook-urile RTK Query există deja — nu e nevoie de niciun endpoint nou. Pagina e composited din widget-uri de tip organism/molecule, fiecare cu propriul hook RTK.

### Architecture decision log

| Decision | Options considered | Why we chose this |
|----------|--------------------|-------------------|
| Endpoint-uri noi vs. reutilizare | Endpoint dedicat `/profile/summary` vs. 5 query-uri paralele | 5 query-uri independente — deja există, RTK le cachează, no backend needed |
| ProfileInfo modificat vs. componentă nouă | Modifica în loc vs. componentă nouă `ProfileSummary` | Componentă nouă — ProfileInfo rămâne pentru tab-ul propriu, summary e un organism separat |
| Vendor widget conditional | Separat sau inline în summary | Inline, conditional pe `user.role === 'vendor'` |

### Risks & trade-offs

- **Risk:** 5 query-uri la prima deschidere a paginii — **Mitigation:** RTK Query le face în paralel; toate sunt lightweight; cache-ul le refolosește dacă user-ul a vizitat sub-paginile deja
- **Risk:** SavedCardItem conține butoane delete/default — **Mitigation:** Cream un `SavedCardPreview` molecule care e read-only (nu aduce RTK mutations)

---

## Implementation

### Data flow

```
/profile (default route) → ProfileSummaryPage
  ├── useGetMyOrdersQuery()         → filtrare client-side: Pending + Processing, max 5
  ├── useGetAddressesQuery()        → filtrare client-side: isDefault === true
  ├── useGetMyCardQuery()           → card Alcrro (credits, points, tier, cardNumber)
  ├── useGetPaymentMethodsQuery()   → filtrare client-side: isDefault === true
  └── useGetVendorAnalyticsQuery()  → doar dacă user.role === 'vendor' (skip: false/true)
```

### API contracts

Toate endpoint-urile există deja. Le documentăm ca referință:

#### `GET /api/orders/my` → `useGetMyOrdersQuery`
**Response:** `{ orders: [{ _id, status, totalPrice, createdAt, items[], installmentPlan }] }`
**Filtrare client-side:** `status === 'Pending' || status === 'Processing'` → primele 5

#### `GET /api/addresses` → `useGetAddressesQuery`
**Response:** `{ addresses: [{ _id, label, street, city, county, zip, phone, isDefault }] }`
**Filtrare client-side:** `addresses.find(a => a.isDefault)`

#### `GET /api/shop-card/my` → `useGetMyCardQuery`
**Response:** `{ card: { cardNumber, credits, points, tier, referralCode } }`

#### `GET /api/payment-methods` → `useGetPaymentMethodsQuery`
**Response:** `{ data: [{ id, brand, last4, expMonth, expYear, isDefault }] }`
**Filtrare client-side:** `data.find(pm => pm.isDefault)`

#### `GET /api/vendor/analytics` → `useGetVendorAnalyticsQuery`
**Response:** `{ totalProducts, totalOrders, totalUnitsSold, estimatedRevenue, averageRating }`
**Condiție:** apelat doar când `user.role === 'vendor'`

---

### Frontend — component tree

```
Pages/Profile/Profile.jsx                     ← MODIFY: default tab renders ProfileSummary
  Components/profile/ProfileSummary/
    ProfileSummary.jsx                        ← NEW organism (< 150 linii) — orchestrare
    ProfileSummary.css                        ← NEW
    index.js                                  ← NEW

    molecules/SummaryOrdersWidget/            ← NEW molecule
      SummaryOrdersWidget.jsx                 ← max 80 linii
      SummaryOrdersWidget.css
      index.js

    molecules/SummaryAddressWidget/           ← NEW molecule
      SummaryAddressWidget.jsx                ← max 80 linii
      SummaryAddressWidget.css
      index.js

    molecules/SummaryCardWidget/              ← NEW molecule (wraps AlcrroCard read-only)
      SummaryCardWidget.jsx                   ← max 80 linii
      SummaryCardWidget.css
      index.js

    molecules/SummaryPaymentWidget/           ← NEW molecule (read-only card preview)
      SummaryPaymentWidget.jsx                ← max 80 linii
      SummaryPaymentWidget.css
      index.js

    molecules/SummaryVendorWidget/            ← NEW molecule (conditional)
      SummaryVendorWidget.jsx                 ← max 80 linii
      SummaryVendorWidget.css
      index.js

  REUSE:
    molecules/AlcrroCard/AlcrroCard.jsx       ← REUSE as-is în SummaryCardWidget
    molecules/TierBadge/TierBadge.jsx         ← REUSE în SummaryCardWidget
```

### Redux / RTK Query changes

Niciun endpoint nou. Folosim hook-urile existente:

| Hook | Fișier | Folosit în |
|------|--------|------------|
| `useGetMyOrdersQuery` | `features/order/rtkOrders.js` | `SummaryOrdersWidget` |
| `useGetAddressesQuery` | `features/address/rtkAddresses.js` | `SummaryAddressWidget` |
| `useGetMyCardQuery` | `features/shopCard/rtkShopCard.js` | `SummaryCardWidget` |
| `useGetPaymentMethodsQuery` | `features/paymentMethods/rtkPaymentMethods.js` | `SummaryPaymentWidget` |
| `useGetVendorAnalyticsQuery` | `features/vendor/rtkVendor.js` | `SummaryVendorWidget` |

### Key types / shapes

```js
// Order (relevant fields)
{ _id: string, status: 'Pending'|'Processing'|..., totalPrice: number, createdAt: string }

// Address
{ _id: string, label: string, street: string, city: string, county: string, zip: string, phone: string, isDefault: boolean }

// ShopCard
{ cardNumber: string, credits: number, points: number, tier: 'standard'|'silver'|'gold', referralCode: string }

// PaymentMethod
{ id: string, brand: string, last4: string, expMonth: number, expYear: number, isDefault: boolean }

// VendorAnalytics
{ totalProducts: number, totalOrders: number, totalUnitsSold: number, estimatedRevenue: number, averageRating: number }
```

### Edge cases to handle

- [ ] Loading state — fiecare widget are propriul skeleton/spinner, nu blochează celelalte
- [ ] Empty state comenzi — "Nu ai comenzi active" + link spre /profile/orders
- [ ] Empty state adresă — CTA "Adaugă adresă" → link spre /profile/addresses
- [ ] Empty state shop card — CTA "Activează cardul Alcrro" → link spre /profile/card
- [ ] Empty state payment — CTA "Adaugă card" → link spre /profile/payment-methods
- [ ] Vendor analytics error — widget ascuns silențios (nu crash page)
- [ ] Card expirat — widget payment arată "Expirat" cu stil roșu (refolosește logica din SavedCardItem)
