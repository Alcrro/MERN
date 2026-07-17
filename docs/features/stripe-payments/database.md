# Database: Stripe Payments

> **Last updated:** 2026-07-15
> **Affects collections:** `Order`, `StripeEvent` (nou)

---

## New collection(s)

### `StripeEvent`

```js
// models/stripe/StripeEvent.js
{
  eventId:     { type: String, required: true, unique: true },  // "evt_xxx"
  type:        { type: String, required: true },                // "payment_intent.succeeded"
  orderId:     { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  processedAt: { type: Date, default: Date.now },
}
// timestamps: false — processedAt e suficient
```

**Why this collection exists:** Idempotency pentru webhook Stripe. Stripe poate retrimite același event de mai multe ori. Unique index pe `eventId` garantează că un event e procesat exact o dată, indiferent de câte retry-uri face Stripe. Nu se poate stoca pe `Order` pentru că un order poate primi mai multe events distincte (succeeded, refunded).

---

## Changes to existing collections

### `Order`

| Field | Type | Default | Required | Why added |
|-------|------|---------|----------|-----------|
| `stripePaymentIntentId` | `String` | `null` | no | Lookup order din webhook via `paymentIntent.metadata.orderId` sau din intent ID direct |
| `isPaid` | `Boolean` | `false` | yes | **Existent** — rămâne; setat `true` de webhook `payment_intent.succeeded` |
| `paidAt` | `Date` | — | no | **Existent** — rămâne; setat de webhook |
| `isRefunded` | `Boolean` | `false` | no | Setat de webhook `charge.refunded` |
| `refundedAt` | `Date` | — | no | Timestamp refund din Stripe |
| `paymentDetails` | `Object` | `null` | no | Snapshot card din webhook: `{ last4, brand, receiptUrl }` |
| `paymentDetails.last4` | `String` | — | no | Ultimele 4 cifre card: "4242" |
| `paymentDetails.brand` | `String` | — | no | "visa", "mastercard", etc. |
| `paymentDetails.receiptUrl` | `String` | — | no | URL receipt Stripe (https://pay.stripe.com/receipts/...) |

**Migration needed:** no — câmpurile noi au `default` sau sunt opționale. Comenzile existente cu `paymentMethod: "Ramburs"` rămân neatinse.

**Schema additions:**

```js
// În OrderSchema — adaugă după câmpul existent `paidAt`
stripePaymentIntentId: { type: String },

isRefunded:  { type: Boolean, default: false },
refundedAt:  { type: Date },

paymentDetails: {
  last4:      { type: String },
  brand:      { type: String },
  receiptUrl: { type: String },
},
```

---

## Indexes

```js
// Order — pentru lookup rapid în webhook handler
OrderSchema.index({ stripePaymentIntentId: 1 }, { sparse: true });
// sparse: true — nu indexează documentele fără acest câmp (Ramburs)

// StripeEvent — deja garantat de unique: true pe câmp, dar explicit:
StripeEventSchema.index({ eventId: 1 }, { unique: true });
StripeEventSchema.index({ orderId: 1 });  // pentru debug / admin queries
```

**Why:** Webhook-ul face `Order.findOne({ stripePaymentIntentId: intentId })` — fără index, full collection scan la fiecare webhook.

---

## Seed / test data

```js
// Card de test Stripe (nu se stochează în DB, dar util pentru dezvoltare)
// Succes:   4242 4242 4242 4242 | orice dată viitoare | orice CVC
// 3D Secure: 4000 0027 6000 3184
// Refuz:    4000 0000 0000 0002

// Exemplu document Order după payment_intent.succeeded:
{
  _id: ObjectId("..."),
  user: ObjectId("..."),
  paymentMethod: "Card",
  status: "Processing",
  isPaid: true,
  paidAt: ISODate("2026-07-15T17:00:00Z"),
  stripePaymentIntentId: "pi_3abc123",
  paymentDetails: {
    last4: "4242",
    brand: "visa",
    receiptUrl: "https://pay.stripe.com/receipts/payment/..."
  },
  isRefunded: false,
  items: [...],
  totalPrice: 1299,
}

// Exemplu document StripeEvent:
{
  _id: ObjectId("..."),
  eventId: "evt_1abc123",
  type: "payment_intent.succeeded",
  orderId: ObjectId("..."),
  processedAt: ISODate("2026-07-15T17:00:05Z"),
}
```
