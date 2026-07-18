# Voucher — Backend TODOs

## Model Voucher (`backend/models/Voucher.js`)

- [x] Câmpuri de bază: `code, type, value, minOrder, active, expiresAt`
- [x] `timestamps: true`
- [x] `unique` index pe `code`
- [x] `uppercase: true` pe `code`
- [x] `vendorId`, `productIds` (voucher vendor-specific cu produse)
- [x] `scope` (global / vendor / reward)
- [x] `issuedTo`, `sourceOrderId` (reward vouchers)
- [x] `isRedeemed`, `usedOnOrderId` (tracking utilizare)
- [x] Index compus `{ vendorId, active }`
- [x] Index compus `{ issuedTo, isRedeemed }`
- [ ] Lipsă câmp `maxUses` / `usedCount` (fără limită utilizări)
- [ ] Lipsă validare `value <= 100` când `type === "percent"` în schema

## Model VendorVoucherRule (`backend/models/VendorVoucherRule.js`)

- [x] `vendorId` unique (un singur document per vendor)
- [x] `enabled`, `type`, `value`, `minOrderAmount`, `validDays`, `productIds`
- [x] `timestamps: true`

## Controller voucher (`backend/controllers/voucher/voucher.js`)

- [x] `validateVoucher`: lookup `{ code, active: true }`, verifică expiresAt, isRedeemed
- [x] Validare ownership pentru scope=reward (`issuedTo`)
- [x] Voucher vendor-specific: filtrare `cartItems` pe vendorId + productIds
- [x] Calcul `eligibleSubtotal` și `discount` corect pentru vendor scope
- [x] `createVoucher`: validări tip/valoare, check cod duplicat, vendorId automat
- [x] `listVouchers`: filtrare pe vendor sau toate (admin)
- [x] `toggleVoucher`: verificare ownership (vendor owner sau admin)
- [x] `getMyVouchers`: reward vouchers personale cu populate vendorId
- [x] `getVendorRule` + `upsertVendorRule` (upsert atomic)
- [ ] **CRITIC: `isRedeemed` nu e setat true după utilizare în checkout**
- [ ] **CRITIC: `usedOnOrderId` nu e populat nicăieri**
- [ ] Lipsă validare `value > 0` în `validateVoucher`
- [ ] Endpoint public `/validate` fără rate limiting (risc brute-force coduri)

## voucherRewardService (`backend/controllers/voucher/voucherRewardService.js`)

- [x] `generateRewardVouchers(order)`: per vendor, verifică regula, creează Voucher scope=reward
- [x] `invalidateOrderVouchers(orderId)`: dezactivează voucher-ele reward nefolosite
- [x] Cod unic cu retry (max 10 încercări)
- [x] Apelat din `order.js` la isPaid=true și la cancel
- [ ] `console.error` prezent (acceptabil în service, nu în componente)

## Rute (`backend/routes/voucher/voucher.js`)

- [x] `POST /validate` cu `optionalProtect`
- [x] `GET /my` cu `protect`
- [x] `GET /` + `POST /` cu `protect` + `authorize("vendor","admin")`
- [x] `PATCH /:id/toggle`
- [x] `GET /vendor-rule` + `PUT /vendor-rule`
- [ ] Lipsă rate limiting pe `/validate`
- [ ] Lipsă endpoint `DELETE /:id` (ștergere voucher)

## Integrare Order (`backend/controllers/order/order.js`)

- [x] `generateRewardVouchers` apelat după isPaid=true
- [x] `invalidateOrderVouchers` apelat la cancel
- [ ] **CRITIC: `createOrder` nu primește și nu procesează `voucherCode`**
- [ ] **CRITIC: reducerea din voucher nu se scade din suma trimisă la Stripe**
- [ ] **CRITIC: `isRedeemed` nu e setat la plasarea comenzii**

---

## Gaps found

| ⚠ Gap | Severitate | Fișier |
|-------|-----------|--------|
| `createOrder` ignoră `voucherCode` — reducere UI-only | **Critică** | `controllers/order/order.js` |
| `isRedeemed` + `usedOnOrderId` nu se setează | **Critică** | `controllers/voucher/voucher.js` |
| Rate limiting lipsă pe `/validate` | Medie | `routes/voucher/voucher.js` |
| Fără `maxUses`/`usedCount` | Medie | `models/Voucher.js` |
| Lipsă endpoint `DELETE /:id` | Scăzută | `routes/voucher/voucher.js` |
