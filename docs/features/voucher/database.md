<!-- Reverse-engineered from existing model — verify against DB -->

# Voucher — Database Schema

## Collection: `vouchers`
**Model:** `backend/models/Voucher.js`

| Câmp | Tip | Constrângeri | Default | Note |
|------|-----|-------------|---------|------|
| `code` | String | required, unique, uppercase, trim | — | Auto-uppercase la save |
| `type` | String | required, enum: `["percent","fixed"]` | — | |
| `value` | Number | required | — | Procent sau RON; fără validare max |
| `minOrder` | Number | — | `0` | Comandă minimă RON |
| `active` | Boolean | — | `true` | Dezactivare soft |
| `expiresAt` | Date | — | `null` | null = fără expirare |
| `vendorId` | ObjectId | ref: Register | `null` | null = global (admin); populat = vendor-specific |
| `productIds` | [ObjectId] | ref: Product | `[]` | gol = toate produsele vendorului |
| `scope` | String | enum: `["global","vendor","reward"]` | `"global"` | `reward` = emis automat după livrare |
| `issuedTo` | ObjectId | ref: Register | `null` | Cumpărătorul care a primit reward-ul |
| `sourceOrderId` | ObjectId | ref: Order | `null` | Comanda care a generat reward-ul |
| `isRedeemed` | Boolean | — | `false` | Marcat true la folosire |
| `usedOnOrderId` | ObjectId | ref: Order | `null` | Comanda pe care s-a folosit |
| `createdAt` | Date | auto | — | timestamps: true |
| `updatedAt` | Date | auto | — | timestamps: true |

### Indexes
```js
VoucherSchema.index({ vendorId: 1, active: 1 });   // query frecvent vendor dashboard
VoucherSchema.index({ issuedTo: 1, isRedeemed: 1 }); // query profil cumpărător
// unique pe `code` implicit din { unique: true }
```

---

## Collection: `vendorvoucherrules`
**Model:** `backend/models/VendorVoucherRule.js`

Un singur document per vendor (upserted).

| Câmp | Tip | Constrângeri | Default | Note |
|------|-----|-------------|---------|------|
| `vendorId` | ObjectId | ref: Register, required, **unique** | — | |
| `enabled` | Boolean | — | `false` | Regula inactivă până e activată explicit |
| `type` | String | enum: `["percent","fixed"]` | `"percent"` | |
| `value` | Number | min: 1 | `10` | |
| `minOrderAmount` | Number | min: 0 | `0` | Subtotal vendor minim RON pentru a genera |
| `validDays` | Number | min: 1 | `30` | Zile de valabilitate ale voucherului generat |
| `productIds` | [ObjectId] | ref: Product | `[]` | gol = toate produsele vendorului |
| `createdAt` | Date | auto | — | timestamps: true |
| `updatedAt` | Date | auto | — | timestamps: true |

### Index
```js
// unique pe vendorId implicit din { unique: true }
```

---

## Note

- `isRedeemed` există pe model dar **nu e setat automat** la aplicarea voucherului în checkout — voucherCode nu e trimis la `createOrder`.
- `usedOnOrderId` există pe model dar nu e populat nicăieri în cod curent.
- Fără `maxUses`/`usedCount` — un voucher global poate fi folosit de oricâți utilizatori.
