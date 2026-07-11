# PRD — Product Catalog

- **Date:** 2026-07-11
- **Status:** Shipped

## Problem Statement

Platforma are nevoie de un catalog master de produse, independent de listingurile vânzătorilor, care să servească drept sursă de adevăr pentru specificații, imagini și prețuri de referință. Vânzătorii nu adaugă produse de la zero — le aleg din catalog și setează doar prețul și stocul propriu. Adminii gestionează catalogul; vânzătorii îl răsfoiesc și publică variante.

## User Stories

1. **Admin** poate lista toate intrările din catalog, filtrat pe categorie, paginate.
2. **Admin** poate adăuga o intrare nouă cu kind, brand, specs specifice categoriei și imagini.
3. **Admin** poate edita o intrare existentă din catalog.
4. **Admin** poate șterge o intrare din catalog.
5. **Vendor** poate răsfoi catalogul pe categorii (Electronics, Clothing, etc.) și sub-tipuri (Telefon, Laptop…).
6. **Vendor** poate căuta în catalog după brand/model cu autocomplete debounced (min 2 caractere, full-text search MongoDB).
7. **Vendor** poate expanda o intrare din catalog și seta preț + stoc per culoare disponibilă.
8. **Vendor** poate publica câte o variantă de culoare separat, fiecare creând un listing cu `listingStatus: pending`.
9. **Vendor** poate propune un produs inexistent în catalog via `?view=add` (VendorProductForm în același dashboard).
10. **Oricine** poate apela `GET /api/catalog/all` și `GET /api/catalog/` fără autentificare.

## Acceptance Criteria

- [x] `GET /api/catalog/all?kind=&brand=&tip=&page=&limit=` returnează `{ results, total, page, pages }`
- [x] `GET /api/catalog/?q=&kind=&limit=` full-text search, returnează `{ results, count }`
- [x] CRUD admin protejat cu `protect + authorize("admin")`
- [x] Vendor vede categorii ca pills orizontale, sub-tipuri ca chips secundare
- [x] Skeleton loading (8 rânduri animate shimmer) la fetch
- [x] Rând expandabil cu tabel variante per culoare (preț, cantitate, disponibilitate)
- [x] Publish per culoare → creează listing propriu via `POST /api/vendor/products`
- [x] Culoarea publicată devine disabled cu ✓ Publicat
- [x] `?view=add` pe ruta catalog deschide VendorProductForm în loc de catalog panel
- [x] AdminCatalog redirecționează la `/` dacă userul nu e admin

## Out of Scope / Gaps

- [ ] `culoare[]` și `refPrice` nu sunt editabile în `CatalogEntryModal` (doar prin seeder)
- [ ] `CatalogBrowserModal` implementat dar neimportat nicăieri (component mort)
- [ ] `createCatalogEntry` nu validează body explicit (doar Mongoose validation)
- [ ] `searchCatalog` nu paginează — max 20 rezultate fără suport `page`
- [ ] `CatalogAdmin` și `CatalogEntryModal` lipsă dark mode CSS
- [ ] Nicio notificare/toast după publish reușit — doar cell disabled
