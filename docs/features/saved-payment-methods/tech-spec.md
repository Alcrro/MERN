# Tech Spec: Saved Payment Methods

> **Status:** `Draft`
> **Author:** Alexandru Roventa
> **Last updated:** 2026-07-16
> **Related PRD:** [PRD.md](./PRD.md)

---

## Overview

### What we're building

Salvarea cardurilor bancare folosind Stripe Customer + SetupIntent. Datele cardului **nu ating serverul nostru** — Stripe le stochează securizat. Noi păstrăm doar `stripeCustomerId` în modelul `Register`. Cardurile salvate sunt afișate în profil și preselectate la checkout.

### Architecture decision log

| Decision | Options considered | Why we chose this |
|----------|--------------------|-------------------|
| Stocare date card | Pe serverul nostru / Stripe Vault | Stripe: PCI compliance automat, zero risc de breach pe serverul nostru |
| Flux salvare card | PaymentIntent + save / SetupIntent | SetupIntent: salvează fără a debita, explicit și clar pentru user |
| stripeCustomerId | În Register / colecție separată | În Register: un câmp, query simplu, același model deja folosit |
| Card implicit | Flag în Register / metadata Stripe | Metadata Stripe (`default_payment_method` pe Customer): single source of truth |
| Checkout cu card salvat | Confirm pe frontend / backend | Backend confirm: mai sigur, aceeași logică ca fluxul existent |

### Risks & trade-offs

- **Risk:** User fără `stripeCustomerId` ajunge la checkout cu card salvat — **Mitigation:** `getOrCreateStripeCustomer()` helper care creează lazy
- **Risk:** Card expirat în lista salvată — **Mitigation:** Afișăm `exp_month/exp_year` din Stripe, userul vede vizual dacă e expirat
- **Risk:** SetupIntent eșuează silențios — **Mitigation:** Eroare explicită returnată din Stripe și afișată în UI

---

## Implementation

### Data flow

```
Salvare card nou:
  User click „Adaugă card" → POST /api/payment-methods/setup
  → backend: getOrCreateStripeCustomer(userId) → stripe.setupIntents.create()
  → frontend: stripe.confirmCardSetup(clientSecret, { card: CardElement })
  → Stripe atașează PaymentMethod la Customer automat
  → frontend: invalidate cache → lista se reîncarcă

Listare carduri:
  GET /api/payment-methods
  → backend: stripe.paymentMethods.list({ customer, type: 'card' })
  → returnează: id, brand, last4, exp_month, exp_year, isDefault

Ștergere card:
  DELETE /api/payment-methods/:pmId
  → backend: stripe.paymentMethods.detach(pmId)
  → dacă era default: șterge default_payment_method de pe Customer

Card implicit:
  PUT /api/payment-methods/:pmId/default
  → backend: stripe.customers.update(customerId, { invoice_settings: { default_payment_method: pmId } })

Checkout cu card salvat:
  User selectează cardul salvat → paymentMethodId trimis în body la POST /api/orders
  → backend: stripe.paymentIntents.create({ payment_method: pmId, confirm: true, ... })
  → dacă 3DS necesar: returnează clientSecret pentru confirmare pe frontend
  → dacă succes direct: order marcat ca paid
```

### API contracts

#### `POST /api/payment-methods/setup`
Auth: required (client)

**Response `200`:**
```json
{
  "success": true,
  "clientSecret": "seti_xxx_secret_xxx"
}
```

---

#### `GET /api/payment-methods`
Auth: required (client)

**Response `200`:**
```json
{
  "success": true,
  "data": [
    {
      "id": "pm_xxx",
      "brand": "visa",
      "last4": "4242",
      "expMonth": 12,
      "expYear": 2027,
      "isDefault": true
    }
  ]
}
```

---

#### `DELETE /api/payment-methods/:pmId`
Auth: required (client)

**Response `200`:**
```json
{ "success": true }
```

**Error cases:**
- `403` — PaymentMethod nu aparține userului curent
- `404` — PaymentMethod nu există

---

#### `PUT /api/payment-methods/:pmId/default`
Auth: required (client)

**Response `200`:**
```json
{ "success": true }
```

---

#### `POST /api/orders` — modificat
Adaugă câmpul opțional `savedPaymentMethodId` în body:

```json
{
  "items": [...],
  "addressId": "...",
  "paymentMethod": "Card",
  "savedPaymentMethodId": "pm_xxx"
}
```

