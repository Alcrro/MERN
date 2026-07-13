# Tech Spec: Product Ecosystem

> **Status:** `Draft`
> **Author:** Alexandru Roventa
> **Last updated:** 2026-07-13
> **Related PRD:** [PRD.md](./PRD.md)

---

## Overview

### What we're building

Un widget în sidebar-ul paginii de listing (`/products/:categorySlug/:tipSlug`) care
afișează accesorii grupate pe 3 niveluri de importanță (Critic / Recomandat / Task-based).
Datele sunt generate de OpenAI per `tip`, cache-uite în MongoDB 7 zile, cu fallback static.
Frontend-ul consumă două RTK Query endpoints: `useGetEcosystemQuery` și `useConfigureEcosystemMutation`.
Un al doilea flow — `ProductConfigurator` — permite utilizatorului să selecteze scenarii de utilizare și să primească recomandări din catalogul real, generate de OpenAI.

### Architecture decision log

| Decision | Options considerate | De ce am ales asta |
|----------|--------------------|-------------------|
| Apel OpenAI pe backend | Frontend direct vs. backend proxy | API key nu poate fi expus în client |
| Cache MongoDB cu TTL | Redis / in-memory / fără cache | MongoDB deja existent; ecosistemul e același pentru toți utilizatorii, TTL nativ cu `expireAfterSeconds` |
| Fallback static în `backend/utils/` | Fără fallback / fallback în frontend | Site-ul rămâne funcțional dacă OpenAI e down; fallback centralizat pe backend |
| Model `gpt-4o-mini` | gpt-4o / gpt-3.5-turbo | Rapid, ieftin, excelent pentru JSON structurat fără raționament complex |
| Slug-uri generate pe backend din label | AI generează slug-uri / frontend le generează | AI nu cunoaște structura URL-urilor noastre; centralizat și consistent |

### Risks & trade-offs

- **Risk:** OpenAI latency la prima accesare (MISS cache) — **Mitigation:** timeout 10s + fallback static instant
- **Risk:** AI generează accesorii inexistente în catalog — **Mitigation:** link-urile duc la listing gol (0 produse), nu la eroare; acceptabil în v1
- **Risk:** Slug generat din label nu matchează un tip existent — **Mitigation:** pagina de listing cu 0 produse; în v4 se adaugă validare cu catalog real

---

## Implementation

### Data flow

```
URL: /products/electronice/telefon
  → useParams() → tipSlug="telefon" → TIP_SLUG_TO_TIP["telefon"] = "Telefon"
  → useGetEcosystemQuery("Telefon")  (RTK Query, skip dacă tip="")
      → GET /api/ecosystem/Telefon
          → EcosystemCache.findOne({ tip: "Telefon" })
              ├── HIT  → res.json({ source: "cache", data: ... })
              └── MISS → res.json({ source: "static", data: FALLBACK["Telefon"] ?? null })
  → ProductEcosystem renders EcosystemLevel (x2) + EcosystemTask[] (x4)

  → EcosystemCarousels (sub grid, full width):
      → criticalTips = eco.data.critical.map(i => i.label)
      → useGetProductsQuery({ kind, tips: criticalTips })    → produse reale din catalog
      → useGetProductsQuery({ kind, tips: recommendedTips }) → produse reale din catalog
      → ProductCarousel x2

  → ProductConfigurator (sub carousele, full width):
      → chips din eco.data.tasks (scenarii selectabile)
      → useConfigureEcosystemMutation({ tip, brand, model, scenarios, context })
          → POST /api/ecosystem/configure
              → Product.distinct("tip") → availableTips
              → OpenAI gpt-4o-mini (JSON mode, timeout 20s)
              → fetchează ≤ 4 produse per recomandare
              → res.json({ recommendations: [{ tip, reason, products }] })
      → afișează Cards grupate pe categorie
```

### API contracts

#### `GET /api/ecosystem/:tip`

**Path params:**
| Param | Type | Required | Descriere |
|-------|------|----------|-----------|
| `tip` | `string` | da | Valoarea internă a tipului (ex: `Telefon`, `Laptop`, `TV`) |

**Response `200`:**
```json
{
  "tip": "Telefon",
  "source": "cache",
  "data": {
    "critical": [
      {
        "label": "Încărcător",
        "reason": "Bateria se consumă zilnic, încărcătorul din cutie se degradează rapid",
        "icon": "⚡",
        "slug": "/products/electronice/incarcator"
      }
    ],
    "recommended": [
      {
        "label": "Folie sticlă securizată",
        "reason": "Ecranul e componenta cea mai scumpă de reparat",
        "icon": "📱",
        "slug": "/products/electronice/folie-sticla-securizata"
      }
    ],
    "tasks": [
      {
        "id": "photography",
        "label": "Fotografie & Video",
        "icon": "📸",
        "context": "Vrei să filmezi sau să faci poze de calitate",
        "items": [
          {
            "label": "Gimbal stabilizator",
            "icon": "🎬",
            "slug": "/products/electronice/gimbal-stabilizator"
          }
        ]
      }
    ]
  }
}
```

**`source`** poate fi `"cache"` | `"static"` — util pentru debugging, nu afișat în UI.
**NOTĂ:** OpenAI nu este apelat pe acest endpoint. MISS → static fallback direct.

**Error cases:**
- `400` — `tip` lipsă sau gol
- `500` — eroare MongoDB

---

#### `POST /api/ecosystem/configure`

**Body:**
| Câmp | Type | Required | Descriere |
|------|------|----------|-----------|
| `tip` | `string` | da | Tipul produsului principal (ex: `"Telefon"`) |
| `brand` | `string` | nu | Brand-ul produsului (contextualizare prompt) |
| `model` | `string` | nu | Modelul produsului (contextualizare prompt) |
| `scenarios` | `string[]` | da | Label-urile scenariilor selectate de user |
| `context` | `string` | nu | Text liber suplimentar de la utilizator |

