# Frontend TODOs: Checkout Payment

> **Last updated:** 2026-07-16
> **Stack:** React 18, RTK Query, Redux Toolkit, React Router v6, plain CSS
> **Conventions:** CLAUDE.md — atomic design, one hook = one action, co-located CSS

---

## Phase 1 — Setup & data layer

> Goal: eligibilitatea ratelor e detectată din coș, starea de plată e extinsă în useCheckoutState.

- [x] Adaugă selector `selectCartHasInstallments` în `features/product/addToCart/addToCartSlice.js`
  - returnează `true` dacă cel puțin un item din coș are `installmentOptions.length > 0`
- [x] Creează `hooks/useCheckoutEligibility.js`
  - folosește `selectCartHasInstallments` și returnează `{ isInstallmentEligible: boolean }`
- [x] Extinde `useCheckoutState.js` cu câmpuri noi:
  - `paymentPath: "full" | "installments"` (default: `"full"`)
  - `installmentPlan: { bank: "", months: null, monthlyAmount: null }` (default: `null`)
  - resetează `installmentPlan` când `paymentPath` revine la `"full"`
- [x] Adaugă `INSTALLMENT_BANKS` și `INSTALLMENT_MONTHS` în `src/utils/constants.js`
- [ ] Verifică în consolă: `selectCartHasInstallments` returnează corect pentru un coș cu/fără rate

---

## Phase 2 — Core UI

> Goal: Step 3 funcționează end-to-end cu ambele căi de plată.

- [x] Creează `molecules/PaymentPathSelector/`
  - [x] `PaymentPathSelector.jsx` — două card-uri radio: „Plată integrală" / „Rate fără dobândă"
  - [x] `PaymentPathSelector.css`
  - [x] `index.js`
  - Props: `{ value, onChange, isInstallmentEligible }`
  - Dacă `!isInstallmentEligible` → nu randează cardul „Rate"
- [x] Creează `molecules/InstallmentPlanForm/`
  - [x] `InstallmentPlanForm.jsx`
  - [x] `InstallmentPlanForm.css`
  - [x] `index.js`
  - Props: `{ plan, onPlanChange, totalCart }`
- [x] Modifică `UI/checkout/CheckoutStepPayment.jsx`
- [x] Extinde body-ul din `useCreateOrderMutation` în `rtkOrders.js` (în useCheckoutState)

---

## Phase 3 — Polish & edge cases

> Goal: production-ready.

- [x] Dark mode — `html[data-theme="dark"]` overrides în `PaymentPathSelector.css` și `InstallmentPlanForm.css`
- [x] Mobile — `InstallmentPlanForm` butoane nr. rate în grid 2×2 sub 480px
- [x] Recalculează `monthlyAmount` la submit din `cartItems` (total fresh, nu cached)
- [x] Reset `installmentPlan` la `null` când `paymentPath` revine la `"full"` (în `setPaymentPath`)
- [x] Accesibilitate — `role="radiogroup"`, `aria-label`, `aria-pressed`, `type="button"`
- [x] CSS — BEM: `.pps__card`, `.ipf__chip`, `.ipf__preview`
- [x] `ProfileOrders.jsx` — badge „6× BT" + dark mode `.po-item__rate`
- [x] Zero `console.log`
- [x] `npm run build` — zero warnings noi

---

## Files touched

| File | Status | Notes |
|------|--------|-------|
| `features/product/addToCart/addToCartSlice.js` | [x] | selector nou |
| `hooks/useCheckoutEligibility.js` | [x] | fișier nou |
| `UI/checkout/useCheckoutState.js` | [x] | paymentPath + installmentPlan |
| `UI/checkout/Checkout.jsx` | [x] | canAdvance + props noi |
| `utils/constants.js` | [x] | INSTALLMENT_BANKS, INSTALLMENT_MONTHS |
| `molecules/PaymentPathSelector/` | [x] | folder nou |
| `molecules/InstallmentPlanForm/` | [x] | folder nou |
| `UI/checkout/CheckoutStepPayment.jsx` | [x] | refactored |
| `UI/checkout/checkout.css` | [x] | .ck-pay-methods |
| `profile/ProfileOrders/ProfileOrders.jsx` | [x] | afișare plan rate |
| `profile/ProfileOrders/ProfileOrders.css` | [x] | .po-item__rate + dark mode |
