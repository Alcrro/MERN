# Voucher — Tech Spec

---

## Data Flow

```
User tipează cod
  → CartVoucherBox (local state: code, error)
  → useValidateVoucherMutation({ code, orderTotal })
  → POST /api/vouchers/validate
  → Mongoose: Voucher.findOne({ code, active: true })
  → răspuns { valid, code, type, value, discount, description }
  → dispatch(setVoucher(payload))  ← Redux discountSlice
  → CartSummary recitește s.discount.voucher
  → recalculează finalTotal
  → afișează linia de discount + total actualizat
```

---

## API Contract

### `POST /api/vouchers/validate`

**Auth:** nu e necesar (public endpoint)

**Request body:**
```json
{ "code": "ALCRRO10", "orderTotal": 299.99 }
```

**Response — succes:**
```json
{
  "valid": true,
  "code": "ALCRRO10",
  "type": "percent",
  "value": 10,
  "discount": 30.00,
  "description": "-10%"
}
```

**Response — eșec:**
```json
{ "valid": false, "message": "Cod invalid sau expirat" }
{ "valid": false, "message": "Codul a expirat" }
{ "valid": false, "message": "Comandă minimă: 100 RON" }
```

**Logică discount:**
- `percent`: `Math.round(orderTotal * value) / 100`
- `fixed`: `value` (RON direct)

---

## RTK Query

```js
// src/features/voucher/rtkVoucher.js
voucherApi.endpoints.validateVoucher
  mutation: POST /api/vouchers/validate
  hook: useValidateVoucherMutation()
  reducerPath: "voucherApi"
```

---

## Redux — discountSlice

```
src/features/discount/discountSlice.js
reducerPath: "discount"

initialState:
  voucher:    null  | { code, type, value, discount, description }
  useCredits: false | true
  usePoints:  false | true

actions:
  setVoucher(payload)    → state.voucher = payload
  clearVoucher()         → state.voucher = null
  setUseCredits(bool)    → state.useCredits = bool
  setUsePoints(bool)     → state.usePoints  = bool
  clearDiscount()        → reset all to initial
```

---

## Component Tree

```
CartSummary (organism) — src/Components/products/add-to-Cart/CartSummary.jsx
  ├── reads: s.discount (voucher, useCredits, usePoints)
  ├── reads: useGetMyCardQuery() — pentru calcul credite/puncte
  ├── CartVoucherBox (molecule) — src/Components/molecules/CartVoucherBox/
  │     ├── useState: code (string), error (string|null)
  │     ├── useSelector: s.discount.voucher
  │     ├── useValidateVoucherMutation
  │     ├── dispatch: setVoucher / clearVoucher
  │     └── props: orderTotal (number)
  └── CartAlcrroBox (molecule) — src/Components/molecules/CartAlcrroBox/
        ├── useGetMyCardQuery
        ├── useSelector: s.discount.useCredits, s.discount.usePoints
        ├── dispatch: setUseCredits / setUsePoints
        └── props: orderTotal (number)
```

---

## Calcul total în CartSummary

```js
const shipping       = total >= SHIP_THRESHOLD ? 0 : 15;   // SHIP_THRESHOLD = 500
const voucherDiscount = voucher?.type === "percent"
                        ? Math.round(total * voucher.value) / 100
                        : voucher?.value ?? 0;
const creditsDiscount = useCredits
                        ? Math.min(card.credits, total + shipping - voucherDiscount)
                        : 0;
const pointsDiscount  = usePoints
                        ? Math.min(card.points / 10, total + shipping - voucherDiscount - creditsDiscount)
                        : 0;
const finalTotal = Math.max(0, total + shipping - voucherDiscount - creditsDiscount - pointsDiscount);
```
