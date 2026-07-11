# PRD — Vendor Dashboard

- **Date:** 2026-07-11
- **Status:** Shipped

## Problem Statement

Vânzătorii au nevoie de un spațiu propriu în aplicație unde să-și gestioneze produsele, comenzile și performanța vânzărilor. Fluxul începe cu o cerere de înregistrare ca vânzător (aprobată manual de admin), după care accesul la dashboard e restricționat doar utilizatorilor cu `role: "vendor"`. Produsele adăugate rămân în stare `pending` până la aprobarea adminului.

## User Stories

1. **Utilizator** poate accesa `/vendor/apply` și trimite o cerere de vânzător cu `shopName` + `shopDescription`.
2. **Utilizator** cu cerere trimisă primește mesaj de confirmare și este redirecționat când revine pe pagina de aplicare.
3. **Vendor** este redirecționat automat la `/auth/login` dacă nu e autentificat.
4. **Vendor** este redirecționat la `/vendor/apply` dacă e autentificat dar rolul nu e `"vendor"`.
5. **Vendor** vede în Overview statistici: total/aprobate/pending/respinse listări + unități vândute + venit estimat.
6. **Vendor** poate filtra produsele proprii pe status (Toate / Aprobate / În așteptare / Respinse).
7. **Vendor** poate edita un produs existent — produsul revine automat la `pending` și necesită re-aprobare.
8. **Vendor** poate șterge un produs propriu cu confirmare.
9. **Vendor** poate vedea comenzile care conțin produsele sale, cu detalii client și status.
10. **Vendor** poate vedea analytics: status listări + unități vândute + venit estimat.
11. **Vendor** poate naviga între secțiuni prin sidebar persistent.

## Acceptance Criteria

- [x] `POST /api/vendor/apply` setează `vendorStatus: "pending"` și salvează `shopName`
- [x] `GET /api/vendor/products` returnează doar produsele vânzătorului autentificat
- [x] `POST /api/vendor/products` creează listing cu `listingStatus: "pending"` automat
- [x] `PUT /api/vendor/products/:id` resetează `listingStatus: "pending"` + `rejectionReason: null`
- [x] `DELETE /api/vendor/products/:id` verifică ownership înainte de ștergere
- [x] `GET /api/vendor/orders` returnează comenzi care conțin produsele vânzătorului
- [x] `GET /api/vendor/analytics` returnează aggregate: statusCounts + totalUnitsSold + estimatedRevenue
- [x] VendorLayout redirecționează la `/auth/login` dacă !user, la `/vendor/apply` dacă role ≠ vendor
- [x] VendorSidebar arată 5 link-uri cu NavLink active state
- [x] VendorProductsPanel: tab-uri filtrare status, empty state cu link spre catalog
- [x] VendorProductRow: imagine, info, preț, stoc, ListingStatusBadge, edit, delete
- [x] ListingStatusBadge: tooltip cu `rejectionReason` când status = rejected
- [x] VendorApplyForm: success state după submit reușit

## Out of Scope / Gaps

- [ ] VendorOverview CTA "Adaugă produs" navighează la `/vendor/dashboard/products/add` (rută inexistentă)
- [ ] Nicio paginare UI pentru produse (backend suportă `page`/`limit`, frontend nu)
- [ ] Nicio paginare pentru comenzi (backend returnează toate)
- [ ] `window.confirm` pentru delete — nu e a11y-friendly
- [ ] Nicio stare de eroare în VendorOverview, VendorAnalyticsPanel, VendorOrdersPanel
- [ ] Analytics nu arată evoluție în timp (doar totale)
- [ ] Admin nu poate aproba/respinge cereri vendor din UI (doar din DB direct)
