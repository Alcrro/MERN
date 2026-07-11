# Audit tehnic — MERN Shop (Iulie 2026)

> Proiect refactorizat din 2023. Evaluare pentru adăugare în CV.

---

## Scor general: 6.5 / 10

Fundații tehnice solide, arhitectură modernă, dar cu gap-uri clare înainte de a-l arăta unui angajator.

---

## 1. Arhitectură

### Structură foldere — 7/10

**Puncte tari:**
- Atomic design aplicat: `atoms/`, `molecules/`, `organisms/`, `pages/`
- Backend organizat: `controllers/`, `models/`, `routes/`, `middleware/`
- Feature docs în `docs/features/` cu PRD + tech-spec + todos
- 51 directoare de componente în frontend (bine modularizat)
- CLAUDE.md cu reguli clare de coding

**Probleme:**
- Naming inconsistent: unele foldere PascalCase (`Components/`), altele kebab (`add-to-Cart/`)
- Coexistă Redux slices vechi (`postProductSlice.js`, `addToCardSlice.js`) cu RTK Query modern
- Mix de axios-based services și RTK Query (ambele active)

### Separarea responsabilităților — 7.5/10

**Bine:**
- Server state: RTK Query (cache, invalidation)
- UI state: Redux slices (coș, favorites, filtre, temă)
- Custom hooks extrag logica (`useProductFilters`, `useCheckoutState`, `useCatalogSearch`)
- Middleware layer pentru auth și error handling

**Probleme:**
- Auth stocată atât în cookie httpOnly **cât și** în localStorage (redundant + risc de securitate)
- Unele componente cuplează logică de business direct

### State management — 7/10

**RTK Query (modern, bine aplicat):**
- `rtkProducts.js`: 18 endpoint-uri (products, categories, reviews, sellers)
- `rtkVendor.js`: 9 endpoint-uri pentru vendor operations
- Cache strategy: 1h pentru categorii, tag-based invalidation
- `rtkOrders.js`, `rtkAddresses.js`, `rtkUpload.js`, `rtkAdmin.js`, `rtkCatalog.js`

**Redux slices (pattern mai vechi, mix):**
- `authSlice.js`, `addToCartSlice.js`, `favoritesSlice.js`, `menuDepartmentSlice.js`, `buttonsSlice.js`, `cartModalSlice.js`
- 8 RTK APIs + 6 Redux slices = 14 reducers în store (funcțional, dar arată mix arhitectural)

### Routing — 8/10

**Bine:**
- React Router v6
- Nested routes pentru profile și vendor dashboard
- Private routes pentru pagini autentificate

**Probleme:**
- Fără error boundary sau 404 custom
- Rutele vendor nu sunt gate-uite strict pe rol

---

## 2. Calitatea codului

### Dimensiune componente — 6/10

CLAUDE.md limitează: atoms ≤50, molecules ≤80, organisms ≤150, pages ≤60 linii.

**Violări găsite:**
- `Checkout.jsx`: 95 linii (pagină, limita 60) — are logică + UI + subcomponent
- `Cards.jsx`: 75 linii (organism, limita 150 — ok, dar dense)

**Respectate:**
- `Products.jsx`: 40 linii ✓
- `VendorDashboard.jsx`: 5 linii ✓
- Majority of components are well-sized

### Convenții de denumire — 8/10

**Bine:**
- Fișiere componente: PascalCase ✓
- Hooks: `use` prefix ✓
- RTK: `use[Action][Noun]Query/Mutation` ✓
- CSS: BEM-like (`.card-v2__price`, `.seller-row__meta`) ✓

**Probleme:**
- `add-to-Cart/` folder (inconsistent)
- Mix `productService.js` vs fără suffix

### CSS — 8/10

**Bine:**
- CSS variables peste tot (`--primary`, `--bg-card`, `--shadow`)
- Dark mode: `html[data-theme="dark"] .class { }` aplicat consistent
- Fiecare componentă are propriul .css

**Probleme:**
- 2 fișiere cu `/* eslint-disable */` (interzis în CLAUDE.md)
- Multiple fișiere CSS cu nume generice în foldere diferite

### console.log — 4/10 — PROBLEMĂ MAJORĂ

**Active în cod:**
```
AddCategoryForm.jsx     → console.log(category)
MegaMenu.jsx            → console.log(value)
productService.js       → console.log(response)
middleware/error.js     → console.log(err) — expune stack trace
```

CLAUDE.md interzice explicit `console.log` în cod final.

---

## 3. Features

### Ce există și funcționează

