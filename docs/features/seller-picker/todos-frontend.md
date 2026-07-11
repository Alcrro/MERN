# Frontend TODOs: Seller Picker

> **Last updated:** 2026-07-11
> **Stack:** React 18, RTK Query, Redux Toolkit, React Router v6, plain CSS
> **Conventions:** CLAUDE.md — atomic design, one hook = one action, co-located CSS
> **Requires:** feature `product-catalog` implementat (catalogRef disponibil pe Product)

---

## Phase 1 — Setup & data layer

> Goal: endpoint de sellers returnează date în consolă. Fără UI.

- [ ] Adaugă endpoint `useGetSellersQuery` în `features/product/rtkProducts.js`
  - `GET /api/products/sellers/:catalogRef`
  - tag de invalidare: `["Sellers"]`
- [ ] Test în browser: Network tab returnează lista de sellers pentru un `catalogRef` valid

---

## Phase 2 — SellerPicker organism

> Goal: secțiunea de sellers e funcțională pe pagina produsului.

- [ ] Crează `Components/vendor/SellerRow/SellerRow.jsx` (moleculă, ≤ 80 linii)
  - Afișează: `vendor.shopName`, `price`, `stock.availability`, buton "Selectează"
  - `SellerRow.css` + `index.js`
- [ ] Crează `Components/vendor/SellerPicker/SellerPicker.jsx` (organism, ≤ 150 linii)
  - Primește `catalogRef` ca prop
  - Apelează `useGetSellersQuery(catalogRef)`
  - `useState` local pentru `selectedSeller` (inițializat cu primul din listă — prețul minim)
  - Emite `onSellerChange(seller)` când se schimbă selecția
  - `SellerPicker.css` + `index.js`
- [ ] Handle loading — skeleton 3 rânduri
- [ ] Handle empty — "Momentan niciun vânzător disponibil"
- [ ] Handle single seller — afișează direct, fără header "Alege vendorul"

---

## Phase 3 — Integrare în SingleProducts

> Goal: pagina produsului folosește seller-ul selectat pentru preț și coș.

- [ ] Modifică `Components/products/singleProducts/SingleProducts.jsx`:
  - Dacă `product.catalogRef` există → randează `<SellerPicker>`
  - `useState selectedListing` — inițializat cu `product` (listing-ul cu prețul minim din listing)
  - Pasează `selectedListing` la `ProductHero` și la butonul de coș
- [ ] Modifică `ProductHero.jsx` — afișează `selectedListing.price` în loc de `product.price`
- [ ] `AddToCartV2Button` primește `selectedListing._id` (nu `product._id`)

---

## Phase 4 — Badge pe card în listing

> Goal: card-urile arată "N oferte" când există mai mulți sellers.

- [ ] Modifică `Components/products/cards/Cards.jsx`:
  - Dacă `product.sellersCount > 1` → afișează badge `.cards__sellers-badge` cu "N oferte"
- [ ] Adaugă CSS pentru badge în `cards/Cards.css`
- [ ] Verifică că prețul afișat pe card e `MIN(price)` (vine din backend, nu e calcul frontend)

---

## Phase 5 — Polish & edge cases

> Goal: production-ready.

- [ ] Dark mode — `html[data-theme="dark"]` overrides în `SellerPicker.css` și `SellerRow.css`
- [ ] Mobile — `SellerPicker` stacked, scroll intern la > 5 sellers (`max-height` + `overflow-y: auto`)
- [ ] Accesibilitate — `role="radiogroup"` pe lista de sellers, `aria-checked` pe seller selectat
- [ ] CSS — BEM: `.seller-picker__list`, `.seller-row__price`, `.seller-row--selected`
- [ ] `catalogRef` null → `SellerPicker` nu se montează, zero regresii pe produsele existente
- [ ] `npm run build` — zero warnings

---

## Files touched

| File | Status | Notes |
|------|--------|-------|
| `features/product/rtkProducts.js` | [ ] | adaugă `useGetSellersQuery` |
| `Components/vendor/SellerPicker/` | [ ] | nou organism |
| `Components/vendor/SellerRow/` | [ ] | nouă moleculă |
| `Components/products/singleProducts/SingleProducts.jsx` | [ ] | integrare SellerPicker |
| `Components/products/singleProducts/ProductHero.jsx` | [ ] | preț din selectedListing |
| `Components/products/cards/Cards.jsx` | [ ] | badge "N oferte" |
