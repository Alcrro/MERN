# Database: Vendor Profile

> **Last updated:** 2026-07-11
> **Affects collections:** `users` (model `Register`)

---

## Changes to existing — `users` collection

### Câmp nou: `vendorProfile` (subdocument embedded)

Adaugă în `backend/models/auth/register.js`:

```js
const VendorProfileSchema = new mongoose.Schema({
  cui:           { type: String, default: null },
  denumireFirma: { type: String, maxlength: 150, default: null },
  tipEntitate:   { type: String, enum: ["SRL", "PFA", "SA", "RA", "II", "ONG"], default: null },
  orasDepozit:   { type: String, maxlength: 100, default: null },
  zileLivrare: {
    min: { type: Number, min: 0, default: null },
    max: { type: Number, min: 0, default: null },
  },
  returZile:     { type: Number, min: 0, default: 30 },
  telefon:       { type: String, default: null },
  emailContact:  { type: String, default: null },
}, { _id: false });
```

Adaugă în `RegisterSchema`:
```js
vendorProfile: { type: VendorProfileSchema, default: () => ({}) },
```

**Migration needed:** No — `default: () => ({})`, documentele existente primesc subdocument gol. Backwards compatible.

---

## Câmpuri existente relevante pe `Register`

| Câmp | Tip | Note |
|------|-----|------|
| `shopName` | String | maxlength: 100 — nume magazin (public) |
| `shopDescription` | String | maxlength: 500 |
| `vendorStatus` | String | enum: none/pending/approved/rejected |
| `phone` | String | telefon cont user (diferit de `vendorProfile.telefon`) |

---

## Tabel complet `vendorProfile`

| Câmp | Tip | Constrângeri | Default | Note |
|------|-----|-------------|---------|------|
| `cui` | String | — | null | Format: 2–10 cifre. Validat în controller, nu în model. |
| `denumireFirma` | String | maxlength: 150 | null | Numele legal al firmei |
| `tipEntitate` | String | enum: SRL/PFA/SA/RA/II/ONG | null | Forma juridică |
| `orasDepozit` | String | maxlength: 100 | null | Orașul de unde pleacă coletele |
| `zileLivrare.min` | Number | min: 0 | null | Zile lucrătoare minim |
| `zileLivrare.max` | Number | min: 0 | null | Zile lucrătoare maxim |
| `returZile` | Number | min: 0 | 30 | Zile politică retur |
| `telefon` | String | — | null | Contact public vendor |
| `emailContact` | String | — | null | Email contact public (diferit de email cont) |

---

## Indexes

Niciun index nou necesar — interogările sunt după `_id` (populate din Product.vendor).

Opțional, pentru admin panel:
```js
RegisterSchema.index({ "vendorProfile.cui": 1 }, { sparse: true });
```
