# Database: Checkout Payment

> **Last updated:** 2026-07-16
> **Affects collections:** `Order`

---

## New collection(s)

Nicio colecție nouă. Modificăm doar `Order`.

---

## Changes to existing collections

### `Order`

**Câmpuri existente relevante:**
```js
paymentMethod: { type: String, enum: ["Card", "Ramburs"], required: true }
stripePaymentIntentId: { type: String }
isPaid: { type: Boolean, default: false }
paymentDetails: { last4, brand, receiptUrl }
```

**Câmpuri noi:**

| Field | Type | Default | Required | Why added |
|-------|------|---------|----------|-----------|
| `installmentPlan` | `Object` | `null` | no | Stochează planul de rate ales de client |
| `installmentPlan.bank` | `String` | — | dacă plan prezent | Banca acreditată aleasă |
| `installmentPlan.months` | `Number` | — | dacă plan prezent | Numărul de rate |
| `installmentPlan.monthlyAmount` | `Number` | — | dacă plan prezent | Suma lunară (totalPrice / months) |

**Schema Mongoose adăugată în `Order.js`:**
```js
const InstallmentPlanSchema = new mongoose.Schema(
  {
    bank:          { type: String, enum: ["BT", "ING", "Raiffeisen", "BCR"], required: true },
    months:        { type: Number, enum: [3, 6, 10, 12], required: true },
    monthlyAmount: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

// în OrderSchema:
installmentPlan: {
  type: InstallmentPlanSchema,
  default: null,
}
```

**Migration needed:** no
Câmpul are `default: null` — documentele existente nu sunt afectate.

**Validare la nivel de schema (adăugat în `OrderSchema`):**
```js
OrderSchema.pre("save", function (next) {
  if (this.paymentMethod === "Ramburs" && this.installmentPlan) {
    return next(new Error("Ramburs nu este compatibil cu un plan de rate"));
  }
  next();
});
```

---

## Indexes

Nu sunt necesare indexuri noi. Comenzile cu rate sunt căutate prin indexul existent `{ user: 1, createdAt: -1 }`.

---

## Seed / test data

```js
// Comandă cu rate — pentru testare manuală în Compass
{
  user: ObjectId("..."),
  items: [...],
  deliveryAddress: { street: "Str. Test 1", city: "București", county: "IF", zip: "010001", phone: "0700000000" },
  paymentMethod: "Card",
  installmentPlan: {
    bank: "BT",
    months: 6,
    monthlyAmount: 1493.33,
  },
  totalPrice: 8960,
  status: "Pending",
}
```
