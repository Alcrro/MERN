# Tech Spec: Alcrro Shop Card

> **Status:** `Draft`
> **Author:** Alexandru Roventa
> **Last updated:** 2026-07-16
> **Related PRD:** [PRD.md](./PRD.md)

---

## Overview

### What we're building

Un sistem de card de loialitate hibrid: wallet de credite (1 credit = 1 RON) + puncte de fidelitate (10 puncte = 1 credit). Cardul este creat automat la înregistrare, vizibil pe pagina `/account/my-card` și cu un widget în navbar. Creditele se cumpără prin Stripe; punctele se câștigă automat la comenzi finalizate.

### Architecture decision log

| Decision | Options considered | Why we chose this |
|----------|--------------------|-------------------|
| Card creat la register sau lazy | la register / la prima vizită | La register: nu există stare „user fără card"; simplifică orice query ulterior |
| Tranzacții în ShopCard sau colecție separată | embedded array vs `CardTransaction` | Colecție separată: scalabilitate (sute de tranzacții/user), interogare independentă |
| Puncte câștigate la `Delivered` sau `Paid` | la plată / la livrare | La `Delivered`: evită puncte pentru comenzi returnate / refundate |
| Top-up credite: Stripe Checkout sau PaymentIntent | Checkout Session / PaymentIntent | PaymentIntent: deja integrat, același flow ca la orders |
| Credite la checkout: Redux local sau backend validat | client-only / server-validated | Server-validated: soldul trebuie verificat și decrementat atomic pe backend |

### Risks & trade-offs

- **Risk:** Race condition la decrementarea soldului (două cereri simultane) — **Mitigation:** `findOneAndUpdate` cu `$inc` atomic în MongoDB
- **Risk:** Puncte acordate pentru comenzi ulterior refundate — **Mitigation:** La `isRefunded: true` se revocă tranzacția de puncte corespunzătoare
- **Risk:** Stripe webhook ratat pentru top-up — **Mitigation:** Același pattern ca `StripeEvent` existent — idempotency key pe `stripePaymentIntentId`

---

## Implementation

### Data flow

```
Top-up credite:
  User selectează pachet → POST /api/shop-card/top-up → PaymentIntent Stripe
  → Stripe webhook (payment_intent.succeeded) → POST /api/shop-card/webhook
  → ShopCard.credits += amount, CardTransaction creat

Câștig puncte:
  Order status → "Delivered" → controller order
  → calculeaza puncte (floor(totalPrice * 0.1) * tierMultiplier)
  → ShopCard.points += pts, CardTransaction creat, tier recalculat

Plată cu credite la checkout:
  User aplică credite → creditsToUse trimis în body la POST /api/orders
  → backend validează ShopCard.credits >= creditsToUse
  → dacă OK: ShopCard.credits -= creditsToUse, Order.creditsUsed = creditsToUse
  → diferența (totalPrice - creditsToUse) procesată prin Stripe sau Ramburs
```

### API contracts

#### `GET /api/shop-card/my`
Auth: required (client)

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "_id": "string",
    "cardNumber": "ALCRRO-XXXX-XXXX",
    "credits": 95.0,
    "points": 230,
    "tier": "silver",
    "referralCode": "ABC123",
    "createdAt": "ISO date"
  }
}
```

---

#### `GET /api/shop-card/transactions`
Auth: required (client)

**Query params:**
| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `page` | `number` | no | default 1 |
| `limit` | `number` | no | default 20 |

**Response `200`:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "string",
      "type": "points-earned",
      "amount": 20,
      "description": "Comandă #ABC - 200 RON",
      "createdAt": "ISO date"
    }
  ]
}
```

---

#### `POST /api/shop-card/top-up`
Auth: required (client)

**Body:**
```json
{ "package": "100" }
```
Valori acceptate pentru `package`: `"50"` | `"100"` | `"250"` | `"500"`

**Response `200`:**
```json
{
  "success": true,
  "clientSecret": "pi_xxx_secret_xxx",
  "amount": 95
}
```
`amount` = suma în RON care se plătește (cu discount aplicat)

---

#### `POST /api/shop-card/redeem-points`
Auth: required (client)

**Body:**
```json
{ "points": 50 }
```
Minim 10 puncte. Conversia: `points / 10` credite.

**Response `200`:**
```json
{
  "success": true,
  "creditsAdded": 5,
  "newCredits": 100,
  "newPoints": 180
}
```

**Error cases:**
- `400` — `points` nu e multiplu de 10 sau < 10
- `400` — sold puncte insuficient

---

#### `POST /api/shop-card/referral/apply`
Auth: required (client)

**Body:**
```json
{ "referralCode": "ABC123" }
```

**Response `200`:**
```json
{ "success": true, "bonusPoints": 50 }
```

