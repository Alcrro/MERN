# /createDocsFeature

Creează documentația completă pentru un feature nou în `docs/features/[feature-name]/`.

**Utilizare:** `/createDocsFeature [feature-name]` (kebab-case, ex: `product-filters`, `user-reviews`)

---

## Pași în ordine

### 1. Validează argumentul

Dacă nu există argument, cere-l explicit:
```
Cum se numește feature-ul? (kebab-case, ex: product-filters)
```

Convertește automat: spații → `-`, uppercase → lowercase.

### 2. Verifică dacă există deja

Dacă `docs/features/[feature-name]/` există deja, oprește-te și întreabă:
```
docs/features/[feature-name]/ există deja. Suprascriu? (yes / no)
```

### 3. Scanează codebase-ul pentru context

Rulează în paralel:

**Modele Mongoose** — `find backend/models -name "*.js" | sort`
- Extrage numele fiecărui model (numele fișierului = numele modelului)
- Notează câmpurile relevante din fiecare (citește fișierele)

**Rute Express** — `find backend/routes -name "*.js" | sort`
- Extrage metodele HTTP și path-urile din fiecare fișier de rute
- Format: `GET /api/products`, `POST /api/products`, etc.

**Componente React** — `find frontend/src/Components -name "*.jsx" | grep -v index | sort`
- Listează organisms/ și molecules/ existente
- Acestea sunt candidați pentru REUSE în component tree

### 4. Creează folderul și cele 5 fișiere

Copiază din `docs/features/_template/` și completează cu ce ai găsit la pasul 3.

#### PRD.md
- Lasă `Problem Statement`, `User Stories`, `Acceptance Criteria`, `Out of Scope` goale cu comentariile template
- Completează doar `Last updated` cu data curentă
- Status: `Draft`

#### tech-spec.md
- Secțiunea **API contracts**: listează rutele existente descoperite la pas 3 ca referință (comentariu: "rute existente — adaugă cele noi mai jos")
- Secțiunea **Component tree**: listează organisms/ și molecules/ existente ca secțiune REUSE
- Secțiunea **Redux / RTK Query changes**: listează endpoint-urile RTK existente din `frontend/src/features/`
- Lasă restul gol cu comentariile template
- Status: `Draft`

#### database.md
- Secțiunea **Changes to existing collections**: listează modelele Mongoose găsite cu câmpurile lor actuale
- Lasă restul gol
- Adaugă nota: `<!-- Completează doar câmpurile noi sau modificate -->`

#### todos-frontend.md
- Completează placeholder-ul `[FeatureName]` cu numele în PascalCase
- Completează placeholder-ul `[resource]` cu feature-name-ul
- Lasă toate checkbox-urile nebifate `- [ ]`

#### todos-backend.md
- Completează placeholder-ul `[Resource]` / `[resource]` cu feature-name-ul
- Lasă toate checkbox-urile nebifate `- [ ]`

### 5. Raportează

```
✓ Creat: docs/features/[feature-name]/
  ├── PRD.md          — completează: problem, user stories, AC, out of scope
  ├── tech-spec.md    — completează: data flow, API contracts noi, decizii
  ├── database.md     — [X modele existente pre-completate]
  ├── todos-frontend.md
  └── todos-backend.md

Modele găsite: [lista]
Rute găsite:   [lista]
Componente reutilizabile: [lista organisms/molecules]

Pasul următor: completează PRD.md, apoi /implementDocsFeature [feature-name]
```
