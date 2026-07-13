# Frontend TODOs: Cart

> **Last updated:** 2026-07-13
> **Stack:** React 18, Redux Toolkit, React Router v6, plain CSS

---

## Phase 1 — Setup & data layer

- [x] Redux slice created: `features/product/addToCart/addToCartSlice.js`
- [x] Actions: `addToCart`, `removeSingleCart`, `removeFromCart`, `clearCart`
- [x] localStorage persistence: `load()` on init, `save()` after every mutation
- [x] `recalc()` recalculates `cartTotalQuantity` and `cartTotalAmount` after every change
- [x] Slice registered in Redux store
- [x] `cartUtils.js` exports `fmt()` and `SHIP_THRESHOLD = 500`

---

## Phase 2 — Core UI

- [x] `/cart` route registered in `App.js`
- [x] `AddToCart` page organism reads `state.addToCart` via `useSelector`
- [x] `CartItem` — renders product info, specs chips, stepper, delete button
- [x] `CartItem` — dispatches `addToCart` / `removeSingleCart` / `removeFromCart` directly (no prop drilling)
- [x] `CartSummary` — subtotal, shipping logic, total, CTA to `/cart/checkout`
- [x] `ShipBar` — progress bar toward 500 RON free shipping threshold
- [x] `Steps` — step indicator (Coș / Livrare / Plată)
- [x] `EmptyCart` — empty state with SVG and link to `/products`
- [x] `AddToCartIcon` — header badge showing `cartTotalQuantity`
- [x] `AddToCartModal` — hover dropdown in header with full cart preview + qty controls

---

## Phase 3 — Polish & edge cases

- [x] Mobile responsive — `addToCart.css` has `@media (max-width: 768px)` for `.ct-layout`, `.ct-item`
- [x] Dark mode partial — `addToCart.css` has dark mode for `ct-item__img`, `ct-item__del`, `ct-ship--done`, `ct-receipt__free`
- [x] A11y — stepper buttons have `aria-label`, delete has `aria-label`, `aria-hidden` on index number
- [x] Max qty guard — `atMax` disables + button when `itemQuantity >= stock.quantity`
- [x] `CartSummary` — free shipping displayed in green when threshold reached

---

## Gaps found

- [x] RTK endpoint `useCreateOrderMutation` — `features/order/rtkOrders.js`
- [x] RTK endpoint `useGetMyOrdersQuery` — `features/order/rtkOrders.js`
- [x] RTK endpoint `useGetAddressesQuery` + `useAddAddressMutation` — `features/address/rtkAddresses.js`
- [x] Both APIs registered in `app/store.js`

- [x] `AddToCartModal.jsx` — importă `fmt` din `cartUtils.js`, nu mai duplică funcția
- [x] `AddToCartModal.jsx` — `require(...)` → ES `import panda from "..."`
- [x] `AddToCartModal.jsx` — emoji-uri (📷 🖥 🔋) înlocuite cu text simplu
- [x] `AddToCartModal.jsx` — adăugat `type="button"` pe toate butoanele
- [x] `addToCartModal.css` — dark mode adăugat (inner, items, specs, footer, remove hover)
- [x] `AddToCartIcon.jsx` — șters comentarul mort `// console.log`
- [x] `AddToCartV2Button.jsx` — curățat (fără eslint-disable, destructured `{ data }`, text în română, `type="button"`)
- [x] `FiltersAndProducts.jsx` + `Add-to-cart-button/` — șterse (nefolosite)
- [x] `Steps.jsx` — now route-aware via `useLocation`; `/cart` → step 0 active, `/cart/checkout` → step 1 active
- [x] `AddToCartModal.jsx` — imagine dinamică: `p.images?.[0] || panda` (fallback la placeholder)
- [x] `AddToCartModal.jsx` — aliniere smart: `useEffect + useRef` calculează `left|center|right` bazat pe poziția în viewport
- [ ] `CartItem.jsx` — product image still hardcoded to `panda.png`; should use `item.data.images?.[0] || panda` (already fixed in AddToCartModal, not yet in CartItem)
- [x] `Checkout.jsx` — implementat: 3 pași (adresă → plată → confirmare), redirect dacă neautentificat/coș gol, success state
- [x] `CheckoutStepAddress.jsx` — selectare adresă existentă sau adăugare inline via `useAddAddressMutation`
- [x] `CheckoutStepPayment.jsx` — selecție Card / Ramburs
- [x] `CheckoutStepConfirm.jsx` — review items + submit via `useCreateOrderMutation` + `clearCart()`
- [x] `useCheckoutState.js` — hook co-located pentru flow state și submit
- [x] `ProfileAddress.jsx` — listează și șterge adrese via `useGetAddressesQuery` / `useDeleteAddressMutation`
- [ ] `features/cartModal/cartModalSlice.js` — exports `hoverLinkSlice`, has nothing to do with cart; wrong folder and wrong name — clarify or delete
