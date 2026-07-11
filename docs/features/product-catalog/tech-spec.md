# Tech Spec: Product Catalog

> **Status:** `Draft`
> **Author:** Alexandru Roventa
> **Last updated:** 2026-07-11
> **Related PRD:** [PRD.md](./PRD.md)

---

## Overview

### What we're building

O colecție MongoDB `CatalogProduct` cu produse pre-seeded (telefoane, laptopuri, haine etc.) care servește ca sursă de adevăr. În `VendorProductForm` apare un câmp de căutare care face query la catalog; la selectare, câmpurile formularului se auto-completează. Vendorul poate modifica orice câmp sau ignora catalogul și completa manual.

### Architecture decision log

| Decision | Options considered | Why we chose this |
|----------|--------------------|-------------------|
| Colecție separată vs subdocument în Product | Subdocument, colecție separată | Separată — catalog e read-only pentru vendori, evoluat independent |
| Schema catalog vs discriminator | Discriminator (ca Product), schema plată | Schema plată cu câmp `kind` + `specs` object — mai simplu de seeded și de interogat |
| Search: text index vs regex | Regex `/query/i`, MongoDB text index | Text index — mai rapid, suportă relevance score |
| State în form: RTK cache vs useState local | RTK cache, useState | useState local pentru query string + rezultate dropdown — e UI state pur |

### Risks & trade-offs

- **Risk:** Catalogul e gol la început — vendorii nu vor găsi nimic. **Mitigation:** Seeder cu top 50 telefoane + 20 laptopuri la lansare.
- **Risk:** Specs din catalog devin vechi. **Mitigation:** Admin poate edita oricând; datele sunt doar un punct de plecare, nu sursa de adevăr la afișare.

---

## Implementation

### Data flow

```
VendorProductForm
  → input onChange (≥2 chars)
  → useSearchCatalogQuery(q, kind)   ← RTK Query (debounced 300ms)
  → GET /api/catalog?q=iphone&kind=Electronics
  → CatalogProduct.find({ $text: { $search: q }, kind })
  → dropdown cu rezultate
  → user selectează → onSelect(catalogEntry)
  → setForm({ brand, price, ...specs }) + setImages(catalogEntry.images)
```

### API contracts

#### `GET /api/catalog`

**Query params:**
| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `q` | `string` | yes | search term (min 2 chars) |
| `kind` | `string` | no | `Electronics` \| `Clothing` etc. — filtrare după categorie |
| `limit` | `number` | no | default `10`, max `20` |

**Response `200`:**
```json
{
  "results": [
    {
      "_id": "...",
      "kind": "Electronics",
      "brand": "Apple",
      "specs": {
        "model": "iPhone 15 Pro",
        "tip": "Telefon",
        "stocare": "256GB",
        "RAM": "8GB",
        "procesor": "A17 Pro",
        "display": "6.1\" OLED",
        "camera": "48MP",
        "baterie": "3274mAh",
        "OS": "iOS 17"
      },
      "images": ["https://..."]
    }
  ],
  "count": 1
}
```

**Error cases:**
- `400` — `q` lipsă sau mai scurt de 2 caractere

---

#### `POST /api/catalog` _(admin only)_

**Body:** același shape ca un result de mai sus (fără `_id`)
**Response `201`:** intrarea creată

#### `PUT /api/catalog/:id` _(admin only)_
#### `DELETE /api/catalog/:id` _(admin only)_

---

### Frontend — component tree

```
vendor/VendorProductForm/VendorProductForm.jsx   ← MODIFY — adaugă CatalogSearch deasupra câmpurilor
  vendor/CatalogSearch/CatalogSearch.jsx          ← NEW organism (≤ 150 linii)
    CatalogSearch.css                             ← NEW
    index.js                                      ← NEW
```

**Componente reutilizabile:**
- `vendor/CategoryPicker/CategoryPicker.jsx` — selectorul de `kind` deja existent, folosit pentru a filtra catalogul
- `vendor/ImageUploader/ImageUploader.jsx` — pre-populat cu imaginile din catalog la selecție
- `vendor/VendorProductForm/CategoryFields.jsx` — câmpurile de specs, auto-completate la selecție

### Redux / RTK Query changes

| Type | Name | File | Description |
|------|------|------|-------------|
| RTK endpoint | `useSearchCatalogQuery` | `features/catalog/rtkCatalog.js` | GET /api/catalog cu debounce |
| RTK endpoint | `useCreateCatalogEntryMutation` | `features/catalog/rtkCatalog.js` | admin only |

> Nu e nevoie de Redux slice — rezultatele sunt UI state local în `CatalogSearch`.

### Key types / shapes

```js
// CatalogEntry — shape returnat de API
{
  _id: string,
  kind: "Electronics" | "Clothing" | "Furniture" | "HomeGarden" | "Books",
  brand: string,
  specs: {
    // Electronics
    model?: string, tip?: string, stocare?: string, RAM?: string,
    procesor?: string, GPU?: string, display?: string, camera?: string,
    baterie?: string, OS?: string, conectivitate?: string,
    // Clothing
    name?: string, material?: string, gender?: string,
  },
  images: string[],   // URL-uri imagini oficiale
}
```

### Edge cases to handle

- [ ] Empty state — "Niciun produs găsit în catalog. Completează manual câmpurile de mai jos."
- [ ] Loading state — spinner mic în dreapta input-ului (nu skeleton întreg)
- [ ] Query < 2 chars — nu se face request, dropdown închis
- [ ] Selecție anulată — buton X care resetează câmpurile la valorile inițiale (goale)
- [ ] Mobile — dropdown apare deasupra/dedesubt în funcție de spațiu disponibil
