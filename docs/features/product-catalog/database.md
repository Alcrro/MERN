# Database: Product Catalog

> **Last updated:** 2026-07-11
> **Affects collections:** `CatalogProduct` (nouă), `Product` (neatinsă)

---

## New collection(s)

### `CatalogProduct`

```js
// backend/models/catalog/CatalogProduct.js
{
  kind: {
    type: String,
    required: true,
    enum: ["Electronics", "Clothing", "Furniture", "HomeGarden", "Books"],
  },
  brand: {
    type: String,
    required: true,
    trim: true,
  },
  specs: {
    type: mongoose.Schema.Types.Mixed,  // obiect cu câmpuri specifice per kind
    default: {},
  },
  images: {
    type: [String],
    default: [],
  },
  createdAt: Date,  // auto via { timestamps: true }
  updatedAt: Date,
}
```

**De ce există această colecție:** Stochează produse master pre-seeded (ex: iPhone 15 Pro cu toate specs-urile) independent de listing-urile vendorilor. `Product` e listing-ul unui vendor; `CatalogProduct` e sursa de adevăr a specs-urilor.

**Diferența față de `Product`:** Nu are `user`, `vendor`, `price`, `stock`, `listingStatus`, `rating`. Nu e discriminator — un singur model cu `kind` + `specs` (Mixed).

---

## Changes to existing collections

### `Product`

Nicio modificare. Catalogul e o colecție separată, read-only pentru vendori.

---

## Indexes

```js
// backend/models/catalog/CatalogProduct.js
CatalogProduct.index({ kind: 1 });
CatalogProduct.index(
  { brand: "text", "specs.model": "text", "specs.name": "text" },
  { weights: { brand: 3, "specs.model": 2, "specs.name": 2 }, name: "CatalogTextIndex" }
);
```

**Why:**
- `kind: 1` — filtrare rapidă după categorie (Electronics, Clothing etc.)
- Text index — full-text search pe brand + model/name cu relevance scoring

---

## Seed / test data

```js
// backend/seeder.js — adaugă în catalogData array
[
  {
    kind: "Electronics",
    brand: "Apple",
    specs: {
      model: "iPhone 15 Pro",
      tip: "Telefon",
      stocare: "256GB",
      RAM: "8GB",
      procesor: "A17 Pro",
      display: "6.1\" Super Retina XDR OLED",
      camera: "48MP Main + 12MP Ultra Wide + 12MP Telephoto",
      baterie: "3274mAh",
      OS: "iOS 17",
      conectivitate: "5G, Wi-Fi 6E, Bluetooth 5.3, USB-C"
    },
    images: []
  },
  {
    kind: "Electronics",
    brand: "Samsung",
    specs: {
      model: "Galaxy S24 Ultra",
      tip: "Telefon",
      stocare: "256GB",
      RAM: "12GB",
      procesor: "Snapdragon 8 Gen 3",
      display: "6.8\" Dynamic AMOLED 2X",
      camera: "200MP Main",
      baterie: "5000mAh",
      OS: "Android 14 / One UI 6.1"
    },
    images: []
  },
  // ... minim 50 entries la lansare
]
```
