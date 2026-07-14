# Tech Spec: Product Variants

> **Status:** `Draft`
> **Author:** Alexandru Roventa
> **Last updated:** 2026-07-13
> **Related PRD:** [PRD.md](./PRD.md)

---

## Overview

### What we're building

Înlocuim câmpurile scalare `price` și `stock` de pe Product cu un array de variante embedded (`variants: [VariantSchema]`). Fiecare variantă are `attributes` (obiect cheie-valoare liber), `price`, `stock` și `images` proprii. UI-ul din `ProductHero` afișează selectori dinamici per cheie de atribut; când toate atributele sunt selectate, panoul de preț se actualizează cu valorile variantei găsite.

### Architecture decision log

| Decision | Options considered | Why we chose this |
|----------|--------------------|-------------------|
| Embedded vs documente separate | Embedded în Product vs colecție `Variant` separată | Embedded — fără round-trips extra, atomic update, variante sunt întotdeauna citite cu produsul |
| Atribute generice | Schema fixă (culoare, stocare, mărime) vs `Map<string, string>` | `Map` — universal, orice tip de produs, fără migrare la adăugarea unui atribut nou |
| Preț top-level | Păstrat ca fallback (dual mode) vs eliminat complet | Eliminat complet (Option B) — o singură sursă de adevăr, elimină logica condițională din tot codul |
| Preț în listinguri/filtre | Query pe `variants.price` vs câmp denormalizat `minPrice` | `minPrice` denormalizat — index simplu, sort/filter performant fără aggregation |
| Slug SEO | Slug din `stocare` scalar vs din prima variantă | Prima variantă — universală, se calculează în pre-save |

### Risks & trade-offs

- **Risk:** Migrare DB — produsele existente n-au `variants` — **Mitigation:** script de migrare + `minPrice` calculat din `variants[0].price`
- **Risk:** `price` index existent devine invalid — **Mitigation:** înlocuit cu index pe `minPrice`
- **Risk:** `slug` pre-save hook citea `this.get("stocare")` — **Mitigation:** actualizat să citească `this.variants?.[0]?.attributes?.get?.("Stocare")` cu fallback la string gol

---

## Implementation

### Data flow

```
Vendor form → POST/PUT /admin/product (variants array) → Product.save() → minPrice calculat în pre-save hook
                                                                         ↓
Client: GET /product/:id → { ...product, variants: [...] }
  → useGetSingleProductQuery → ProductHero
  → useVariantPicker (hook local) → { selectedVariant, selectors, select(key, val) }
  → VariantPicker (UI) → onChange → hook recalculează selectedVariant
  → panoul de preț citește selectedVariant.price + selectedVariant.stock
```

### API contracts

#### `GET /api/product/:id` — nemodificat ca rută, răspuns extins

**Response `200`** (adăugat față de acum):
```json
{
  "product": {
    "_id": "...",
    "brand": "Samsung",
    "minPrice": 3499,
    "variants": [
      {
        "_id": "...",
        "attributes": { "Culoare": "Negru", "Stocare": "128GB" },
        "price": 3499,
        "stock": { "quantity": 10, "availability": "In Stoc" },
        "images": []
      },
      {
        "_id": "...",
        "attributes": { "Culoare": "Negru", "Stocare": "256GB" },
        "price": 3799,
        "stock": { "quantity": 3, "availability": "In Stoc" },
        "images": []
      }
    ]
  }
}
```

#### `POST /api/admin/product` — vendor creează produs

**Body modificat** (înlocuiește `price` și `stock` scalare):
```json
{
  "brand": "Samsung",
  "variants": [
    {
      "attributes": { "Culoare": "Negru", "Stocare": "128GB" },
      "price": 3499,
      "stock": { "quantity": 10, "availability": "In Stoc" },
      "images": []
    }
  ]
}
```

**Error cases:**
- `400` — `variants` gol sau lipsă
- `400` — variantă fără `price`
- `400` — `price` negativ

#### `PUT /api/admin/product/:id` — vendor editează produs

Același body ca POST. Replace complet al array-ului `variants`.

---

### Frontend — component tree

```
Components/products/singleProducts/
  ProductHero.jsx                  ← MODIFY: înlocuiește DEMO_COLORS + stocare scalar cu VariantPicker
  useVariantPicker.js              ← NEW hook (co-located): gestionează selecția de variante

Components/products/singleProducts/VariantPicker/
  VariantPicker.jsx                ← NEW molecule (< 80 linii): selectori dinamici per cheie atribut
  VariantPicker.css                ← NEW

Components/vendor/products/VendorProductForm/
  VendorProductForm.jsx            ← MODIFY: înlocuiește câmpurile price/stock cu VariantBuilder
  VariantBuilder.jsx               ← NEW molecule (< 80 linii): add/remove variante, editare atribute
  VariantBuilder.css               ← NEW

Components/products/cards/Cards.jsx  ← MODIFY: price din variants[0].price → minPrice
```

**REUSE:**
- `StockInput` — refolosit în VariantBuilder per variantă
- `ImageUploader` — refolosit în VariantBuilder per variantă (opțional)
- `.sp-vchip` / `.sp-color` CSS classes — refolosite în VariantPicker

### Redux / RTK Query changes

| Type | Name | File | Description |
|------|------|------|-------------|
| Hook local | `useVariantPicker` | `singleProducts/useVariantPicker.js` | Derivă selectori din `variants`, ține selecția curentă |
| RTK endpoint | `useGetSingleProductQuery` | `features/product/rtkProducts.js` | Nemodificat — variante vin în payload existent |
| RTK endpoint | `usePostProductMutation` | `features/product/rtkProducts.js` | Body acceptă `variants` array în loc de `price`/`stock` |

### Key types / shapes

```js
// VariantSchema (embedded în Product)
{
  _id: ObjectId,
  attributes: Map<string, string>,  // ex: { "Culoare": "Negru", "Stocare": "128GB" }
  price: Number,                    // required, min 0
  stock: {
    quantity: Number,
    availability: "In Stoc" | "Promotii" | "Nou" | "Resigilat" | "Precomanda" | "Stoc Epuizat"
  },
  images: [String],                 // URLs, opțional per variantă
}

// Product (câmpuri relevante după migrare)
{
  _id: ObjectId,
  brand: String,
  minPrice: Number,         // denormalizat, calculat în pre-save din min(variants.*.price)
  variants: [VariantSchema],
  // price: REMOVED
  // stock: REMOVED
}

// useVariantPicker output
{
  attrKeys: ["Culoare", "Stocare"],           // chei unice din toate variantele
  options: { Culoare: ["Negru", "Alb"], Stocare: ["128GB", "256GB"] },
  selected: { Culoare: "Negru", Stocare: null },
  selectedVariant: VariantSchema | null,      // null dacă nu toate cheile sunt selectate
  isValid: (key, val) => boolean,             // returnează false dacă valoarea e incompatibilă cu selecția curentă
  select: (key, val) => void,
}
```

### Edge cases to handle

- [ ] Produs fără variante (după migrare parțială) — afișează "Indisponibil"
- [ ] O singură variantă fără atribute (`attributes: {}`) — ascunde VariantPicker, afișează direct prețul
- [ ] Variantă cu `stock.quantity === 0` — CTA dezactivat, badge "Stoc epuizat"
- [ ] Atribut cu o singură valoare — afișat ca chip selectat automat (nu interactiv)
- [ ] Loading state în ProductHero — SingleProductSkeleton existent acoperă
- [ ] Mobile < 480px — VariantPicker chips wrappate pe mai multe linii
