# PRD — Vendor Dashboard

- **Date:** 2026-07-13
- **Status:** Shipped

## Problem Statement

Vânzătorii au nevoie de un spațiu propriu în aplicație unde să-și gestioneze produsele, comenzile și performanța vânzărilor. Fluxul începe cu o cerere de înregistrare ca vânzător (aprobată manual de admin), după care accesul la dashboard e restricționat doar utilizatorilor cu `role: "vendor"`. Produsele adăugate rămân în stare `listingStatus: "pending"` până la aprobarea adminului, iar după aprobare vânzătorul le publică manual în shop (`publishStatus: "published"`).

## User Stories

1. **Utilizator** poate accesa `/vendor/apply` și trimite o cerere de vânzător cu `shopName` + `shopDescription`.
2. **Utilizator** cu cerere trimisă primește mesaj de confirmare și este redirecționat când revine pe pagina de aplicare.
3. **Vendor** este redirecționat automat la `/auth/login` dacă nu e autentificat.
4. **Vendor** este redirecționat la `/vendor/apply` dacă e autentificat dar rolul nu e `"vendor"`.
5. **Vendor** vede în Overview statistici: total/aprobate/pending/respinse listări + unități vândute + venit estimat.
6. **Vendor** poate filtra produsele proprii pe status (Toate / Publicate / Draft / În așteptare / Respinse).
7. **Vendor** poate edita un produs existent — produsul revine automat la `listingStatus: "pending"` și `publishStatus: "draft"`.
8. **Vendor** poate șterge un produs propriu cu confirmare.
9. **Vendor** poate publica un produs aprobat (`listingStatus: "approved"`) apăsând "Publică" — doar dacă produsul trece validarea locală (imagine, descriere, preț, stoc).
10. **Vendor** vede badge "Publicat" / "Gata de publicare" pe produsele aprobate, și lista de probleme dacă produsul nu e complet.
11. **Vendor** poate vedea comenzile care conțin produsele sale, cu detalii client și status.
12. **Vendor** poate vedea analytics: status listări (inclusiv câte sunt publicate) + unități vândute + venit estimat.
13. **Vendor** poate completa profilul firmei (CUI, denumire, tip entitate, depozit, livrare, retur, contact).
14. **Vendor** poate naviga între secțiuni prin sidebar persistent (6 linkuri).

## Acceptance Criteria

- [x] `POST /api/vendor/apply` setează `vendorStatus: "pending"` și salvează `shopName`
- [x] `GET /api/vendor/products` returnează doar produsele vânzătorului autentificat
- [x] `GET /api/vendor/products` filtrare pe status compus (published/draft/pending/rejected)
- [x] `POST /api/vendor/products` creează listing cu `listingStatus: "pending"`, `publishStatus: "draft"`, `sku` generat
- [x] `PUT /api/vendor/products/:id` resetează `listingStatus: "pending"` + `publishStatus: "draft"` + `rejectionReason: null`
- [x] `PUT /api/vendor/products/:id/publish` validează ownership + listingStatus + completitudine + unicitate catalogRef
- [x] `DELETE /api/vendor/products/:id` verifică ownership înainte de ștergere
- [x] `GET /api/vendor/orders` returnează comenzi care conțin produsele vânzătorului
- [x] `GET /api/vendor/analytics` returnează aggregate: statusCounts + publishedListings + totalUnitsSold + estimatedRevenue
- [x] `PUT /api/vendor/profile` actualizează `vendorProfile` subdocument cu validări CUI/tipEntitate/zileLivrare
- [x] VendorLayout redirecționează la `/auth/login` dacă !user, la `/vendor/apply` dacă role ≠ vendor
- [x] VendorSidebar arată 6 link-uri cu NavLink active state
- [x] VendorProductsPanel: 5 tab-uri filtrare status, skeleton loading, empty state cu link spre catalog
- [x] VendorProductRow: imagine, info, preț, stoc, ListingStatusBadge, buton Publică, edit, delete
- [x] VendorProductRow: `getIssues()` validare locală + badge "Publicat"/"Gata de publicare"
- [x] ListingStatusBadge: tooltip cu `rejectionReason` când status = rejected
- [x] VendorAnalyticsPanel: două secțiuni (Status listări / Vânzări) cu skeleton loading
- [x] VendorOrdersPanel: skeleton loading cu VendorOrderRowSkeleton
- [x] VendorProfilePanel: formular 3 secțiuni (legal / operațional / contact), pre-populat din GET /vendor/me
- [x] VendorApplyForm: success state după submit reușit

## Out of Scope / Gaps

- [ ] Nicio paginare UI pentru produse (backend suportă `page`/`limit`, frontend nu)
- [ ] Nicio paginare pentru comenzi (backend returnează toate)
- [ ] `window.confirm` pentru delete — nu e a11y-friendly
- [ ] Nicio stare de eroare în VendorOverview, VendorAnalyticsPanel, VendorOrdersPanel
- [ ] Analytics nu arată evoluție în timp (doar totale)
- [ ] Admin nu poate aproba/respinge cereri vendor din UI (doar din DB direct)
