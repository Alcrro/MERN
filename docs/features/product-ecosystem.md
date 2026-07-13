# Product Ecosystem — Feature Spec

## Concept

Pe pagina de listing pentru un `tip` specific (ex: Telefon, Laptop), afișează în sidebar
un widget care mapează **produse accesorii** în funcție de relația lor cu produsul principal.

Scopul nu e o listă de categorii — e un **ghid de decizie**: utilizatorul înțelege
_de ce_ are nevoie de un accesoriu înainte să-l caute.

Vendorii și echipa internă nu pot acoperi toate cazurile de utilizare posibile, de aceea
ecosistemul este **generat și îmbogățit de OpenAI** — config-ul static servește ca
fallback și seed, AI-ul adaugă task-uri nișate pe care oamenii nu le-ar anticipa.

---

## Cele 3 niveluri

### Nivel 1 — Critic
> „Fără asta produsul nu funcționează optim / deloc"

- Afișat mereu, expanded
- Accent vizual: roșu / portocaliu
- Exemple Telefon: Încărcător, Husă protecție

### Nivel 2 — Recomandat
> „Cu asta experiența e completă"

- Afișat mereu, expanded
- Accent vizual: albastru (primary)
- Exemple Telefon: Căști, Folie sticlă, Cablu date

### Nivel 3 — Task-based
> „Depinde ce vrei să faci cu el"

- Fiecare task = un grup collapsed by default, expandabil individual
- Accent vizual: neutru / gri
- AI generează task-urile — static config acoperă cazurile comune, AI descoperă nișe

---

## Arhitectura AI (OpenAI)

### De ce backend, nu frontend

API key-ul OpenAI nu poate fi expus în client. Toate apelurile trec printr-un
endpoint de backend care returnează JSON structurat, identic indiferent dacă
răspunsul vine din cache sau din OpenAI.

### Flux complet

```
Frontend (RTK Query)
  → GET /api/ecosystem/:tip
      → Backend verifică cache MongoDB
          ├── HIT  → returnează JSON din cache
          └── MISS → apelează OpenAI (gpt-4o-mini, JSON mode)
                        → salvează în cache (TTL: 7 zile)
                        → returnează JSON
```

### Motivul cache-ului

Ecosistemul pentru „Telefon" e același indiferent de utilizator.
Un apel OpenAI per tip la prima accesare, apoi 0 costuri pentru același tip
timp de 7 zile. La TTL expiry, se regenerează automat cu date potențial mai bune.

---

## Backend — endpoint

### `GET /api/ecosystem/:tip`

**Parametri:**
- `:tip` — valoarea internă a tipului (ex: `Telefon`, `Laptop`, `TV`)

**Răspuns (același shape indiferent de sursă):**

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
    "recommended": [ ... ],
    "tasks": [
      {
        "id": "photography",
        "label": "Fotografie & Video",
        "icon": "📸",
        "context": "Vrei să scoți poze ca la aparat foto sau să filmezi vlog-uri",
        "items": [
          {
            "label": "Gimbal stabilizator",
            "icon": "🎬",
            "slug": "/products/electronice/gimbal"
          }
        ]
      }
    ]
  }
}
```

`"source"` poate fi `"cache"` | `"openai"` | `"static"` — util pentru debugging.

---

## Promptul OpenAI

Model: `gpt-4o-mini` (rapid, ieftin, excelent pentru JSON structurat)  
Mode: `response_format: { type: "json_object" }`

```
Ești un expert în produse electronice și accesorii pentru o platformă
de e-commerce din România.

Generează un ecosystem de accesorii pentru produsul de tip: "${tip}".

Regulile ecosistemului:
- "critical": max 3 accesorii FĂRĂ de care produsul nu funcționează bine sau deloc.
  Fiecare are: label, reason (de ce e critic, 1 propoziție), icon (emoji).
- "recommended": max 5 accesorii care completează semnificativ experiența.
  Fiecare are: label, reason (de ce îl recomand, 1 propoziție), icon (emoji).
- "tasks": 3-6 scenarii de utilizare nișate, collapse-abile.
  Fiecare task are: id (slug fără spații), label, icon (emoji),
  context (descriere scurtă a utilizatorului țintă, max 15 cuvinte),
  items (3-4 accesorii, fiecare cu label și icon).

Răspunde EXCLUSIV în limba română.
Răspunde cu un obiect JSON valid cu cheile: critical, recommended, tasks.
Nu include sluguri URL — acestea se generează automat pe backend.
```

### Generarea slug-urilor

Backend-ul primește răspunsul AI (fără URL-uri) și mapează fiecare `label`
la un slug folosind `TIP_TO_TIP_SLUG` dacă există, altfel generează din label:

```js
const toSlug = (label) =>
  label.toLowerCase()
    .replace(/ă/g, "a").replace(/â/g, "a").replace(/î/g, "i")
    .replace(/ș/g, "s").replace(/ț/g, "t")
    .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

