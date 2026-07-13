# PRD: Vendor Profile

> **Status:** `Shipped`
> **Owner:** Alexandru Roventa
> **Last updated:** 2026-07-13
> **Related tech spec:** [tech-spec.md](./tech-spec.md)
> **Depends on:** `vendor-dashboard` (shopName/shopDescription deja existente)

---

## Problem Statement

**Current state:** Vendorii au doar `shopName` + `shopDescription`. Când un client vede `SellerPicker` pe pagina unui produs, nu știe nimic despre vânzător — nicio informație legală, nicio estimare de livrare, nicio adresă de contact.

**Pain points:**
1. **Client:** Nu știe dacă vânzătorul e o firmă sau un particular, din ce oraș vine coada, cât durează livrarea sau cum poate returna produsul.
2. **Vendor:** Nu poate comunica avantajele sale față de alți vendori (livrare rapidă, depozit local, etc.).
3. **Legal/compliance:** Platforma nu colectează CUI sau denumire juridică — nu există bază pentru facturare sau dispute.

**Why now:** `SellerPicker` e implementat. Fără date de profil, seller row-ul afișează doar preț — nu e suficient pentru decizia de cumpărare.

---

## User Stories

| # | Role | Want to | So that |
|---|------|---------|---------|
| 1 | vendor | să-mi completez profilul cu CUI și denumire firmă | platforma știe că sunt o entitate legală |
| 2 | vendor | să specific din ce oraș livrez și în câte zile | clienții știu la ce să se aștepte |
| 3 | vendor | să setez politica de retur (N zile) | clienții pot compara termenele de retur între vendori |
| 4 | vendor | să adaug un email și telefon de contact public | clienții mă pot contacta înainte de comandă |
| 5 | client | să văd în SellerPicker: oraș, zile livrare, tip entitate | pot alege vânzătorul în cunoștință de cauză |
| 6 | client | să văd pe pagina unui vendor: toate detaliile firmei | pot verifica legitimitatea vânzătorului |
| 7 | admin | să văd CUI-ul și denumirea juridică a fiecărui vendor | pot valida că entitatea e înregistrată legal |

---

## Acceptance Criteria

- [x] `#1` — `PUT /api/vendor/profile` acceptă `cui`, `denumireFirma`, `tipEntitate`; salvează în `vendorProfile` pe user
- [x] `#1` — CUI validat: 2–10 cifre (format RO)
- [x] `#2` — `zileLivrare: { min, max }` — `min <= max` validat în controller
- [x] `#2` — `orasDepozit` — string liber, max 100 caractere
- [x] `#3` — `returZile` — număr pozitiv, default 30
- [ ] `#4` — `email` și `telefon` — opționale, fără validare format server-side (doar model-level regex pe `phone` cont, nu pe `vendorProfile.telefon`/`emailContact`)
- [x] `#5` — `GET /api/products/sellers/:catalogRef` populează `vendorProfile` (orasDepozit, zileLivrare, tipEntitate)
- [x] `#5` — `SellerRow` afișează: orasDepozit, zile livrare, retur (cu iconițe emoji)
- [x] `#6` — Pagina `/vendor/dashboard/profile` cu formular complet, loading + error + success state
- [x] `#7` — `GET /api/admin/vendors` returnează lista vendorilor cu `vendorProfile.cui` + `denumireFirma`

---

## Out of Scope

- Verificare CUI real prin API ANAF (v1 — doar validare format)
- Upload documente legale (contract, certificat înregistrare)
- Rating per vendor calculat din recenzii
- Harta depozitelor / calcul distanță livrare
- Notificări la expirare date legale
