# PRD: Product Catalog

> **Status:** `Shipped`
> **Owner:** Alexandru Roventa
> **Last updated:** 2026-07-11
> **Related tech spec:** [tech-spec.md](./tech-spec.md)

---

## Problem Statement

**Current state:** Vendorii completează manual toate câmpurile când adaugă un produs nou (brand, model, specs, etc.). Nu există nicio sursă de adevăr pentru produsele cunoscute (ex: iPhone 15 Pro, Samsung Galaxy S24).

**Pain point:** Același produs apare în DB cu date inconsistente (greșeli de scriere, specs lipsă, imagini de calitate proastă). Vendorii pierd timp completând specs pe care le știe toată lumea.

**Why now:** Vendor dashboard-ul e funcțional. Pasul logic următor e să reducem fricțiunea la adăugarea unui produs și să creștem calitatea datelor din catalog.

---

## User Stories

| # | Role | Want to | So that |
|---|------|---------|---------|
| 1 | vendor | să caut un produs după nume/model și să îl selectez | câmpurile să se completeze automat cu specs corecte |
| 2 | vendor | să văd imagini oficiale ale produsului din catalog | nu trebuie să uploadez manual imagini de bază |
| 3 | admin | să adaug/editez produse în catalogul master | vendorii au întotdeauna date corecte și actuale |
| 4 | vendor | să adaug un produs care nu există în catalog | pot vinde și produse nișă fără să fiu blocat |

---

## Acceptance Criteria

- [x] `#1` — Câmpul de căutare din `VendorProductForm` returnează sugestii după minim 2 caractere
- [x] `#1` — La selectarea unui produs din catalog, câmpurile brand, model, specs se completează automat
- [x] `#1` — Vendorul poate modifica orice câmp auto-completat înainte de submit
- [x] `#2` — Imaginile din catalog apar pre-selectate în `ImageUploader`; vendorul le poate șterge sau adăuga altele
- [x] `#3` — Adminul are un endpoint protejat pentru a crea/edita/șterge intrări din catalog
- [x] `#4` — Dacă nu selectează nimic din catalog, formularul funcționează exact ca înainte (completare manuală)

---

## Out of Scope

- Import bulk din fișier CSV/Excel (iterație viitoare)
- Sincronizare automată cu API-uri externe de produse
- Rating/review pe produsele din catalog (nu pe listing-ul vendorului)
- Catalog pentru categoriile Furniture, HomeGarden, Books (doar Electronics + Clothing în v1)
