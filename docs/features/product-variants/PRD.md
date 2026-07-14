# PRD: Product Variants

> **Status:** `Shipped`
> **Owner:** Alexandru Roventa
> **Last updated:** 2026-07-13
> **Related tech spec:** [tech-spec.md](./tech-spec.md)

---

## Problem Statement

**Current state:** Fiecare produs are un singur `price` și `stock` la nivel de document. Culorile sunt hardcodate în `DEMO_COLORS` (constante false), `stocare` este un string scalar. Nu există posibilitatea de a defini variante reale cu prețuri diferite.

**Pain point:** Un vendor nu poate lista același produs în variante (ex: tricou S/M/L la prețuri diferite, telefon 128GB vs 256GB cu preț diferit). Clienții văd un singur preț indiferent de opțiunile alese.

**Why now:** Sistemul multi-vendor e deja funcțional. Pasul logic următor e ca fiecare listing să suporte N variante cu atribute generice, preț și stoc proprii — aplicabil oricărui tip de produs (electronice, îmbrăcăminte, mobilă, cărți etc.).

---

## User Stories

| # | Role | Want to | So that |
|---|------|---------|---------|
| 1 | client | selectez o combinație de atribute (ex: Culoare + Mărime) | văd prețul și stocul exact pentru acea variantă |
| 2 | client | opțiunile indisponibile să fie dezactivate | nu pot selecta o combinație inexistentă |
| 3 | vendor | definesc N variante cu atribute libere când creez/editez un produs | pot vinde același produs în versiuni diferite cu prețuri diferite |
| 4 | vendor | fiecare variantă să aibă stoc, preț și imagini proprii | inventarul e corect per variantă |

---

## Acceptance Criteria

- [x] `#1` — Selectând o valoare pentru un atribut, panoul de preț se actualizează instant fără reload
- [x] `#1` — Stocul afișat reflectă varianta selectată
- [x] `#2` — Combinațiile de atribute fără variantă definită nu pot fi selectate
- [x] `#2` — Când un atribut e selectat, valorile invalide ale celorlalte atribute sunt dezactivate
- [x] `#3` — Formularul vendor permite adăugarea/ștergerea de variante cu chei de atribut libere
- [x] `#3` — Fiecare variantă are câmpuri: atribute (key-value liber), preț, stoc, imagini
- [x] `#4` — Stocul per variantă se actualizează independent
- [x] Produsele existente funcționează corect după migrare (o singură variantă cu `attributes: {}`)
- [x] `Cards.jsx` afișează `minPrice` (cel mai mic preț dintre variante)
- [x] Prețul top-level și stocul top-level sunt eliminate complet din model

---

## Out of Scope

- Variante cu imagini diferite per atribut (ex: swipe la schimbarea culorii) — iterație viitoare
- Filtrare pe prețul unei variante specifice în pagina de produse (se filtrează după `minPrice`)
- Variante la nivel de CatalogProduct (fiecare vendor listing are variantele lui)
- Comparare variante side-by-side
