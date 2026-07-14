# PRD: Vendor Page

> **Status:** `Draft`
> **Owner:** Alexandru Roventa
> **Last updated:** 2026-07-13
> **Related tech spec:** [tech-spec.md](./tech-spec.md)

---

## Problem Statement

**Current state:** Cumpărătorul vede vânzătorul în SellerPicker (shopName, tipEntitate, preț, zile livrare) dar nu poate afla mai multe — nu există pagină publică de profil pentru niciun vendor.

**Pain point:** Nu poți evalua credibilitatea unui vânzător înainte să cumperi: de cât timp e activ, ce alte produse vinde, are depozit sau e dropshipper, ce parere au alți cumpărători despre firmă ca întreg.

**Why now:** Seller multi-vendor este functional (SellerPicker, listinguri aprobate). Pagina de vendor e pasul logic următor pentru a face platforma credibilă.

---

## User Stories

| # | Role | Want to | So that |
|---|------|---------|---------|
| 1 | client | dau click pe un vânzător și ajung la profilul lui | pot vedea mai multe detalii înainte să cumpăr |
| 2 | client | văd toate produsele active ale vânzătorului | pot cumpăra și alte produse de la același seller de încredere |
| 3 | client | văd recenzii lăsate de alți cumpărători despre vânzător | pot lua o decizie informată despre cine livrează comanda |
| 4 | client | văd dacă vânzătorul are depozit fizic și de când e activ | pot evalua seriozitatea firmei |
| 5 | client (autentificat) | las o recenzie despre vânzător (nu despre produs) | pot ajuta alți cumpărători să evalueze seller-ul |

---

## Acceptance Criteria

- [ ] `#1` — Click pe shopName în SellerRow navighează la `/vendor/:vendorId`
- [ ] `#1` — Pagina afișează: shopName, tipEntitate, denumireFirma, cui, orasDepozit, emailContact, zileLivrare, returZile
- [ ] `#1` — Afișează data de când e vânzătorul activ (câmpul `createdAt` din Register)
- [ ] `#2` — Secțiunea „Produse" afișează listingurile aprobate + publicate ale vânzătorului, paginate (12/pagină)
- [ ] `#2` — Fiecare card produs are link spre `/product/:id`
- [ ] `#3` — Secțiunea „Recenzii firmă" afișează recenziile VendorReview cu rating + comentariu + data
- [ ] `#3` — Rating mediu vendor (1–5 stele) calculat din VendorReview, vizibil în header-ul paginii
- [ ] `#4` — Badge „Depozit propriu" dacă `orasDepozit` e completat, „Dropshipping" dacă nu
- [ ] `#5` — User autentificat poate lăsa o recenzie vendor (1 recenzie per user per vendor, același pattern ca Review.js)
- [ ] `#5` — User neautentificat vede formularul dezactivat cu mesaj „Autentifică-te pentru a lăsa o recenzie"

---

## Out of Scope

- Pagina de vendor în dashboard-ul vendorului (există deja VendorProfilePanel)
- Chat / mesagerie cu vânzătorul
- Admin-moderation pentru recenzii vendor
- Statistici publice de vânzări (venituri, număr de comenzi)
- Follow / favorite vendor