item.slug = `/products/electronice/${toSlug(item.label)}`;
```

---

## Cache — schema MongoDB

```js
// models/ecosystemCache/EcosystemCache.js
const EcosystemCacheSchema = new Schema({
  tip:       { type: String, required: true, unique: true, index: true },
  data:      { type: Schema.Types.Mixed, required: true },
  source:    { type: String, enum: ["openai", "static"], default: "openai" },
  expiresAt: { type: Date, required: true, index: { expireAfterSeconds: 0 } },
}, { timestamps: true });
```

TTL gestionat de MongoDB via `expireAfterSeconds: 0` pe câmpul `expiresAt`
(se setează la `Date.now() + 7 * 24 * 60 * 60 * 1000` la scriere).

---

## Config static — fallback

Dacă OpenAI call eșuează (timeout, eroare, lipsă API key), backend-ul
returnează config-ul static din `productEcosystem.js`.

```js
// backend/utils/productEcosystemFallback.js
module.exports = {
  "Telefon": {
    critical: [
      { label: "Încărcător",         reason: "Bateria se consumă zilnic", icon: "⚡" },
      { label: "Husă de protecție",  reason: "Prima linie de apărare la căderi",  icon: "🛡️" },
    ],
    recommended: [
      { label: "Folie sticlă",   reason: "Ecranul e componenta cea mai scumpă de reparat", icon: "📱" },
      { label: "Căști",          reason: "Audio de calitate și mâini libere",               icon: "🎧" },
      { label: "Cablu USB-C",    reason: "Transfer rapid + backup",                         icon: "🔌" },
    ],
    tasks: [
      {
        id: "photography", label: "Fotografie & Video", icon: "📸",
        context: "Vrei să filmezi sau să faci poze de calitate",
        items: [
          { label: "Trepied smartphone",  icon: "📷" },
          { label: "Gimbal stabilizator", icon: "🎬" },
          { label: "Microfon extern",     icon: "🎙️" },
        ],
      },
      {
        id: "gaming", label: "Gaming Mobile", icon: "🎮",
        context: "Joci titluri competitive pe telefon",
        items: [
          { label: "Controller Bluetooth", icon: "🕹️" },
          { label: "Răcitor telefon",      icon: "❄️" },
          { label: "Power bank",           icon: "🔋" },
        ],
      },
      {
        id: "travel", label: "Mașină & Călătorie", icon: "🚗",
        context: "Telefonul stă în mașină sau ești mereu pe drumuri",
        items: [
          { label: "Suport auto",          icon: "🚗" },
          { label: "Încărcător auto rapid",icon: "⚡" },
          { label: "Power bank compact",   icon: "🔋" },
        ],
      },
    ],
  },
};
```

---

## Frontend — RTK Query endpoint

```js
// features/product/rtkProducts.js (adăugat)
getEcosystem: builder.query({
  query: (tip) => `ecosystem/${encodeURIComponent(tip)}`,
  keepUnusedDataFor: 3600, // cache client 1h (backend are cache 7 zile)
}),
```

---

## Componente necesare

```
src/Components/products/
  ProductEcosystem/
    ProductEcosystem.jsx   ← organism: citește tip din useParams, fetch RTK
    ProductEcosystem.css
    index.js
    EcosystemLevel.jsx     ← molecule: titlu nivel + listă items (critical / recommended)
    EcosystemTask.jsx      ← molecule: task collapsible (nivel 3), useState(isOpen)
    EcosystemItem.jsx      ← atom: Link cu icon + label + reason opțional
```

`ProductEcosystem.jsx` returnează `null` dacă `tip` nu există în URL sau dacă
fetch-ul nu returnează date.

---

## Montare în pagină

În sidebar-ul din `Products.jsx`, deasupra filtrelor:

```jsx
<div className="filter">
  <ProductEcosystem />
  <FilterContent filters={filters} />
</div>
```

---

## Variabile de mediu necesare

```env
# backend/.env
OPENAI_API_KEY=sk-...
```

---

## Roadmap

| Versiune | Ce adaugă |
|----------|-----------|
| v1 | Backend endpoint + OpenAI + cache MongoDB + fallback static, doar Telefon |
| v2 | RTK Query frontend + componente UI (toate 3 nivelurile) |
| v3 | Query param `?context=gaming-mobile` cu banner pe pagina destinație |
| v4 | Extindere la toate tip-urile din seeder (auto-generate la primul acces) |
| v5 | Admin panel — vizualizare + override manual al ecosistemului generat de AI |