**Response `200`:**
```json
{
  "recommendations": [
    {
      "tip": "Căști",
      "reason": "Audio de calitate pentru gaming competitiv",
      "products": [{ "brand": "Sony", "model": "WH-1000XM5", "price": 1299 }]
    }
  ]
}
```

**Error cases:**
- `400` — `tip` lipsă sau `scenarios` gol
- `500` — eroare OpenAI sau MongoDB

---

### OpenAI prompt

**Model:** `gpt-4o-mini`
**Mode:** `response_format: { type: "json_object" }`
**Timeout:** 10 secunde

```
Ești un expert în produse electronice și accesorii pentru o platformă
de e-commerce din România.

Generează un ecosystem de accesorii pentru produsul de tip: "${tip}".

Regulile ecosistemului:
- "critical": max 3 accesorii FĂRĂ de care produsul nu funcționează bine sau deloc.
  Fiecare are: label (string), reason (de ce e critic, 1 propoziție), icon (emoji).
- "recommended": max 5 accesorii care completează semnificativ experiența.
  Fiecare are: label (string), reason (de ce îl recomand, 1 propoziție), icon (emoji).
- "tasks": 3-6 scenarii de utilizare nișate, fiecare cu:
    id (string slug fără spații, ex: "gaming-mobile"),
    label (string, ex: "Gaming Mobile"),
    icon (emoji),
    context (descriere scurtă a utilizatorului țintă, max 15 cuvinte),
    items: array de 3-4 obiecte cu { label, icon }.

Răspunde EXCLUSIV în limba română.
Răspunde cu un obiect JSON valid cu exact cheile: critical, recommended, tasks.
Nu include URL-uri sau slug-uri — acestea se generează automat.
```

### Generarea slug-urilor (backend util)

```js
// backend/utils/toSlug.js
const toSlug = (label) =>
  label.toLowerCase()
    .replace(/ă/g, "a").replace(/â/g, "a").replace(/î/g, "i")
    .replace(/ș/g, "s").replace(/ț/g, "t")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

// Aplicat pe fiecare item din critical, recommended și tasks[].items
item.slug = `/products/electronice/${toSlug(item.label)}`;
```

---

### Frontend — component tree

```
Products.jsx  (MODIFIED)
  └── div.container-products-outer
        ├── div.filter
        │     ├── ProductEcosystem/          ← organism (sidebar)
        │     │     ├── EcosystemLevel/      ← molecule — nivel 1 și 2 (always expanded)
        │     │     │     └── EcosystemItem/ ← atom — Link + icon + label + reason
        │     │     └── EcosystemTask/       ← molecule — task collapsible (nivel 3)
        │     │           └── EcosystemItem/ ← refolosit
        │     └── FilterContent/             ← EXISTENT, neschimbat
        └── ProductGrid/
  └── EcosystemCarousels/                    ← NOU organism (full width, sub grid)
  └── ProductConfigurator/                   ← NOU organism (full width, sub carousele)

SingleProducts.jsx  (MODIFIED)
  └── ... secțiuni existente ...
  └── ProductConfigurator/                   ← NOU — montat și pe pagina single product
```

**Fișiere noi:**
```
src/Components/products/ProductEcosystem/
  ProductEcosystem.jsx
  EcosystemCarousels.jsx    ← NOU față de spec original
  ProductEcosystem.css
  index.js
  EcosystemLevel.jsx
  EcosystemTask.jsx
  EcosystemItem.jsx

src/Components/products/ProductConfigurator/  ← NOU față de spec original
  ProductConfigurator.jsx
  ProductConfigurator.css
  index.js
```

### Redux / RTK Query changes

| Tip | Nume | Fișier | Descriere |
|-----|------|--------|-----------|
| RTK endpoint | `getEcosystem` / `useGetEcosystemQuery` | `features/product/rtkProducts.js` | `GET /api/ecosystem/:tip`, cache 1h client |
| RTK endpoint | `configureEcosystem` / `useConfigureEcosystemMutation` | `features/product/rtkProducts.js` | `POST /api/ecosystem/configure` |

Fără Redux slice nou — niciun state global necesar.

### Key types / shapes

```js
// EcosystemItem shape
{
  label:  string,   // "Gimbal stabilizator"
  reason: string,   // doar în critical și recommended
  icon:   string,   // emoji "🎬"
  slug:   string,   // "/products/electronice/gimbal-stabilizator"
}

// EcosystemTask shape
{
  id:      string,          // "photography"
  label:   string,          // "Fotografie & Video"
  icon:    string,          // "📸"
  context: string,          // "Vrei să filmezi sau să faci poze de calitate"
  items:   EcosystemItem[],
}

// Ecosystem data shape (răspuns API)
{
  critical:    EcosystemItem[],
  recommended: EcosystemItem[],
  tasks:       EcosystemTask[],
}
```

### Edge cases

- [x] `tip` lipsă din URL → `useGetEcosystemQuery` cu `skip: !tip` → widget + carousele + configurator nu se afișează
- [x] Loading state → skeleton 4 linii animate (`eco-pulse`) în locul widgetului
- [x] Static fallback → `data.source === "static"` → UI afișează identic ca din cache
- [x] `tip` fără fallback static → `data.data === null` → widget returnează null
- [x] Mobile (≤ 768px) → `ecosystem-task__header` min-height 44px
- [ ] `OPENAI_API_KEY` lipsă → `configurator.js` crasha — de adăugat guard
- [ ] OpenAI MISS cache pentru `getEcosystem` (populare automată) — neimplementat, rămâne pentru v2
