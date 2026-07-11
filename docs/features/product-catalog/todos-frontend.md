# Frontend TODOs — Product Catalog

## Faza 1 — RTK + Data layer
- [x] `rtkCatalog.js` cu `useListCatalogQuery`, `useSearchCatalogQuery`
- [x] `useCreateCatalogEntryMutation`, `useUpdateCatalogEntryMutation`, `useDeleteCatalogEntryMutation`
- [x] Tag `Catalog` pentru cache invalidation
- [x] `store.js` înregistrează `catalogApi`

## Faza 2 — Vendor: browse catalog
- [x] `VendorCatalog.jsx` (page) — routing cu `useSearchParams` (`?view=add`)
- [x] `VendorCatalogPanel.jsx` — pills kind + chips tip + buton "Propune produs"
- [x] `CatalogTable.jsx` — tabel cu search debounced, paginare, skeleton
- [x] `CatalogRow.jsx` — rând expandabil (Fragment cu 2 `<tr>`)
- [x] `CatalogVariantTable.jsx` — preț + stoc + publish per culoare
- [x] `useCatalogDraft.js` — draft state cu publishing/published/error per variant
- [x] `catalogCols.js` — `SPEC_COLS` + `COL_HEADERS` per kind
- [x] Skeleton loading (8 rânduri shimmer animate)
- [x] Inline specs pe mobile (< 640px) cu separator ` · `
- [x] CSS split: VendorCatalogPanel.css, CatalogTable.css, CatalogRow.css, CatalogVariantTable.css

## Faza 2 — Vendor: search autocomplete
- [x] `CatalogSearch.jsx` — combobox a11y (role, aria-expanded, aria-activedescendant)
- [x] `useCatalogSearch.js` — query state, RTK, keyboard nav (↑↓Enter Escape), select/reset
- [x] Debounce 300ms, skip dacă < 2 caractere
- [x] Clear button când e selectat un produs

## Faza 2 — Admin: gestiune catalog
- [x] `AdminCatalog.jsx` (page) — redirect dacă nu ești admin
- [x] `CatalogAdmin.jsx` — tabel cu filtru kind + paginare + delete
- [x] `CatalogEntryModal.jsx` — add/edit modal cu specs dinamice per kind

## Faza 3 — Polish
- [x] Mobile responsive: VendorCatalogPanel, CatalogTable
- [x] Dark mode: VendorCatalogPanel.css, CatalogRow.css, CatalogTable.css, CatalogVariantTable.css
- [x] `type="button"` pe toate butoanele non-submit
- [x] Loading state: skeleton în CatalogTable, "Se încarcă…" în CatalogAdmin
- [x] Empty state: "Niciun produs găsit." în CatalogTable + CatalogAdmin

## Gaps found
- [ ] `CatalogAdmin.jsx` — lipsă `html[data-theme="dark"]` în `CatalogAdmin.css`
- [ ] `CatalogEntryModal.jsx` — lipsă `html[data-theme="dark"]` în `CatalogEntryModal.css`
- [ ] `CatalogEntryModal.jsx` — câmpurile `culoare[]` și `refPrice` nu sunt în formular
- [ ] `CatalogBrowserModal.jsx` — component implementat dar neimportat nicăieri (dead code)
- [ ] Nicio notificare vizuală (toast) după publish reușit în `CatalogVariantTable`
- [ ] `searchCatalog` RTK — fără paginare; rezultate limitate la 20
