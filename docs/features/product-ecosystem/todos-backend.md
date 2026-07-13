# Backend TODOs: Product Ecosystem

> **Last updated:** 2026-07-13
> **Stack:** Node.js, Express, MongoDB/Mongoose, OpenAI SDK
> **Conventions:** controllers în `controllers/[resource]/`, routes în `routes/`

---

## Phase 1 — Model & fallback static

> Goal: cache-ul poate stoca și returna ecosisteme; fallback-ul static e gata.

- [x] Instalează OpenAI SDK: `npm install openai` în `/backend`
- [x] Creează `backend/models/ecosystemCache/EcosystemCache.js` (vezi `database.md`)
  - [x] Câmpuri: `tip`, `data`, `source`, `expiresAt`
  - [x] Index TTL pe `expiresAt` (definit ca `EcosystemCacheSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })`)
  - [x] Index unic pe `tip`
- [x] Creează `backend/utils/toSlug.js` — transliterare română → slug latin (include și variantele `ş`/`ţ`)
- [x] Creează `backend/utils/productEcosystemFallback.js` — date statice pentru `"Telefon"`
  - [x] Secțiunea `critical` (2 itemi: Încărcător, Husă de protecție)
  - [x] Secțiunea `recommended` (4 itemi: Folie, Căști, Cablu USB-C, Power bank)
  - [x] Secțiunea `tasks` (4 task-uri: photography, gaming, productivity, travel)
  - [x] Aplică `toSlug` pe toate label-urile pentru a genera slug-urile

---

## Phase 2 — Controller & route

> Goal: `GET /api/ecosystem/:tip` și `POST /api/ecosystem/configure` returnează JSON corect.

- [x] Creează `backend/controllers/ecosystem/ecosystem.js`
  - [x] Handler `getEcosystem(req, res)`
  - [x] Validare: `tip` lipsă → `400`
  - [x] Sanitizare: `decodeURIComponent(req.params.tip).trim()` înainte de orice
  - [x] Lookup cache: `EcosystemCache.findOne({ tip })`
  - [x] Dacă cache HIT → `res.json({ tip, source: "cache", data: cached.data })`
  - [x] Dacă cache MISS → returnează fallback static (`FALLBACK[tip] ?? null`)
  - **NOTĂ:** Apelul OpenAI nu este în acest controller — endpoint-ul GET nu apelează OpenAI
- [x] Creează `backend/controllers/ecosystem/configurator.js`
  - [x] Handler `configure(req, res)` pentru `POST /api/ecosystem/configure`
  - [x] Validare: `tip` lipsă → `400`; `scenarios` gol → `400`
  - [x] Extrage categorii disponibile din catalog: `Product.distinct("tip", ...)`
  - [x] Apel OpenAI `gpt-4o-mini` cu prompt product-aware, timeout 20s (`AbortSignal.timeout(20000)`)
  - [x] Pentru fiecare recomandare AI: fetch ≤ 4 produse din catalog cu `tip` matching
  - [x] Filtrează recomandările fără produse (`r.products.length > 0`)
  - [x] Returnează `{ recommendations: [...] }` cu produse reale embedded
- [x] Creează `backend/routes/ecosystem/ecosystem.js`
  - [x] `GET /:tip` → `getEcosystem`
  - [x] `POST /configure` → `configure`
- [x] Înregistrează în `backend/server.js`: `server.use("/api/ecosystem", ...)`
- [ ] Testează cu curl / Postman (după ce pornești serverul)

---

## Phase 3 — Edge cases & securitate

> Goal: production-ready, nu expune erori interne, gestionează rate limits.

- [x] Sanitizare `tip` din URL: `decodeURIComponent(req.params.tip).trim()` — implementat
- [ ] Dacă `OPENAI_API_KEY` lipsește din `.env` → `configurator.js` va crasha (nu are fallback); de adăugat guard
- [ ] Timeout la OpenAI call în `configurator.js` e 20s (mai lung decât spec-ul de 10s) — acceptabil, de revizuit
- [ ] Rate limit `configure`: cereri simultane de la mulți useri vor genera apeluri OpenAI multiple — de adăugat throttling în v2
- [ ] Niciun `console.log` în cod final
- [ ] OpenAI pentru popularea cache-ului GET — neimplementat în v1; rămâne pentru v2

---

## Files touched

| Fișier | Status | Note |
|--------|--------|------|
| `backend/models/ecosystemCache/EcosystemCache.js` | [x] | model creat |
| `backend/utils/toSlug.js` | [x] | util creat (include ş/ţ variante) |
| `backend/utils/productEcosystemFallback.js` | [x] | fallback static — Telefon complet |
| `backend/controllers/ecosystem/ecosystem.js` | [x] | GET handler — cache + static fallback |
| `backend/controllers/ecosystem/configurator.js` | [x] | POST handler — OpenAI + catalog real |
| `backend/routes/ecosystem/ecosystem.js` | [x] | GET /:tip + POST /configure |
| `backend/server.js` | [x] | `server.use("/api/ecosystem", ...)` înregistrat |
| `backend/.env` | [ ] | adaugă `OPENAI_API_KEY=sk-...` |
| `package.json` (backend) | [x] | `openai` dependency instalat |
