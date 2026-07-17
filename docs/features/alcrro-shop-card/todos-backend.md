# Backend TODOs: Alcrro Shop Card

> **Last updated:** 2026-07-16
> **Stack:** Node.js, Express, MongoDB/Mongoose
> **Conventions:** controllers în `controllers/[resource]/`, routes în `routes/`

---

## Phase 1 — Models

> Goal: datele pot fi stocate și recuperate corect în MongoDB.

- [x] Creează `models/shopCard/ShopCard.js`
  - [x] Câmpuri: `user`, `cardNumber`, `credits`, `points`, `tier`, `referralCode`, `referredBy`, `hasUsedReferral`
  - [x] Helper static: `generateCardNumber()` → `"ALCRRO-XXXX-XXXX"` (random hex)
  - [x] Helper static: `generateReferralCode()` → 6 char alphanumeric unic
  - [x] Pre-save hook: recalculează `tier` din `points` (standard/silver/gold)
  - [x] Indexuri: `{ user: 1 }` unique, `{ referralCode: 1 }` unique
- [x] Creează `models/shopCard/CardTransaction.js`
  - [x] Câmpuri: `card`, `user`, `type`, `amount`, `description`, `orderId`, `stripePaymentIntentId`
  - [x] Indexuri: `{ user: 1, createdAt: -1 }`, `{ stripePaymentIntentId: 1 }` sparse, `{ orderId: 1 }` sparse
- [x] Adaugă `creditsUsed` și `pointsEarned` în `models/order/Order.js`
- [x] Adaugă `creditsOnly` în `models/product/Product.js`

---

## Phase 2 — Service layer (logică reutilizabilă)

> Goal: logica de business e separată de controller-e.

- [x] Creează `controllers/shopCard/shopCardService.js`
  - [x] `createCardForUser(userId)` — creare card + tranzacție welcome-bonus (50 pct)
  - [x] `awardPoints(userId, orderTotal, orderId)` — calculează puncte cu bonus tier, actualizează card, creează tranzacție
  - [x] `revokePoints(orderId)` — caută tranzacția `points-earned` pentru order, anulează cu tranzacție negativă
  - [x] `applyTierMultiplier(basePoints, tier)` — returnează puncte finale

---

## Phase 3 — Controllers & Routes

> Goal: endpoint-urile funcționează și returnează shape-ul din `tech-spec.md`.

- [x] Creează `controllers/shopCard/shopCard.js`
  - [x] `getMyCard` — GET `/api/shop-card/my` (auth required)
  - [x] `getTransactions` — GET `/api/shop-card/transactions` (paginat, auth required)
  - [x] `topUp` — POST `/api/shop-card/top-up` (crează PaymentIntent Stripe, nu acordă credite)
  - [x] `topUpWebhook` — handler pentru `payment_intent.succeeded` cu metadata `type: "shop-card-topup"`
    - [x] Verifică idempotency pe `stripePaymentIntentId` în `CardTransaction`
    - [x] Atomic: `ShopCard.findOneAndUpdate({ user }, { $inc: { credits: amount } })`
    - [x] Crează tranzacție `credit-purchase`
  - [x] `redeemPoints` — POST `/api/shop-card/redeem-points`
    - [x] Validează: `points >= 10`, `points % 10 === 0`, sold suficient
    - [x] Atomic decrement puncte + increment credite
    - [x] Crează tranzacție `points-redeemed`
  - [x] `applyReferral` — POST `/api/shop-card/referral/apply`
    - [x] Validează: cod există, user nu a folosit referral, nu e propriul cod
    - [x] Acordă 50 pct referit + 100 pct referrer
- [x] Creează `routes/shopCard/shopCard.js`
  - [x] Toate rutele protejate cu middleware `protect`
- [x] Înregistrează router în `server.js`

---

## Phase 4 — Integrare cu fluxurile existente

- [x] `controllers/auth/auth.js` (register) — apelează `createCardForUser(user._id)` după creare user
- [x] `controllers/order/order.js` — la statusul `Delivered`:
  - [x] Apelează `awardPoints(userId, totalPrice, orderId)`
  - [x] Dacă `req.body.creditsToUse > 0`:
    - [x] Validează că `ShopCard.credits >= creditsUsed`
    - [x] Decrementează atomic credite
    - [x] Crează tranzacție `credits-spent`
    - [x] Setează `order.creditsUsed` și `order.pointsEarned`
- [x] `controllers/stripe/stripeWebhook.js` — la refund: apelează `revokePoints(orderId)`

---

## Phase 5 — Auth, guards & edge cases

- [ ] Toate write endpoints au `protect` middleware
- [ ] `topUp`: validare `package` în `["50","100","250","500"]`
- [ ] `redeemPoints`: validare tip și minim 10 puncte
- [ ] `applyReferral`: rate limit (1 dată per user)
- [ ] Nici un endpoint nu returnează câmpul `referredBy` cu datele complete (populate selectiv)
- [ ] Remove `console.log`

---

## Files touched

| File | Status | Notes |
|------|--------|-------|
| `models/shopCard/ShopCard.js` | [ ] | nou |
| `models/shopCard/CardTransaction.js` | [ ] | nou |
| `models/order/Order.js` | [ ] | +creditsUsed, +pointsEarned |
| `models/product/Product.js` | [ ] | +creditsOnly |
| `controllers/shopCard/shopCard.js` | [ ] | nou |
| `controllers/shopCard/shopCardService.js` | [ ] | nou |
| `controllers/auth/auth.js` | [ ] | +createCardForUser la register |
| `controllers/order/order.js` | [ ] | +awardPoints, +revokePoints, +creditsUsed logic |
| `routes/shopCard/shopCard.js` | [ ] | nou |
| `server.js` | [ ] | router înregistrat |
