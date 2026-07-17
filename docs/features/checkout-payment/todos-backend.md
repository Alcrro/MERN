# Backend TODOs: Checkout Payment

> **Last updated:** 2026-07-16
> **Stack:** Node.js, Express, MongoDB/Mongoose
> **Conventions:** controllers în `controllers/[resource]/`, routes în `routes/`

---

## Phase 1 — Model & validation

> Goal: `installmentPlan` se poate stoca și valida corect pe documentele Order.

- [x] Adaugă `InstallmentPlanSchema` în `backend/models/order/Order.js`
  ```js
  const InstallmentPlanSchema = new mongoose.Schema(
    {
      bank:          { type: String, enum: ["BT", "ING", "Raiffeisen", "BCR"], required: true },
      months:        { type: Number, enum: [3, 6, 10, 12], required: true },
      monthlyAmount: { type: Number, required: true, min: 0 },
    },
    { _id: false }
  );
  ```
- [x] Adaugă câmpul `installmentPlan` în `OrderSchema`:
  ```js
  installmentPlan: { type: InstallmentPlanSchema, default: null }
  ```
- [x] Adaugă pre-save hook de validare încrucișată:
  ```js
  // Ramburs + rate = invalid
  if (this.paymentMethod === "Ramburs" && this.installmentPlan) {
    return next(new Error("Ramburs nu este compatibil cu un plan de rate"));
  }
  ```
- [ ] Testează în MongoDB Compass: creează document cu `installmentPlan` și verifică shape-ul

---

## Phase 2 — Controller & routes

> Goal: `POST /api/orders` acceptă și validează `installmentPlan`.

- [x] Modifică `backend/controllers/order/order.js` → funcția `createOrder`:
  - Extrage `installmentPlan` din `req.body` (opțional)
  - Validează dacă `paymentMethod === "Ramburs"` și `installmentPlan` e prezent → `400`
  - Validează `installmentPlan.bank` ∈ `["BT", "ING", "Raiffeisen", "BCR"]` dacă prezent
  - Validează `installmentPlan.months` ∈ `[3, 6, 10, 12]` dacă prezent
  - Pasează `installmentPlan` la `new Order({ ..., installmentPlan })`
- [ ] Verifică că `GET /api/orders/:id` returnează `installmentPlan` în response (ar trebui automat)
- [ ] Verifică că `GET /api/orders` (getMyOrders) include `installmentPlan` în lista comenzilor

---

## Phase 3 — Auth, guards & edge cases

> Goal: production-ready, securizat.

- [x] Auth middleware deja aplicat pe `POST /api/orders` (verificat — `router.use(protect)`)
- [x] Input validation completă în `createOrder`:
  - [x] `paymentMethod: "Ramburs"` + `installmentPlan` → `400`
  - [x] `installmentPlan.bank` neacreditată → `400`
  - [x] `installmentPlan.months` invalid → `400`
  - [x] `monthlyAmount` negativ → `400`
- [x] Cazul edge: `installmentPlan: null` → `...(null ? { installmentPlan } : {})` = absent
- [x] Zero `console.log` în controller
- [ ] Testează cu Postman:
  - `POST /api/orders` cu `installmentPlan` valid → `200`
  - `POST /api/orders` cu `paymentMethod: "Ramburs"` + `installmentPlan` → `400`
  - `POST /api/orders` cu `installmentPlan.bank: "AlteBank"` → `400`

---

## Files touched

| File | Status | Notes |
|------|--------|-------|
| `models/order/Order.js` | [x] | InstallmentPlanSchema + câmp nou |
| `controllers/order/order.js` | [x] | validare + parsare installmentPlan |
| `routes/order/order.js` | [x] | neschimbat (rutele există deja) |
