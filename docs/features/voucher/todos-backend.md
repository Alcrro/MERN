# Voucher — Backend TODOs

## Model (`backend/models/Voucher.js`)

- [x] Câmpuri de bază: `code, type, value, minOrder, active, expiresAt`
- [x] `timestamps: true`
- [x] `unique` index pe `code`
- [x] `uppercase: true` pe `code` (normalizare la save)
- [ ] Lipsă câmp `maxUses` (limită utilizări totale)
- [ ] Lipsă câmp `usedCount` (contor utilizări)
- [ ] Lipsă câmp `userId`/`usedBy` (per-user one-time use)
- [ ] Lipsă validare `value <= 100` când `type === "percent"`
- [ ] Lipsă index pe `active` (query frecvent: `{ active: true }`)

## Controller (`backend/controllers/voucher/voucher.js`)

- [x] Verificare câmp `code` prezent (400 dacă lipsă)
- [x] Lookup cu `{ code, active: true }`
- [x] Verificare `expiresAt < now`
- [x] Verificare `orderTotal >= minOrder`
- [x] Calcul discount corect pentru `percent` și `fixed`
- [x] Response `{ valid: false, message }` pentru toate cazurile de eșec
- [ ] Endpoint public — **nu există auth guard** — oricine poate valida orice cod (risc recon)
- [ ] Voucher-ul nu e marcat ca folosit la validare (nu există `usedCount++`)
- [ ] Lipsă validare că `value` > 0
- [ ] `percent` calcul: `Math.round(total * value) / 100` — corect doar dacă `value` e întreg (ex: 10 = 10%). Dacă `value = 10.5`, rezultatul e imprecis.
- [ ] Lipsă endpoint `GET /api/vouchers/:code` (preview fără aplicare)
- [ ] Lipsă endpoint admin `POST /api/vouchers` (creare voucher)
- [ ] Lipsă endpoint admin `PATCH /api/vouchers/:id` (dezactivare)

## Rută (`backend/routes/voucher/voucher.js`)

- [x] `POST /validate` definit
- [x] Handler importat corect din controller
- [ ] Lipsă rate limiting (un atacator poate brute-force codurile)
- [ ] Lipsă rute admin (CRUD complet pentru gestionare vouchere)

## Integrare în Order

- [ ] `voucherCode` nu e câmp în Order model — reducerea nu se aplică real la plasarea comenzii
- [ ] Order controller nu validează și nu aplică voucher-ul la submit
- [ ] Fără integrare, voucherul e doar UI cosmetic

---

## Gaps found

| ⚠ Gap | Severitate | Fișier |
|-------|-----------|--------|
| Endpoint public fără auth — risc recon | Medie | `routes/voucher/voucher.js` |
| Niciun rate limiting pe validate | Medie | `routes/voucher/voucher.js` |
| Voucher-ul nu se aplică real la comandă | **Critică** | `controllers/order/`, `models/Order.js` |
| Lipsă câmp `maxUses`/`usedCount` | Medie | `models/Voucher.js` |
| Lipsă rute admin CRUD | Medie | `routes/voucher/` |
| Lipsă validare `value <= 100` pentru percent | Scăzută | `models/Voucher.js` |
