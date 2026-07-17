# PRD: Alcrro Shop Card

> **Status:** `Shipped`
> **Owner:** Alexandru Roventa
> **Last updated:** 2026-07-16
> **Related tech spec:** [tech-spec.md](./tech-spec.md)

---

## Problem Statement

**Current state:** Userii fac comenzi fără niciun mecanism de fidelizare. Nu există un motiv tangibil să se întoarcă pe platformă sau să cumpere mai mult.

**Pain point:** Platforma nu oferă niciun beneficiu post-cumpărare — nicio recompensă, niciun sold acumulat, niciun motiv de retenție față de un alt shop.

**Why now:** Stack-ul Stripe este deja integrat (PaymentIntent, webhook). Adăugarea unui wallet de credite și a unui sistem de puncte reutilizează infrastructura existentă fără efort major.

---

## User Stories

| # | Role | Want to | So that |
|---|------|---------|---------|
| 1 | client | văd cardul meu Alcrro Shop cu soldul de credite și puncte | știu ce am acumulat |
| 2 | client | cumpăr pachete de credite prin Stripe | încarc soldul cardului și plătesc comenzi cu el |
| 3 | client | câștig puncte automat la fiecare comandă finalizată | sunt recompensat pentru loialitate |
| 4 | client | convertesc puncte acumulate în credite | folosesc recompensele ca reducere reală |
| 5 | client | plătesc o comandă integral sau parțial din credite | evit să introduc cardul bancar de fiecare dată |
| 6 | client | văd istoricul tranzacțiilor cardului | am transparență completă |
| 7 | client | urc la tier Silver sau Gold pe măsură ce acumulez puncte | primesc un bonus mai mare la acumulare |
| 8 | client | trimit un link de referral unui prieten | câștig puncte bonus când prietenul finalizează prima comandă |
| 9 | client | văd produse disponibile exclusiv cu credite | am un motiv în plus să acumulez credite |

---

## Acceptance Criteria

- [ ] `#1` — Cardul este creat automat la înregistrarea unui user nou
- [ ] `#1` — Pagina `/account/my-card` afișează cardul animat cu: prenume, număr card mascat, sold credite, puncte totale și tier curent
- [ ] `#2` — Există 4 pachete de credite: 50/100/250/500, cu discount progresiv
- [ ] `#2` — Plata pachetelor se face prin Stripe; la succes creditele sunt adăugate instant
- [ ] `#3` — La schimbarea statusului comenzii în `Delivered`, punctele sunt calculate și adăugate automat
- [ ] `#3` — Formula: `floor(totalPrice * 0.1)` puncte, cu bonus tier aplicat
- [ ] `#4` — Butonul „Convertește puncte" transformă 10 puncte → 1 credit (minim 10 puncte)
- [ ] `#5` — La checkout există opțiunea „Plătește cu credite" dacă soldul >= 1 credit
- [ ] `#5` — Plata parțială e permisă: userul alege câte credite aplică, restul se plătește cu card
- [ ] `#6` — Istoricul afișează toate tranzacțiile: tip, sumă, dată, descriere
- [ ] `#7` — Tier-ul se recalculează automat după fiecare câștig de puncte
- [ ] `#7` — Standard: 0–499 pct (+0%), Silver: 500–1999 pct (+10%), Gold: 2000+ pct (+25%)
- [ ] `#8` — Fiecare user are un cod de referral unic; userul referit primește 50 puncte bonus la prima comandă; referrer primește 100 puncte
- [ ] `#9` — Produsele cu `creditsOnly: true` apar cu un badge special și nu pot fi cumpărate cu card bancar

---

## Out of Scope

- Expirarea punctelor sau creditelor (faza 2)
- Admin panel pentru ajustarea manuală a soldului
- Transfer de credite între useri
- Integrare cu cashback extern (ex: Visa/Mastercard)
- Notificări email la câștig puncte (se adaugă după ce fluxul de bază funcționează)
- Cardul fizic tipărit
