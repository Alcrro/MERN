# Tech Spec: Cart

> **Status:** `Shipped`
> **Last updated:** 2026-07-10
> **Related PRD:** [PRD.md](./PRD.md)

---

## Overview

### What we're building

Client-side shopping cart with Redux + localStorage persistence. No API calls — all state is local. The cart has two surfaces: a full-page view at `/cart` and a hover dropdown in the header. Checkout (`/cart/checkout`) is not yet implemented.

### Architecture decision log

| Decision | Options considered | Why we chose this |
|----------|--------------------|-------------------|
| State location | Server-side cart vs Redux + localStorage | No auth required, simpler UX, works without login |
| Persistence | sessionStorage vs localStorage | Cart must survive full page refresh / new tab |
| Totals calculation | Stored vs derived | Stored in Redux (`cartTotalQuantity`, `cartTotalAmount`) and recalculated in `recalc()` after every mutation |

### Risks & trade-offs

- **Risk:** Cart is lost if user clears browser storage — **Mitigation:** out of scope for now, requires auth + server cart
- **Risk:** Price drift — cart stores price at time of add, not live price — **Mitigation:** acceptable for MVP

---

## Implementation

### Data flow

```
User clicks "Add to Cart"
  → dispatch(addToCart({ data: product, ... }))
  → cartSlice reducer (addToCartSlice.js)
      → finds existing item by data._id or pushes new
      → recalc(): updates cartTotalQuantity + cartTotalAmount
      → save(): writes to localStorage["alcrro-cart"]
  → useSelector(s => s.addToCart) in consumers re-renders

Page /cart → AddToCart reads state.addToCart
  → empty: renders EmptyCart
  → items: renders Steps + CartItem[] + ShipBar + CartSummary

Header → AddToCartModal reads state.addToCart on hover
  → shows live item list + totals + CTAs
```

### API contracts

**Backend routes** — `backend/routes/order/order.js` (all require auth):

| Method | Path | Handler | Access |
|--------|------|---------|--------|
| `GET` | `/api/orders` | `getMyOrders` | client |
| `POST` | `/api/orders` | `createOrder` | client |
| `GET` | `/api/orders/:id` | `getOrder` | client (own) |
| `PUT` | `/api/orders/:id/cancel` | `cancelOrder` | client (own, Pending only) |
| `GET` | `/api/admin/orders` | `getAllOrders` | admin |
| `PUT` | `/api/admin/orders/:id/status` | `updateOrderStatus` | admin |

**`POST /api/orders` — createOrder**

Request body:
```json
{
  "items": [{ "product": "<ObjectId>", "quantity": 2 }],
  "addressId": "<ObjectId>",
  "paymentMethod": "Card"
}
```
Response `201`: `{ success: true, order: Order }`
Errors: `400` no items / insufficient stock, `404` address not found

**`GET /api/orders`**
Response `200`: `{ success: true, count: N, orders: Order[] }`

⚠ **Not connected to frontend** — `Checkout.jsx` is a stub. No RTK Query endpoint calls these routes yet.

---

**Redux actions** (client-side cart, `features/product/addToCart/addToCartSlice.js`):

| Action | Payload | Effect |
|--------|---------|--------|
| `addToCart(item)` | `{ data: Product, itemQuantity, itemAmountPrice }` | Adds or increments qty |
| `removeSingleCart(item)` | same | Decrements qty or removes if qty === 1 |
| `removeFromCart(item)` | same | Removes completely |
| `clearCart()` | none | Empties cart |

---

### Frontend — component tree

```
/cart route
  AddToCart (organism)                     Components/products/add-to-Cart/Add-to-Cart.jsx   37 lines ✓
    Steps (atom)                           Components/products/add-to-Cart/Steps.jsx          20 lines ✓
    CartItem (molecule)                    Components/products/add-to-Cart/CartItem.jsx       60 lines ✓
      cartIcons (atoms)                    Components/products/add-to-Cart/cartIcons.jsx
    ShipBar (molecule)                     Components/products/add-to-Cart/ShipBar.jsx        25 lines ✓
    CartSummary (molecule)                 Components/products/add-to-Cart/CartSummary.jsx    44 lines ✓
    EmptyCart (atom)                       Components/products/add-to-Cart/EmptyCart.jsx      22 lines ✓

Header (always mounted)
  AddToCartIcon (atom)                     Components/UI/add-to-cart-icon/AddToCartIcon.jsx   18 lines ✓
  AddToCartModal (organism)                Components/UI/add-to-cart-modal/AddToCartModal.jsx 134 lines ✓

DEAD (unused, should be deleted)
  Add-to-cart-button.jsx                   Components/UI/add-to-cart-button/
  AddToCartV2Button.jsx                    Components/UI/add-to-cart-v2-button/
```

### Redux state shape

```js
// state.addToCart (persisted to localStorage["alcrro-cart"])
{
  card: [
    {
      data: Product,          // full product object from RTK cache
      itemQuantity: number,   // current qty in cart
      itemAmountPrice: number // data.price * itemQuantity
    }
  ],
  cartTotalQuantity: number,  // sum of all itemQuantity
  cartTotalAmount: number,    // sum of all itemAmountPrice
  message: null               // unused
}
```

### Key types

```js
// Product fields used by the cart (from CartItem.jsx and AddToCartModal.jsx)
{
  _id: string,
  brand: string,
  model: string,
  name: string,
  price: number,
  description: string,
  stocare: string,   // storage spec displayed as chip
  RAM: string,
  camera: string,
  display: string,
  baterie: string,
  culoare: string,
  material: string,
  stock: { quantity: number }
}
```

### Edge cases handled

- [x] Adding same product → increments quantity, does not duplicate
- [x] Max quantity guard → `atMax = itemQuantity >= stock.quantity`, disables + button
- [x] Empty cart → `EmptyCart` component with CTA to `/products`
- [x] Free shipping threshold → `SHIP_THRESHOLD = 500` in `cartUtils.js`
- [ ] Cart empty after clearCart → no visual confirmation / toast
- [ ] Product price changes after add → cart shows stale price (acceptable for now)
