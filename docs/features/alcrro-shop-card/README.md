# AlcrroCard — Loyalty System

Points-based loyalty card with 4 tiers, redeemable credits, referral codes, and a credit top-up flow via Stripe.

---

## What's technically interesting

### Tier multipliers on point awards

Every completed order awards points: `floor(orderTotal * 0.1 * tierMultiplier)`. Multipliers by tier:

| Tier | Threshold | Multiplier |
|------|-----------|-----------|
| Bronze | 0 pts | 1.0× |
| Silver | 500 pts | 1.25× |
| Gold | 2000 pts | 1.5× |
| Platinum | 5000 pts | 2.0× |

Tier is re-evaluated on every point update. Point award and tier upgrade happen atomically in `awardPoints()` using `findOneAndUpdate` with `{ new: true }`.

### Credits as currency

Users can top up credits via Stripe (packages: 50/100/250/500 RON). Credits appear as a balance and are deducted at checkout (`creditsToUse` param). The backend validates that `creditsToUse ≤ min(card.credits, orderTotal)` before applying.

On order cancellation, `revokePoints()` removes the awarded points.

### Referral codes

Each card gets a unique `referralCode` on creation (generated with retry loop for uniqueness). When a new user applies a referral code, both parties receive a bonus.

---

## Flow

```
Order marked paid
  → awardPoints(userId, orderTotal, orderId)
      ├─ Fetch ShopCard for user
      ├─ base = floor(total * 0.1)
      ├─ pts = floor(base * TIER_MULTIPLIERS[card.tier])
      └─ findOneAndUpdate: $inc points, recalculate tier

Checkout with credits
  → createOrder body: { creditsToUse: N }
      ├─ Backend validates N ≤ card.credits
      ├─ Stripe PI amount = totalPrice - N - voucherDiscount
      └─ card.credits -= N (atomic update)

Top-up credits
  → POST /api/shop-card/top-up { package: "100" }
      → Stripe PI for 95 RON → webhook marks credits += 100
```

---

## Key files

| File | Role |
|------|------|
| `backend/models/shopCard/ShopCard.js` | Schema: points, tier, credits, referralCode |
| `backend/models/shopCard/CardTransaction.js` | Transaction log per point/credit event |
| `backend/controllers/shopCard/shopCardService.js` | `awardPoints`, `revokePoints`, `createCardForUser` |
| `backend/controllers/shopCard/shopCard.js` | Top-up, redeem points, apply referral |
| `frontend/src/Components/molecules/SummaryCardWidget/` | Profile summary widget |
| `frontend/src/Pages/Profile/` | Card detail tab |

---

See [tech-spec.md](tech-spec.md) for full API contracts.
