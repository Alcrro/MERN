# Backend TODOs: Profile Summary

> **Last updated:** 2026-07-17
> **Stack:** Node.js, Express, MongoDB/Mongoose

---

## Nicio modificare backend necesară

Feature-ul este **pur frontend**. Toate endpoint-urile necesare există și funcționează:

| Endpoint | Controller | Status |
|----------|------------|--------|
| `GET /api/orders/my` | `order/order.js → getMyOrders` | ✓ existent |
| `GET /api/addresses` | `address → getAddresses` | ✓ existent |
| `GET /api/shop-card/my` | `shopCard → getMyCard` | ✓ existent |
| `GET /api/payment-methods` | `paymentMethods → getPaymentMethods` | ✓ existent |
| `GET /api/vendor/analytics` | `vendor/vendor.js → getVendorAnalytics` | ✓ existent |

---

## Verificări opționale (nice-to-have)

- [ ] Confirmă că `GET /api/orders/my` returnează `status` pe fiecare order
- [ ] Confirmă că `GET /api/addresses` returnează `isDefault` pe fiecare adresă
- [ ] Confirmă că `GET /api/payment-methods` returnează `isDefault` pe fiecare PM
- [ ] Confirmă că `GET /api/vendor/analytics` returnează `totalProducts`, `totalOrders`, `averageRating`

---

## Optimizare opțională (post-ship)

Dacă se dorește un singur call în loc de 5 paralele, se poate adăuga ulterior:

```
GET /api/profile/summary
→ Agregă toate 5 sursele server-side
→ Returnează un singur obiect { orders, defaultAddress, shopCard, defaultPaymentMethod, vendorStats }
```

**De făcut doar dacă** LCP-ul paginii devine problematic în producție.
