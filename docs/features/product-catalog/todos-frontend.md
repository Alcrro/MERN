# Frontend TODOs: Product Catalog

> **Last updated:** 2026-07-11
> **Stack:** React 18, RTK Query, Redux Toolkit, React Router v6, plain CSS
> **Conventions:** CLAUDE.md — atomic design, one hook = one action, co-located CSS

---

## Phase 1 — Setup & data layer

> Goal: endpoint de căutare returnează date în consolă. Fără UI.

- [x] Crează `frontend/src/features/catalog/rtkCatalog.js` cu `createApi`
- [x] Adaugă endpoint `useSearchCatalogQuery` — `GET /api/catalog?q=&kind=`
- [x] Înregistrează `catalogApi` în `store.js`
- [ ] Test în browser: Network tab returnează rezultate la query

---

## Phase 2 — CatalogSearch organism

> Goal: componenta e funcțională end-to-end, fără polish.

- [x] Crează `Components/vendor/CatalogSearch/CatalogSearch.jsx`
  - [x] Input de căutare cu debounce 300ms (hook local `useDebounce`)
  - [x] Apelează `useSearchCatalogQuery` doar dacă `q.length >= 2`
  - [x] Afișează dropdown cu rezultate (`brand — specs.model`)
  - [x] La click pe un rezultat, apelează prop `onSelect(catalogEntry)`
  - [x] Buton X pentru a reseta selecția
- [x] Crează `CatalogSearch.css` + `index.js`
- [x] Modifică `VendorProductForm.jsx`:
  - [x] Adaugă `<CatalogSearch kind={kind} onSelect={handleCatalogSelect} />` deasupra câmpurilor
  - [x] Implementează `handleCatalogSelect(entry)`:
    - `setForm({ brand: entry.brand, price: "" })` — prețul rămâne gol
    - `setCatFields(entry.specs)`
    - `setImages(entry.images)`
- [x] Handle loading state — spinner în input
- [x] Handle empty state — mesaj "Niciun produs găsit. Completează manual."
- [x] Handle error state — mesaj discret sub input

---

## Phase 3 — Polish & edge cases

> Goal: production-ready.

- [x] Dark mode — `html[data-theme="dark"] .catalog-search { }` la finalul CSS
- [x] Mobile — dropdown la 375px (max-height + scroll intern)
- [x] Accesibilitate — `role="listbox"`, `aria-activedescendant`, navigare cu taste ↑↓ + Enter + Escape
- [x] CSS — BEM `.catalog-search__input`, `.catalog-search__dropdown`, `.catalog-search__item`
- [x] Debounce — nu se face request dacă query e < 2 caractere
- [x] Duplicate — dacă imaginile din catalog sunt deja în `images`, nu le duplica la re-selecție
- [x] `console.log` — zero în cod final
- [ ] `npm run build` — zero warnings

---

## Files touched

| File | Status | Notes |
|------|--------|-------|
| `features/catalog/rtkCatalog.js` | [x] | nou |
| `app/store.js` | [x] | adaugă `catalogApi` |
| `Components/vendor/CatalogSearch/CatalogSearch.jsx` | [x] | nou organism |
| `Components/vendor/CatalogSearch/CatalogSearch.css` | [x] | nou |
| `Components/vendor/CatalogSearch/index.js` | [x] | nou |
| `Components/vendor/VendorProductForm/VendorProductForm.jsx` | [x] | adaugă CatalogSearch + handleCatalogSelect |
