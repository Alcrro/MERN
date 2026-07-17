# Frontend TODOs: Saved Payment Methods

> **Last updated:** 2026-07-16
> **Stack:** React 18, RTK Query, Redux Toolkit, React Router v6, plain CSS + Stripe.js
> **Conventions:** CLAUDE.md — atomic design, un hook = o acțiune, CSS co-located

---

## Phase 1 — Data layer

> Goal: datele vin de la API. Niciun UI încă.

- [x] Creează `features/paymentMethods/rtkPaymentMethods.js`
  - [x] `useGetPaymentMethodsQuery` → `GET /api/payment-methods`
  - [x] `useSetupIntentMutation` → `POST /api/payment-methods/setup`
  - [x] `useDeletePaymentMethodMutation` → `DELETE /api/payment-methods/:pmId`
  - [x] `useSetDefaultPaymentMethodMutation` → `PUT /api/payment-methods/:pmId/default`
- [x] Înregistrează `paymentMethodsApi` în `store.js`
- [ ] Verifică în Network tab că `GET /api/payment-methods` returnează `[]` (user fără carduri)

---

## Phase 2 — Molecules

- [x] Creează `molecules/SavedCardItem/`
  - [x] `SavedCardItem.jsx` — afișează: brand (text icon), `•••• last4`, `exp MM/YY`, badge „Implicit" dacă default, buton „Implicit" dacă nu e, buton „Șterge"
  - [x] `SavedCardItem.css` — card orizontal, brand colorat (Visa=albastru, Mastercard=roșu/portocaliu), card expirat = border roșu + text „Expirat"
  - [x] `index.js`

---

## Phase 3 — Organisms

- [x] Creează `organisms/AddCardForm/`
  - [x] `AddCardForm.jsx`
    - [x] `useSetupIntentMutation` → obține `clientSecret`
    - [x] Stripe `<CardElement>` (refolosire `@stripe/react-stripe-js` deja instalat)
    - [x] `stripe.confirmCardSetup(clientSecret, { payment_method: { card: CardElement } })`
    - [x] La succes: callback `onSuccess` + refetch în parent
    - [x] Checkbox opțional „Setează ca implicit"
  - [x] `AddCardForm.css`
  - [x] `index.js`
- [x] Creează `organisms/SavedCardsList/`
  - [x] `SavedCardsList.jsx` — listează `SavedCardItem` + buton „+ Adaugă card" care togglează `AddCardForm`
  - [x] Loading state, empty state „Nu ai carduri salvate"
  - [x] `SavedCardsList.css`
  - [x] `index.js`

---

## Phase 4 — Page tab în profil

- [x] Creează `Components/profile/ProfilePaymentMethods/ProfilePaymentMethods.jsx`
  - [x] Heading „Cardurile mele", `SavedCardsList`
  - [x] Maxim 30 linii (compoziție pură)
- [x] Adaugă în `profileConstants.js`: `{ to: "payment-methods", label: "Cardurile mele", icon: "💳" }`
- [x] Adaugă rută în `App.js`: `<Route path="payment-methods" element={<ProfilePaymentMethods />} />`

---

## Phase 5 — Integrare checkout

- [x] Modifică `CheckoutStepPayment.jsx`
  - [x] `useGetPaymentMethodsQuery` la mount
  - [x] Dacă există carduri salvate: afișează listă radio + opțiunea „Card nou"
  - [x] Card selectat → `savedPaymentMethodId` în state
  - [x] Dacă „Card nou" selectat sau 0 carduri salvate → afișează `CardElement` (comportament actual)
- [x] Modifică `useCheckoutState.js`
  - [x] Adaugă `savedPaymentMethodId: null` în state
  - [x] Trimite `savedPaymentMethodId` în body la `createOrder`
  - [x] Dacă response nu conține `clientSecret` (plată directă reușită): redirect la success

---

## Phase 6 — Polish

- [x] Dark mode la finalul tuturor CSS-urilor noi
- [x] Mobile — `SavedCardItem` stivuit vertical la 480px
- [x] Card expirat: `exp_year < currentYear || (exp_year === currentYear && exp_month < currentMonth)`
- [x] `aria-label` pe butoanele „Șterge" și „Implicit" (includ last4 pentru context: „Șterge cardul Visa 4242")
- [ ] `npm run build` — zero warnings

---

## Files touched

| File | Status | Notes |
|------|--------|-------|
| `features/paymentMethods/rtkPaymentMethods.js` | [x] | nou |
| `app/store.js` | [x] | +paymentMethodsApi |
| `molecules/SavedCardItem/` | [ ] | nou |
| `organisms/AddCardForm/` | [ ] | nou |
| `organisms/SavedCardsList/` | [ ] | nou |
| `Components/profile/ProfilePaymentMethods/` | [ ] | nou |
| `Components/profile/profileConstants.js` | [ ] | +payment-methods în NAV |
| `App.js` | [ ] | +rută /profile/payment-methods |
| `UI/checkout/CheckoutStepPayment.jsx` | [x] | +carduri salvate ca opțiuni |
| `UI/checkout/useCheckoutState.js` | [x] | +savedPaymentMethodId |
