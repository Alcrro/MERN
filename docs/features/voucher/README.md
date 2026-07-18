# Voucher System

Three voucher types (global admin, vendor-created, automatic reward) with server-side discount validation, vendor rule engine, and post-delivery reward emission.

---

## What's technically interesting

### Server-side discount validation

Discounts are **never computed on the client**. At order creation, the backend:
1. Looks up the voucher by code
2. Validates: active, not expired, not already redeemed, minimum order met, correct vendor scope
3. Calculates the discount server-side
4. Stores `voucherCode` + `voucherDiscount` on the order document
5. Passes the reduced amount to Stripe: `totalPrice - creditsUsed - voucherDiscount`
6. Marks the voucher `isRedeemed: true` inside the same MongoDB transaction

This prevents discount manipulation from the client side.

### Automatic reward vouchers

Vendors configure a rule (`VendorVoucherRule` model): type (percent/fixed), value, minimum order, validity days, and optionally scoped to specific product IDs. After an order is marked paid (webhook or confirm endpoint), `generateRewardVouchers()` runs asynchronously:
- Finds all unique vendor IDs in the order items
- Checks if each vendor has an active rule
- Validates minimum subtotal per vendor
- Emits a `Voucher` with `scope: "reward"`, `issuedTo: userId`, `sourceOrderId`

The buyer sees these in their profile under "Voucherele mele".

### Voucher scoping

A voucher can be:
- **Global** — any product, any vendor (admin-created)
- **Vendor-scoped** — only for that vendor's products (`vendorId` field)
- **Product-scoped** — subset of product IDs within a vendor (`productIds[]`)

Validation checks all three levels in order.

---

## Flow

```
Buyer enters code in cart
  → POST /api/vouchers/validate
      ├─ Invalid/expired/redeemed → 400 with reason
      └─ Valid → { discountAmount, type, value }
  → Redux discount slice stores { code, discountAmount }
  
Buyer places order
  → POST /api/orders (body includes voucherCode)
      ├─ Server re-validates voucher (independent of client state)
      ├─ Computes server-side discount
      ├─ Creates order + marks voucher redeemed (same transaction)
      └─ Stripe PI amount = total - credits - voucherDiscount

Order delivered
  → generateRewardVouchers(order) runs async
  → New Voucher docs created per vendor rule
  → Buyer sees codes in profile
```

---

## Key files

| File | Role |
|------|------|
| `backend/models/Voucher.js` | Voucher schema (14 fields, compound index on code) |
| `backend/models/VendorVoucherRule.js` | Vendor reward rule schema |
| `backend/controllers/voucher/voucher.js` | CRUD + validate endpoint |
| `backend/controllers/voucher/voucherRewardService.js` | Post-delivery reward emission |
| `backend/controllers/order/order.js` | Server-side validation at `createOrder` |
| `frontend/src/features/voucher/` | RTK slice + discount Redux slice |
| `frontend/src/Components/molecules/CartVoucherBox/` | Cart voucher input UI |
| `frontend/src/Components/vendor/dashboard/VendorVoucherForm/` | Vendor rule config UI |

---

See [tech-spec.md](tech-spec.md) for full API contracts and [database.md](database.md) for schema details.
