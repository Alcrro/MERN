# Tech Spec: Stripe Payments

> **Status:** `Draft`
> **Author:** Alexandru Roventa
> **Last updated:** 2026-07-15
> **Related PRD:** [PRD.md](./PRD.md)

---

## Overview

### What we're building

Integrare Stripe Payment Element (embedded) în checkout flow-ul existent. La `POST /api/orders` cu `paymentMethod: "Card"`, backend-ul creează un Stripe PaymentIntent și returnează `clientSecret`. Frontend-ul montează `<PaymentElement>`, utilizatorul plătește, iar Stripe notifică backend-ul prin webhook. Idempotency e garantată printr-o colecție separată `StripeEvent`.

### Architecture decision log

| Decision | Options considered | Why we chose this |
|----------|--------------------|-------------------|
| Payment Element vs Checkout Session | Checkout Session (redirect), Payment Element (embedded) | Payment Element păstrează user-ul în app; Google Pay / Apple Pay funcționează automat |
| Când creăm PaymentIntent | La POST /api/orders, sau separat | La POST /api/orders — o singură cerere din frontend, order ID disponibil imediat pentru webhook lookup |
| Idempotency storage | Campo `stripeEventId` pe Order, sau colecție separată | Colecție separată `StripeEvent` — un order poate primi multiple events (succeeded + refunded); unique index pe `eventId` garantează exactitate |
| Stock decrement | La order creation (curent), sau la webhook succeeded | La order creation (curent, în tranzacție) — simplitate; stock restaurat de webhook `canceled` / `payment_failed` |
| `redirect` la confirmPayment | Always, `if_required` | `if_required` — redirecționează doar pentru 3DS sau wallet redirect-based; card standard confirmă în pagină |

### Risks & trade-offs

- **Risk:** PaymentIntent creat dar order abandonat (user pleacă după creare order, înainte de plată) — **Mitigation:** webhook `payment_intent.canceled` anulează order-ul și restaurează stock; Stripe auto-cancelează PaymentIntents neconfirmate după 24h
- **Risk:** Webhook întârziat — order e `isPaid: false` imediat după redirect — **Mitigation:** pagina de succes afișează "Payment processing..." cu polling sau refresh manual; webhook actualizează în secunde
- **Risk:** Stripe signature verification eșuează dacă body e parsat de Express JSON middleware — **Mitigation:** ruta webhook folosește `express.raw()` înainte de JSON middleware global (înregistrată prima în `server.js`)

---

## Implementation

### Data flow

```
Frontend (Cart/Checkout)
  → POST /api/orders { items, addressId, paymentMethod: "Card" }
  
Backend createOrder:
  → mongoose.startSession() + transaction
  → findOneAndUpdate: decrement stock (atomic, with $gte check)
  → Order.create({ ..., status: "Pending", isPaid: false })
  → commitTransaction()
  → stripe.paymentIntents.create({ amount, currency, metadata: { orderId } })
  → return { order, clientSecret }

Frontend receives { order, clientSecret }
  → loadStripe(REACT_APP_STRIPE_PUBLISHABLE_KEY)
  → <Elements stripe={stripe} options={{ clientSecret }}>
  → <PaymentElement /> (Card + Google Pay + Apple Pay automat)
  → User clicks "Plătește"
  → stripe.confirmPayment({ elements, redirect: "if_required" })
  → On success: navigate("/orders/:id?payment=success")
  → On error: afișează error.message din Stripe

Async — Stripe webhook POST /api/stripe/webhook:
  → express.raw() body
  → stripe.webhooks.constructEvent(body, sig, STRIPE_WEBHOOK_SECRET)
  → Idempotency: StripeEvent.create({ eventId }) — aruncă dacă duplicate
  → Switch event.type:
      "payment_intent.succeeded"   → order.isPaid=true, paidAt, paymentDetails, status→"Processing"
      "payment_intent.payment_failed" → order.status="Cancelled", restore stock
      "payment_intent.canceled"    → order.status="Cancelled", restore stock
      "charge.refunded"            → order.isPaid=false, isRefunded=true, refundedAt
  → return 200 imediat (înainte de processing lung, dar procesarea e rapidă — doar DB)
```

### API contracts

#### `POST /api/orders` *(modificat)*

**Body:**
```json
{
  "items": [{ "product": "objectId", "quantity": 2 }],
  "addressId": "objectId",
  "paymentMethod": "Card"
}
```

