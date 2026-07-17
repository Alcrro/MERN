# PRD: Profile Summary Dashboard

> **Status:** `Shipped`
> **Owner:** Alexandru Roventa
> **Last updated:** 2026-07-17
> **Related tech spec:** [tech-spec.md](./tech-spec.md)

---

## Problem Statement

**Current state:** Pagina default `/profile` afișează doar un formular simplu cu nume, email, telefon și rol. Utilizatorul trebuie să navigheze manual în fiecare sub-secțiune pentru a vedea comenzile, adresa, cardul de fidelitate sau cardurile salvate.

**Pain point:** Nu există o vedere de ansamblu — utilizatorul nu știe dacă are comenzi active, ce adresă e implicită, câte credite are sau ce card e setat implicit fără să deschidă fiecare meniu separat.

**Why now:** Toate datele există deja în backend (endpoints + RTK queries funcționale). Costul este zero backend, pur frontend — un dashboard de summary rapid de implementat.

---

## User Stories

| # | Role | Want to | So that |
|---|------|---------|---------|
| 1 | client | văd la o privire comenzile mele active/recente | știu în ce stadiu sunt |
| 2 | client | văd adresa mea implicită direct pe dashboard | nu trebuie să intru în "Adresele mele" |
| 3 | client | văd un summary al cardului meu Alcrro (credite, puncte, tier) | știu rapid ce beneficii am |
| 4 | client | văd cardul de plată setat implicit | știu ce card se va folosi la checkout |
| 5 | vendor | văd câteva statistici cheie (produse, comenzi, rating) direct pe dashboard | am context rapid fără să intru în panoul de vendor |

---

## Acceptance Criteria

- [x] `#1` — Se afișează maxim 5 comenzi cu status Pending sau Processing, cu număr comandă, dată și total
- [x] `#1` — Dacă nu există comenzi active, se arată un mesaj gol + link "Comenzile mele"
- [x] `#2` — Se afișează adresa implicită (label, stradă, oraș, județ, cod poștal, telefon)
- [x] `#2` — Dacă nu există adresă implicită, se afișează un CTA "Adaugă adresă"
- [x] `#3` — Se afișează AlcrroCard cu credite, puncte, tier și număr card mascat
- [x] `#3` — Dacă userul nu are card Alcrro, se afișează CTA "Activează cardul"
- [x] `#4` — Se afișează cardul de plată implicit (brand, last4, expiry) cu visual identic SavedCardItem
- [x] `#4` — Dacă nu există card salvat, se afișează CTA "Adaugă card"
- [x] `#5` — Dacă `user.role === 'vendor'`, se afișează un widget cu: produse live, pending, unități vândute, venit
- [x] `#5` — Widget-ul de vendor nu apare deloc dacă user-ul nu e vendor

---

## Out of Scope

- Editarea datelor direct din dashboard (redirecționare în sub-pagini, nu inline edit)
- Istoricul complet al comenzilor (maxim 5 active pe dashboard)
- Grafice sau chart-uri pentru vendor (doar numere cheie)
- Notificări sau badges pe meniuri
