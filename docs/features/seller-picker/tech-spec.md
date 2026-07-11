# Tech Spec: Seller Picker

> **Status:** `Shipped`
> **Author:** Alexandru Roventa
> **Last updated:** 2026-07-11
> **Related PRD:** [PRD.md](./PRD.md)
> **Depends on:** `product-catalog` feature (CatalogProduct model + catalogRef pe Product)

---

## Overview

### What we're building

Pe listing (`/products`), produsele cu `catalogRef` se grupează — un singur card afișează `MIN(price)` + badge "N oferte". Pe pagina de detaliu (`/product/:id`), un nou organism `SellerPicker` listează toți vendorii aprobați care vând acel produs catalog, sortat după preț. Click pe seller → actualizează prețul/stocul afișat + butonul de coș adaugă listarea acelui vendor.

### Architecture decision log

| Decision | Options considered | Why we chose this |
|----------|--------------------|-------------------|
| Grupare produse | Frontend (group by catalogRef din response), Backend (aggregation) | Backend aggregation — nu trimitem N listări pe client doar ca să le grupăm |
| ID în URL pe pagina produsului | `catalogRef` ca param, `product._id` ca param | `product._id` (listing-ul cu prețul minim) — URL-urile existente rămân valide |
| Seller list endpoint | Nou endpoint `/api/products/sellers`, extend `getSingleProduct` | Nou endpoint — `getSingleProduct` rămâne simplu, sellers se încarcă separat |
| State seller selectat | Redux slice, useState local | `useState` local în `SellerPicker` — e UI state pur, nu global |

### Risks & trade-offs

- **Risk:** Produse fără `catalogRef` se comportă diferit. **Mitigation:** Backwards compatible — dacă `catalogRef` e null, listing și pagina produsului funcționează exact ca înainte.
- **Risk:** Aggregation pe listing poate fi lentă. **Mitigation:** Index compus pe `{ catalogRef: 1, listingStatus: 1, price: 1 }`.

---

## Implementation

### Data flow

**Listing:**
```
GET /api/products
  → dacă prod are catalogRef: aggregate GROUP BY catalogRef → MIN(price), COUNT(sellers)
  → dacă nu: returnează normal
  → ProductCard afișează preț minim + badge "N oferte"
```

**Pagina produsului:**
```
GET /api/product/:id          → listarea cu prețul minim (existent)
GET /api/products/sellers/:catalogRef  → toate listările aprobate pentru acel catalogRef
  → SellerPicker primește lista, afișează sellers sortați după preț
  → user selectează seller → selectedListing state local
  → AddToCartButton folosește selectedListing._id
```

---

### API contracts

#### `GET /api/products` — modificat

Când un produs are `catalogRef`, răspunsul include câmpuri suplimentare:

```json
{
  "queryProducts": [
    {
      "_id": "listing_id_cu_pret_minim",
      "catalogRef": "catalog_product_id",
      "brand": "Apple",
      "price": 4299,
      "sellersCount": 3,
      "images": ["..."],
      "rating": { "average": 4.7, "count": 120 }
    }
  ],
  "totalProducts": 1,
  "count": 1
}
```

> Produsele fără `catalogRef` rămân nemodificate în response.

---

#### `GET /api/products/sellers/:catalogRef`

**Path param:** `catalogRef` — ObjectId al unui `CatalogProduct`

**Response `200`:**
```json
{
  "sellers": [
    {
      "_id": "listing_id",
      "price": 4299,
      "stock": { "quantity": 12, "availability": "In Stoc" },
      "vendor": { "_id": "...", "shopName": "TechVendor SRL" },
      "images": ["..."],
      "listingStatus": "approved"
    }
  ],
  "count": 3
}
```

**Sortare:** preț crescător (implicit)

**Error cases:**
- `400` — `catalogRef` invalid (nu e ObjectId valid)
- `200 { sellers: [], count: 0 }` — niciun seller aprobat (nu 404)

---

### Frontend — component tree

```
pages/SingleProducts/SingleProducts.jsx       ← MODIFY — adaugă SellerPicker dacă catalogRef există
  products/singleProducts/ProductHero.jsx     ← MODIFY — primește selectedListing în loc de product direct
  vendor/SellerPicker/SellerPicker.jsx        ← NEW organism (≤ 150 linii)
    SellerPicker.css                          ← NEW
    index.js                                  ← NEW
  vendor/SellerRow/SellerRow.jsx              ← NEW molecule (≤ 80 linii)
    SellerRow.css                             ← NEW
    index.js                                  ← NEW

products/cards/Cards.jsx                      ← MODIFY — afișează sellersCount badge
products/products/ProductGrid.jsx             ← NEATINS (primește deja date din RTK)
```

**Componente reutilizabile:**
- `UI/add-to-cart-v2-button/AddToCartV2Button.jsx` — reutilizat în `SellerRow`, cu `product._id` al listării selectate
- `vendor/ListingStatusBadge/ListingStatusBadge.jsx` — opțional în `SellerRow`

### Redux / RTK Query changes

| Type | Name | File | Description |
|------|------|------|-------------|
| RTK endpoint | `useGetSellersQuery` | `features/product/rtkProducts.js` | GET /api/products/sellers/:catalogRef |

> `SellerPicker` folosește `useState` local pentru seller selectat — nu intră în Redux.

### Key types / shapes

```js
// SellerListing — shape returnat de /api/products/sellers/:catalogRef
{
  _id: string,          // listing ID — folosit la addToCart
  price: number,
  stock: { quantity: number, availability: string },
  vendor: { _id: string, shopName: string },
  images: string[],
}

// ProductCard shape — extins cu câmpuri noi când catalogRef există
{
  _id: string,          // listing-ul cu prețul minim
  catalogRef: string | null,
  sellersCount: number, // 0 dacă nu e grupat
  price: number,        // MIN(price) dacă grupat
  // ... câmpurile existente
}
```

### Edge cases to handle

- [ ] `catalogRef` null — `SellerPicker` nu se randează, pagina funcționează ca înainte
- [ ] Un singur seller — `SellerPicker` se randează fără header "Alege vendorul", direct cu seller-ul pre-selectat
- [ ] Seller selectat iese din stoc între timp — eroare la addToCart gestionată de RTK
- [ ] Loading sellers — skeleton de 2-3 rânduri în `SellerPicker`
- [ ] Mobile — `SellerPicker` stacked vertical, scroll intern dacă > 5 sellers
