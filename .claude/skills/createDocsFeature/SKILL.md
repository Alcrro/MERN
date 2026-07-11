---
description: Creates full feature documentation in docs/features/[name]/ by scanning Mongoose models, Express routes, and React components. Use when starting a new feature.
argument-hint: "[feature-name]"
---

Creează documentația completă pentru un feature nou în `docs/features/[feature-name]/`.

Dacă nu există argument, cere-l explicit înainte de orice altceva.

## Pași în ordine

### 1. Validează argumentul
Convertește automat: spații → `-`, uppercase → lowercase.
Verifică dacă `docs/features/[feature-name]/` există deja — dacă da, întreabă înainte de a suprascrie.

### 2. Scanează codebase-ul (paralel)
- **Modele Mongoose:** `find backend/models -name "*.js" | sort` → citește câmpurile
- **Rute Express:** `find backend/routes -name "*.js" | sort` → extrage metodele HTTP + path-uri
- **Componente React:** `find frontend/src/Components -name "*.jsx" | grep -v index | sort` → listează organisms și molecules

### 3. Creează `docs/features/[feature-name]/` cu 5 fișiere

Copiază structura din `docs/features/_template/` și completează:

**PRD.md** — data curentă, Status: Draft, restul gol cu comentariile template

**tech-spec.md** — pre-completează:
- API contracts: rutele Express existente ca referință comentată
- Component tree secțiunea REUSE: organisms/ și molecules/ existente
- RTK endpoints: listează cele existente din `frontend/src/features/`

**database.md** — pre-completează secțiunea "Changes to existing" cu modelele Mongoose găsite + câmpurile lor actuale

**todos-frontend.md** — înlocuiește `[FeatureName]` cu PascalCase, `[resource]` cu feature-name, toate checkbox-urile `- [ ]`

**todos-backend.md** — înlocuiește `[Resource]` / `[resource]` cu feature-name, toate checkbox-urile `- [ ]`

### 4. Raportează
```
✓ Creat: docs/features/[feature-name]/
  ├── PRD.md
  ├── tech-spec.md
  ├── database.md
  ├── todos-frontend.md
  └── todos-backend.md

Modele găsite: [lista]
Rute găsite:   [lista]
Reutilizabile: [organisms/molecules]

Pasul următor: completează PRD.md → tech-spec.md → /implementDocsFeature [feature-name]
```
