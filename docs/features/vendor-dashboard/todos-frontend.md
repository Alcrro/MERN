# Frontend TODOs — Vendor Dashboard

## Faza 1 — RTK + Data layer
- [x] `rtkVendor.js`: `useApplyAsVendorMutation`, `useGetVendorMeQuery`
- [x] `useGetVendorProductsQuery` cu param `status`
- [x] `useCreateVendorProductMutation`, `useUpdateVendorProductMutation`, `useDeleteVendorProductMutation`
- [x] `useGetVendorOrdersQuery`, `useGetVendorAnalyticsQuery`
- [x] Tag-uri: VendorProducts, VendorOrders, VendorAnalytics, VendorMe
- [x] Invalidare corectă: create/delete invalidează VendorProducts + VendorAnalytics

## Faza 2 — Apply flow
- [x] `VendorApply.jsx` (page): redirect dacă !user sau deja vendor
- [x] `VendorApplyForm.jsx`: formular shopName + shopDescription
- [x] Success state după submit (fără redirect)
- [x] Error state (mesaj din API)
- [x] Buton disabled în timp ce se trimite

## Faza 2 — Dashboard shell
- [x] `VendorDashboard.jsx` (page, 3 linii) — delegă la VendorLayout
- [x] `VendorLayout.jsx`: guard redirect !user → login, !vendor → apply
- [x] `VendorSidebar.jsx`: NavLink cu active state din VENDOR_LINKS
- [x] Layout full-width (fără max-width)
- [x] Mobile: flex-direction column, aside full width

## Faza 2 — Overview
- [x] `VendorOverview.jsx`: 6 StatCard-uri cu date din analytics
- [x] Loading state: "Se încarcă…"
- [ ] Error state lipsă

## Faza 2 — Products
- [x] `VendorProductsPanel.jsx`: tab-uri status cu VENDOR_STATUS_TABS
- [x] Loading state, empty state cu link spre catalog
- [x] `VendorProductRow.jsx`: imagine, info, preț, stoc, badge, edit, delete
- [x] `ListingStatusBadge.jsx`: tooltip rejectionReason când rejected
- [x] `useVendorProductForm.js`: hook co-located cu tot state-ul formularului
- [x] Edit: populare form din productsData, navigate după save
- [x] Warning "produsul va reveni pending" la prima submit în edit mode
- [ ] Paginare UI lipsă (backend suportă page/limit, VendorProductsPanel nu)

## Faza 2 — Orders
- [x] `VendorOrdersPanel.jsx`: tabel cu ID, dată, client, total, status colorat
- [x] Loading state, empty state explicativ
- [x] ORDER_STATUS_COLORS pentru colorare inline
- [ ] Paginare lipsă (toate comenzile returnate odată)
- [ ] Error state lipsă

## Faza 2 — Analytics
- [x] `VendorAnalyticsPanel.jsx`: 6 StatCard-uri identice cu Overview
- [x] Loading state
- [ ] Error state lipsă
- [ ] Nicio vizualizare temporală (grafic/chart)

## Faza 3 — Polish
- [x] `type="button"` pe toate butoanele non-submit
- [x] Mobile responsive: VendorLayout (align-items: stretch)
- [x] Dark mode: VendorLayout.css, VendorSidebar.css (verificat în CSS)
- [x] Structură sub-foldere: catalog/, products/, dashboard/, apply/, shared/
- [x] index.js în fiecare folder componentă

## Gaps found
- [ ] `VendorOverview.jsx:18` — `navigate("/vendor/dashboard/products/add")` → rută inexistentă; ar trebui `/vendor/dashboard/catalog`
- [ ] `VendorProductRow.jsx:11-13` — `window.confirm` pentru delete (nu e a11y-friendly)
- [ ] `VendorProductsPanel.jsx` — lipsă paginare UI
- [ ] `VendorOrdersPanel.jsx` — lipsă paginare + error state
- [ ] `VendorAnalyticsPanel.jsx` — lipsă error state + vizualizare temporală
- [ ] `VendorOverview.jsx` — lipsă error state
- [ ] Admin nu poate aproba/respinge aplicații vendor din UI
