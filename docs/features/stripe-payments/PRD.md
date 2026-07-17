# PRD: Stripe Payments

> **Status:** `Draft`
> **Owner:** Alexandru Roventa
> **Last updated:** 2026-07-15
> **Related tech spec:** [tech-spec.md](./tech-spec.md)

---

## Problem Statement

**Current state:** Utilizatorii pot plasa o comandă cu metoda de plată „Card", dar nu există nicio procesare reală — câmpul `paymentMethod: "Card"` e stocat fără să se ceară datele cardului sau să se inițieze vreo tranzacție financiară.

**Pain point:** Shop-ul nu poate procesa plăți online. „Ramburs" e singura metodă funcțională end-to-end.

**Why now:** Toate celelalte blocuri de infrastructură sunt gata (order flow cu tranzacții DB, stock management, address management). Stripe e ultimul pas pentru un demo complet și credibil.

---

## User Stories

| # | Role | Want to | So that |
|---|------|---------|---------|
| 1 | client | să plătesc comanda cu cardul direct pe site | să nu mai fiu nevoit să plătesc la livrare |
| 2 | client | să folosesc Google Pay / Apple Pay | să plătesc rapid fără să introduc manual datele cardului |
| 3 | client | să văd confirmarea plății și detaliile cardului folosit (last4, brand) | să știu că tranzacția a avut loc |
| 4 | client | să fiu notificat dacă plata eșuează | să pot reîncerca sau alege altă metodă |
| 5 | admin | să văd statusul plății pe fiecare comandă (`isPaid`, `paidAt`) | să știu ce comenzi sunt confirmate financiar |

---

## Acceptance Criteria

- [ ] `#1` — La checkout cu `paymentMethod: "Card"`, apare un formular Stripe Payment Element embedded (nu redirect extern)
- [ ] `#1` — Utilizatorul introduce datele cardului și apasă „Plătește" — tranzacția e procesată în Stripe test mode
- [ ] `#1` — După plată reușită, comanda are `isPaid: true` și `paidAt` setat
- [ ] `#2` — Google Pay / Apple Pay apar automat în Payment Element dacă browser-ul le suportă (fără cod extra)
- [ ] `#3` — Pagina de confirmare comandă afișează `last4`, `brand` (Visa / Mastercard) și link receipt Stripe
- [ ] `#4` — Dacă plata eșuează, utilizatorul vede mesajul de eroare Stripe (nu crash, nu pagină albă)
- [ ] `#4` — Comanda rămâne în starea `Pending` până la confirmarea webhook — stock-ul e restaurat dacă plata e anulată
- [ ] `#5` — Admin-ul vede în lista de comenzi badge-ul `Paid` / `Unpaid` pe fiecare rând
- [ ] Webhook-ul Stripe e idempotent — același `payment_intent.succeeded` procesat de două ori nu generează duplicate
- [ ] `Ramburs` rămâne funcțional nemodificat

---

## Out of Scope

- Refund inițiat din UI (admin poate face refund din Stripe Dashboard — webhook `charge.refunded` e gestionat, dar nu există buton în app)
- Stripe Connect / split payments cu vendori
- Salvarea cardului pentru plăți viitoare (Stripe Customer + SetupIntent)
- Email de confirmare plată (newsletter/email feature separat)
- Webhooks pentru dispute / chargeback
- Producție (keys reale) — doar test mode