**Response `201` — Card:**
```json
{
  "success": true,
  "order": {
    "_id": "objectId",
    "status": "Pending",
    "isPaid": false,
    "paymentMethod": "Card",
    "stripePaymentIntentId": "pi_xxx",
    "items": [],
    "totalPrice": 1299
  },
  "clientSecret": "pi_xxx_secret_yyy"
}
```

**Response `201` — Ramburs:** *(nemodificat, fără `clientSecret`)*

**Error cases:**
- `400` — stoc insuficient (existent)
- `402` — Stripe a refuzat crearea PaymentIntent (plan stripe invalid, etc.)

---

#### `POST /api/stripe/webhook` *(nou)*

**Headers:** `stripe-signature: t=...,v1=...`

**Body:** raw bytes (nu JSON — necesită `express.raw({ type: 'application/json' })`)

**Events gestionate:**

| Event | Acțiune |
|-------|---------|
| `payment_intent.succeeded` | `order.isPaid = true`, `paidAt = now`, `paymentDetails = { last4, brand, receiptUrl }`, `status = "Processing"` |
| `payment_intent.payment_failed` | `order.status = "Cancelled"`, restaurare stock |
| `payment_intent.canceled` | `order.status = "Cancelled"`, restaurare stock |
| `charge.refunded` | `order.isPaid = false`, `isRefunded = true`, `refundedAt = now` |

**Response `200`:** `{ received: true }` — întotdeauna rapid, înainte de procesare

**Response `400`:** dacă signature verification eșuează

---

#### `GET /api/stripe/config` *(nou, opțional)*

**Response `200`:**
```json
{ "publishableKey": "pk_test_xxx" }
```

*Alternativă: `REACT_APP_STRIPE_PUBLISHABLE_KEY` direct în `.env` frontend — mai simplu pentru demo.*

---

### Frontend — component tree

```
pages/Checkout/ (sau pages/Orders/OrderDetail/)
  organisms/CheckoutPayment/      ← NOU
    CheckoutPayment.jsx           ← <Elements> wrapper + logică confirmPayment
    CheckoutPayment.css
    index.js
      atoms/Button/               ← REUSE — buton "Plătește"
      atoms/Spinner/              ← REUSE (dacă există) sau inline CSS
      molecules/PaymentStatus/    ← NOU — afișează last4, brand, receiptUrl, isPaid badge

pages/Orders/OrderDetail/         ← MODIFICAT — adaugă secțiunea PaymentStatus
```

### Redux / RTK Query changes

| Type | Name | File | Description |
|------|------|------|-------------|
| RTK mutation | `useCreateOrderMutation` | `features/order/rtkOrders.js` | **Modificat** — returnează acum `{ order, clientSecret }` |
| RTK query | `useGetStripeConfigQuery` | `features/stripe/rtkStripe.js` | **Nou** — GET /api/stripe/config (opțional) |
| Local state | `useState` în CheckoutPayment | co-located | `isLoading`, `errorMessage` pentru UI plată |

### Key types / shapes

```js
// Order — câmpuri noi
{
  _id: string,
  stripePaymentIntentId: string | null,   // null pentru Ramburs
  isPaid: boolean,
  paidAt: Date | null,
  isRefunded: boolean,
  refundedAt: Date | null,
  paymentDetails: {
    last4: string,    // "4242"
    brand: string,    // "visa" | "mastercard"
    receiptUrl: string,
  } | null,
  // ... câmpurile existente (items, status, deliveryAddress, etc.)
}

// StripeEvent (colecție nouă)
{
  eventId: string,    // e.g. "evt_xxx" — UNIQUE
  type: string,       // "payment_intent.succeeded"
  orderId: ObjectId,
  processedAt: Date,
}

// clientSecret (doar în response-ul POST /api/orders, nu se stochează)
clientSecret: string  // "pi_xxx_secret_yyy"
```

### Edge cases to handle

- [ ] **Ramburs** — `createOrder` nu apelează Stripe, nu returnează `clientSecret`; frontend nu montează PaymentElement
- [ ] **PaymentElement loading** — afișează spinner până când Stripe SDK e gata (onReady callback)
- [ ] **Confirmare eșuată** — `stripe.confirmPayment` returnează `{ error }` → afișează `error.message`, butonul e re-enabled
- [ ] **Webhook duplicat** — `StripeEvent.create()` aruncă `E11000` (duplicate key) → catch silențios, return 200
- [ ] **Order not found în webhook** — log warning, return 200 (nu trebuie să eșueze Stripe)
- [ ] **Mobile** — PaymentElement e responsive by default; niciun CSS special necesar
- [ ] **3D Secure** — `redirect: "if_required"` gestionează automat redirect + return cu `?payment_intent_client_secret` în URL
