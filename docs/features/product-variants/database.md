# Database: Product Variants

> **Last updated:** 2026-07-13
> **Affects collections:** `Products`

---

## New collection(s)

Nicio colecție nouă — variantele sunt embedded în `Products`.

---

## Changes to existing collections

### `Products`

**Câmpuri ELIMINATE:**

| Field | Motiv |
|-------|-------|
| `price` | Mutat în `variants[].price` — un singur preț per produs nu mai are sens |
| `stock` | Mutat în `variants[].stock` — stocul e per variantă |

**Câmpuri ADĂUGATE:**

| Field | Type | Default | Required | Why added |
|-------|------|---------|----------|-----------|
| `variants` | `[VariantSchema]` | `[]` | da (min 1 după migrare) | Înlocuiește price + stock scalare |
| `minPrice` | `Number` | calculat | nu (auto) | Denormalizat pentru sort/filter performant |

**VariantSchema (embedded, _id: true):**

```js
const VariantSchema = new mongoose.Schema({
  attributes: {
    type: Map,
    of: String,
    default: {},
  },
  price: {
    type: Number,
    required: [true, "Varianta trebuie să aibă un preț"],
    min: [0, "Prețul nu poate fi negativ"],
  },
  stock: {
    type: StockSchema,   // refolosit din models/product/stock/Stock.js
    default: () => ({}),
  },
  images: {
    type: [String],
    default: [],
  },
  sku: {
    type: String,
    default: null,
  },
}, { _id: true });
```

**Migration needed:** da

```js
// Script: backend/scripts/migrateVariants.js
// Pentru fiecare document Products:
//   1. Citește price și stock curente
//   2. Construiește variants: [{ attributes: {}, price, stock, images }]
//      Dacă produsul are câmp "stocare" → attributes: { Stocare: doc.stocare }
//   3. Calculează minPrice = price
//   4. Unset: price, stock
//   5. Set: variants, minPrice

await Product.updateMany(
  { price: { $exists: true }, variants: { $exists: false } },
  [
    {
      $set: {
        variants: [{
          attributes: {},
          price: "$price",
          stock: "$stock",
          images: "$images",
        }],
        minPrice: "$price",
      }
    },
    { $unset: ["price", "stock"] }
  ]
);
```

---

## Indexes

```js
// ELIMINATE indexul vechi pe price
// ProductSchema.index({ price: 1 });  ← REMOVE

// ADAUGĂ index pe minPrice (același pattern de query/sort)
ProductSchema.index({ minPrice: 1 });
ProductSchema.index({ brand: 1, minPrice: 1 });  // înlocuiește brand + price

// Index pe variants.price pentru queries de tip "găsește produse cu vreo variantă sub X RON"
ProductSchema.index({ "variants.price": 1 });
```

**De actualizat în pre-save hook:**
```js
// Calculează minPrice automat la fiecare save
if (this.isModified("variants")) {
  this.minPrice = Math.min(...this.variants.map((v) => v.price));
}

// Slug — înlocuiește this.get("stocare") cu prima variantă
const firstVariant = this.variants?.[0];
const storageAttr = firstVariant?.attributes?.get?.("Stocare")
  || firstVariant?.attributes?.get?.("Memorie")
  || "";
// ... rest of slug logic folosind storageAttr în loc de this.get("stocare")
```

---

## Seed / test data

```js
// Produs cu variante multiple (telefon)
{
  brand: "Samsung",
  minPrice: 3499,
  variants: [
    { attributes: { Culoare: "Negru",  Stocare: "128GB" }, price: 3499, stock: { quantity: 10, availability: "In Stoc" }, images: [] },
    { attributes: { Culoare: "Negru",  Stocare: "256GB" }, price: 3799, stock: { quantity: 5,  availability: "In Stoc" }, images: [] },
    { attributes: { Culoare: "Alb",    Stocare: "128GB" }, price: 3499, stock: { quantity: 0,  availability: "Stoc Epuizat" }, images: [] },
    { attributes: { Culoare: "Alb",    Stocare: "256GB" }, price: 3799, stock: { quantity: 2,  availability: "In Stoc" }, images: [] },
  ]
}

// Produs simplu fără atribute (un singur preț)
{
  brand: "Generic",
  minPrice: 89,
  variants: [
    { attributes: {}, price: 89, stock: { quantity: 100, availability: "In Stoc" }, images: [] }
  ]
}

// Produs îmbrăcăminte
{
  brand: "Zara",
  minPrice: 149,
  variants: [
    { attributes: { Mărime: "S", Culoare: "Roșu" }, price: 149, stock: { quantity: 3, availability: "In Stoc" }, images: [] },
    { attributes: { Mărime: "M", Culoare: "Roșu" }, price: 149, stock: { quantity: 8, availability: "In Stoc" }, images: [] },
    { attributes: { Mărime: "L", Culoare: "Roșu" }, price: 149, stock: { quantity: 0, availability: "Stoc Epuizat" }, images: [] },
    { attributes: { Mărime: "S", Culoare: "Albastru" }, price: 159, stock: { quantity: 5, availability: "Promotii" }, images: [] },
  ]
}
```
