# Backend TODOs: Cart → Order

> **Last updated:** 2026-07-13
> **Stack:** Node.js, Express, Mongoose

---

## Phase 1 — Model & validation

- [x] `Order` model created: `backend/models/order/Order.js`
- [x] `OrderItemSchema` — product ref, brand/model/price snapshot, quantity with integer validator
- [x] `DeliveryAddressSchema` — street, city, county, zip, phone snapshot
- [x] `OrderSchema` — user ref, items[], deliveryAddress, totalPrice, status enum, paymentMethod enum, isPaid, timestamps
- [x] `pre("save")` hook auto-calculates `totalPrice`
- [x] `itemCount` virtual
- [x] 3 indexes: `{ user, createdAt }`, `{ status, createdAt }`, `{ isPaid, createdAt }`

---

## Phase 2 — Controller & routes

- [x] `GET  /api/orders`              — `getMyOrders` (auth required)
- [x] `POST /api/orders`              — `createOrder` (auth required, validates stock, snapshots price + address)
- [x] `GET  /api/orders/:id`          — `getOrder` (auth required, ownership check)
- [x] `PUT  /api/orders/:id/cancel`   — `cancelOrder` (auth, only Pending, restores stock)
- [x] `GET  /api/admin/orders`        — `getAllOrders` (admin only, pagination + status filter)
- [x] `PUT  /api/admin/orders/:id/status` — `updateOrderStatus` (admin only)
- [x] All routes protected via `protect` middleware
- [x] Admin routes via `authorize("admin")`
- [x] Router registered in `server.js`

---

## Phase 3 — Auth, guards & edge cases

- [x] Ownership check on `getOrder` — user can only see own orders (or admin)
- [x] Stock validation on `createOrder` — throws 400 if `product.stock.quantity < quantity`
- [x] Stock decrement on order creation
- [x] Stock restore on `cancelOrder`
- [x] Cannot cancel non-Pending orders — returns 400
- [x] Cannot update status of Cancelled order — returns 400
- [x] Address validated against logged-in user (`Address.findOne({ _id, user: req.user.id })`)
- [x] `deliveredAt` set automatically when status → Delivered

---

## Gaps found

- [ ] `createOrder` — stock is decremented per-item with individual `product.save()` calls; if one fails mid-loop, earlier items are already decremented with no rollback (no transaction)
- [x] `createOrder` — conectat la frontend via `useCreateOrderMutation` în `useCheckoutState.js`
- [ ] No `isPaid` / `paidAt` update endpoint — payment confirmation has no handler
- [ ] `getAllOrders` pagination: `limit` comes from query string unsanitized (`Number(limit)` — no max cap)
