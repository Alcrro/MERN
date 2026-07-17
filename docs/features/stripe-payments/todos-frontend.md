# Frontend TODOs: Stripe Payments

> **Last updated:** 2026-07-15
> **Stack:** React 18, RTK Query, Redux Toolkit, React Router v6, plain CSS
> **Conventions:** CLAUDE.md — atomic design, one hook = one action, co-located CSS

---

## Phase 1 — Setup & data layer

> Goal: Stripe SDK instalat, RTK actualizat, `clientSecret` ajunge în componentă.

- [ ] `npm install @stripe/stripe-js @stripe/react-stripe-js` în `frontend/`
- [ ] Adaugă în `.env`:
  ```
  REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_...
  ```
- [ ] Modifică `features/order/rtkOrders.js` → `createOrder` mutation:
  - Returnează acum `{ order, clientSecret? }` — RTK transformă automat, nu e nevoie de `transformResponse`
  - Tag invalidation rămâne `[{ type: "Orders" }]` — neschimbat
- [ ] Verifică în Network tab că `POST /api/orders` cu `paymentMethod: "Card"` returnează `clientSecret`

---

## Phase 2 — Organism CheckoutPayment

> Goal: formular Stripe embedded funcțional, plata procesată end-to-end.

- [ ] Creează `Components/organisms/CheckoutPayment/`:
  - [ ] `CheckoutPayment.jsx`
  - [ ] `CheckoutPayment.css`
  - [ ] `index.js`

- [ ] `CheckoutPayment.jsx` — primește prop `clientSecret` (string):
  - [ ] `loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY)` — apelat o singură dată în afara componentei (nu în render)
  - [ ] Wrappează cu `<Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe' } }}>`
  - [ ] Renderează `<PaymentElement />` (Google Pay / Apple Pay apar automat)
  - [ ] Buton „Plătește acum" — apelează `stripe.confirmPayment({ elements, confirmParams: { return_url: \`${window.location.origin}/orders/${orderId}?payment=success\` }, redirect: "if_required" })`
  - [ ] `useState` local: `isProcessing` (boolean), `errorMessage` (string | null)
  - [ ] Dacă `result.error`: setează `errorMessage`, re-enables butonul
  - [ ] Dacă succes (fără redirect): `navigate(\`/orders/${orderId}?payment=success\`)`
  - [ ] `onReady` callback pe `<PaymentElement>` → ascunde spinner inițial

- [ ] `CheckoutPayment.css`:
  - [ ] `.checkout-payment` — container cu `max-width`, `padding`
  - [ ] `.checkout-payment__error` — mesaj eroare (roșu, `var(--error)` sau fallback)
  - [ ] `.checkout-payment__button` — buton full-width sau stilizat
  - [ ] Dark mode la final: `html[data-theme="dark"] .checkout-payment { }`

---

## Phase 3 — Integrare în checkout flow

> Goal: CheckoutPayment apare la momentul potrivit în fluxul de comandă.

- [ ] Identifică unde se face `createOrder` în frontend (pagina Checkout sau OrderCreate)
- [ ] Modifică flow-ul:
  - [ ] Dacă `paymentMethod === "Card"` și response conține `clientSecret`:
    - [ ] Stochează `{ clientSecret, orderId }` în `useState` local (sau Redux dacă e necesar cross-component)
    - [ ] Afișează `<CheckoutPayment clientSecret={clientSecret} orderId={order._id} />`
    - [ ] Ascunde formularul de checkout inițial
  - [ ] Dacă `paymentMethod === "Ramburs"`: redirect direct la `/orders/${order._id}` (comportament existent)

- [ ] Adaugă ruta în `App.js` dacă e necesară o pagină separată de plată

---

## Phase 4 — Pagina de confirmare order

> Goal: utilizatorul vede statusul plății și detaliile cardului.

- [ ] Modifică `pages/Orders/` (sau organism OrderDetail) pentru a afișa:
  - [ ] Badge `Plătit` / `Neachitat` / `Rambursat` bazat pe `isPaid` și `isRefunded`
  - [ ] Dacă `order.paymentDetails` există:
    - [ ] Brand card: „Visa" / „Mastercard" (capitalize `order.paymentDetails.brand`)
    - [ ] Ultimele cifre: „•••• 4242"
    - [ ] Link „Vezi chitanța" → `order.paymentDetails.receiptUrl` (target `_blank`)
  - [ ] Dacă `?payment=success` în URL și `isPaid` e încă `false`: afișează „Plata se procesează..." cu un spinner mic (webhook poate întârzia 1-2 secunde)

---

## Phase 5 — Polish & edge cases

> Goal: production-ready. Gestionează toate stările, fără regressions.

- [ ] Dark mode pe toate componentele noi
- [ ] Mobile — `<PaymentElement>` e responsive by default; testează la 375px
- [ ] Dacă `clientSecret` e `null` sau lipsă → nu monta `<Elements>` (evita crash Stripe SDK)
- [ ] Butonul „Plătește" e `disabled` cât timp `isProcessing === true`
- [ ] 3DS redirect: după return de la Stripe (URL conține `?payment_intent_client_secret=...`), verifică `stripe.retrievePaymentIntent(clientSecret)` și afișează statusul
- [ ] Elimină orice `console.log` rămas
- [ ] Testează cu card Stripe test: `4242 4242 4242 4242` (succes) și `4000 0000 0000 0002` (refuz)
- [ ] Testează Google Pay / Apple Pay în browser compatibil
- [ ] Ramburs — verifică că flow-ul existent nu e rupt

---

## Files touched

| File | Status | Notes |
|------|--------|-------|
| `features/order/rtkOrders.js` | [ ] | returnează `clientSecret` |
| `Components/organisms/CheckoutPayment/CheckoutPayment.jsx` | [ ] | nou |
| `Components/organisms/CheckoutPayment/CheckoutPayment.css` | [ ] | nou |
| `Components/organisms/CheckoutPayment/index.js` | [ ] | nou |
| `pages/[Checkout sau OrderCreate]/` | [ ] | integrare CheckoutPayment |
| `pages/Orders/` (OrderDetail) | [ ] | afișare paymentDetails + badge |
| `App.js` | [ ] | rută nouă dacă e necesar |
| `.env` | [ ] | REACT_APP_STRIPE_PUBLISHABLE_KEY |
