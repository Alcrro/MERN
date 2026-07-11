---
description: Reverse-engineers documentation for an existing feature that has no docs. Reads actual code (components, controllers, models, RTK endpoints) and generates filled PRD, tech-spec, database, and todos — marking what's done and flagging quality gaps. Use when a feature exists in code but has no docs/features/ folder.
argument-hint: "[feature-name]"
---

Reverse-engineers documentation for a feature that already exists in the codebase but has no docs.
Reads the actual implementation — fills in docs from real code, not placeholders.

If no argument provided, ask for it before anything else.
If `docs/features/[feature-name]/` already exists, ask before overwriting.

## Step 1 — Find all files for this feature

Search in parallel across frontend and backend using the feature name (case-insensitive):
- `find frontend/src -iname "*[feature]*" | grep -v node_modules`
- `find backend/controllers -iname "*[feature]*"`
- `find backend/routes -iname "*[feature]*"`
- `find backend/models -iname "*[feature]*"`
- `find frontend/src/features/[feature] -type f 2>/dev/null`

Read every file found. If nothing is found, stop and list available pages/features.

## Step 2 — Extract from the code

From each file, extract:
- What it does (one sentence)
- API calls / RTK hooks used → endpoint method + path + response shape
- Component hierarchy (page → organism → molecule → atom)
- Mongoose schema fields + indexes + refs
- State: useState, useSelector, Redux slices

Then identify quality gaps vs CLAUDE.md rules:
- Missing dark mode CSS (`html[data-theme="dark"]`)
- Missing loading / empty / error states
- `console.log` in code
- `href="#"` instead of `type="button"`
- Prop drilling > 2 levels
- Hooks doing more than one thing
- Components over line limits (atoms > 50, molecules > 80, organisms > 150, pages > 60)
- Missing mobile breakpoints

## Step 3 — Create docs/features/[feature-name]/ with 5 files

All content comes from the actual code — no placeholders.

**PRD.md**
- Problem Statement: what the feature enables, from the code's perspective
- User Stories: one per distinct user action found
- Acceptance Criteria: derive from what's actually working
- Out of Scope: list quality gaps as "not yet implemented"
- Status: `Shipped`

**tech-spec.md**
- Data flow: describe the actual flow (`URL param → RTK → selector → component`)
- API contracts: from actual controller handlers + RTK endpoint definitions
- Component tree: map actual files with their atomic level
- Key types: copy actual Mongoose schema + RTK response shape

**database.md**
- Fill from actual Mongoose model — every field with type + constraints
- Indexes found in the model
- Note at top: `<!-- Reverse-engineered from existing model — verify against DB -->`

**todos-frontend.md**
- `- [x]` for everything that exists and works
- `- [ ]` for gaps found in Step 2
- Add `## Gaps found` section at the bottom with specific file references

**todos-backend.md**
- Same: `- [x]` for existing, `- [ ]` for missing validation / auth guards / error handling
- Add `## Gaps found` section

## Step 4 — Report

Show:
- Files read (BE + FE)
- What was generated (N user stories, N endpoints, N DB fields)
- Checklist count: N done, N gaps
- List all gaps with ⚠
- End with: "Run /implementDocsFeature [feature-name] to fix the gaps."
