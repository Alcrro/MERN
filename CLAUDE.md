# MERN / alcrro — Reguli pentru Claude Code

## Stack
- **Frontend:** React 18, RTK Query, Redux Toolkit, React Router v6
- **Styling:** Plain CSS cu variabile CSS (`var(--primary)`, `var(--bg-card)` etc.), fără Tailwind
- **Backend:** Node.js, Express, MongoDB/Mongoose
- **Theme:** `html[data-theme="dark"] .clasa { }` pentru dark mode

---

## Structura folderelor — Atomic Design

```
src/
  components/
    atoms/          ← cea mai mică unitate, fără logică de business
      Button/
      Input/
      Badge/
      Checkbox/
    molecules/      ← 2-3 atomi combinați cu un scop clar
      SearchBar/    ← Input + Button
      FilterChip/   ← Checkbox + Badge
      RatingStars/
    organisms/      ← secțiuni complete, pot conține logică
      Header/
      ProductCard/
      SidebarFilters/
      Pagination/
  pages/            ← doar compoziție de organisme, fără logică proprie
    Products/
    Home/
    Auth/
  features/         ← RTK Query endpoints + Redux slices
    product/
    cart/
    auth/
  hooks/            ← hooks shared între mai multe componente
  utils/            ← funcții pure, fără React
```

### Structura unui folder de componentă (co-located)
```
ProductCard/
  ProductCard.jsx
  ProductCard.css
  index.js          ← export { default } from './ProductCard'
```

---

## Reguli componente

### Dimensiune limită
- **atoms:** maxim 50 linii JSX
- **molecules:** maxim 80 linii JSX
- **organisms:** maxim 150 linii JSX
- **pages:** maxim 60 linii JSX (doar compoziție, zero logică)

Dacă depășești limita, sparge în sub-componente sau extrage un hook.

### Props
- Maxim **4 props** pentru atomi, **6 pentru molecule**, **8 pentru organisme**
- Nu pasa setteri Redux ca props (prop drilling). Fiecare componentă apelează `useDispatch` direct.
- Dacă ai nevoie de mai mult de 6 props, ridică state-ul în Redux sau restructurează.

---

## Hooks — un hook = o singură acțiune

**Regula strictă:** fiecare hook face UN singur lucru.

```js
// ✓ corect
const { addToCart }      = useAddToCart()
const { removeFromCart } = useRemoveFromCart()
const { updateQuantity } = useUpdateQuantity()

// ✗ greșit
const { add, remove, update } = useCart()
```

### Tipuri de hooks și unde stau

| Tip | Exemplu | Locație |
|-----|---------|---------|
| Server action (RTK) | `useAddToCart`, `useGetProducts` | `features/numeFeature/` |
| UI state | `useToggle`, `useDebounce` | `hooks/` (shared) sau co-located |
| Derivat din state | `useFilteredProducts`, `useCartTotal` | co-located cu componenta |
| Browser API | `useLocalStorage`, `useMediaQuery` | `hooks/` |

Hook-ul RTK wrappează un singur endpoint:
```js
// features/cart/useAddToCart.js
export const useAddToCart = () => {
  const [addItem, { isLoading }] = useAddItemMutation()
  return {
    addToCart: (product) => addItem({ productId: product._id }),
    isLoading,
  }
}
```

---

## State management

- **RTK Query** — orice call API (GET/POST/PUT/DELETE), cache automat
- **Redux slice** — state global: coș, user autentificat, filtre active, preferință afișare, temă
- **useState local** — EXCLUSIV pentru: `isOpen`, `inputValue` înainte de submit, animații locale

Nu duplica date din server în slice. RTK cache-ul e suficient.

---

## Funcții utilitare — `src/utils/`

Funcțiile pure (fără React, fără side effects) stau în `src/utils/` grupate pe domeniu:

```
utils/
  formatters.js     ← formatPrice(n), formatDate(d), truncate(str, n)
  arrayHelpers.js   ← groupBy(arr, key), uniqueBy(arr, key), sortBy(arr, key)
  validators.js     ← isValidEmail(s), isValidPhone(s)
  constants.js      ← ITEMS_PER_PAGE, SORT_OPTIONS, RATING_OPTIONS
```

**Regulă:** dacă o funcție e folosită în 2+ locuri, merge în `utils/`. Dacă e folosită doar într-un singur loc, poate sta co-located temporar, dar la prima duplicare se mută.

---

## CSS

- Fiecare componentă are **propriul fișier CSS** importat în JSX-ul ei
- Folosește **variabilele globale** — nu hard-coda culori, mărimi, shadow-uri
- Clasele CSS includ numele componentei: `.product-card__title`, nu `.title`
- Dark mode la **finalul** fișierului: `html[data-theme="dark"] .product-card { }`
- Media queries la **finalul** fișierului, după dark mode
- Nu duplica reguli care există în `productsv2.css`, `global.css`

---

## Convenții de denumire

| Tip | Format | Exemplu |
|-----|--------|---------|
| Componentă | PascalCase | `ProductCard.jsx` |
| Hook | camelCase + `use` | `useAddToCart.js` |
| Slice Redux | camelCase + `Slice` | `cartSlice.js` |
| RTK endpoint | verb + substantiv | `useGetProductsQuery` |
| Util function | camelCase | `formatPrice.js` |
| Constantă | SCREAMING_SNAKE | `MAX_ITEMS_PER_PAGE` |
| CSS class | BEM-like kebab | `.product-card__price` |

---

## Ce NU se face niciodată

- `console.log` în cod final
- Comentarii care explică CE face codul — numele variabilei/funcției face asta
- `/* eslint-disable */` pe fișiere noi — repară warning-ul
- Logică de business în pagini (pages/ e doar compoziție)
- Prop drilling mai mult de 2 nivele — pune în Redux
- Un hook care face mai mult de un lucru
- Fișiere `.md`, `README`, `NOTES` în cod — documentația e în CLAUDE.md
