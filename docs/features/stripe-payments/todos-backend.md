# Backend TODOs: Stripe Payments

> **Last updated:** 2026-07-15
> **Stack:** Node.js, Express, MongoDB/Mongoose, Stripe Node SDK
> **Conventions:** controllers în `controllers/[resource]/`, routes în `routes/`

---

## Phase 1 — Setup & modele

> Goal: Stripe SDK inițializat, modele actualizate, baza de date pregătită.

- [x] `npm install stripe` în `backend/`
- [ ] Adaugă în `.env`:
  ```
  STRIPE_SECRET_KEY=sk_test_...
  STRIPE_WEBHOOK_SECRET=whsec_...
  ```
- [x] Creează `backend/utils/stripe.js` — singleton Stripe
- [x] Adaugă câmpurile noi la `models/order/Order.js` (vezi `database.md → Changes to existing`)
  - [x] `stripePaymentIntentId`, `isRefunded`, `refundedAt`, `paymentDetails`
  - [x] Index sparse pe `stripePaymentIntentId`
- [x] Creează `models/stripe/StripeEvent.js` (vezi `database.md → New collection`)
  - [x] Schema cu `eventId` (unique), `type`, `orderId`, `processedAt`
  - [x] Index explicit pe `eventId` (unique) și `orderId`
- [ ] Verifică în MongoDB Compass că ambele colecții există și indexurile sunt create

---

## Phase 2 — Modifică createOrder

> Goal: `POST /api/orders` cu `paymentMethod: "Card"` returnează `clientSecret`.

- [x] În `controllers/order/order.js` → `createOrder`:
  - [x] Importă `stripe` din `utils/stripe.js`
  - [x] După `commitTransaction()`, dacă `paymentMethod === "Card"`:
    - [x] Apelează `stripe.paymentIntents.create(...)` cu fallback cancel dacă Stripe eșuează
    - [x] Adaugă `stripePaymentIntentId` pe order și salvează
    - [x] Returnează `{ success: true, order, clientSecret: paymentIntent.client_secret }`
  - [x] Dacă `paymentMethod !== "Card"`: returnează `{ success: true, order }` (comportament existent)
- [ ] Testează cu Postman:
  - `POST /api/orders` cu `paymentMethod: "Card"` → response conține `clientSecret`
  - `POST /api/orders` cu `paymentMethod: "Ramburs"` → response fără `clientSecret` (nemodificat)

---

## Phase 3 — Webhook handler

> Goal: Stripe poate notifica backend-ul; idempotency garantată; order actualizat corect.

- [x] Creează `controllers/stripe/stripeWebhook.js`:
  - [x] Verificare semnătură + idempotency (StripeEvent.create cu E11000 catch)
  - [x] Handlers: succeeded, payment_failed, canceled, charge.refunded
  - [x] Suport ambele Stripe API versions (charges.data[0] și latest_charge)
- [x] Creează `routes/stripe/stripe.js` cu `express.raw()` pe webhook
- [x] Înregistrează ruta în `server.js` **înainte** de `express.json()`

- [ ] Testează cu Stripe CLI:
  ```bash
  stripe listen --forward-to localhost:5000/api/stripe/webhook
  stripe trigger payment_intent.succeeded
  ```
  - [ ] Verifică că order e actualizat în DB
  - [ ] Trimite același event de 2 ori → a doua oară ignorat (idempotency OK)

---

## Phase 4 — Config endpoint (opțional)

> Goal: publishableKey disponibil din backend (alternativă la REACT_APP_STRIPE_PUBLISHABLE_KEY).

- [x] `getStripeConfig` implementat în `controllers/stripe/stripeWebhook.js`
- [x] Ruta `GET /config` adăugată în `routes/stripe/stripe.js`

---

## Phase 5 — Guards & securitate

> Goal: production-ready. Nicio vulnerabilitate, niciun console.log.

- [ ] Webhook-ul NU are `protect` middleware (Stripe nu trimite cookie auth) — verificarea e prin semnătură
- [ ] Dacă `constructEvent` aruncă → return `res.status(400).send('Webhook signature failed')`
- [ ] Dacă `order` nu e găsit în webhook handler → log warning, **nu** arunca eroare (return 200, altfel Stripe retrimite)
- [ ] Elimină orice `console.log` rămas
- [ ] `STRIPE_SECRET_KEY` și `STRIPE_WEBHOOK_SECRET` nu apar niciodată în response sau logs

---

## Files touched

| File | Status | Notes |
|------|--------|-------|
| `backend/utils/stripe.js` | [x] | singleton Stripe SDK |
| `backend/models/order/Order.js` | [x] | câmpuri stripe + index |
| `backend/models/stripe/StripeEvent.js` | [x] | colecție nouă idempotency |
| `backend/controllers/order/order.js` | [x] | createOrder modificat |
| `backend/controllers/stripe/stripeWebhook.js` | [x] | webhook + config handler |
| `backend/routes/stripe/stripe.js` | [x] | rute stripe |
| `backend/server.js` | [x] | înregistrare rută stripe ÎNAINTE de express.json() |
| `.env` | [ ] | STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET — adaugă manual |
