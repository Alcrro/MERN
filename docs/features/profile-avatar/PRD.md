# PRD: Profile Avatar Upload

> **Status:** `Shipped`
> **Owner:** Alexandru Roventa
> **Last updated:** 2026-07-17
> **Related tech spec:** [tech-spec.md](./tech-spec.md)

---

## Problem Statement

**Current state:** Avatarul utilizatorului este o literă colorată generată din numele lui, afișată în header, sidebar profil, drawer mobil și bottom nav.

**Pain point:** Utilizatorul nu poate personaliza profilul cu o fotografie proprie — experiența e impersonală și nu permite diferențierea vizuală.

**Why now:** Câmpul `avatar` există deja pe modelul User (dar e mereu `null`). Cloudinary + `POST /api/upload/image` sunt deja funcționale. Costul e mic: un endpoint nou + UI simplu.

---

## User Stories

| # | Role | Want to | So that |
|---|------|---------|---------|
| 1 | client | încarc o fotografie de profil | profilul meu arată personalizat |
| 2 | client | văd preview-ul pozei înainte să o salvez | știu cum va arăta |
| 3 | client | văd poza mea în header și în sidebar | e consistent pe tot site-ul |

---

## Acceptance Criteria

- [ ] `#1` — În Setări cont există un buton "Schimbă poza de profil" care deschide un file picker (image/*)
- [ ] `#1` — La selectare, imaginea e uploadată pe Cloudinary via `POST /api/upload/image`
- [ ] `#1` — URL-ul rezultat e salvat pe user via `PUT /api/auth/me` și persistat în DB
- [ ] `#2` — Între selectare și salvare se afișează preview circular al imaginii alese
- [ ] `#3` — Dacă `user.avatar` există, se afișează `<img>` în loc de litera colorată în: Profile sidebar, UserMenu header, MobileDrawer, BottomNav
- [ ] `#3` — Dacă `user.avatar` e null, fallback la litera colorată (comportament actual)

---

## Out of Scope

- Crop / resize în browser (se uploadează as-is)
- Ștergerea pozei (buton "Șterge poza") — iterație viitoare
- Validare dimensiune maximă pe frontend (Cloudinary o face pe backend)
- Avatar pe recenzii de produs sau vendor reviews
