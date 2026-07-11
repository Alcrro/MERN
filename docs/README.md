# docs/

Feature documentation for the alcrro MERN shop.

## Structure

```
docs/
  features/
    _template/          ← copy this folder for every new feature
    [feature-name]/     ← one folder per feature (kebab-case)
      PRD.md
      tech-spec.md
      database.md       ← only if DB changes are needed
      todos-frontend.md
      todos-backend.md
```

## How to start a new feature

1. Copy `features/_template/` → `features/[your-feature-name]/`
2. Fill in `PRD.md` first — agree on scope before writing any code
3. Fill in `tech-spec.md` — decisions and contracts before implementation
4. Fill in `database.md` only if schema changes are needed
5. Work through `todos-frontend.md` and `todos-backend.md` phase by phase

## Conventions

- Feature folder names: `kebab-case` (e.g. `product-filters`, `user-reviews`)
- Status field in each doc: `Draft → Review → Approved → Shipped`
- When a feature ships, mark its PRD status as `Shipped` — don't delete the folder