Dacă `savedPaymentMethodId` e prezent:
- Nu se creează PaymentIntent cu `payment_method_types: ["card"]` generic
- Se creează cu `payment_method: savedPaymentMethodId, confirm: true`
- Dacă necesită 3DS: returnează `clientSecret` pentru confirmare
- Dacă succes instant: returnează `order` fără `clientSecret`

---

### Frontend — component tree

```
pages/Profile/              ← EXISTING (Profile.jsx cu sidebar)
  profileConstants.js       ← MODIFY (+payment-methods în NAV)
  ProfilePaymentMethods/    ← NEW page tab (nested route /profile/payment-methods)

organisms/SavedCardsList/   ← NEW
  molecules/SavedCardItem/  ← NEW (brand icon, last4, expiry, default badge, butoane)
  organisms/AddCardForm/    ← NEW (SetupIntent + CardElement)

UI/checkout/CheckoutStepPayment.jsx   ← MODIFY (afișează carduri salvate ca opțiuni)
UI/checkout/useCheckoutState.js       ← MODIFY (+savedPaymentMethodId în state)
```

### Redux / RTK Query changes

| Type | Name | File | Description |
|------|------|------|-------------|
| RTK endpoint | `useGetPaymentMethodsQuery` | `features/paymentMethods/rtkPaymentMethods.js` | Lista cardurilor salvate |
| RTK endpoint | `useSetupIntentMutation` | `features/paymentMethods/rtkPaymentMethods.js` | Creează SetupIntent |
| RTK endpoint | `useDeletePaymentMethodMutation` | `features/paymentMethods/rtkPaymentMethods.js` | Detach card |
| RTK endpoint | `useSetDefaultPaymentMethodMutation` | `features/paymentMethods/rtkPaymentMethods.js` | Setează default |

### Key types / shapes

```js
// PaymentMethod (returnat de API, nu stocat în MongoDB)
{
  id: string,          // "pm_xxx" — Stripe ID
  brand: string,       // "visa" | "mastercard" | "amex" | "revolut" etc.
  last4: string,       // "4242"
  expMonth: number,    // 12
  expYear: number,     // 2027
  isDefault: boolean,
}

// Register — câmp nou adăugat
{
  stripeCustomerId: string | null,  // "cus_xxx"
}
```

### Helper: getOrCreateStripeCustomer

```js
// controllers/paymentMethods/paymentMethodsService.js
async function getOrCreateStripeCustomer(user) {
  if (user.stripeCustomerId) return user.stripeCustomerId;

  const customer = await stripe.customers.create({
    email: user.email,
    name: user.name,
    metadata: { userId: user._id.toString() },
  });

  await Register.findByIdAndUpdate(user._id, { stripeCustomerId: customer.id });
  return customer.id;
}
```

### Checkout cu card salvat — logică

```js
// controllers/order/order.js — modificat în createOrder
if (savedPaymentMethodId && paymentMethod === "Card") {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amountAfterCredits * 100),
    currency: "ron",
    customer: stripeCustomerId,
    payment_method: savedPaymentMethodId,
    confirm: true,
    return_url: `${process.env.FRONTEND_URL}/cart/checkout`,
    metadata: { orderId: order._id.toString() },
  });

  if (paymentIntent.status === "succeeded") {
    // webhook va marca order ca paid — sau marcăm direct
  } else if (paymentIntent.status === "requires_action") {
    return res.json({ success: true, order, clientSecret: paymentIntent.client_secret });
  }
}
```

### Brand icons

```js
const BRAND_ICON = {
  visa:       "💳 Visa",
  mastercard: "💳 Mastercard",
  amex:       "💳 Amex",
  default:    "💳 Card",
};
// Sau SVG icons per brand (font-awesome / custom)
```

### Edge cases to handle

- [ ] User fără carduri salvate la checkout — afișează direct `CardElement` (comportament actual)
- [ ] Toate cardurile șterse — mesaj „Nu ai carduri salvate" + buton adaugă
- [ ] Card expirat — afișat cu text roșu `Expirat`, buton șterge vizibil
- [ ] 3DS required pe card salvat — `stripe.confirmCardPayment(clientSecret)` pe frontend după redirect
- [ ] `stripeCustomerId` invalid (customer șters din Stripe dashboard) — recreează customer
