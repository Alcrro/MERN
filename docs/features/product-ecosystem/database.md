# Database: Product Ecosystem

> **Last updated:** 2026-07-13
> **Affects collections:** `EcosystemCache` (nouă)

---

## New collection: `EcosystemCache`

```js
// backend/models/ecosystemCache/EcosystemCache.js
const mongoose = require("mongoose");

const EcosystemCacheSchema = new mongoose.Schema(
  {
    tip: {
      type:     String,
      required: true,
      unique:   true,
      index:    true,
    },
    data: {
      type:     mongoose.Schema.Types.Mixed,
      required: true,
      // Shape: { critical: [...], recommended: [...], tasks: [...] }
    },
    source: {
      type:    String,
      enum:    ["openai", "static"],
      default: "openai",
    },
    expiresAt: {
      type:     Date,
      required: true,
      // TTL index definit separat mai jos
    },
  },
  { timestamps: true }
);

// TTL index definit separat (nu inline pe câmp)
EcosystemCacheSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("EcosystemCache", EcosystemCacheSchema);
```

**De ce există această colecție:** Stochează răspunsurile OpenAI per `tip` pentru a
evita apeluri repetate (cost + latență). Un document per tip de produs, auto-expirat
după 7 zile via MongoDB TTL index.

**TTL calcul la scriere:**
```js
expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)  // +7 zile
```

---

## Changes to existing collections

Nicio colecție existentă nu este modificată.

| Colecție | Modificat | Motiv |
|----------|-----------|-------|
| `Product` | ❌ | Ecosistemul e per tip, nu per produs |
| `Category` | ❌ | Tipurile existente sunt suficiente |
| `User` | ❌ | |

---

## Indexes

```js
// Definite direct în schema de mai sus:
EcosystemCacheSchema.index({ tip: 1 }, { unique: true });
EcosystemCacheSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
```

**Index `tip`:** lookup O(1) la fiecare request `GET /api/ecosystem/:tip`

**Index TTL `expiresAt`:** MongoDB șterge automat documentele expirate
(daemon intern rulează la ~60s interval)

---

## Seed / test data

Nu e nevoie de seed automat — primul request per tip populează cache-ul.

Pentru testare manuală în development:

```js
// MongoDB Compass sau mongosh
db.ecosystemcaches.insertOne({
  tip: "Telefon",
  source: "static",
  expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  data: {
    critical: [
      { label: "Încărcător",        reason: "Bateria se consumă zilnic", icon: "⚡",  slug: "/products/electronice/incarcator" },
      { label: "Husă de protecție", reason: "Prima linie de apărare",    icon: "🛡️", slug: "/products/electronice/husa-de-protectie" },
    ],
    recommended: [
      { label: "Folie sticlă", reason: "Ecranul e cel mai scump de reparat", icon: "📱", slug: "/products/electronice/folie-sticla" },
    ],
    tasks: [
      {
        id: "gaming", label: "Gaming Mobile", icon: "🎮",
        context: "Joci titluri competitive pe telefon",
        items: [
          { label: "Controller Bluetooth", icon: "🕹️", slug: "/products/electronice/controller-bluetooth" },
          { label: "Răcitor telefon",      icon: "❄️", slug: "/products/electronice/racitor-telefon" },
        ],
      },
    ],
  },
});
```
