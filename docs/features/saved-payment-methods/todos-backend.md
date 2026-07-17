# Backend TODOs: Saved Payment Methods

> **Last updated:** 2026-07-16
> **Stack:** Node.js, Express, MongoDB/Mongoose + Stripe SDK
> **Conventions:** controllers în `controllers/[resource]/`, routes în `routes/`

---

## Phase 1 — Model & helper

> Goal: `stripeCustomerId` stocat în DB, helper `getOrCreateStripeCustomer` funcțional.

- [x] Adaugă `stripeCustomerId: { type: String, default: null }` în `models/auth/register.js`
- [x] Creează `controllers/paymentMethods/paymentMethodsService.js`
  - [x] `getOrCreateStripeCustomer(user)` — dacă `user.stripeCustomerId` există: return direct; altfel: `stripe.customers.create({ email, name, metadata: { userId } })` + update Register

---

## Phase 2 — Controller & routes

> Goal: toate endpoint-urile funcționează și returnează shape-ul din `tech-spec.md`.

- [x] Creează `controllers/paymentMethods/paymentMethods.js`
  - [x] `setupIntent` — POST `/api/payment-methods/setup`
    - [x] Apelează `getOrCreateStripeCustomer(req.user)`
    - [x] `stripe.setupIntents.create({ customer, payment_method_types: ['card'] })`
    - [x] Returnează `{ clientSecret }`
  - [x] `listPaymentMethods` — GET `/api/payment-methods`
    - [x] Apelează `getOrCreateStripeCustomer(req.user)`
    - [x] `stripe.paymentMethods.list({ customer, type: 'card' })`
    - [x] Fetch customer pentru `invoice_settings.default_payment_method`
    - [x] Mapează la shape `{ id, brand, last4, expMonth, expYear, isDefault }`
  - [x] `deletePaymentMethod` — DELETE `/api/payment-methods/:pmId`
    - [x] Verifică că PM aparține customerului curent (`pm.customer === stripeCustomerId`)
    - [x] `stripe.paymentMethods.detach(pmId)`
    - [x] Dacă era default: `stripe.customers.update(customerId, { invoice_settings: { default_payment_method: '' } })`
  - [x] `setDefaultPaymentMethod` — PUT `/api/payment-methods/:pmId/default`
    - [x] Verifică că PM aparține customerului curent
    - [x] `stripe.customers.update(customerId, { invoice_settings: { default_payment_method: pmId } })`
- [x] Creează `routes/paymentMethods/paymentMethods.js`
  - [x] Toate rutele protejate cu `protect`
- [x] Înregistrează router în `server.js`: `server.use("/api/payment-methods", ...)`

---

## Phase 3 — Integrare checkout

> Goal: comanda poate fi plasată cu un card salvat, fără `CardElement` nou.

- [x] Modifică `controllers/order/order.js` — `createOrder`
  - [x] Extrage `savedPaymentMethodId` din `req.body`
  - [x] Dacă `savedPaymentMethodId` și `paymentMethod === "Card"`:
    - [x] Obține `stripeCustomerId` al userului
    - [x] `stripe.paymentIntents.create({ customer, payment_method: savedPaymentMethodId, confirm: true, return_url, metadata: { orderId } })`
    - [x] Dacă `status === "succeeded"`: returnează order fără clientSecret
    - [x] Dacă `status === "requires_action"`: returnează `{ order, clientSecret }` pentru 3DS

---

## Phase 4 — Guards & edge cases

- [ ] `deletePaymentMethod`: verificare că PM aparține userului (`403` dacă nu)
- [ ] `setDefaultPaymentMethod`: aceeași verificare
- [ ] `listPaymentMethods`: dacă `stripeCustomerId` invalid (customer șters) — recreează customer și returnează `[]`
- [ ] `createOrder` cu `savedPaymentMethodId` și `creditsUsed` = totalPrice — skip Stripe (deja gestionat)
- [ ] Remove `console.log`

---

## Files touched

| File | Status | Notes |
|------|--------|-------|
| `models/auth/register.js` | [x] | +stripeCustomerId |
| `controllers/paymentMethods/paymentMethodsService.js` | [x] | nou |
| `controllers/paymentMethods/paymentMethods.js` | [x] | nou |
| `routes/paymentMethods/paymentMethods.js` | [x] | nou |
| `controllers/order/order.js` | [x] | +savedPaymentMethodId logic |
| `server.js` | [x] | +router payment-methods |
