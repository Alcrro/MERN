# AlcrrO Shop — MERN Multi-Vendor E-commerce

**Live demo:** [mern-lemon-sigma.vercel.app](https://mern-lemon-sigma.vercel.app)  
**API:** [alcrro.onrender.com](https://alcrro.onrender.com)

> Note: Backend runs on Render free tier — first request may take ~30s to cold-start.

A full-stack e-commerce marketplace with multi-vendor support, role-based access control, and a modern React frontend.

## Features

- **Multi-vendor marketplace** — vendors apply, get approved, and list products independently; buyers compare offers from multiple sellers on a single product page
- **Role hierarchy** — three roles (Admin / Vendor / Client) each with dedicated dashboards and protected routes
- **Product catalog** — Admin creates canonical product templates; vendors clone them with their own price, stock, and color variants
- **Advanced filtering** — 8+ simultaneous filters (brand, model, availability, RAM, storage, rating, price, color) with URL-persistent state
- **Shopping cart & checkout** — 3-step checkout (address → payment method → confirmation) with stock deduction on order
- **Order snapshots** — price and delivery address are locked at purchase time, immune to later edits
- **Vendor dashboard** — overview, product management, order tracking, Cloudinary image upload, business profile (CUI, entity type, delivery windows, return policy)
- **Reviews & ratings** — authenticated buyers can rate and review products
- **Dark mode** — CSS-variable-based theme toggle, persisted across sessions
- **Responsive design** — mobile-first, tested at 375px / 768px / 1280px

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Redux Toolkit, RTK Query, React Router v6 |
| Styling | Plain CSS with CSS custom properties (no Tailwind in prod) |
| Backend | Node.js, Express, express-async-handler |
| Database | MongoDB with Mongoose (discriminator pattern for product types) |
| Auth | JWT stored in httpOnly cookie + Redux auth slice |
| Images | Cloudinary (vendor upload flow) |
| Dev | Nodemon, Concurrently |

## Architecture

```
frontend/src/
  Components/         ← Atomic design: atoms / molecules / organisms
  Pages/              ← Route-level composition only (no business logic)
  features/           ← RTK Query APIs + Redux slices
  hooks/              ← Shared custom hooks
  utils/              ← Pure functions (colorUtils, seoHelpers, constants)

backend/
  controllers/        ← One file per resource (auth, products, vendor, admin, orders)
  models/             ← Mongoose schemas (discriminators for product variants)
  routes/             ← Express routers, one per resource
  middleware/         ← protect (JWT), authorize (role), errorHandler
```

State management:
- **RTK Query** — all server state (products, orders, vendor ops, catalog)
- **Redux slices** — UI state (cart, favorites, auth, view mode, cart modal)
- **useState** — component-local state only (open/closed, form inputs)

## Setup

### Prerequisites
- Node.js ≥ 18
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account (for image uploads)

### 1. Clone and install

```bash
git clone https://github.com/Alcrro/MERN.git
cd MERN
npm install
npm install --prefix frontend
```

### 2. Environment variables

Create `.env` in the project root (same level as `package.json`):

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/mern

JWT_SECRET=your_jwt_secret_here
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Create `frontend/.env`:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 3. Seed the database

```bash
npm run seed
```

This creates: 2 categories, 16 canonical products (phones), 3 client accounts, 1 vendor account, 1 admin account, and sample reviews.

To also seed multi-vendor listings (2 extra vendor accounts + 13 product listings with varied prices and stock):

```bash
node backend/scripts/seedMultiVendor.js
```

### 4. Run in development

```bash
npm run dev
```

Frontend → http://localhost:3000  
Backend API → http://localhost:5000/api

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@alcrro.ro | Parola123 |
| Vendor | vendor@alcrro.ro | Parola123 |
| Client | ion@gmail.com | Parola123 |

## API Overview

| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login, sets httpOnly cookie |
| GET | /api/products | Products with filter/sort/pagination |
| GET | /api/products/:id/sellers | All vendor listings for a product |
| POST | /api/orders | Create order (deducts stock) |
| GET | /api/vendor/me | Authenticated vendor profile |
| PUT | /api/vendor/profile | Update vendor business profile |
| GET | /api/admin/vendors | All vendors (admin only) |

## Scripts

```bash
npm run dev        # Start backend + frontend concurrently
npm run server     # Backend only (nodemon)
npm run client     # Frontend only
npm run seed       # Seed database with demo data
npm run test:backend  # Run backend unit tests
```

## Project History

**2023 — Initial build:** Authentication, product catalog, shopping cart, checkout, orders, user profile, admin panel.

**2026 — Full refactor:**
- Atomic design component structure (atoms → molecules → organisms → pages)
- RTK Query replacing Redux Thunk for all server state
- Multi-vendor marketplace: vendor apply/approval flow, vendor dashboard (6 sections), seller picker, business profile
- Complete CSS rewrite with CSS custom properties, BEM-like naming, dark mode
- Mongoose discriminator pattern for product variants (Electronics, Clothing, etc.)

Payment processing is in demo mode — orders are created but no real payment gateway is integrated.
