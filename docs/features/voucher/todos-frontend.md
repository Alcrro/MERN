# Voucher — Frontend TODOs

## CartVoucherBox (molecule)

- [x] Input cu auto-uppercase pe taste
- [x] Enter în input declanșează `handleApply`
- [x] Buton „Aplică" dezactivat când input gol sau loading
- [x] Loading state pe buton (`"..."`)
- [x] Pe succes: afișează codul aplicat + buton „Elimină"
- [x] Pe eroare: mesaj inline sub input
- [x] Stare „aplicat" citită din Redux (`s.discount.voucher`)
- [x] Dark mode: `.cvb__applied`, `.cvb__ok-badge`, `.cvb__input`
- [ ] Lipsă `aria-label` pe `cvb__btn` și `cvb__remove` (accesibilitate)
- [ ] Lipsă `aria-live="polite"` pe zona de eroare / succes
- [ ] Voucherul aplicat nu se revalidează dacă totalul coșului se schimbă după aplicare

## discountSlice

- [x] `setVoucher` / `clearVoucher`
- [x] `setUseCredits` / `setUsePoints`
- [x] `clearDiscount` (reset complet)
- [ ] `clearDiscount` nu e apelat la `clearCart` — dacă utilizatorul golește coșul, voucherul rămâne în Redux

## CartSummary

- [x] Calcul `voucherDiscount` (percent și fixed)
- [x] Calcul `creditsDiscount` cu cap la suma rămasă
- [x] Calcul `pointsDiscount` (10 puncte = 1 RON)
- [x] `finalTotal = max(0, ...)` — nu poate fi negativ
- [x] Linii de discount afișate separat (cu cod voucher, credite, puncte)
- [ ] `POINTS_TO_RON = 10` duplicat în `CartSummary.jsx` și `CartAlcrroBox.jsx` — ar trebui mutat în `utils/constants.js`
- [ ] Lipsă `isLoading` state în CartSummary când `useGetMyCardQuery` e în curs

## rtkVoucher

- [x] `useValidateVoucherMutation` definit și exportat
- [x] `baseUrl` citit din `REACT_APP_API_URL`
- [x] `credentials: "include"`
- [ ] Lipsă `tagTypes` (nu e necesar pentru mutații, dar documentat explicit)

---

## Gaps found

| ⚠ Gap | Fișier | Linie |
|-------|--------|-------|
| `clearDiscount` nu e apelat la `clearCart` | `addToCartSlice.js` | reducer `clearCart` |
| `POINTS_TO_RON` duplicat | `CartSummary.jsx:9`, `CartAlcrroBox.jsx:6` | — |
| Voucher nu se revalidează la schimbare coș | `CartVoucherBox.jsx` | efect lipsă pe `orderTotal` |
| Lipsă `aria-live` pe zona eroare/succes | `CartVoucherBox.jsx:70` | `cvb__error` |
