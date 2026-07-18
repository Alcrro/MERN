# Voucher — Product Requirements

**Status:** Shipped (parțial — discount UI-only, nu se aplică real la comandă)
**Feature area:** Cart / Discount / Vendor Dashboard / Profile

---

## Problem Statement

Platforma suportă trei tipuri de vouchere: globale (create de admin), vendor-specifice (create de vendori din dashboard), și reward (emise automat cumpărătorilor după livrare conform regulii setate de vendor). Cumpărătorii pot aplica codul în coș și îl pot vedea în profilul lor.

---

## User Stories

| # | Ca... | Vreau să... | Astfel încât... |
|---|-------|-------------|-----------------|
| 1 | cumpărător | introduc un cod voucher în coș | să văd reducerea înainte de plată |
| 2 | cumpărător | văd codul aplicat cu reducerea calculată | să confirm că e corect |
| 3 | cumpărător | elimin voucherul aplicat | totalul să revină la valoarea originală |
| 4 | cumpărător | primesc mesaj clar când codul e invalid/expirat/prea mică comanda | să știu exact de ce nu merge |
| 5 | cumpărător | văd voucherele mele reward în profil | să știu ce coduri am disponibile |
| 6 | cumpărător | copiez codul dintr-un click din profil | să-l aplic rapid în coș |
| 7 | vendor | creez vouchere manuale (cod, tip, valoare, produse) | să ofer promoții clienților |
| 8 | vendor | activez/dezactivez un voucher existent | să controlez când e disponibil |
| 9 | vendor | configurez o regulă de voucher automat | cumpărătorii să primească reward după fiecare comandă plătită |
| 10 | vendor | limitez voucherul la anumite produse ale mele | să fac promoții țintite |

---

## Acceptance Criteria

- [x] Input uppercase automat pe taste
- [x] Enter în input declanșează validarea
- [x] Buton dezactivat când input e gol sau loading
- [x] Pe succes: input dispare, codul e afișat cu badge (`-10%` sau `-50 RON`)
- [x] Buton „Elimină" resetează starea Redux
- [x] Eroare specifică de la server afișată inline
- [x] Reducerea apare ca linie separată în sumar (verde)
- [x] Totalul final recalculat în UI
- [x] Vendor poate crea voucher din dashboard
- [x] Vendor poate activa/dezactiva voucher
- [x] Vendor poate configura regulă automată (tip, valoare, zile valabilitate, min. comandă)
- [x] Reward voucher generat automat la `isPaid = true` dacă regula e activă
- [x] Reward voucher invalidat la anularea comenzii
- [x] Cumpărătorul vede voucherele reward în `/profile/vouchers`
- [ ] **Voucherul nu e aplicat real la plasarea comenzii** — `voucherCode` nu e trimis în body-ul `createOrder`
- [ ] `isRedeemed` nu e setat true după utilizare
- [ ] Un voucher global poate fi folosit de oricâți utilizatori (fără `maxUses`)

---

## Out of Scope (neimplementat)

- Aplicarea reducerii server-side la plasarea comenzii (`createOrder` nu primește `voucherCode`)
- Marcarea voucherului ca folosit (`isRedeemed`, `usedOnOrderId` există în model dar nu sunt setate)
- Limită utilizări per voucher (`maxUses`/`usedCount` lipsesc din model)
- Rate limiting pe `POST /validate` (risc brute-force)
- Revalidare voucher când totalul coșului se schimbă după aplicare
- `clearDiscount` nu e apelat la `clearCart` — voucher rămâne în Redux dacă coșul e golit
