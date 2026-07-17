# Database: Profile Summary Dashboard

> **Last updated:** 2026-07-17
> **Affects collections:** niciunul — feature pur frontend

---

## New collection(s)

Nicio colecție nouă. Feature-ul agregă date din colecțiile existente pe client.

---

## Changes to existing collections

Nicio modificare la scheme. Câmpurile necesare există deja:

### `Order` — câmpuri folosite
| Field | Type | Note |
|-------|------|------|
| `_id` | ObjectId | pentru numărul comenzii (slice(-6)) |
| `status` | String | filtrăm Pending / Processing |
| `totalPrice` | Number | afișat în widget |
| `createdAt` | Date | data comenzii |

### `Address` — câmpuri folosite
| Field | Type | Note |
|-------|------|------|
| `label` | String | ex: "Acasă" |
| `street` | String | |
| `city` | String | |
| `county` | String | |
| `zip` | String | |
| `phone` | String | |
| `isDefault` | Boolean | filtru pentru adresa implicită |

### `ShopCard` — câmpuri folosite
| Field | Type | Note |
|-------|------|------|
| `cardNumber` | String | mascat în UI |
| `credits` | Number | |
| `points` | Number | |
| `tier` | String | standard / silver / gold |

### `PaymentMethod` (Stripe) — câmpuri folosite
| Field | Type | Note |
|-------|------|------|
| `id` | String | Stripe PM id |
| `brand` | String | visa / mastercard etc. |
| `last4` | String | |
| `expMonth` | Number | |
| `expYear` | Number | |
| `isDefault` | Boolean | filtru pentru cardul implicit |

---

## Indexes

Indexurile relevante există deja:
```js
// Address: query frecvent pt adresa default
AddressSchema.index({ user: 1, isDefault: 1 });  // ✓ existent

// Order: comenzile unui user, cele mai noi primele
OrderSchema.index({ user: 1, createdAt: -1 });   // ✓ existent
```

---

## Seed / test data

Asigură-te că în dev există:
- Minim 1 adresă cu `isDefault: true`
- Minim 1 comandă cu status `Pending` sau `Processing`
- Un ShopCard creat pentru user
- Minim 1 payment method cu `isDefault: true` (din Stripe test)
