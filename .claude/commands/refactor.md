# /refactor

Refactorizează componenta/fișierul curent sau cel specificat ca argument.
Utilizare: `/refactor` sau `/refactor src/components/organisms/ProductCard/ProductCard.jsx`

Aplică direct regulile din CLAUDE.md. Fără să ceri aprobare, fără plan intermediar.

---

## Pași în ordine

### 1. Citește fișierul țintă
Dacă nu e specificat un argument, folosește fișierul deschis în IDE.
Citește-l complet. Notează: număr de linii, props, state, hooks, funcții, CSS importat.

### 2. Determină nivelul atomic
Pe baza ce face componenta:
- **atom** — element UI singular, fără logică de business, sub 50 linii
- **molecule** — 2-3 atomi combinați, sub 80 linii
- **organism** — secțiune completă cu logică posibilă, sub 150 linii
- **page** — doar compoziție de organisme, sub 60 linii, zero logică

Dacă componenta nu e în folderul corect (`atoms/`, `molecules/`, `organisms/`, `pages/`), mută-o.

### 3. Sparge dacă depășește limita de linii
- Identifică blocuri JSX cu scop clar (un card, un header, o listă)
- Extrage fiecare bloc ca o nouă componentă la nivelul atomic corect
- Creează folderul co-located: `NumeComponenta/NumeComponenta.jsx`, `NumeComponenta.css`, `index.js`
- Componenta originală importă noile componente

### 4. Extrage hooks — UN HOOK = O SINGURĂ ACȚIUNE
Pentru fiecare acțiune distinctă din componentă:
- **Call API (RTK):** extrage în `useVerbSubstantiv.js` în `features/numeFeature/`
  ```js
  // useAddToCart.js
  export const useAddToCart = () => {
    const [addItem, { isLoading }] = useAddItemMutation()
    return { addToCart: (product) => addItem({ productId: product._id }), isLoading }
  }
  ```
- **Calcul derivat din state:** extrage în hook co-located cu componenta
- **UI state shared:** extrage în `hooks/useNume.js`
- Nu combina niciodată două acțiuni în același hook

### 5. Mută funcții utilitare
Dacă există funcții pure (formatare, filtrare array, validare) în componentă:
- Dacă e folosită în 1 loc → mută în `utils/domeniu.js` co-located temporar
- Dacă e folosită în 2+ locuri → mută în `src/utils/domeniu.js`
- Funcțiile din componentă devin import-uri

### 6. Curăță state-ul
- `useState` rămâne DOAR pentru: `isOpen`, `inputValue`, stări de animație
- Orice alt state global → verifică dacă există deja un Redux slice; dacă nu, creează slice
- Elimină prop drilling: dacă state-ul vine prin 3+ niveluri de props, pune-l în Redux

### 7. Curăță CSS
- Verifică dacă există reguli duplicate față de `productsv2.css`, `global.css`
- Șterge duplicatele din fișierul componentei
- Asigură-te că clasele urmează pattern-ul `.nume-componenta__element`
- Mută media queries și dark mode la finalul fișierului CSS

### 8. Raportează
La final, afișează compact:
```
✓ Extrase: [lista componente noi] [lista hooks noi] [utils mutate]
✓ Mutat în: atoms/ | molecules/ | organisms/ | pages/
⚠ Rămas: [ce mai necesită atenție dacă fișierul era prea complex]
```
