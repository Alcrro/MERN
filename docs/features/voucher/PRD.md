# Voucher — Product Requirements

**Status:** Shipped  
**Feature area:** Cart / Discount  
**Locație:** `/cart` → CartSummary → CartVoucherBox

---

## Problem Statement

Utilizatorii pot aplica coduri promoționale în coșul de cumpărături pentru a obține reduceri înainte de finalizarea comenzii. Reducerea se reflectă instant în totalul sumarului, fără reîncărcarea paginii.

---

## User Stories

| # | Ca utilizator... | Vreau să... | Astfel încât... |
|---|-----------------|-------------|-----------------|
| 1 | neautentificat sau autentificat | introduc un cod voucher în coș | să văd dacă e valid și cât economisesc |
| 2 | utilizator cu voucher valid | văd codul aplicat cu reducerea calculată | să confirm că reducerea e corectă |
| 3 | utilizator care s-a răzgândit | elimin voucherul aplicat | totalul să revină la valoarea originală |
| 4 | utilizator cu comandă sub minim | primesc mesaj de eroare explicit cu suma minimă | să știu ce condiție nu e îndeplinită |
| 5 | utilizator cu cod expirat | primesc mesaj că a expirat | să nu fiu confuz de ce nu merge |

---

## Acceptance Criteria

- [x] Input uppercase automat pe taste
- [x] Enter în input declanșează validarea
- [x] Buton dezactivat când input-ul e gol sau loading
- [x] Pe succes: input dispare, codul e afișat cu badge (`-10%` sau `-50 RON`)
- [x] Buton „Elimină" resetează starea Redux + input
- [x] Eroare specifică returnată de server afișată inline
- [x] Reducerea apare ca linie separată în sumar (verde, cu codul)
- [x] Totalul final recalculat: `max(0, produse + livrare - voucherDiscount)`
- [x] Starea voucher-ului persistă în Redux între re-render-uri

---

## Out of Scope (neimplementat)

- Limită de utilizări per voucher (câmpul `maxUses` nu există în model)
- Voucher per utilizator (un user nu poate folosi același cod de două ori)
- Interfață admin pentru creare/dezactivare vouchere (doar MongoDB direct)
- Aplicarea reducerii la checkout — `voucherCode` nu e trimis în body-ul comenzii
- Voucher cu tip `percent` poate depăși 100% (fără validare backend)
- Voucherul validat cu un `orderTotal` nu se revalidează dacă totalul se schimbă (produse adăugate/eliminate din coș)
