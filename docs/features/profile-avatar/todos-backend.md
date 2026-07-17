# Backend TODOs: Profile Avatar

> **Last updated:** 2026-07-17
> **Stack:** Node.js, Express, MongoDB/Mongoose

---

## Phase 1 — Controller & routes

- [x] `controllers/auth/auth.js` — adaugă `exports.updateMe`:
  - [x] Whitelist câmpuri permise: `name`, `phone`, `avatar`
  - [x] `Register.findByIdAndUpdate(req.user._id, filtered, { new: true, runValidators: true })`
  - [x] Returnează `{ success: true, user }` (fără `password`)
- [x] `controllers/auth/auth.js` — adaugă `exports.getMe`:
  - [x] `Register.findById(req.user._id).select("-password")`
  - [x] Returnează `{ success: true, user }`
- [x] `routes/auth/auth.js` — adaugă:
  - [x] `router.get("/me", protect, getMe)`
  - [x] `router.put("/me", protect, updateMe)`

## Phase 2 — Guards & validare

- [x] `updateMe` nu permite modificarea `role`, `email`, `password`, `stripeCustomerId`
- [x] `avatar` URL validat că e string (Mongoose validează tipul)
- [x] Returnăm user fără câmpul `password` (`.select("-password")`)

---

## Files touched

| File | Status | Notes |
|------|--------|-------|
| `controllers/auth/auth.js` | [ ] | adaugă `getMe`, `updateMe` |
| `routes/auth/auth.js` | [ ] | adaugă GET /me, PUT /me |
