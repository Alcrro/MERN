# Voucher — Frontend TODOs

## CartVoucherBox (molecule) — `src/Components/molecules/CartVoucherBox/`

- [x] Input cu auto-uppercase pe taste
- [x] Enter în input declanșează `handleApply`
- [x] Buton „Aplică" dezactivat când input gol sau loading
- [x] Loading state pe buton (`"..."`)
- [x] Pe succes: afișează codul aplicat + badge reducere + buton „Elimină"
- [x] Afișare „N produse eligibile" pentru scope=vendor
- [x] Pe eroare: mesaj inline sub input
- [x] Stare citită din Redux (`s.discount.voucher`)
- [ ] Voucherul nu se revalidează dacă totalul coșului se schimbă după aplicare
- [ ] Lipsă `aria-live="polite"` pe zona de eroare/succes

## ProfileVouchers (organism) — `src/Components/profile/ProfileVouchers/`

- [x] `useGetMyVouchersQuery` pentru reward vouchers
- [x] Grilă de carduri cu cod, discount, vendor, expiresAt, badge status
- [x] Copy-to-clipboard pe cod (`navigator.clipboard`)
- [x] Badge: Activ / Folosit / Expirat / Inactiv
- [x] State gol: „Nu ai primit niciun voucher încă."
- [x] Loading state simplu
- [ ] Lipsă dark mode CSS explicit (folosește variabilele globale, dar fără `html[data-theme="dark"]` overrides)
- [ ] Lipsă refresh automat după aplicarea unui voucher (badge rămâne Activ chiar dacă folosit — `isRedeemed` nu e setat)

## VendorVouchersPanel (organism) — `src/Components/vendor/dashboard/VendorVouchersPanel/`

- [x] Tabel vouchere cu: cod, tip, valoare, min. comandă, produse, expiresAt, status, toggle
- [x] Buton „+ Voucher nou" toggle pentru VendorVoucherForm inline
- [x] Loading state + state gol cu hint
- [x] `useToggleVoucherMutation` cu invalidare cache
- [x] `RuleSection`: form configurare regulă automată (tip, valoare, min. comandă, zile)
- [x] Toggle enabled/disabled pe regulă
- [x] Feedback „Salvat!" 2s după save
- [ ] Lipsă feedback de eroare când `upsertVendorRule` eșuează
- [ ] Lipsă confirmare înainte de toggle dezactivare voucher activ

## VendorVoucherForm (molecule) — `src/Components/vendor/dashboard/VendorVoucherForm/`

- [x] Input cod (auto-uppercase), selector tip (radio), valoare, min. comandă, expiresAt
- [x] Picker produse (collapse) cu checkbox per produs — „N produse selectate"
- [x] `useGetVendorProductsQuery({ limit: 100 })` pentru lista produse
- [x] `useCreateVoucherMutation` cu invalidare "Vouchers"
- [x] Reset form după creare reușită
- [x] Mesaj eroare generic la eșec (fără detaliu de la server)
- [ ] Nu afișează mesajul exact de eroare de la server (ex: „Codul există deja")
- [ ] Lipsă validare client-side: `value <= 100` pentru percent

## discountSlice (`src/features/discount/discountSlice.js`)

- [x] `setVoucher` / `clearVoucher`
- [x] `setUseCredits` / `setUsePoints`
- [x] `clearDiscount` (reset complet)
- [ ] **`clearDiscount` nu e apelat la `clearCart`** — voucher rămâne în Redux dacă coșul e golit

## rtkVoucher (`src/features/voucher/rtkVoucher.js`)

- [x] `tagTypes: ["Vouchers", "MyVouchers", "VendorRule"]`
- [x] Toate cele 7 endpoint-uri definite și exportate
- [x] `credentials: "include"`, `baseUrl` din env

## Integrare checkout (`useCheckoutState.js`)

- [ ] **CRITIC: `voucherCode` nu e trimis în body-ul `createOrder`**
- [ ] **CRITIC: `clearDiscount` nu e apelat după plasarea comenzii**

---

## Gaps found

| ⚠ Gap | Severitate | Fișier |
|-------|-----------|--------|
| `voucherCode` absent din `createOrder` body | **Critică** | `useCheckoutState.js:39-54` |
| `clearDiscount` absent din `clearCart` | Medie | `addToCartSlice.js:77` |
| `POINTS_TO_RON = 10` duplicat | Scăzută | `CartSummary.jsx`, `CartAlcrroBox.jsx` |
| Voucher nu se revalidează la schimbare coș | Medie | `CartVoucherBox.jsx` |
| Eroare server nu e afișată în VendorVoucherForm | Scăzută | `VendorVoucherForm.jsx` |
