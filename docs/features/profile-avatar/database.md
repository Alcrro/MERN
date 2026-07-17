# Database: Profile Avatar Upload

> **Last updated:** 2026-07-17
> **Affects collections:** `users` (Register model)

---

## New collection(s)

Nicio colecție nouă.

---

## Changes to existing collections

### `users` (Register model)

Câmpul `avatar` există deja — nu e nevoie de migrare:

```js
avatar: { type: String, default: null }  // ← deja în schemă
```

**Modificare necesară:** zero. Câmpul e prezent, indexat implicit pe `_id`.

---

## Indexes

Niciun index nou necesar.

---

## Seed / test data

Pentru a testa:
1. Uploadează o imagine via `POST /api/upload/image` și ia URL-ul din response
2. Pune manual în MongoDB: `db.users.updateOne({ email: "..." }, { $set: { avatar: "<url>" } })`
3. Verifică că avatar-ul apare în header și profile sidebar
