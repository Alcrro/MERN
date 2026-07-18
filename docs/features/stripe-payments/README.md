# Stripe Payments

Real card payments via Stripe PaymentIntents, with saved cards, CVV-only re-auth, webhook sync, and automatic recovery from cancelled or already-succeeded intents.

---

## What's technically interesting

### PaymentIntent lifecycle management

A PaymentIntent is created at order time and stored on the order document. Three edge cases are handled automatically at payment time:

1. **PI already succeeded** (e.g. webhook fired before user returned to site) → order is marked paid immediately, frontend gets `{ alreadyPaid: true }` and invalidates the RTK cache
2. **PI cancelled** (from a previous failed attempt) → a new PI is created atomically with `findOneAndUpdate` to prevent race conditions, old cancelled PI is replaced
3. **PI missing Stripe Customer** (required for saved payment methods) → `stripe.paymentIntents.update()` attaches the customer before returning the client secret

### Saved cards with CVV-only

Stripe's `PaymentMethod` objects are stored per `Customer`. On the order payment screen:
- If the user has a default card saved, only a `CardCvcElement` is shown (not the full card form)
- The confirm call passes `payment_method: pm_xxx` + `payment_method_options: { card: { cvc: cvcElement } }`
- Full card entry (`CardElement`) is shown only when no saved card exists

### Cross-origin cookie auth

In production (Vercel → Render), the JWT cookie requires `Secure; SameSite=None`. Without these flags, browsers silently drop the cookie on cross-origin requests. The `cookieOptions()` helper in `auth.js` sets these conditionally based on `NODE_ENV`.

---

## Flow

```
Client clicks "Pay"
  → GET /api/orders/:id/pay-intent
      ├─ PI succeeded? → sync order, return { alreadyPaid: true }
      ├─ PI cancelled? → create new PI (atomic update)
      └─ PI missing customer? → attach customer, return clientSecret
  → stripe.confirmCardPayment(clientSecret, { payment_method })
  → POST /api/orders/:id/confirm-payment  ← fallback sync (not just webhook)
  → navigate to /orders/:id?payment=success
  → polling starts (3s interval) until order.isPaid === true
```

---

## Key files

| File | Role |
|------|------|
| `backend/controllers/order/order.js` | `getOrderPayIntent`, `confirmPayment` |
| `backend/controllers/stripe/stripeWebhook.js` | Webhook handler, marks order paid |
| `backend/utils/stripe.js` | Stripe SDK singleton |
| `frontend/src/Components/organisms/OrderDetailPanel/` | Inline payment UI |
| `frontend/src/features/order/rtkOrders.js` | `useGetOrderPayIntentQuery`, `useConfirmPaymentMutation` |
| `frontend/src/features/paymentMethods/rtkPaymentMethods.js` | Saved cards RTK |

---

See [tech-spec.md](tech-spec.md) for full API contracts and [database.md](database.md) for the Order schema.
