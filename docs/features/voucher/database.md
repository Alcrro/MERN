<!-- Reverse-engineered from existing model — verify against DB -->

# Voucher — Database Schema

**Collection:** `vouchers`  
**Model file:** `backend/models/Voucher.js`  
**Mongoose model:** `Voucher`

---

## Schema Fields

| Câmp | Tip | Constrângeri | Default | Note |
|------|-----|-------------|---------|------|
| `code` | String | required, unique, uppercase, trim | — | Auto-uppercase la save via Mongoose |
| `type` | String | required, enum: `["percent", "fixed"]` | — | `percent` = %; `fixed` = RON fix |
| `value` | Number | required | — | Procent (0–100) sau RON. Nu e validat maxim. |
| `minOrder` | Number | — | `0` | Comandă minimă în RON pentru a putea aplica |
| `active` | Boolean | — | `true` | Dezactivare soft — nu șterge din DB |
| `expiresAt` | Date | — | `null` | `null` = fără expirare |
| `createdAt` | Date | auto | — | `timestamps: true` |
| `updatedAt` | Date | auto | — | `timestamps: true` |

---

## Indexes

- `code`: **unique index** (implicit din `unique: true` pe câmp)
- Niciun index explicit adăugat cu `.index()`

---

## Cum creezi un voucher (development)

```js
// MongoDB Shell / Compass
db.vouchers.insertOne({
  code: "ALCRRO10",
  type: "percent",
  value: 10,
  minOrder: 0,
  active: true,
  expiresAt: null
})

db.vouchers.insertOne({
  code: "WELCOME50",
  type: "fixed",
  value: 50,
  minOrder: 100,
  active: true,
  expiresAt: new Date("2025-12-31")
})
```

---

## Note

- Nu există câmp `maxUses` / `usedCount` — un voucher nu are limită de utilizări.
- Nu există câmp `userId` — un voucher nu e legat de un utilizator specific.
- Validarea pe backend verifică `active: true` și `expiresAt < now` dar nu marchează voucher-ul ca folosit.
