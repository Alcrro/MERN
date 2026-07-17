# Tech Spec: Checkout Payment — Opțiunea A

> **Status:** `Draft`
> **Author:** Alexandru Roventa
> **Last updated:** 2026-07-16
> **Related PRD:** [PRD.md](./PRD.md)

---

## Overview

### What we're building

Înlocuim `CheckoutStepPayment.jsx` (simplu, 2 opțiuni plate) cu un step de plată cu două căi distincte: **Plată integrală** (Card / Ramburs) și **Rate fără dobândă** (bancă + nr. rate). Eligibilitatea pentru rate se determină pe baza coșului Redux: dacă cel puțin un produs are `installmentOptions`, calea „Rate" apare. Alegerea clientului se persistă în `useCheckoutState.js` și se trimite la backend pe `POST /api/orders`, care salvează `installmentPlan` pe document.

### Architecture decision log

| Decision | Options considered | Why we chose this |
|----------|--------------------|-------------------|
| Detecție eligibilitate rate | Backend query vs. date din coș Redux | Coșul e deja în Redux cu toate câmpurile; nu e nevoie de un call extra |
| Stare selecție plată | useState local vs. useCheckoutState | useCheckoutState gestionează deja adresa și livrarea — consistență |
| Bănci acreditate | Config hardcodat vs. colecție DB | Băncile nu se schimbă des; hardcodat în constants.js e suficient |
| Suma lunară | Calculat pe frontend vs. returnat de backend | Calcul pur (totalCoș / nrRate), nu necesită round-trip |

### Risks & trade-offs

- **Risk:** Produse fără `installmentOptions` în DB existente — **Mitigation:** Fallback: dacă `installmentOptions` lipsește sau e `[]`, produsul e tratat ca non-eligibil; UI ascunde calea „Rate"
- **Risk:** Clientul schimbă cantitatea în coș după ce a selectat rate — **Mitigation:** `monthlyAmount` se recalculează reactiv din `totalCoș` Redux

---

## Implementation

### Data flow

```
Coș Redux (items + installmentOptions)
  → useCheckoutEligibility()          ← detectează dacă coșul e rate-eligible
  → CheckoutStepPayment (MODIFIED)
      → PaymentPathSelector            ← NEW molecule: toggle Integrală / Rate
      → InstallmentPlanForm            ← NEW molecule: bancă + nr. rate (condiționat)
      → suma lunară (calcul local)
  → useCheckoutState.js (MODIFIED)    ← adaugă paymentPath + installmentPlan
  → POST /api/orders                  ← body include installmentPlan dacă e cazul
  → Order model (MODIFIED)            ← câmp nou installmentPlan
```

### API contracts

#### `POST /api/orders` — MODIFICAT

**Request body (existent + câmpuri noi):**
```json
{
  "items": [...],
  "deliveryAddress": { ... },
  "paymentMethod": "Card",
  "installmentPlan": {
    "bank": "BT",
    "months": 6,
    "monthlyAmount": 1493.33
  }
}
```

`installmentPlan` este **opțional**. Dacă `paymentMethod` este `"Ramburs"` și `installmentPlan` este prezent → backend returnează `400`.

**Response `200`:**
```json
{
  "success": true,
  "order": {
    "_id": "...",
    "paymentMethod": "Card",
    "installmentPlan": {
      "bank": "BT",
      "months": 6,
      "monthlyAmount": 1493.33
    },
    "totalPrice": 8960,
    ...
  }
}
```

**Error cases:**
- `400` — `paymentMethod: "Ramburs"` cu `installmentPlan` prezent
- `400` — `installmentPlan.bank` nu este în lista acreditată
- `400` — `installmentPlan.months` nu este în `[3, 6, 10, 12]`
- `401` — utilizator neautentificat

---

### Frontend — component tree

```
UI/checkout/CheckoutStepPayment.jsx     ← MODIFIED (înlocuit conținutul)
  molecules/PaymentPathSelector/        ← NEW: toggle Integrală vs Rate
    PaymentPathSelector.jsx
    PaymentPathSelector.css
    index.js
  molecules/InstallmentPlanForm/        ← NEW: bancă + nr. rate (condiționat)
    InstallmentPlanForm.jsx
    InstallmentPlanForm.css
    index.js

hooks/useCheckoutEligibility.js         ← NEW: detectează dacă coșul e rate-eligible
UI/checkout/useCheckoutState.js         ← MODIFIED: adaugă paymentPath + installmentPlan
```

**REUSE:**
- `organisms/CheckoutPayment/CheckoutPayment.jsx` — reutilizat neschimbat pentru plata Stripe (calea Card integrală)
- `InstallmentWidget.jsx` — reutilizat în `InstallmentPlanForm` pentru preview sumă lunară

### Redux / RTK Query changes

| Type | Name | File | Description |
|------|------|------|-------------|
| Selector | `selectCartHasInstallments` | `features/product/addToCart/addToCartSlice.js` | returnează `true` dacă cel puțin un item din coș are `installmentOptions.length > 0` |
| RTK mutation | `useCreateOrderMutation` | `features/order/rtkOrders.js` | deja există — body extins cu `installmentPlan` |

### Key types / shapes

```js
// Câmpuri noi pe Order
installmentPlan: {
  bank: "BT" | "ING" | "Raiffeisen" | "BCR",
  months: 3 | 6 | 10 | 12,
  monthlyAmount: Number,  // totalPrice / months, rotunjit la 2 zecimale
}

// Câmpuri pe Product (existente, folosite pentru eligibilitate)
installmentOptions: [
  { months: Number, monthlyPrice: Number }
]

// Stare locală checkout (useCheckoutState)
paymentPath: "full" | "installments",   // NOU
installmentPlan: {                        // NOU
  bank: string,
  months: number,
  monthlyAmount: number,
}

// Bănci acreditate (constants)
INSTALLMENT_BANKS = ["BT", "ING", "Raiffeisen", "BCR"]
INSTALLMENT_MONTHS = [3, 6, 10, 12]
```

### Edge cases to handle

- [ ] Coș fără produse rate-eligible → ascunde complet secțiunea „Rate", nu o dezactiva
- [ ] Clientul selectează Rate → revine la Integrală → `installmentPlan` se resetează la `null`
- [ ] `monthlyAmount` se recalculează când cantitatea unui produs se schimbă în coș
- [ ] Loading state — butonul „Continuă" dezactivat până când selecția e completă (bancă + nr. rate)
- [ ] Mobile — `InstallmentPlanForm` stivuit vertical, butoanele de nr. rate ca grid 2×2
