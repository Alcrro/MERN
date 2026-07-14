# Frontend TODOs: Product Variants

> **Last updated:** 2026-07-13
> **Stack:** React 18, RTK Query, Redux Toolkit, React Router v6, plain CSS
> **Conventions:** CLAUDE.md — atomic design, one hook = one action, co-located CSS

---

## Phase 1 — Setup & data layer ✓

- [x] `useVariantPicker.js` — hook generic cu attrKeys, options, selectedVariant, isValid, select
- [x] `Cards.jsx` — minPrice + "De la X RON"
- [x] `SellerRow.jsx` + `SellerPicker.jsx` — minPrice
- [x] `addToCartSlice.js` — resolvePrice fallback

---

## Phase 2 — Core UI ✓

- [x] `VariantPicker/VariantPicker.jsx` — color swatches + chip buttons, disabled invalid
- [x] `VariantPicker/VariantPicker.css`
- [x] `VariantPicker/index.js`
- [x] `ProductHero.jsx` — useVariantPicker + VariantPicker, preț reactiv din activeV
- [x] `useAddProductToCart.js` — handleCart(variant) cu price override
- [x] `VariantBuilder.jsx` — add/remove variante, add/remove atribute, price + StockInput
- [x] `VariantBuilder.css`
- [x] `VendorProductForm.jsx` — înlocuit price + StockInput cu VariantBuilder
- [x] `useVendorProductForm.js` — state variants în loc de price/stock

---

## Phase 3 — Polish & edge cases

- [x] Dark mode — `html[data-theme="dark"]` complet în VariantPicker.css ✓ (deja adăugat)
- [x] Mobile — VariantPicker chips wrappate corect la 375px ✓ (deja adăugat)
- [x] A11y — type="button" ✓, aria-pressed ✓, aria-label pe swatches ✓
- [x] Produs fără atribute — VariantPicker returnează null ✓
- [x] O singură variantă fără atribute — VariantPicker ascuns, preț direct ✓
- [x] Variantă cu stock.quantity === 0 — CTA disabled ✓
- [x] Validare VariantBuilder: nu poți salva cu price <= 0 (browser required + min=0)
- [x] Fără console.log ✓
- [x] npm run build — zero warnings ✓

---

## Files touched

| File | Status | Notes |
|------|--------|-------|
| `singleProducts/useVariantPicker.js` | [x] | hook nou |
| `singleProducts/VariantPicker/VariantPicker.jsx` | [x] | molecule nouă |
| `singleProducts/VariantPicker/VariantPicker.css` | [x] | dark mode + mobile incluse |
| `singleProducts/VariantPicker/index.js` | [x] | |
| `singleProducts/ProductHero.jsx` | [x] | MODIFY — VariantPicker integrat |
| `singleProducts/useAddProductToCart.js` | [x] | MODIFY — handleCart(variant) |
| `vendor/products/VendorProductForm/VariantBuilder.jsx` | [x] | organism nou |
| `vendor/products/VendorProductForm/VariantBuilder.css` | [x] | dark mode inclus |
| `vendor/products/VendorProductForm/VendorProductForm.jsx` | [x] | MODIFY |
| `vendor/products/VendorProductForm/useVendorProductForm.js` | [x] | MODIFY |
| `products/cards/Cards.jsx` | [x] | minPrice + "De la" |
| `features/product/addToCart/addToCartSlice.js` | [x] | resolvePrice |
| `vendor/shared/SellerRow/SellerRow.jsx` | [x] | minPrice |
| `vendor/shared/SellerPicker/SellerPicker.jsx` | [x] | minPrice |
