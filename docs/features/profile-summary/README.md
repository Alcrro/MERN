# User Profile

Dashboard with 7 sections: order history, addresses, AlcrroCard, saved payment cards, vouchers, account settings, and avatar upload with circular crop.

---

## What's technically interesting

### Avatar upload with circular crop

The avatar flow uses a two-stage upload:
1. User selects an image → `react-image-crop` renders a circular crop preview
2. On confirm, the cropped canvas is converted to a Blob and sent to `POST /api/upload/avatar`
3. The backend streams it to Cloudinary, returns the CDN URL
4. `PUT /api/auth/me { avatar: url }` updates the user document
5. Redux auth slice is updated so the header avatar refreshes immediately

The crop is circular (aspect ratio locked to 1:1, circular mask via CSS `border-radius`). No server-side image processing — crop happens on the client canvas.

### Saved payment methods via Stripe

`GET /api/payment-methods` calls `stripe.paymentMethods.list({ customer: stripeCustomerId, type: 'card' })`. The Stripe Customer ID is stored on the user document and created lazily on first card save.

Cards are displayed with brand, last 4 digits, and expiry. The default card is used automatically at checkout (CVV-only flow). Deleting a card calls `stripe.paymentMethods.detach(pm_id)`.

### Order timeline with inline payment

The `OrderDetailPanel` organism renders a visual timeline (Pending → Processing → Shipped → Delivered). For unpaid orders with an active PaymentIntent, an inline Stripe card form appears within the order detail — no redirect to a separate checkout page.

After the user pays from the order detail view, a polling interval (3s) watches `order.isPaid` and clears when it flips to `true`.

### Section architecture

The profile page is a pure composition page (`< 60 lines`). Each section is an organism with its own RTK Query subscription:

| Section | Query |
|---------|-------|
| Summary | `useGetMyOrdersQuery` + `useGetAddressesQuery` + `useGetPaymentMethodsQuery` |
| Orders | `useGetMyOrdersQuery` |
| Addresses | `useGetAddressesQuery` |
| AlcrroCard | `useGetMyCardQuery` |
| Payment Cards | `useGetPaymentMethodsQuery` |
| Vouchers | `useGetMyVouchersQuery` |
| Settings | `useGetMeQuery` |

Each section manages its own loading/error states independently.

---

## Key files

| File | Role |
|------|------|
| `frontend/src/Pages/Profile/Profile.jsx` | Route-level composition |
| `frontend/src/Components/profile/ProfileSummary/` | Overview dashboard |
| `frontend/src/Components/profile/ProfileOrders/` | Order list + detail |
| `frontend/src/Components/profile/ProfilePaymentMethods/` | Stripe saved cards |
| `frontend/src/Components/profile/ProfileVouchers/` | Reward + promo vouchers |
| `frontend/src/Components/organisms/OrderDetailPanel/` | Invoice + timeline + inline pay |
| `backend/controllers/auth/auth.js` | `updateMe` for avatar URL |
| `backend/routes/upload/` | Cloudinary upload endpoint |

---

See [tech-spec.md](tech-spec.md) for API contracts.