| Feature | Status | Note |
|---------|--------|------|
| Auth (register/login/logout) | ✅ | JWT + cookie httpOnly |
| Role-based access (client/vendor/admin) | ✅ | 3 roluri cu flow de aprobare vendor |
| Catalog produse cu filtre | ✅ | 8+ filtre, paginare, sort |
| Coș + checkout 3 pași | ✅ | Address → Payment → Confirm |
| Comenzi + tracking status | ✅ | Order snapshots la prețul din momentul achiziției |
| Multi-vendor marketplace | ✅ | Vendor dashboard cu 6 sub-secțiuni |
| Review & rating produse | ✅ | 1-5 stele cu text |
| Profil utilizator + adrese | ✅ | CRUD adrese |
| Dark mode | ✅ | CSS theme toggle |
| Upload imagini Cloudinary | ✅ | Vendor uploads |
| Seller picker (produse multi-vendor) | ✅ | Dropdown cu oferte comparate |

### Ce e incomplet sau broken

| Feature | Status | Problemă |
|---------|--------|----------|
| Plată card | ⚠️ | UI există, dar 0 integrare reală (no Stripe/PayPal) |
| Email notificări | ⚠️ | UI spune "vei primi email", dar nu există nodemailer |
| Upload imagini produse | ⚠️ | Folosește `panda.png` placeholder |
| Vendor analytics | ⚠️ | Componenta există, query poate fi goală |
| Password reset | ❌ | Nu există |
| Email verification | ❌ | Nu există |

---

## 4. Backend

### Organizare rute — 8/10

13 rute montate în `server.js`:
```
/api/categories, /api/auth, /api/users, /api/products
/api/admin, /api/vendor, /api/orders, /api/addresses
/api/reviews, /api/stock, /api/upload, /api/catalog, /api/widget
```

**Probleme:**
- Toate montate direct în server.js (funcționează, dar greu de navigat)
- Naming inconsistent: `/api/admin/vendors` vs `/api/vendor/me`

### Modele Mongoose — 8/10

**Bine:**
- Discriminator pattern pentru tipuri produse (Electronics, Clothing, etc.)
- Embedded schemas pentru snapshots în orders (preț imutabil)
- Enum constraints, timestamps, regex validation pe email
- bcrypt hashing în pre-save hook
- JWT generation ca metodă pe model

**Probleme:**
- Fără indexuri explicite pe câmpuri frecvent interogate (brand, model, catalogRef)
- Stock quantity poate fi negativ (lipsește `min: 0`)

### Error handling — 6/10

**Bine:**
- `asyncHandler` wrapper pe toți controllerii
- `ErrorResponse` class pentru format consistent
- 404 handler în server.js

**Probleme:**
- `error.js` middleware face `console.log(err)` — expune stack trace
- Fără rate limiting (vulnerability)
- Fără validare input (parole, telefon, email complex)
- Stock deduction nu e tranzacțional (race condition posibil la comandă simultană)

---

## 5. Securitate

### Probleme critice

| Problemă | Severitate |
|----------|-----------|
| `.env` cu credențiale reale în git history | 🔴 CRITIC |
| `MONGO_URI`, `JWT_SECRET`, `CLOUDINARY_API_SECRET` expuse | 🔴 CRITIC |
| Auth stocată și în localStorage (pe lângă cookie) | 🟡 Mediu |
| Fără rate limiting pe `/api/auth` | 🟡 Mediu |
| Stack trace expus în producție prin `console.log(err)` | 🟡 Mediu |
| Fără HTTPS enforcement | 🟠 Scăzut (depinde de deploy) |

---

## 6. Puncte tari pentru CV

1. **Stack modern**: React 18, RTK Query, Redux Toolkit, React Router v6, Node/Express/MongoDB
2. **Arhitectură non-trivială**: Multi-vendor marketplace cu rol hierarchy
3. **Atomic design**: Document + implementat consistent
4. **Git history curată**: 30+ commits cu mesaje clare, refactoring vizibil
5. **Feature docs**: PRD + tech-spec în `docs/features/` — arată process professional
6. **Dark mode, responsive design**, mobile breakpoints
7. **Order snapshots**: Pattern avansat (preț imutabil la momentul comenzii)
8. **Cloudinary integration**: Image upload real

---

## 7. Lipsă absolută

- **Zero teste** (unit, integration, E2E)
- **README incomplet** (fără setup instructions, features list, architecture overview)
- **Niciun deployment** (fără link demo live)
- **Fără Swagger/API docs**