**Error cases:**
- `400` — codul nu există
- `400` — userul a aplicat deja un referral
- `400` — userul încearcă propriul cod

---

### Frontend — component tree

```
pages/ShopCard/ShopCard.jsx                    ← NEW (zero logic, compoziție)
  organisms/ShopCardHero/                      ← NEW (cardul animat + sold)
    molecules/AlcrroCard/                      ← NEW (design card fizic animat)
    molecules/TierBadge/                       ← NEW (Standard/Silver/Gold cu culori)
  organisms/CreditPackages/                    ← NEW (4 pachete Stripe)
    molecules/CreditPackageCard/               ← NEW
  organisms/CardTransactions/                  ← NEW (tabel istoric)
  organisms/PointsConverter/                   ← NEW (input conversie puncte → credite)

atoms/PointsBadge/                             ← NEW (widget navbar: ★ 1.250 pct)
  → adăugat în NavbarAux.jsx                  ← MODIFY

Components/UI/checkout/CheckoutStepPayment.jsx ← MODIFY (opțiune "Plătește cu credite")
Components/UI/checkout/useCheckoutState.js     ← MODIFY (creditsToUse în state)
```

### Redux / RTK Query changes

| Type | Name | File | Description |
|------|------|------|-------------|
| RTK endpoint | `useGetMyCardQuery` | `features/shopCard/rtkShopCard.js` | Fetch card curent user |
| RTK endpoint | `useGetCardTransactionsQuery` | `features/shopCard/rtkShopCard.js` | Istoric tranzacții paginated |
| RTK endpoint | `useTopUpCreditsMutation` | `features/shopCard/rtkShopCard.js` | Inițiază Stripe PaymentIntent pentru top-up |
| RTK endpoint | `useRedeemPointsMutation` | `features/shopCard/rtkShopCard.js` | Convertește puncte în credite |
| RTK endpoint | `useApplyReferralMutation` | `features/shopCard/rtkShopCard.js` | Aplică cod referral |
| Redux slice | `shopCardSlice` | `features/shopCard/shopCardSlice.js` | `creditsToUse` la checkout (local state) |

### Key types / shapes

```js
// ShopCard
{
  _id: string,
  user: string,           // ref Register
  cardNumber: string,     // ex: "ALCRRO-4A2B-9F3C"
  credits: number,        // 1 credit = 1 RON
  points: number,         // 10 points = 1 credit
  tier: "standard" | "silver" | "gold",
  referralCode: string,   // unic per user
  referredBy: string | null,  // userId care a trimis codul
  hasUsedReferral: boolean,
  createdAt: Date,
}

// CardTransaction
{
  _id: string,
  card: string,           // ref ShopCard
  user: string,           // ref Register (pentru index)
  type: "credit-purchase" | "points-earned" | "points-redeemed"
      | "credits-spent" | "referral-bonus" | "welcome-bonus",
  amount: number,         // pozitiv = câștig, negativ = cheltuire
  description: string,
  orderId: string | null,
  stripePaymentIntentId: string | null,
  createdAt: Date,
}
```

### Tier logic

```js
const TIER_THRESHOLDS = { standard: 0, silver: 500, gold: 2000 };
const TIER_MULTIPLIERS = { standard: 1.0, silver: 1.1, gold: 1.25 };

function calculateTier(totalPoints) {
  if (totalPoints >= 2000) return "gold";
  if (totalPoints >= 500)  return "silver";
  return "standard";
}

function calculatePointsEarned(orderTotal, tier) {
  const base = Math.floor(orderTotal * 0.1);
  return Math.floor(base * TIER_MULTIPLIERS[tier]);
}
```

### Credit packages

```js
const CREDIT_PACKAGES = {
  "50":  { credits: 50,  priceRON: 50  },  // 0% discount
  "100": { credits: 100, priceRON: 95  },  // -5%
  "250": { credits: 250, priceRON: 220 },  // -12%
  "500": { credits: 500, priceRON: 400 },  // -20%
};
```

### Checkout cu credite

```
CheckoutStepPayment:
  - Dacă userul are credits > 0: afișează toggle "Folosește credite"
  - Input: câte credite aplici (1 – min(credits, totalPrice))
  - totalDePlătit = totalPrice - creditsToUse
  - Dacă totalDePlătit === 0: skip Stripe, POST direct
  - Dacă totalDePlătit > 0: PaymentIntent pentru diferență
```

### Edge cases to handle

- [ ] User fără card (creat la register, deci imposibil în practică — log error dacă apare)
- [ ] Sold credite 0 — ascunde secțiunea „plătește cu credite", nu o dezactiva
- [ ] Pachet top-up: Stripe eșuează — creditele NU se adaugă până la webhook confirmat
- [ ] Order refundat — revocă tranzacția de puncte, recalculează tier
- [ ] Mobile — cardul animat are fallback static dacă `prefers-reduced-motion`
