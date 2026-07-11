# /generateDocsFeature

Reverse-engineers documentation for a feature that already exists in the codebase but has no docs.
Reads the actual implementation and fills in PRD, tech-spec, database, and todos — marking what's already done.

**Usage:** `/generateDocsFeature [feature-name]`

Examples: `/generateDocsFeature cart`, `/generateDocsFeature product-filters`, `/generateDocsFeature auth`

---

## Step 1 — Validate argument

If no argument is provided, ask:
```
Which existing feature should I document? (kebab-case, e.g. cart, product-filters, auth)
```

If `docs/features/[feature-name]/` already exists, stop and ask:
```
docs/features/[feature-name]/ already exists. Overwrite? (yes / no)
```

---

## Step 2 — Locate all files belonging to this feature

Search in parallel across the whole codebase. Cast a wide net — better to find too much than too little.

**Frontend:**
```
find frontend/src -iname "*[featureName]*" -o -iname "*[FeatureName]*" | grep -v node_modules
find frontend/src/Pages -type d | grep -i [feature]
find frontend/src/Components -type d | grep -i [feature]
find frontend/src/features/[feature] -type f 2>/dev/null
```

**Backend:**
```
find backend/controllers -iname "*[feature]*"
find backend/routes -iname "*[feature]*"
find backend/models -iname "*[feature]*"
```

Read **every file found**. Extract:
- What each file does (one sentence)
- Props / function signatures
- API calls made (RTK hooks used, axios calls)
- State managed (useState, useSelector, Redux slices)
- DB fields accessed (from models and controllers)

If zero files are found, stop:
```
No files found for "[feature-name]". Try a different name or check the folder structure.
Existing pages: [list frontend/src/Pages/ folders]
Existing features: [list frontend/src/features/ folders]
```

---

## Step 3 — Analyze the implementation

After reading all files, determine:

**What the feature does** (for PRD Problem Statement):
- The user-facing action this feature enables
- Which user roles can use it (client / vendor / admin)
- Which pages/routes it appears on

**API shape** (for tech-spec):
- Every endpoint used: method, path, query params, response shape
- Infer from RTK Query endpoint definitions and controller handlers

**Component tree** (for tech-spec):
- Map the actual hierarchy: page → organism → molecule → atom
- Note which components exist vs which are missing per CLAUDE.md atomic design rules

**DB schema** (for database.md):
- Actual Mongoose schema fields from the model file(s)
- Indexes already defined
- Relations (refs to other collections)

**Quality gaps** (for todos):
- Missing dark mode CSS overrides
- Missing mobile breakpoints
- Missing loading / empty / error states
- `console.log` statements left in code
- `href="#"` instead of `type="button"`
- Prop drilling deeper than 2 levels
- Hooks that do more than one thing
- Components over the CLAUDE.md line limits

---

## Step 4 — Generate docs/features/[feature-name]/

Create all 5 files. Unlike `/createDocsFeature`, these are filled from the actual code — not placeholders.

#### PRD.md
- **Problem Statement:** write from what the code actually does, not speculation
- **User Stories:** infer from the UI flows you read (1 story per distinct user action found)
- **Acceptance Criteria:** derive from what's actually implemented and working
- **Out of Scope:** list quality gaps found in Step 3 as "not yet implemented"
- **Status:** `Shipped` (feature exists) but note gaps if any

#### tech-spec.md
- **What we're building:** past tense — "This feature implements..."
- **Decision log:** leave empty with comment `<!-- infer from git log if needed -->`
- **Data flow:** describe the actual flow found in the code (`URL param → RTK → selector → component`)
- **API contracts:** fill from actual controller handlers + RTK endpoints
- **Component tree:** map the actual files found, mark level (atom/molecule/organism/page)
- **Key types:** copy the actual Mongoose schema shape + RTK response shape

#### database.md
- **Changes to existing collections:** list every field in the Mongoose model with its type and constraints
- **Indexes:** list indexes found in the model
- **New collection:** only if the model is not shared with other features
- Add note at top: `<!-- Reverse-engineered from existing model — verify against DB -->`

#### todos-frontend.md
- Phase 1 items → mark `- [x]` (RTK endpoint exists, data flows)
- Phase 2 items → mark `- [x]` for components that exist, `- [ ]` for ones missing
- Phase 3 items → mark `- [x]` only if actually implemented; leave `- [ ]` for gaps found in Step 3
- Add a **Gaps** section at the bottom:
```
## Gaps found (not in original todos)
- [ ] [specific gap 1 — file and line if possible]
- [ ] [specific gap 2]
```

#### todos-backend.md
- Same logic: `- [x]` for what exists, `- [ ]` for what's missing
- Add **Gaps** section for any missing validation, auth guards, or error handling found in Step 3

---

## Step 5 — Report

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DOCS GENERATED: [feature-name]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Files read:
  BE: [list]
  FE: [list]

docs/features/[feature-name]/ created:
  ├── PRD.md          — [N] user stories, [N] acceptance criteria
  ├── tech-spec.md    — [N] API endpoints documented
  ├── database.md     — [N] fields from [ModelName]
  ├── todos-frontend.md — [N] done, [N] gaps
  └── todos-backend.md  — [N] done, [N] gaps

Gaps that need fixing:
  ⚠ [gap 1]
  ⚠ [gap 2]

Run /implementDocsFeature [feature-name] to fix the gaps.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```
