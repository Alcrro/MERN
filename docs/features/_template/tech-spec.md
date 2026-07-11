# Tech Spec: [Feature Name]

> **Status:** `Draft` | `Review` | `Approved`
> **Author:** Alexandru Roventa
> **Last updated:** YYYY-MM-DD
> **Related PRD:** [PRD.md](./PRD.md)

---

## Overview

### What we're building

<!--
  2-3 sentences: what the feature is, where it lives in the app,
  and how it connects to existing systems (RTK Query, Redux, existing pages).
-->

### Architecture decision log

| Decision | Options considered | Why we chose this |
|----------|--------------------|-------------------|
| [e.g. state management] | [RTK slice vs useState] | [reason] |
| [e.g. API approach] | [new endpoint vs query param] | [reason] |

### Risks & trade-offs

- **Risk:** [What could go wrong] — **Mitigation:** [What we do about it]
- **Risk:** [Performance concern] — **Mitigation:** [Lazy load / pagination / etc.]

---

## Implementation

### Data flow

<!--
  Describe how data moves end-to-end.
  Example: URL param → RTK Query → selector → component → UI
  Use a simple text diagram if helpful.
-->

```
[Trigger] → [Where state lives] → [What re-renders] → [What the user sees]
```

### API contracts

<!--
  One block per endpoint. Be exact — Claude will use these to write the backend.
-->

#### `GET /api/[resource]`

**Query params:**
| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `field` | `string` | no | |

**Response `200`:**
```json
{
  "totalProducts": [],
  "queryProducts": [],
  "count": 0
}
```

**Error cases:**
- `400` — [when]
- `404` — [when]

---

### Frontend — component tree

<!--
  List which components are NEW, which are MODIFIED, which are REUSED.
  Follow atomic design levels from CLAUDE.md.
-->

```
pages/[FeaturePage]/          ← NEW page (zero logic, composition only)
  organisms/[FeaturePanel]/   ← NEW organism (< 150 lines)
    molecules/[FilterBar]/    ← REUSE existing
    atoms/[Badge]/            ← REUSE existing
```

### Redux / RTK Query changes

<!-- List every new slice, endpoint, or selector. -->

| Type | Name | File | Description |
|------|------|------|-------------|
| RTK endpoint | `useGet[Resource]Query` | `features/[x]/rtk[X].js` | |
| Redux slice | `[x]Slice` | `features/[x]/[x]Slice.js` | |
| Selector | `select[X]` | same file | |

### Key types / shapes

<!--
  Define the data shapes Claude will work with.
  Copy the Mongoose schema field names exactly — Claude will match these to the DB.
-->

```js
// Product shape relevant to this feature
{
  _id: string,
  [field]: type,
}
```

### Edge cases to handle

- [ ] Empty state — [what to show when there's no data]
- [ ] Loading state — [skeleton, spinner, or nothing]
- [ ] Error state — [API down / 0 results / invalid input]
- [ ] Mobile — [any layout changes below 768px]
