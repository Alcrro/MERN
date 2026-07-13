# Frontend TODOs: Product Ecosystem

> **Last updated:** 2026-07-13
> **Stack:** React 18, RTK Query, Redux Toolkit, React Router v6, plain CSS
> **Conventions:** CLAUDE.md — atomic design, one hook = one action, co-located CSS

---

## Phase 1 — Data layer

> Goal: datele curg de la API la consolă. Fără UI.

- [x] Adaugă endpoint în `frontend/src/features/product/rtkProducts.js`
- [x] Exportă `useGetEcosystemQuery` din același fișier
- [x] Exportă `useConfigureEcosystemMutation` din același fișier (`POST /api/ecosystem/configure`)
- [ ] Verifică în Network tab: `GET /api/ecosystem/Telefon` returnează shape corect
- [ ] Testează `skip`: `useGetEcosystemQuery(tip, { skip: !tip })` returnează `undefined` când `tip=""`

---

## Phase 2 — Core UI

> Goal: widgetul e funcțional end-to-end, fără polish.

- [x] Creează `src/Components/products/ProductEcosystem/`
  - [x] `index.js`
  - [x] `EcosystemItem.jsx` ← atom
  - [x] `EcosystemLevel.jsx` ← molecule
  - [x] `EcosystemTask.jsx` ← molecule cu `useState(isOpen)`
  - [x] `ProductEcosystem.jsx` ← organism cu skeleton loading
  - [x] `EcosystemCarousels.jsx` ← organism — carusele cu produse reale din catalog sub grid
  - [x] `ProductEcosystem.css`
- [x] Montat în `Products.jsx` deasupra `FilterContent`
- [x] `EcosystemCarousels` montat în `Products.jsx` sub grila de produse (outside `.container-products-outer`)
- [x] `ProductConfigurator` montat în `Products.jsx` după `EcosystemCarousels`
- [x] `ProductConfigurator` montat și în `SingleProducts.jsx` (pe pagina de produs single)
- [ ] Verifică în browser că widgetul apare pe `/products/electronice/telefon`
- [ ] Verifică că widgetul NU apare pe `/products/electronice`

---

## Phase 3 — Polish & edge cases

> Goal: production-ready.

- [x] **Loading skeleton** — 4 linii gri pulsante cât timp `isLoading=true` (implementat cu `eco-pulse` animation)
- [x] **Empty state** — dacă `data.data` e undefined → returnează `null`, fără crash; `EcosystemLevel` returnează `null` dacă `items` e gol
- [x] **Dark mode** — `html[data-theme="dark"] .ecosystem-*` la finalul CSS — implementat
- [x] **Mobile** — `ecosystem-task__header` are `min-height: 44px` la ≤ 768px
- [x] **Accessibility** — header-ul de task este `<button type="button">` cu `aria-expanded={isOpen}`
- [x] **CSS** — clase cu prefix `.ecosystem-` (`.ecosystem-level`, `.ecosystem-task`, `.ecosystem-item`, `.ecosystem-carousels`); fără culori hardcodate (excepție: `#ef4444` pentru nivelul `critical` — acceptabil)
- [ ] Niciun `console.log`
- [ ] `npm run build` — zero warnings noi

---

## Phase 4 — ProductConfigurator (feature suplimentar implementat)

> Goal: utilizatorul selectează scenarii și primește recomandări din catalogul real.

- [x] Creează `src/Components/products/ProductConfigurator/`
  - [x] `ProductConfigurator.jsx` ← organism
  - [x] `ProductConfigurator.css`
  - [x] `index.js`
- [x] Consumă `useGetEcosystemQuery` pentru a extrage scenariile (task-urile) din ecosistem
- [x] Consumă `useConfigureEcosystemMutation` pentru `POST /api/ecosystem/configure`
- [x] Afișează chips-uri selectabile din task-urile ecosistemului
- [x] Include câmp textarea pentru context adițional liber
- [x] Afișează rezultate ca grile de `Cards` grupate pe categorie (`rec.tip`)
- [ ] Stare de eroare (dacă mutation returnează eroare)
- [ ] Empty state dacă niciun produs nu e disponibil pentru recomandările AI

---

## Files touched

| Fișier | Status | Note |
|--------|--------|------|
| `features/product/rtkProducts.js` | [x] | `getEcosystem` + `configureEcosystem` endpoints adăugate |
| `Components/products/ProductEcosystem/ProductEcosystem.jsx` | [x] | organism creat |
| `Components/products/ProductEcosystem/EcosystemLevel.jsx` | [x] | molecule creat |
| `Components/products/ProductEcosystem/EcosystemTask.jsx` | [x] | molecule creat |
| `Components/products/ProductEcosystem/EcosystemItem.jsx` | [x] | atom creat |
| `Components/products/ProductEcosystem/EcosystemCarousels.jsx` | [x] | organism nou — carusele produse reale |
| `Components/products/ProductEcosystem/ProductEcosystem.css` | [x] | stiluri co-located, dark mode, mobile |
| `Components/products/ProductEcosystem/index.js` | [x] | re-export |
| `Components/products/ProductConfigurator/ProductConfigurator.jsx` | [x] | organism configurator AI |
| `Components/products/ProductConfigurator/ProductConfigurator.css` | [x] | stiluri co-located |
| `Components/products/ProductConfigurator/index.js` | [x] | re-export |
| `Components/products/products/Products.jsx` | [x] | montare widget sidebar + carousele + configurator |
| `Components/products/singleProducts/SingleProducts.jsx` | [x] | montare configurator |
