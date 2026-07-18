# Voucher — Tech Spec

---

## Data Flow — aplicare voucher în coș

```
User tipează cod
  → CartVoucherBox (local state: code, error)
  → useValidateVoucherMutation({ code, orderTotal, cartItems })
  → POST /api/vouchers/validate  (optionalProtect)
  → Voucher.findOne({ code, active: true })
  → verifică: expiresAt, isRedeemed, scope=reward→issuedTo
  → dacă vendorId: filtrează cartItems pe vendor + productIds → eligibleSubtotal
  → răspuns { valid, scope, discount, eligibleProductIds, ... }
  → dispatch(setVoucher(payload))  ← Redux discountSlice
  → Checkout.jsx / CartSummary recitesc s.discount.voucher
  → calcVoucherDiscount() recalculează
  → afișează linia discount + total actualizat
```

**⚠ Gap critic:** `voucherCode` nu ajunge la `createOrder` — reducerea e doar UI.

---

## API Contracts

### `POST /api/vouchers/validate`
**Auth:** opțional (`optionalProtect`) — necesar doar pentru scope=reward

**Request:**
```json
{
  "code": "ALCRRO10",
  "orderTotal": 299.99,
  "cartItems": [
    { "productId": "...", "vendorId": "...", "price": 150, "quantity": 2 }
  ]
}
```

**Response — succes global:**
```json
{ "valid": true, "scope": "global", "code": "ALCRRO10", "type": "percent", "value": 10,
  "discount": 30.0, "eligibleProductIds": [], "description": "-10%" }
```

**Response — succes vendor:**
```json
{ "valid": true, "scope": "vendor", "code": "VENDOR10", "type": "percent", "value": 10,
  "discount": 15.0, "eligibleSubtotal": 150, "eligibleProductIds": ["..."], "description": "-10%" }
```

**Response — eșec:**
```json
{ "valid": false, "message": "Cod invalid sau expirat" }
{ "valid": false, "message": "Codul a expirat" }
{ "valid": false, "message": "Codul nu îți aparține" }
{ "valid": false, "message": "Codul nu e valabil pentru produsele din coș" }
{ "valid": false, "message": "Comandă minimă: 100 RON" }
```

---

### `POST /api/vouchers` — creare voucher
**Auth:** `protect` + `authorize("vendor","admin")`

```json
// Request
{ "code": "SUMMER20", "type": "percent", "value": 20, "minOrder": 0,
  "expiresAt": "2026-12-31", "productIds": [] }
// Response
{ "success": true, "data": { ...voucher } }
```

### `GET /api/vouchers` — listare vouchere proprii
**Auth:** vendor sau admin

```json
{ "success": true, "count": 3, "data": [...vouchers] }
```

### `PATCH /api/vouchers/:id/toggle` — activare/dezactivare
**Auth:** vendor owner sau admin

```json
{ "success": true, "data": { ...voucher, "active": false } }
```

### `GET /api/vouchers/my` — reward vouchers ale cumpărătorului
**Auth:** `protect` (orice user)

```json
{ "success": true, "count": 2, "data": [{ ...voucher, "vendorId": { "shopName": "..." } }] }
```

### `GET /api/vouchers/vendor-rule`
**Auth:** vendor

```json
{ "success": true, "data": { "enabled": true, "type": "percent", "value": 10, "validDays": 30, ... } }
```

### `PUT /api/vouchers/vendor-rule` — upsert regulă automată
**Auth:** vendor

```json
// Request (parțial — doar câmpurile de schimbat)
{ "enabled": true, "type": "percent", "value": 10, "minOrderAmount": 0, "validDays": 30 }
// Response
{ "success": true, "data": { ...rule } }
```

---

## RTK Query — `src/features/voucher/rtkVoucher.js`

