# Plan de acțiuni — CV readiness

> Pornind de la scorul actual **6.5/10**.  
> Ținta: **8.5/10** înainte de a-l adăuga în CV.

---

## Prioritate 1 — Blocker (max 2h, nu trimite CV fără astea)

### 1.1 Curăță `.env` din git history

```bash
# Rotește credențialele ÎNAINTE (MongoDB Atlas, Cloudinary, JWT secret)
git rm --cached .env
echo ".env" >> .gitignore   # probabil deja e, dar verifică
git commit -m "chore: remove .env from tracking"
# Opțional dar recomandat:
git filter-branch --force --index-filter 'git rm --cached --ignore-unmatch .env' HEAD
```

Generează credențiale noi după:
- MongoDB Atlas: rotate connection string
- Cloudinary: revoke API key
- JWT_SECRET: schimbă string-ul

### 1.2 Șterge console.log-urile active

Fișiere de editat:
- `frontend/src/Components/products/add-card-item/AddCategoryForm.jsx` — șterge `console.log(category)`
- `frontend/src/Components/UI/header/MegaMenu.jsx` — șterge `console.log(value)` (și commented-out-urile)
- `frontend/src/store/fetchProducts/productService.js` — șterge `console.log(response)`
- `backend/middleware/error.js` — înlocuiește `console.log(err)` cu return silent sau `process.env.NODE_ENV === 'development' && console.error(err)`

### 1.3 Fixează eslint-disable

- `frontend/src/Components/products/add-card-item/AddCategoryForm.jsx` — scoate `/* eslint-disable */`, repară warning-urile
- `frontend/src/Pages/...TipAfisare.jsx` — idem

### 1.4 Commit tot ce e neterminat

```bash
git status   # 35+ fișiere modificate necommitate
git add frontend/src/Components/vendor/ frontend/src/utils/constants.js
git commit -m "feat(vendor-profile): seller picker dropdown, compact seller rows"
```

---

## Prioritate 2 — Impact mare pe CV (4–8h total)

### 2.1 README complet (2h)

README-ul actual e minimal. Adaugă:

```markdown
## Features
- Multi-vendor marketplace cu role hierarchy (admin/vendor/client)
- Seller picker: compară oferte multiple pentru același produs
- Order snapshots: prețul blocat la momentul comenzii
- Dark mode, responsive design

## Tech Stack
Frontend: React 18, Redux Toolkit + RTK Query, React Router v6
Backend: Node.js, Express, MongoDB/Mongoose
Infra: Cloudinary (images), JWT (auth), bcrypt

## Setup
1. Clone + npm install în /frontend și /backend
2. Creează .env (vezi .env.example)
3. npm run seed (opțional, populează DB)
4. npm run dev

## Architecture
Atomic design: atoms → molecules → organisms → pages
RTK Query pentru server state, Redux slices pentru UI state
```

### 2.2 Minimum 10 teste (3–4h)

Hire-erii vor observa imediat lipsa testelor. Minimul acceptabil:

**Backend (Jest + supertest):**
```
tests/auth.test.js     → POST /api/auth/register, POST /api/auth/login
tests/products.test.js → GET /api/products cu filtre
tests/orders.test.js   → POST /api/orders (stock deduction)
```

**Frontend (Jest + React Testing Library):**
```
tests/authSlice.test.js          → reducers login/logout
tests/formatters.test.js         → formatPrice, truncate
tests/useProductFilters.test.js  → filter logic
```

### 2.3 Payment: marchează ca Demo (30min)

Nu ai nevoie de Stripe real. Dar "place order" fără nicio verificare de plată arată rău.

**Opțiunea rapidă:** Adaugă un banner în `CheckoutStepPayment.jsx`:
```jsx
<div className="checkout__demo-banner">
  Demo mode — plata nu este procesată real
</div>
```

**Opțiunea mai bună (2-3h):** Integrare Stripe test mode cu card `4242 4242 4242 4242`.

### 2.4 Curăță Redux slices vechi (1h)

Fișiere de șters (dacă nu sunt folosite nicăieri):
```
frontend/src/store/postProductSlice.js
frontend/src/store/postAddProductCategorySlice.js
frontend/src/store/addToCardSlice.js   ← (există addToCartSlice.js?)
```

Verifică cu `grep -r "postProductSlice" frontend/src --include="*.js" --include="*.jsx"` înainte de ștergere.

---

## Prioritate 3 — Nice to have (opțional, dar impresionant)

### 3.1 Deploy (cel mai mare impact)

Un link live bate orice descripție în CV.

**Gratuit:**
- Frontend: Vercel (conectezi repo GitHub, auto-deploy)
- Backend: Railway (plan gratuit, conectezi MongoDB Atlas)
- Imagini: Cloudinary (deja integrat)

**Pași:**
1. Creează `.env.example` cu chei fără valori reale
2. Deploy backend pe Railway → obții URL
3. Actualizează `REACT_APP_API_URL` în frontend
4. Deploy frontend pe Vercel

### 3.2 Indexuri MongoDB (30min)

Adaugă în modele, îmbunătățește query time vizibil la demo:

```js
// Product.js
ProductSchema.index({ brand: 1, model: 1 });
ProductSchema.index({ catalogRef: 1 });
ProductSchema.index({ vendor: 1, listingStatus: 1 });

// Order.js
OrderSchema.index({ user: 1, createdAt: -1 });
```

### 3.3 Fix Checkout.jsx (30min)

Extrage `OrderSuccess` în componentă separată pentru a respecta limita de 60 linii/pagină.

### 3.4 Stock validation min: 0 (10min)

```js
// stock.schema.js sau Product.js
quantity: { type: Number, default: 0, min: 0 }
```

---

## Ce NU merită timp acum

| Item | Motivul |
|------|---------|
| Password reset flow | Feature nou, nu fix — nu e pe CV-ul tău de features actuale |
| Email notifications | Feature nou — marchează "not implemented" în README |
| Swagger API docs | Nice to have, nu blocker |
| Refresh token rotation | Over-engineering pentru un proiect CV |
| Rate limiting | Important dar recrutorul nu va testa asta |

---

## Estimare finală

| Prioritate | Timp estimat | Scor după |
|-----------|-------------|-----------|
| P1 — Blocker | 2h | 7.0/10 |
| P1 + P2 | 8–10h | 8.0/10 |
| P1 + P2 + Deploy | 12–14h | 8.5/10 |
| P1 + P2 + P3 complet | 16–20h | 9.0/10 |

**Concluzie:** Cu o zi de muncă (P1 + P2 parțial + deploy) ajungi la un proiect CV-ready solid. Multi-vendor marketplace pe un MERN stack bine structurat e non-trivial și arată bine.
