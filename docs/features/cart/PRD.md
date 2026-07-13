# PRD: Cart

> **Status:** `Shipped`
> **Owner:** Alexandru Roventa
> **Last updated:** 2026-07-13
> **Related tech spec:** [tech-spec.md](./tech-spec.md)

---

## Problem Statement

**Current state:** Clients browsing products can add items to a client-side cart, review quantities and totals at `/cart`, and navigate to checkout. Cart state persists across page refreshes via localStorage.

**Scope:** Pure frontend feature — no server-side cart. State lives in Redux + localStorage only. No user account required to use the cart.

**Why it exists:** Enables the core e-commerce purchase flow: browse → add → review → checkout.

---

## User Stories

| # | Role | Want to | So that |
|---|------|---------|---------|
| 1 | client | add a product to the cart from the product page | I can buy it later |
| 2 | client | see all items in my cart at /cart | I can review my order before checkout |
| 3 | client | increase or decrease item quantity | I can adjust my order without removing it |
| 4 | client | remove an item entirely | I can change my mind |
| 5 | client | see subtotal, shipping cost, and final total | I can plan my budget |
| 6 | client | know how close I am to free shipping (threshold: 500 RON) | I can add more items to avoid shipping costs |
| 7 | client | preview cart items in a header dropdown without leaving the page | I can quickly check what I have without navigating away |
| 8 | client | have my cart survive page refresh | I don't lose items when I reload |
| 9 | client | finalize cumpărătura prin 3 pași (adresă → plată → confirmare) | pot plasa o comandă cu livrare și metodă de plată

---

## Acceptance Criteria

- [x] `#1` — Adding a product that's already in cart increments its quantity instead of adding a duplicate
- [x] `#1` — Adding a product beyond `stock.quantity` is prevented (button disabled)
- [x] `#2` — Cart page shows all items with brand, name, specs, unit price, quantity, and line total
- [x] `#2` — Empty cart shows a dedicated empty state with a link back to `/products`
- [x] `#3` — Stepper (+/−) updates quantity and recalculates line total and cart total
- [x] `#4` — Trash button removes item completely from cart
- [x] `#5` — CartSummary shows subtotal, shipping (free if ≥ 500 RON, else ~15 RON), and total
- [x] `#6` — ShipBar shows % progress to 500 RON threshold and remaining amount needed
- [x] `#7` — Header modal (AddToCartModal) reads live cart state and allows qty change + remove
- [x] `#8` — Cart state persists to localStorage under key `"alcrro-cart"` on every mutation
- [x] `#9` — Checkout redirecționează utilizatorul neautentificat la `/auth/login`
- [x] `#9` — Pasul adresă permite selectarea unei adrese existente sau adăugarea uneia inline
- [x] `#9` — Pasul plată permite alegerea Card sau Ramburs
- [x] `#9` — Pasul confirmare afișează sumar comandă și submitează la `POST /api/orders`
- [x] `#9` — La succes, coșul se golește și `CheckoutSuccess` afișează referința comenzii + total

---

## Out of Scope

- Server-side cart — no backend persistence, no user-cart association
- Coupon / promo codes
- Saved-for-later
- Real product images în `CartItem` — hardcoded placeholder (`panda.png`); `AddToCartModal` deja fix-uit
- Dead code cleanup — `Add-to-cart-button.jsx` rămasă neștearsă
- Plată reală — Checkout e demo-only (Card/Ramburs); niciun payment processor integrat
