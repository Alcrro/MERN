# PRD: Saved Payment Methods

> **Status:** `Shipped`
> **Owner:** Alexandru Roventa
> **Last updated:** 2026-07-16
> **Related tech spec:** [tech-spec.md](./tech-spec.md)

---

## Problem Statement

**Current state:** La fiecare comandă, userul trebuie să introducă manual datele cardului bancar. Nu există posibilitatea de a salva un card BT, Revolut, etc. pentru refolosire.

**Pain point:** Flow-ul de checkout e lent și frustrant pentru userii care cumpără frecvent. Reintroducerea datelor cardului la fiecare comandă crește rata de abandon.

**Why now:** Stripe este deja integrat cu PaymentIntent. Adăugarea SetupIntent + Customer API reutilizează același SDK fără infrastructură nouă.

---

## User Stories

| # | Role | Want to | So that |
|---|------|---------|---------|
| 1 | client | salvez un card bancar în contul meu | nu mai introduc datele la fiecare comandă |
| 2 | client | văd lista cardurilor salvate în profilul meu | știu ce carduri am active |
| 3 | client | șterg un card salvat | păstrez doar ce folosesc |
| 4 | client | setez un card ca implicit | este preselectat automat la checkout |
| 5 | client | plătesc cu un card salvat la checkout | finalizez comanda cu un singur click |
| 6 | client | adaug un card nou direct din checkout | nu trebuie să merg în profil mai întâi |

---

## Acceptance Criteria

- [ ] `#1` — Buton „Adaugă card" în `/profile/payment-methods` deschide form Stripe securizat
- [ ] `#1` — Cardul salvat apare în listă cu: brand (Visa/Mastercard etc.), ultimele 4 cifre, data expirării
- [ ] `#2` — Pagina `/profile/payment-methods` listează toate cardurile salvate ale userului
- [ ] `#3` — Buton „Șterge" pe fiecare card elimină cardul din Stripe și din listă
- [ ] `#4` — Buton „Setează implicit" marchează cardul cu o steluță; este preselectat la checkout
- [ ] `#5` — La `CheckoutStepPayment`, dacă există carduri salvate, sunt afișate ca opțiuni radio
- [ ] `#5` — Userul selectează un card salvat → comanda se creează fără `CardElement` nou
- [ ] `#6` — Opțiunea „Card nou" în checkout afișează `CardElement` și permite salvarea pentru viitor

---

## Out of Scope

- Carduri de debit prepaid sau virtual (tratate la fel de Stripe, fără logică specială)
- Limite de număr de carduri salvate (Stripe nu impune, noi nu impunem)
- Notificări la expirarea unui card
- Apple Pay / Google Pay (separat)
- Carduri pentru Ramburs (nu se aplică)
