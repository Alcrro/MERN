# Database: Alcrro Shop Card

> **Last updated:** 2026-07-16
> **Affects collections:** `ShopCard` (new), `CardTransaction` (new), `Order` (modified), `Product` (modified)

---

## New collection(s)

### `ShopCard`

```js
// models/shopCard/ShopCard.js
{
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Register",
    required: true,
    unique: true,       // un singur card per user
  },
  cardNumber: {
    type: String,
    required: true,
    unique: true,       // ex: "ALCRRO-4A2B-9F3C"
  },
  credits: {
    type: Number,
    default: 0,
    min: 0,
  },
  points: {
    type: Number,
    default: 0,
    min: 0,
  },
  tier: {
    type: String,
    enum: ["standard", "silver", "gold"],
    default: "standard",
  },
  referralCode: {
    type: String,
    required: true,
    unique: true,       // generat la creare: 6 char alphanumeric
  },
  referredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Register",
    default: null,
  },
  hasUsedReferral: {
    type: Boolean,
    default: false,
  },
  createdAt: Date,      // auto via { timestamps: true }
  updatedAt: Date,
}
```

**Why this collection exists:** Stochează soldul de credite și puncte per user, separat de modelul de autentificare pentru a nu aglomera `Register`.

---

### `CardTransaction`

```js
// models/shopCard/CardTransaction.js
{
  card: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ShopCard",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Register",
    required: true,     // duplicat pentru query rapid fără populate
  },
  type: {
    type: String,
    enum: [
      "credit-purchase",   // top-up prin Stripe
      "points-earned",     // comandă finalizată
      "points-redeemed",   // conversie puncte → credite
      "credits-spent",     // plată comandă cu credite
      "referral-bonus",    // bonus referral (referrer sau referred)
      "welcome-bonus",     // bonus prima comandă
    ],
    required: true,
  },
  amount: {
    type: Number,
    required: true,       // pozitiv = câștig, negativ = cheltuire
  },
  description: {
    type: String,
    required: true,       // ex: "Comandă #ABC - 200 RON"
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    default: null,
  },
  stripePaymentIntentId: {
    type: String,
    default: null,
  },
  createdAt: Date,      // auto via { timestamps: true }
}
```

**Why this collection exists:** Audit trail complet al mișcărilor de credite și puncte; permite paginare fără a stoca arrays necontrolate în `ShopCard`.

---

## Changes to existing collections

### `Order`

| Field | Type | Default | Required | Why added |
|-------|------|---------|----------|-----------|
| `creditsUsed` | `Number` | `0` | no | Câte credite au fost aplicate la această comandă |
| `pointsEarned` | `Number` | `0` | no | Câte puncte au fost acordate (stocat pentru referință în istoric) |

**Migration needed:** no — câmpuri noi cu default, documentele existente le moștenesc automat.

---

### `Product`

| Field | Type | Default | Required | Why added |
|-------|------|---------|----------|-----------|
| `creditsOnly` | `Boolean` | `false` | no | Dacă `true`, produsul poate fi cumpărat DOAR cu credite |

**Migration needed:** no — default `false` pentru toate produsele existente.

---

## Indexes

```js
// ShopCard
ShopCardSchema.index({ user: 1 }, { unique: true });
ShopCardSchema.index({ referralCode: 1 }, { unique: true });

// CardTransaction
CardTransactionSchema.index({ user: 1, createdAt: -1 });   // GET /transactions cu paginare
CardTransactionSchema.index({ card: 1, createdAt: -1 });
CardTransactionSchema.index({ stripePaymentIntentId: 1 }, { sparse: true }); // webhook idempotency
CardTransactionSchema.index({ orderId: 1 }, { sparse: true }); // revoke la refund
```

---

## Seed / test data

```js
// ShopCard exemplu (dev)
{
  user: ObjectId("..."),
  cardNumber: "ALCRRO-4A2B-9F3C",
  credits: 95,
  points: 230,
  tier: "standard",
  referralCode: "ALEX42",
  referredBy: null,
  hasUsedReferral: false,
}

// CardTransaction exemple
{ type: "credit-purchase", amount: 100, description: "Pachet 100 credite", stripePaymentIntentId: "pi_xxx" }
{ type: "points-earned",   amount: 20,  description: "Comandă #ORD001 - 200 RON", orderId: ObjectId("...") }
{ type: "points-redeemed", amount: -50, description: "Conversie 50 puncte → 5 credite" }
{ type: "credits-spent",   amount: -30, description: "Plată comandă #ORD002" }
{ type: "referral-bonus",  amount: 100, description: "Referral acceptat de alex@test.com" }
{ type: "welcome-bonus",   amount: 50,  description: "Bonus prima comandă" }
```
