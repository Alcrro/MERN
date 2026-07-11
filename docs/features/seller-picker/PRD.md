# PRD: Seller Picker

> **Status:** `Shipped`
> **Owner:** Alexandru Roventa
> **Last updated:** 2026-07-11
> **Related tech spec:** [tech-spec.md](./tech-spec.md)
> **Depends on:** `docs/features/product-catalog/` — trebuie implementat primul

---

## Problem Statement

**Current state:** Dacă 5 vendori vând iPhone 15 Pro, apar 5 carduri separate în listing — catalog poluat, experiență proastă pentru cumpărător.

**Pain point:** Cumpărătorul nu poate compara vendorii pentru același produs. Nu există un concept de "cel mai bun preț" sau "alege de la cine cumperi".

**Why now:** `ProductCatalog` e documentat și urmează să fie implementat. Seller Picker e stratul de UI care valorifică acel catalog — fără el, catalogul nu aduce niciun beneficiu vizibil utilizatorului.

---

## User Stories

| # | Role | Want to | So that |
|---|------|---------|---------|
| 1 | client | să văd un singur card per produs în listing | catalogul să fie curat, fără duplicate |
| 2 | client | să văd prețul minim disponibil pe card | știu instant cea mai bună ofertă |
| 3 | client | să aleg vendorul pe pagina produsului | pot compara prețuri, stoc și rating vendor |
| 4 | client | să adaug în coș de la vendorul ales | comanda merge la vendorul corect |
| 5 | vendor | listarea mea să apară în picker când e aprobată | câștig vizibilitate fără a duplica produsul |

---

## Acceptance Criteria

- [ ] `#1` — Listing-ul afișează un singur card per `catalogRef`; produsele fără `catalogRef` apar normal (backwards compatible)
- [ ] `#2` — Prețul afișat pe card e `MIN(price)` dintre toate listările aprobate cu același `catalogRef`
- [ ] `#2` — Badge "N oferte" apare pe card când există mai mult de un seller
- [ ] `#3` — Pe pagina produsului, secțiunea `SellerPicker` listează toți vendorii aprobați cu preț + stoc + rating vendor
- [ ] `#3` — Primul seller din listă e cel cu prețul minim (sortat automat)
- [ ] `#4` — Butonul "Adaugă în coș" din `SellerPicker` adaugă listarea vendorului selectat (nu a catalogului)
- [ ] `#5` — Un listing vendor cu `listingStatus: "approved"` apare în picker în max 1 minut (fără cache vechi)

---

## Out of Scope

- Rating per vendor (doar prețul și stocul în v1)
- Filtrare/sortare în picker după altceva decât preț
- Notificări când un seller nou apare pentru un produs urmărit
- Produse fără `catalogRef` — rămân neafectate, afișate individual
