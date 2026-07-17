# Frontend TODOs: Profile Avatar

> **Last updated:** 2026-07-17
> **Stack:** React 18, RTK Query, Redux Toolkit, plain CSS

---

## Phase 1 — Data layer

- [x] Verifică că `authSlice.js` are acțiune `setUser` (sau adaug-o)
- [x] Crează `features/auth/rtkAuth.js` cu:
  - [x] `useGetMeQuery` → `GET /api/auth/me`
  - [x] `useUpdateMeMutation` → `PUT /api/auth/me`
- [x] `useUploadImageMutation` există deja în `features/upload/rtkUpload.js` ✓

---

## Phase 2 — Core UI

### Atom Avatar
- [x] Crează `Components/atoms/Avatar/Avatar.jsx`
  - [x] Dacă `src` prop există → `<img src={src} onError={fallback} />`
  - [x] Altfel → div colorat cu prima literă din `name`
  - [x] Props: `src`, `name`, `size` (sm / md / lg)
- [x] Crează `Avatar.css` — size variants, border-radius 50%, object-fit cover
- [x] Crează `index.js`

### Molecule AvatarUpload
- [x] Crează `Components/molecules/AvatarUpload/AvatarUpload.jsx`
  - [x] Input `type="file" accept="image/*"` ascuns
  - [x] Click pe avatar/buton deschide file picker
  - [x] `onChange`: crează preview cu `URL.createObjectURL`
  - [x] Buton "Salvează poza": `useUploadImageMutation` → `useUpdateMeMutation` → `dispatch(setUser(...))`
  - [x] Loading state pe buton în timpul uploadului
  - [x] Cleanup `URL.revokeObjectURL` la unmount
- [x] Crează `AvatarUpload.css`
- [x] Crează `index.js`

### Integrare în ProfileSettings
- [x] `ProfileSettings.jsx` — adaugă `<AvatarUpload />` deasupra secțiunii "Informații personale"

### Înlocuire avatar în toate locurile
- [x] `Pages/Profile/Profile.jsx` — înlocuiește `.prf-avatar` div cu `<Avatar src={user.avatar} name={user.name} size="lg" />`
- [x] `Layouts/header/UserMenu/UserMenu.jsx` — înlocuiește `avatar-circle` cu `<Avatar src={user.avatar} name={user.name} size="sm" />`
- [x] `Layouts/header/MobileDrawer/MobileDrawer.jsx` — înlocuiește `mob-avatar` cu `<Avatar>`
- [x] `Layouts/header/BottomNav/BottomNav.jsx` — înlocuiește `mob-bot-avatar` cu `<Avatar>`

---

## Phase 3 — Polish

- [x] Dark mode — Avatar.css și AvatarUpload.css
- [x] Mobile — AvatarUpload funcționează pe telefon (camera / galerie)
- [x] `onerror` pe `<img>` → fallback la litera colorată
- [x] Preview revocăm URL la unmount (memory leak prevention)
- [x] Accesibilitate — input file are `aria-label`, buton are `type="button"`
- [x] Zero `console.log`

---

## Files touched

| File | Status | Notes |
|------|--------|-------|
| `features/auth/rtkAuth.js` | [x] | NOU |
| `features/auth/authSlice.js` | [x] | MODIFY — adăugat setUser |
| `atoms/Avatar/` | [x] | NOU atom |
| `molecules/AvatarUpload/` | [x] | NOU molecule |
| `molecules/AvatarCropModal/` | [x] | NOU molecule |
| `profile/ProfileSettings/ProfileSettings.jsx` | [x] | MODIFY |
| `Pages/Profile/Profile.jsx` | [x] | MODIFY |
| `Layouts/header/UserMenu/UserMenu.jsx` | [x] | MODIFY |
| `Layouts/header/MobileDrawer/MobileDrawer.jsx` | [x] | MODIFY |
| `Layouts/header/BottomNav/BottomNav.jsx` | [x] | MODIFY |