```
reducerPath: "voucherApi"
tagTypes: ["Vouchers", "MyVouchers", "VendorRule"]

useValidateVoucherMutation     → POST /validate          (no tag)
useListVouchersQuery           → GET  /                  providesTags: ["Vouchers"]
useCreateVoucherMutation       → POST /                  invalidates: ["Vouchers"]
useToggleVoucherMutation       → PATCH /:id/toggle       invalidates: ["Vouchers"]
useGetMyVouchersQuery          → GET  /my                providesTags: ["MyVouchers"]
useGetVendorRuleQuery          → GET  /vendor-rule       providesTags: ["VendorRule"]
useUpsertVendorRuleMutation    → PUT  /vendor-rule       invalidates: ["VendorRule"]
```

---

## Redux — discountSlice (`src/features/discount/discountSlice.js`)

```
initialState:
  voucher:    null | { code, scope, type, value, discount, description, eligibleProductIds }
  useCredits: false
  usePoints:  false

actions:
  setVoucher(payload)    → state.voucher = payload
  clearVoucher()         → state.voucher = null
  setUseCredits(bool)
  setUsePoints(bool)
  clearDiscount()        → reset all
```

---

## Component Tree

```
Checkout.jsx (page, ~200 linii ⚠ depășit)
  ├── CheckoutStepCart    → CartSummary + CartVoucherBox + CartAlcrroBox
  ├── CheckoutStepDetails → adresă + metodă plată + InstallmentPlanForm
  └── CheckoutStepConfirm → rezumat + CheckoutPayment

CartSummary (organism) — src/Components/products/add-to-Cart/CartSummary.jsx
  ├── calcVoucherDiscount(voucher, cartItems, subtotal)
  ├── reads: s.discount (voucher, useCredits, usePoints)
  ├── CartVoucherBox (molecule)
  │     ├── useState: code, error
  │     ├── useSelector: s.discount.voucher
  │     ├── useValidateVoucherMutation
  │     └── dispatch: setVoucher / clearVoucher
  └── CartAlcrroBox (molecule)
        ├── useGetMyCardQuery
        ├── dispatch: setUseCredits / setUsePoints
        └── props: orderTotal, shipping

VendorVouchersPanel (organism) — src/Components/vendor/dashboard/VendorVouchersPanel/
  ├── useListVouchersQuery
  ├── useToggleVoucherMutation
  ├── VendorVoucherForm (molecule) — afișat la „+ Voucher nou"
  │     ├── useCreateVoucherMutation
  │     ├── useGetVendorProductsQuery (selector produse)
  │     └── checkbox picker produse (collapse)
  └── RuleSection (sub-componentă inline)
        ├── useGetVendorRuleQuery
        └── useUpsertVendorRuleMutation

ProfileVouchers (organism) — src/Components/profile/ProfileVouchers/
  ├── useGetMyVouchersQuery
  └── VoucherCard (atom inline)
        ├── copy-to-clipboard
        └── afișează: cod, discount, vendor, expiresAt, badge status
```

---

## Calcul discount frontend (Checkout.jsx + CartSummary.jsx)

```js
const POINTS_TO_RON   = 10;   // 10 puncte = 1 RON  ⚠ duplicat în CartAlcrroBox
const SHIP_THRESHOLD  = 500;

const voucherDiscount = calcVoucherDiscount(voucher, cartItems, subtotal);
const creditsDiscount = useCredits ? Math.min(credits, subtotal + ship - voucherDiscount) : 0;
const pointsDiscount  = usePoints  ? Math.min(points / POINTS_TO_RON, ... - creditsDiscount) : 0;
const finalTotal      = Math.max(0, subtotal + ship - voucherDiscount - creditsDiscount - pointsDiscount);
```

### voucherRewardService — generare automată

```
generateRewardVouchers(order)  — apelat după isPaid = true
  → colectează vendorIds unici din order.items
  → per vendor: caută VendorVoucherRule { vendorId, enabled: true }
  → verifică minOrderAmount vs subtotal vendor
  → creează Voucher { scope: "reward", issuedTo: order.user, expiresAt: +validDays }

invalidateOrderVouchers(orderId) — apelat la anulare
  → Voucher.updateMany({ sourceOrderId, isRedeemed: false }, { active: false })
```
