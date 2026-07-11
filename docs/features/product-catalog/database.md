<!-- Reverse-engineered from backend/models/catalog/CatalogProduct.js — verify against DB -->

# Database — Product Catalog

## Collection: `catalogproducts`

Model: `CatalogProduct` (`backend/models/catalog/CatalogProduct.js`)

### Schema

| Câmp | Tip | Constrângeri | Default |
|------|-----|-------------|---------|
| `_id` | ObjectId | auto | — |
| `kind` | String | required, enum: Electronics / Clothing / Furniture / HomeGarden / Books | — |
| `brand` | String | required, trim | — |
| `specs` | Mixed | — | `{}` |
| `images` | [String] | — | `[]` |
| `culoare` | [String] | — | `[]` |
| `refPrice` | Number | — | `null` |
| `createdAt` | Date | timestamps | auto |
| `updatedAt` | Date | timestamps | auto |

### `specs` — câmpuri uzuale per kind

| kind | Câmpuri specs folosite |
|------|----------------------|
| Electronics | `model`, `procesor`, `RAM`, `stocare`, `tip` (Telefon/Laptop/etc.) |
| Clothing | `name`, `tip`, `gen`, `material`, `fit` |
| Furniture | `name`, `material`, `dimensiuni` |
| HomeGarden | `name`, `material` |
| Books | `name`, `autor`, `editura`, `pagini` |

> `specs` e `Mixed` — nu e validat de Mongoose. Câmpurile de mai sus sunt convenție din seeder și `CATALOG_SPEC_FIELDS`.

### Indexes

```js
{ kind: 1 }
// text index pentru searchCatalog:
{ brand: "text", "specs.model": "text", "specs.name": "text" }
// weights: brand: 3, specs.model: 2, specs.name: 2
// name: "CatalogTextIndex"
```

## Seeder

`backend/seeder.js` — 31 intrări hardcodate (Apple, Samsung, Google, Asus, Sony, ZARA, IKEA, etc.) cu `culoare[]` și `refPrice`.

Rulare: `node backend/seeder.js` — șterge colecția și re-inserează toate intrările.
