# Frontend TODOs: Alcrro Shop Card

> **Last updated:** 2026-07-16
> **Stack:** React 18, RTK Query, Redux Toolkit, React Router v6, plain CSS
> **Conventions:** CLAUDE.md — atomic design, un hook = o acțiune, CSS co-located

---

## Phase 1 — Data layer

> Goal: datele cardului curg de la API. Niciun UI încă.

- [x] Creează `features/shopCard/rtkShopCard.js`
  - [x] `useGetMyCardQuery` → `GET /api/shop-card/my`
  - [x] `useGetCardTransactionsQuery` → `GET /api/shop-card/transactions?page=&limit=`
  - [x] `useTopUpCreditsMutation` → `POST /api/shop-card/top-up`
  - [x] `useRedeemPointsMutation` → `POST /api/shop-card/redeem-points`
  - [x] `useApplyReferralMutation` → `POST /api/shop-card/referral/apply`
- [x] Creează `features/shopCard/shopCardSlice.js`
  - [x] State: `creditsToUse: 0` (folosit la checkout)
  - [x] Actions: `setCreditsToUse(amount)`, `clearCreditsToUse()`
- [x] Înregistrează reducer în `store.js`
- [ ] Verifică în Network tab că `GET /api/shop-card/my` returnează shape-ul din tech-spec

---

## Phase 2 — Atoms

- [x] Creează `atoms/PointsBadge/`
  - [x] `PointsBadge.jsx` — afișează `★ {points} pct`
  - [x] `PointsBadge.css` — badge mic, inline cu navbar
  - [x] `index.js`

---

## Phase 3 — Molecules

- [x] Creează `molecules/AlcrroCard/`
  - [x] `AlcrroCard.jsx`
  - [x] `AlcrroCard.css` — gradient per tier, hover lift, prefers-reduced-motion
  - [x] `index.js`
- [x] Creează `molecules/TierBadge/`
  - [x] `TierBadge.jsx`
  - [x] `TierBadge.css`
  - [x] `index.js`
- [x] Creează `molecules/CreditPackageCard/`
  - [x] `CreditPackageCard.jsx`
  - [x] `CreditPackageCard.css`
  - [x] `index.js`

---

## Phase 4 — Organisms

- [x] Creează `organisms/ShopCardHero/`
  - [x] `ShopCardHero.jsx` — AlcrroCard + TierBadge + stats + progress bar
  - [x] `ShopCardHero.css`
  - [x] `index.js`
- [x] Creează `organisms/CreditPackages/`
  - [x] `CreditPackages.jsx` — grid 4 pachete + inline Stripe checkout
  - [x] `CreditPackages.css`
  - [x] `index.js`
- [x] Creează `organisms/PointsConverter/`
  - [x] `PointsConverter.jsx`
  - [x] `PointsConverter.css`
  - [x] `index.js`
- [x] Creează `organisms/CardTransactions/`
  - [x] `CardTransactions.jsx` — paginare, iconițe, sume colorate
  - [x] `CardTransactions.css`
  - [x] `index.js`
- [x] Creează `organisms/ReferralPanel/`
  - [x] `ReferralPanel.jsx`
  - [x] `ReferralPanel.css`
  - [x] `index.js`

---

## Phase 5 — Page & routing

- [x] Creează `pages/ShopCard/ShopCard.jsx`
  - [x] Compoziție pură: ShopCardHero, CreditPackages, PointsConverter, CardTransactions, ReferralPanel
  - [x] 36 linii JSX (sub limita de 60)
- [x] Adaugă ruta în `App.js`: `/account/my-card`
- [x] Adaugă `PointsBadge` în `NavbarAux.jsx`

---

## Phase 6 — Integrare checkout cu credite

- [ ] Modifică `CheckoutStepPayment.jsx`
  - [ ] Dacă `myCard.credits > 0`: afișează secțiunea „Folosește credite"
  - [ ] Slider/input: 0 – min(credits, totalPrice) credite
  - [ ] Preview: „Total de plătit: X RON (Y credite + Z RON card)"
  - [ ] Dacă total = 0: buton „Finalizează (fără card)"
- [ ] Modifică `useCheckoutState.js`
  - [ ] Adaugă `creditsToUse` în state
  - [ ] Trimite `creditsToUse` în body la submit order
- [ ] Modifică `CheckoutStepConfirm.jsx`
  - [ ] Afișează linia „Credite aplicate: -X RON" în sumar

---

## Phase 7 — Polish & edge cases

- [x] Dark mode — overrides adăugate în toate CSS-urile noi
- [x] Mobile — AlcrroCard 100% width la 480px, grid pachete responsive, form referral vertical
- [x] Accessibility — `aria-label` pe PointsBadge, copy button, paginare; `aria-live` pe pagina curentă
- [x] Stare goală: tranzacții „Nu ai nicio tranzacție încă"
- [x] Loading state pe ShopCard page
- [x] `useGetMyCardQuery` refetch după top-up succes
- [x] CSS — BEM complet, `#fff` doar pe text alb/fundal colorat, verde/roșu cu dark override
- [x] Zero `console.log`
- [x] `npm run build` — zero erori

---

## Files touched

| File | Status | Notes |
|------|--------|-------|
| `features/shopCard/rtkShopCard.js` | [ ] | nou |
| `features/shopCard/shopCardSlice.js` | [ ] | nou |
| `atoms/PointsBadge/` | [ ] | nou |
| `molecules/AlcrroCard/` | [ ] | nou |
| `molecules/TierBadge/` | [ ] | nou |
| `molecules/CreditPackageCard/` | [ ] | nou |
| `organisms/ShopCardHero/` | [ ] | nou |
| `organisms/CreditPackages/` | [ ] | nou |
| `organisms/PointsConverter/` | [ ] | nou |
| `organisms/CardTransactions/` | [ ] | nou |
| `organisms/ReferralPanel/` | [ ] | nou |
| `pages/ShopCard/ShopCard.jsx` | [ ] | nou |
| `App.js` | [ ] | +rută /account/my-card |
| `nav/navbar-aux/NavbarAux.jsx` | [ ] | +PointsBadge |
| `UI/checkout/CheckoutStepPayment.jsx` | [ ] | +secțiune credite |
| `UI/checkout/useCheckoutState.js` | [ ] | +creditsToUse |
| `UI/checkout/CheckoutStepConfirm.jsx` | [ ] | +linie credite în sumar |
