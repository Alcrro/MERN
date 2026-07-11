# /implementDocsFeature

Implementează un feature complet pe baza documentației din `docs/features/[feature-name]/`.
Lucrează fază cu fază, cu confirmare între faze.

**Utilizare:** `/implementDocsFeature [feature-name]`

---

## Înainte de orice cod

### 1. Validează că documentația există și e completă

```
find docs/features/[feature-name] -type f
```

Citește în ordine:
1. `PRD.md` — înțelege CE construiești și ce NU construiești (Out of Scope)
2. `tech-spec.md` — arhitectura, API contracts, component tree
3. `database.md` — dacă există schimbări de schemă
4. `todos-frontend.md` — lista exactă de sarcini FE pe faze
5. `todos-backend.md` — lista exactă de sarcini BE pe faze

Dacă `PRD.md` are Status `Draft` sau câmpuri goale critice (Problem Statement, Acceptance Criteria), oprește-te:
```
PRD.md e în Draft sau incomplet. Completează-l înainte de implementare.
Câmpuri lipsă: [lista]
```

### 2. Verifică conflicte cu codul existent

- Rutele noi din tech-spec nu se suprapun cu `backend/routes/`
- Componentele noi nu există deja în `frontend/src/`
- Modelele modificate nu au migrări necesare neacoperite în `database.md`

Raportează orice conflict înainte de a scrie cod.

---

## FAZA 1 — Setup & data layer

> Scopul: date care curg de la API la consolă. Zero UI.

### Backend (dacă database.md are schimbări):
- Aplică modificările de schemă din `database.md`
- Creează/actualizează modelul Mongoose
- Adaugă indexele specificate

### Backend (controller + route):
- Implementează handler-ele din `tech-spec.md → API contracts`
- Înregistrează ruta în `server.js` / `app.js`
- Urmează convențiile: `controllers/[resource]/[resource].js`, `routes/[resource].js`

### Frontend:
- Adaugă endpoint-ul RTK Query în `features/[x]/rtk[X].js`
- Shape-ul răspunsului trebuie să corespundă `tech-spec.md → Key types`

### La final Faza 1:
1. Bifează `- [x]` în `todos-frontend.md` și `todos-backend.md` pentru tot ce e implementat în Faza 1
2. Afișează:
```
━━━ FAZA 1 completă ━━━
✓ BE: [fișiere create/modificate]
✓ FE: [fișiere create/modificate]
✓ Todo-uri bifate: [număr]

Testează în browser: [URL sau instrucțiune specifică]
Confirmă cu "ok" pentru a trece la Faza 2.
```
3. **Oprește-te și așteaptă confirmare.**

---

## FAZA 2 — Core UI

> Scopul: feature funcțional end-to-end. Fără polish.

Implementează conform `tech-spec.md → Frontend component tree`:
- Page shell în `pages/[FeatureName]/` (zero logică, compoziție pură)
- Organism principal în `organisms/[FeaturePanel]/` (`.jsx` + `.css` + `index.js`)
- Conectează la hook-ul RTK din Faza 1
- Loading state, empty state, error state
- Adaugă ruta în `App.js` dacă nu există
- Adaugă în NavbarAux / Breadcrumb dacă tech-spec specifică

Respectă CLAUDE.md:
- atoms ≤ 50 linii, molecules ≤ 80, organisms ≤ 150, pages ≤ 60
- Un hook = o singură acțiune
- CSS co-located, variabile CSS, BEM naming

### La final Faza 2:
1. Bifează `- [x]` în `todos-frontend.md` pentru Faza 2
2. Afișează:
```
━━━ FAZA 2 completă ━━━
✓ Componente create: [lista cu nivel atomic]
✓ Rută adăugată: [path]
✓ Todo-uri bifate: [număr]

Testează: navighează la [rută] și verifică că datele apar.
Confirmă cu "ok" pentru Faza 3 (polish).
```
3. **Oprește-te și așteaptă confirmare.**

---

## FAZA 3 — Polish & edge cases

> Scopul: production-ready. Design, accesibilitate, mobile, fără regressions.

- Dark mode: `html[data-theme="dark"]` la finalul CSS-ului fiecărei componente
- Mobile: verifică la 768px și 375px
- A11y: `type="button"`, labels, fără `href="#"`, fără `onClick` pe `<div>`
- CSS: fără culori hardcodate, clase BEM, fără duplicate față de global.css
- Șterge orice `console.log`
- Verifică: prop drilling ≤ 2 nivele
- Bifează acceptance criteria din PRD.md (mental, nu în fișier)

### La final Faza 3 — Raport final:
1. Bifează `- [x]` în `todos-frontend.md` și `todos-backend.md` pentru Faza 3
2. Actualizează `PRD.md` Status: `Draft` → `Shipped`
3. Afișează raportul final:

```
━━━━━━━━━━━━━━━━━━━━━━━
FEATURE [feature-name] — IMPLEMENTAT
━━━━━━━━━━━━━━━━━━━━━━━

Fișiere create:
  BE: [lista]
  FE: [lista]

Fișiere modificate:
  [lista]

Acceptance criteria:
  ✓ [criterion 1]
  ✓ [criterion 2]
  ⚠ [criterion nebifat dacă există]

Todo-uri rămase nebifate:
  [lista sau "toate bifate"]

PRD.md actualizat → Shipped
━━━━━━━━━━━━━━━━━━━━━━━
```

4. Sugerează commit:
```
Rulează: git add [fișiere relevante]
Mesaj recomandat: feat([feature-name]): [descriere din PRD Problem Statement]
```
