---
description: Implements a feature phase-by-phase from its documentation in docs/features/[name]/. Pauses for confirmation between phases, checks todos, and generates a final report. Use when docs are ready and you want to start coding.
argument-hint: "[feature-name]"
---

Implementează un feature pe baza documentației din `docs/features/[feature-name]/`.
Lucrează fază cu fază, oprește-te după fiecare fază și așteaptă confirmare.

Dacă nu există argument, cere-l înainte de orice altceva.

## Înainte de cod

Citește în ordine: `PRD.md` → `tech-spec.md` → `database.md` → `todos-frontend.md` → `todos-backend.md`

Dacă PRD.md e în `Draft` sau are câmpuri goale critice, oprește-te și cere completarea lui.

Verifică conflicte cu codul existent (rute, componente, modele) și raportează înainte de a scrie orice.

## FAZA 1 — Setup & data layer

- Aplică schema changes din `database.md` (dacă există)
- Implementează handler-ele din `tech-spec.md → API contracts`
- Adaugă endpoint RTK Query în `features/[x]/rtk[X].js`

La final:
1. Bifează `- [x]` în todos-frontend.md și todos-backend.md pentru Faza 1
2. Afișează rezumat + instrucțiune de testare în browser
3. **Oprește-te. Scrie "ok" pentru Faza 2.**

## FAZA 2 — Core UI

- Page shell în `pages/[FeatureName]/` (zero logică)
- Organism în `organisms/[FeaturePanel]/` (`.jsx` + `.css` + `index.js`)
- Conectat la RTK hook, cu loading/empty/error states
- Rută adăugată în `App.js`
- Respectă CLAUDE.md: atoms ≤ 50 linii, molecules ≤ 80, organisms ≤ 150, pages ≤ 60

La final:
1. Bifează `- [x]` în todos-frontend.md pentru Faza 2
2. Afișează rezumat + ruta de testat
3. **Oprește-te. Scrie "ok" pentru Faza 3.**

## FAZA 3 — Polish

- Dark mode la finalul CSS-ului (`html[data-theme="dark"]`)
- Mobile: 768px și 375px
- A11y: `type="button"`, labels, fără `href="#"`
- Fără `console.log`, fără culori hardcodate, BEM naming

La final:
1. Bifează `- [x]` toate rămase în todos-frontend.md și todos-backend.md
2. Actualizează PRD.md Status → `Shipped`
3. Afișează raportul final:
   - Fișiere create / modificate (BE + FE separate)
   - Acceptance criteria din PRD: ✓ bifat / ⚠ nebifat
   - Todo-uri rămase nebifate (dacă există)
4. Sugerează mesajul de commit: `feat([feature-name]): [din PRD Problem Statement]`
