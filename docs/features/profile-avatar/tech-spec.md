# Tech Spec: Profile Avatar Upload

> **Status:** `Approved`
> **Author:** Alexandru Roventa
> **Last updated:** 2026-07-17
> **Related PRD:** [PRD.md](./PRD.md)

---

## Overview

### What we're building

Un flow de upload avatar în 2 pași: (1) upload fișier pe Cloudinary via endpoint existent, (2) salvare URL pe userul din DB via endpoint nou `PUT /api/auth/me`. Redux `auth` slice se actualizează cu noul avatar URL, iar toate componentele care randează avatarul primesc `user.avatar` și afișează `<img>` dacă există, altfel fallback la litera colorată.

### Architecture decision log

| Decision | Options considered | Why we chose this |
|----------|--------------------|-------------------|
| Upload flow | Upload direct pe client vs. prin server | Prin server existent (`/api/upload/image`) — deja securizat cu `protect` middleware |
| Persistare avatar | Nou câmp JWT vs. re-fetch user vs. Redux patch | Redux patch direct după save — evită re-login și e instantaneu |
| Randare avatar | Componentă nouă `<Avatar>` vs. inline în fiecare loc | Componentă atom `Avatar` reutilizabilă — 4 locuri de înlocuit |

### Risks & trade-offs

- **Risk:** JWT-ul nu conține `avatar`, deci după refresh de pagină avatarul s-ar pierde — **Mitigation:** adăugăm `GET /api/auth/me` care returnează user complet (cu avatar) și îl apelăm la mount în `App.js`
- **Risk:** Fișier prea mare — **Mitigation:** Cloudinary respinge fișierele mari; mulberry middleware validează tipul

---

## Implementation

### Data flow

```
[ProfileSettings] → file input onChange
  → useUploadImageMutation(formData)       → POST /api/upload/image → Cloudinary URL
  → useUpdateMeMutation({ avatar: url })   → PUT /api/auth/me → DB save
  → dispatch(setUser({ ...user, avatar })) → Redux auth state updated
  → <Avatar> componentă re-renders everywhere
```

### API contracts

#### `PUT /api/auth/me` ← NOU
**Body:**
```json
{ "avatar": "https://res.cloudinary.com/..." }
```
**Câmpuri acceptate:** `name`, `phone`, `avatar` (whitelist — nu role, nu password)

**Response `200`:**
```json
{ "success": true, "user": { "_id": "...", "name": "...", "email": "...", "role": "...", "avatar": "https://..." } }
```

**Error cases:**
- `401` — neautentificat
- `400` — câmp nepermis în body

#### `GET /api/auth/me` ← NOU (pentru re-fetch după refresh)
**Response `200`:**
```json
{ "success": true, "user": { "_id": "...", "name": "...", "email": "...", "role": "...", "avatar": "..." } }
```

#### `POST /api/upload/image` ← EXISTENT
Reutilizat as-is. Returnează `{ url: string }`.

---

### Frontend — component tree

```
atoms/Avatar/                          ← NEW atom (< 50 linii)
  Avatar.jsx                           ← <img> dacă avatar URL există, altfel litera colorată
  Avatar.css
  index.js

Components/profile/ProfileSettings/
  ProfileSettings.jsx                  ← MODIFY: adaugă AvatarUpload section la top
  
molecules/AvatarUpload/                ← NEW molecule (< 80 linii)
  AvatarUpload.jsx                     ← file input + preview + upload + save
  AvatarUpload.css
  index.js

Layouts/header/UserMenu/UserMenu.jsx   ← MODIFY: înlocuiește litera cu <Avatar>
Layouts/header/MobileDrawer/MobileDrawer.jsx  ← MODIFY
Layouts/header/BottomNav/BottomNav.jsx        ← MODIFY
Pages/Profile/Profile.jsx              ← MODIFY: înlocuiește prf-avatar cu <Avatar>
```

### Redux / RTK Query changes

| Type | Name | Fișier | Descriere |
|------|------|--------|-----------|
| RTK mutation | `useUpdateMeMutation` | `features/auth/rtkAuth.js` ← NOU | `PUT /api/auth/me` |
| RTK query | `useGetMeQuery` | `features/auth/rtkAuth.js` ← NOU | `GET /api/auth/me` |
| Redux action | `setUser` | `features/auth/authSlice.js` | Patch user în store după avatar save |

**Notă:** Verifică dacă `authSlice.js` are deja un `setUser` action sau dacă trebuie adăugat.

### Key types / shapes

```js
// User shape (relevant)
{ _id: string, name: string, email: string, role: string, avatar: string | null }

// Upload response
{ success: true, url: string }

// UpdateMe request body
{ avatar?: string, name?: string, phone?: string }
```

### Edge cases to handle

- [ ] Loading state pe buton în timpul uploadului (disabled + text "Se încarcă...")
- [ ] Eroare upload (Cloudinary down) → toast/mesaj de eroare inline
- [ ] Fișier non-imagine selectat → validare `accept="image/*"` pe input
- [ ] Avatar URL invalid (imagine ștearsă de pe Cloudinary) → fallback la litera colorată (`onerror` pe `<img>`)
- [ ] Preview înainte de save → `URL.createObjectURL(file)` revocăm după unmount
