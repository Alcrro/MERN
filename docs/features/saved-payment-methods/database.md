# Database: Saved Payment Methods

> **Last updated:** 2026-07-16
> **Affects collections:** `Register` (modificat)
> **Nu e necesară colecție nouă** — Stripe stochează datele cardurilor

---

## New collection(s)

Nicio colecție nouă. Stripe este single source of truth pentru PaymentMethods.
API-ul nostru face proxy la `stripe.paymentMethods.list()` și `stripe.paymentMethods.detach()`.

---

## Changes to existing collections

### `Register` (users)

| Field | Type | Default | Required | Why added |
|-------|------|---------|----------|-----------|
| `stripeCustomerId` | `String` | `null` | no | ID-ul Stripe Customer — permite listarea/atașarea PaymentMethods |

```js
// models/auth/register.js — adaugă în schema
stripeCustomerId: {
  type: String,
  default: null,
},
```

**Migration needed:** no — default `null`, creat lazy la primul `POST /api/payment-methods/setup`.

---

## Indexes

```js
// Nu e necesar index pe stripeCustomerId — query-ul se face doar după _id (din JWT)
```

---

## Modele existente — referință

### `Register` (câmpuri actuale relevante)
```js
{
  name: String,
  email: String,        // trimis la stripe.customers.create
  password: String,
  role: String,
  phone: String,
  avatar: String,
  vendorStatus: String,
  shopName: String,
  // NOU:
  stripeCustomerId: String | null,
}
```

### `Order` (câmpuri actuale relevante)
```js
{
  stripePaymentIntentId: String,
  paymentMethod: "Card" | "Ramburs",
  isPaid: Boolean,
  paymentDetails: { last4, brand, receiptUrl },
  creditsUsed: Number,  // adăugat în alcrro-shop-card
}
```

Niciun câmp nou nu e necesar în `Order` — `paymentDetails.last4` și `paymentDetails.brand` sunt deja populate din webhook la payment_intent.succeeded.

---

## Seed / test data

```js
// Card Stripe de test pentru dev
// Visa: 4242 4242 4242 4242, orice exp viitor, orice CVC
// Mastercard: 5555 5555 5555 4444
// 3DS required: 4000 0025 0000 3155
// Revolut (Visa): 4242 4242 4242 4242 (Stripe nu diferențiază emitentul în test mode)
```
