# Frontend TODOs: Profile Summary

> **Last updated:** 2026-07-17
> **Stack:** React 18, RTK Query, Redux Toolkit, React Router v6, plain CSS
> **Conventions:** CLAUDE.md — atomic design, one hook = one action, co-located CSS

---

## Phase 1 — Setup & data layer

> Goal: toate hook-urile RTK returnează date corecte, niciun endpoint nou.

- [x] Verifică că `useGetMyOrdersQuery` returnează câmpul `status` (filtrăm Pending/Processing)
- [x] Verifică că `useGetAddressesQuery` returnează `isDefault` pe fiecare adresă
- [x] Verifică că `useGetMyCardQuery` returnează `credits`, `points`, `tier`, `cardNumber` (via `data?.data`)
- [x] Verifică că `useGetPaymentMethodsQuery` returnează `isDefault` pe fiecare PM (via `data?.data`)
- [x] Verifică că `useGetVendorAnalyticsQuery` returnează `approvedListings`, `totalUnitsSold`, `estimatedRevenue`
- [x] Testează în Network tab: toate 5 call-uri se fac în paralel la mount

---

## Phase 2 — Core UI

> Goal: dashboard funcțional end-to-end, fără polish.

### ProfileSummary organism
- [ ] Crează `Components/profile/ProfileSummary/ProfileSummary.jsx`
  - [ ] Grid cu 2 coloane: stânga (comenzi + adresă), dreapta (AlcrroCard + payment + vendor)
  - [ ] Importă și compune cele 5 widget-uri
  - [ ] Titlu secțiune: "Bun venit, {user.name}" cu subtitlu "Contul tău la o privire"
- [ ] Crează `ProfileSummary.css` — layout grid responsive
- [ ] Crează `index.js`

### SummaryOrdersWidget molecule
- [ ] Crează `Components/molecules/SummaryOrdersWidget/SummaryOrdersWidget.jsx`
  - [ ] Apelează `useGetMyOrdersQuery()`
  - [ ] Filtrează: `status === 'Pending' || status === 'Processing'` → max 5
  - [ ] Fiecare rând: `#{_id.slice(-6)}` · data · badge status · total RON
  - [ ] Empty state: "Nu ai comenzi active" + `<Link to="/profile/orders">Vezi toate</Link>`
  - [ ] Footer: link "Toate comenzile →"
- [ ] Crează `SummaryOrdersWidget.css`
- [ ] Crează `index.js`

### SummaryAddressWidget molecule
- [ ] Crează `Components/molecules/SummaryAddressWidget/SummaryAddressWidget.jsx`
  - [ ] Apelează `useGetAddressesQuery()`
  - [ ] Filtrează: `addresses.find(a => a.isDefault)`
  - [ ] Afișează: label (badge), stradă, oraș + județ, cod poștal, telefon
  - [ ] Empty state: CTA "Adaugă adresă" → link `/profile/addresses`
  - [ ] Footer: link "Gestionează adresele →"
- [ ] Crează `SummaryAddressWidget.css`
- [ ] Crează `index.js`

### SummaryCardWidget molecule
- [ ] Crează `Components/molecules/SummaryCardWidget/SummaryCardWidget.jsx`
  - [ ] Apelează `useGetMyCardQuery()`
  - [ ] Refolosește `<AlcrroCard>` molecule cu prop-urile corecte
  - [ ] Sub card: rând "Credite: X RON" · "Puncte: Y" · `<TierBadge>`
  - [ ] Empty state (no card): CTA "Activează cardul Alcrro" → link `/profile/card`
  - [ ] Footer: link "Detalii card →"
- [ ] Crează `SummaryCardWidget.css`
- [ ] Crează `index.js`

### SummaryPaymentWidget molecule
- [ ] Crează `Components/molecules/SummaryPaymentWidget/SummaryPaymentWidget.jsx`
  - [ ] Apelează `useGetPaymentMethodsQuery()`
  - [ ] Filtrează: `data.find(pm => pm.isDefault)`
  - [ ] Afișează read-only: brand badge + `•••• •••• •••• {last4}` + expiry
  - [ ] Marchează dacă e expirat (aceeași logică ca `SavedCardItem`)
  - [ ] Empty state: CTA "Adaugă card" → link `/profile/payment-methods`
  - [ ] Footer: link "Gestionează cardurile →"
- [ ] Crează `SummaryPaymentWidget.css`
- [ ] Crează `index.js`

### SummaryVendorWidget molecule
- [ ] Crează `Components/molecules/SummaryVendorWidget/SummaryVendorWidget.jsx`
  - [ ] Apelează `useGetVendorAnalyticsQuery()` cu `skip: user?.role !== 'vendor'`
  - [ ] Afișează: produse active · comenzi totale · rating mediu (stele)
  - [ ] Complet ascuns (return null) dacă `user.role !== 'vendor'`
  - [ ] Footer: link "Panou vendor →"
- [ ] Crează `SummaryVendorWidget.css`
- [ ] Crează `index.js`

### Wiring
- [ ] Modifică `Pages/Profile/Profile.jsx` sau rutarea default să randeze `<ProfileSummary>` în loc de `<ProfileInfo>` la ruta `/profile`
- [ ] `ProfileInfo` rămâne accesibil la sub-ruta `/profile/info` (sau meniu separat)

---

## Phase 3 — Polish & edge cases

- [ ] Dark mode — `html[data-theme="dark"]` overrides la finalul fiecărui CSS
- [ ] Loading state — fiecare widget afișează un placeholder de 2-3 linii skeleton
- [ ] Mobile — la < 768px, grid devine 1 coloană, widget-urile se stivuiesc
- [ ] Carduri expirate — border roșu + text "Expirat" pe SummaryPaymentWidget
- [ ] CSS — fără culori hardcodate, BEM naming (`.summary-orders__row`)
- [ ] Accesibilitate — linkurile au text descriptiv, nu "click here"
- [ ] Zero `console.log`
- [ ] `npm run build` fără warnings

---

## Files touched

| File | Status | Notes |
|------|--------|-------|
| `Components/profile/ProfileSummary/ProfileSummary.jsx` | [ ] | NEW organism |
| `Components/profile/ProfileSummary/ProfileSummary.css` | [ ] | NEW |
| `Components/molecules/SummaryOrdersWidget/` | [ ] | NEW molecule |
| `Components/molecules/SummaryAddressWidget/` | [ ] | NEW molecule |
| `Components/molecules/SummaryCardWidget/` | [ ] | NEW molecule |
| `Components/molecules/SummaryPaymentWidget/` | [ ] | NEW molecule |
| `Components/molecules/SummaryVendorWidget/` | [ ] | NEW molecule (conditional) |
| `Pages/Profile/Profile.jsx` sau router | [ ] | MODIFY default tab |
