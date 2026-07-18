# Checkout & Payment

3-step checkout wizard (cart → details → confirm) with installment plan calculator, voucher + AlcrroCard credits stacking, and Stripe card payment.

---

## What's technically interesting

### Stacking discounts correctly

At confirm step, the order total is computed as:
```
stripeAmount = subtotal - voucherDiscount - creditsUsed
```
Both reductions are applied server-side. The client sends `voucherCode` and `creditsToUse`; the backend re-validates and recalculates independently. The Stripe PaymentIntent is created with the final amount — the client cannot inflate or deflate it.

### Wizard state machine

`useCheckoutState` manages the 3-step flow with a single `step` string: `"cart" | "details" | "confirm"`. Each step is a separate component (`CheckoutStepCart`, `CheckoutStepDetails`, `CheckoutStepConfirm`). Transitions are one-way; going back resets volatile state (payment method selection) but not persistent state (address, voucher).

After a successful card payment:
1. `confirmPayment(orderId)` is called to sync order status
2. `clearCart()` empties Redux cart
3. `clearDiscount()` removes the applied voucher from Redux
4. User is navigated to `/orders/:id?payment=success`

### Installment plan calculator

The `InstallmentPlanForm` component accepts a product price and renders monthly amounts for BCR / BT / ING across 3/6/12/24 month options. Rates are hardcoded constants (real bank rates). The plan is stored on the order as `installmentPlan: { bank, months, monthlyAmount }` — it's informational only; actual installment processing is handled by the bank offline.

### Payment method selection

Step 2 fetches the user's saved Stripe PaymentMethods. If a default card exists, it's pre-selected and only a CVC field is shown. The user can also choose "Ramburs" (cash on delivery) — in which case no Stripe PI is created. The `paymentMethod` field on the order is the source of truth (`"Card"` or `"Ramburs"`).

---

## Flow

```
Step 1 — Cart
  → Review items, apply voucher (CartVoucherBox), use AlcrroBox credits

Step 2 — Details
  → Select address (or add new inline)
  → Select payment: saved card / new card / cash on delivery
  → Select installment plan (optional)

Step 3 — Confirm
  → POST /api/orders → creates order + Stripe PI (if card)
  → If card: Elements renders CardPayForm with clientSecret
  → stripe.confirmCardPayment() → success → confirmPayment() → navigate
  → If cash: order created, navigate immediately
```

---

## Key files

| File | Role |
|------|------|
| `frontend/src/Components/UI/checkout/useCheckoutState.js` | Wizard state + createOrder call |
| `frontend/src/Components/UI/checkout/CheckoutStepCart.jsx` | Cart review + voucher |
| `frontend/src/Components/UI/checkout/CheckoutStepDetails.jsx` | Address + payment method |
| `frontend/src/Components/UI/checkout/CheckoutStepConfirm.jsx` | Order summary + Stripe form |
| `frontend/src/Components/molecules/InstallmentPlanForm/` | Bank installment calculator |
| `frontend/src/Components/molecules/CartVoucherBox/` | Voucher input |
| `frontend/src/Components/molecules/CartAlcrroBox/` | Credits slider |
| `backend/controllers/order/order.js` | `createOrder` with discount validation |

---

See [tech-spec.md](tech-spec.md) for full API contracts.
