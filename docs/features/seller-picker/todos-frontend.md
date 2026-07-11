# Frontend TODOs: Seller Picker

> **Last updated:** 2026-07-11
> **Stack:** React 18, RTK Query, Redux Toolkit, React Router v6, plain CSS
> **Conventions:** CLAUDE.md — atomic design, one hook = one action, co-located CSS
> **Requires:** feature `product-catalog` implementat (catalogRef disponibil pe Product)

---

## Phase 1 — Setup & data layer

> Goal: endpoint de sellers returnează date în consolă. Fără UI.

- [x] Adaugă endpoint `useGetSellersQuery` în `features/product/rtkProducts.js`
  - `GET /api/products/sellers/:catalogRef`
  - tag de invalidare: `["Sellers"]`
- [ ] Test în browser: Network tab returnează lista de sellers pentru un `catalogRef` valid

---

## Phase 2 — SellerPicker organism

> Goal: secțiunea de sellers e funcțională pe pagina produsului.

- [x] Crează `Components/vendor/shared/SellerRow/SellerRow.jsx` (moleculă, 29 linii)
  - Afișează: `vendor.shopName`, `price`, `stock.availability`, buton "Selectează"
  - `SellerRow.css` + `index.js`
- [x] Crează `Components/vendor/shared/SellerPicker/SellerPicker.jsx` (organism, 58 linii)
  - Primește `catalogRef` ca prop
  - Apelează `useGetSellersQuery(catalogRef)`
  - `useState` local pentru `selectedSeller` (inițializat cu primul din listă — prețul minim)
  - Emite `onSellerChange(seller)` când se schimbă selecția
  - `SellerPicker.css` + `index.js`
- [x] Handle loading — skeleton 3 rânduri
- [x] Handle empty — "Momentan niciun vânzător disponibil"
- [x] Handle single seller — afișează direct, fără header "Alege vendorul"

---

## Phase 3 — Integrare în SingleProducts

> Goal: pagina produsului folosește seller-ul selectat pentru preț și coș.

- [x] Modifică `Components/products/singleProducts/SingleProducts.jsx`:
  - Dacă `product.catalogRef` există → randează `<SellerPicker>`
  - `useState selectedListing` — inițializat cu `null`, `handleCart` folosește `selectedListing ?? pd.product`
  - Pasează `listing={selectedListing}` la `ProductHero`
- [x] Modifică `ProductHero.jsx` — `listing` prop optional; `src = listing ?? p`; afișează `src.price`, `src.stock`
- [x] Cart folosește `selectedListing` când e selectat un seller (din `handleCart` în SingleProducts)

---

## Phase 4 — Badge pe card în listing

> Goal: card-urile arată "N oferte" când există mai mulți sellers.

- [x] Modifică `Components/products/cards/Cards.jsx`:
  - Dacă `product.sellersCount > 1` → afișează badge `.card__sellers-badge` cu "N oferte"
- [x] Adaugă CSS pentru badge în `cards/cards.css`
- [ ] Prețul `MIN(price)` — badge funcționează, dar `sellersCount` e 0 până când backend aggregation (Phase 3 backend) e implementat

---

## Phase 5 — Polish & edge cases

> Goal: production-ready.

- [x] Dark mode — `html[data-theme="dark"]` overrides în `SellerPicker.css` și `SellerRow.css`
- [x] Mobile — `SellerPicker` scroll intern (`max-height` + `overflow-y: auto`); 768px + 375px breakpoints
- [x] Accesibilitate — `role="radiogroup"` pe lista de sellers, `aria-checked` + `aria-pressed` pe seller selectat, `type="button"` pe toate butoanele
- [x] CSS — BEM: `.seller-picker__list`, `.seller-row__price`, `.seller-row--selected`
- [x] `catalogRef` null → `SellerPicker` returnează null, zero regresii pe produsele existente
- [ ] `npm run build` — de verificat

---

## Files touched

| File | Status | Notes |
|------|--------|-------|
| `features/product/rtkProducts.js` | [x] | `useGetSellersQuery` adăugat |
| `Components/vendor/shared/SellerPicker/` | [x] | organism creat |
| `Components/vendor/shared/SellerRow/` | [x] | moleculă creată |
| `Components/products/singleProducts/SingleProducts.jsx` | [x] | SellerPicker integrat |
| `Components/products/singleProducts/ProductHero.jsx` | [x] | `listing` prop pentru preț/stoc |
| `Components/products/cards/Cards.jsx` | [x] | badge "N oferte" |
