---
description: Refactor a React component following CLAUDE.md rules - atomic design, one action per hook, separate utils. Use when asked to refactor a component.
argument-hint: "[path/to/Component.jsx]"
---

Refactorizează componenta/fișierul curent sau cel specificat ca argument.
Dacă nu e specificat argument, folosește fișierul deschis în IDE.

Aplică direct regulile din CLAUDE.md. Fără plan intermediar, fără să ceri aprobare.

## Pași în ordine

### 1. Citește fișierul
Citește-l complet. Notează: linii, props, state, hooks, funcții, CSS importat.

### 2. Determină nivelul atomic
- **atom** — element UI singular, fără logică de business, sub 50 linii
- **molecule** — 2-3 atomi combinați, sub 80 linii
- **organism** — secțiune completă cu logică posibilă, sub 150 linii
- **page** — doar compoziție de organisme, sub 60 linii, zero logică

Dacă componenta nu e în folderul corect, mută-o.

### 3. Sparge dacă depășește limita de linii
- Identifică blocuri JSX cu scop clar
- Extrage fiecare bloc ca o nouă componentă la nivelul atomic corect
- Structura co-located: `NumeComponenta/NumeComponenta.jsx` + `NumeComponenta.css` + `index.js`

### 4. Extrage hooks — UN HOOK = O SINGURĂ ACȚIUNE
Pentru fiecare acțiune distinctă:
- **Call API (RTK):** extrage în `useVerbSubstantiv.js` în `features/numeFeature/`
- **Calcul derivat:** hook co-located cu componenta
- **UI state shared:** în `src/hooks/`
- Nu combina niciodată două acțiuni în același hook

### 5. Mută funcții utilitare
- Funcții pure → `src/utils/domeniu.js` (formatters, arrayHelpers, validators, constants)
- Co-located doar dacă e folosită strict într-un singur loc

### 6. Curăță state-ul
- `useState` rămâne DOAR pentru: isOpen, inputValue, animații locale
- Orice alt state global → Redux slice existent sau nou
- Elimină prop drilling: dacă state-ul vine prin 3+ niveluri → Redux

### 7. Curăță CSS
- Șterge duplicate față de `productsv2.css`, `global.css`
- Clase cu prefix: `.product-card__title` nu `.title`
- Media queries și dark mode la finalul fișierului

### 8. Raportează
```
✓ Extrase: [componente noi] [hooks noi] [utils mutate]
✓ Nivel atomic: atoms/ | molecules/ | organisms/ | pages/
⚠ Rămas: [ce mai necesită atenție]
```
