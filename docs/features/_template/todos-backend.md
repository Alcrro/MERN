# Backend TODOs: [Feature Name]

> **Last updated:** YYYY-MM-DD
> **Stack:** Node.js, Express, MongoDB/Mongoose
> **Conventions:** controllers in `controllers/[resource]/`, routes in `routes/`

---

## Phase 1 — Model & validation

> Goal: data can be stored and retrieved correctly in MongoDB.

- [ ] Create / update Mongoose model (see `database.md`)
- [ ] Add required validators and defaults to schema
- [ ] Add indexes (see `database.md → Indexes`)
- [ ] Test model in isolation: create a document and verify shape in MongoDB Compass

---

## Phase 2 — Controller & routes

> Goal: API endpoints work and return the shape defined in `tech-spec.md`.

- [ ] Create controller file `controllers/[resource]/[resource].js`
  - [ ] Implement handler(s): `get[Resource]`, `create[Resource]`, etc.
  - [ ] Add query param parsing (filters, sort, pagination)
  - [ ] Add error handling (`try/catch` → `res.status(500).json(...)`)
- [ ] Create / update route file `routes/[resource].js`
  - [ ] Register routes: `router.get('/', handler)`
  - [ ] Add auth middleware to protected routes
- [ ] Register router in `server.js` / `app.js`
- [ ] Test with Postman or curl — verify response matches `tech-spec.md`

---

## Phase 3 — Auth, guards & edge cases

> Goal: production-ready. Secure, validates input, no data leaks.

- [ ] Verify auth middleware is applied to all write endpoints
- [ ] Add input validation (required fields, type checks)
- [ ] Handle edge cases:
  - [ ] Empty result → `{ data: [], count: 0 }` not 404
  - [ ] Invalid ObjectId → `400` not unhandled crash
  - [ ] Unauthorized access → `401` with clear message
- [ ] Remove any `console.log` statements
- [ ] Check: no sensitive fields returned (passwords, tokens)

---

## Files touched

<!-- Fill in as you work. -->

| File | Status | Notes |
|------|--------|-------|
| `models/[Resource].js` | [ ] | |
| `controllers/[resource]/[resource].js` | [ ] | |
| `routes/[resource].js` | [ ] | |
| `server.js` | [ ] | router registered |
