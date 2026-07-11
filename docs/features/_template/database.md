# Database: [Feature Name]

> **Last updated:** YYYY-MM-DD
> **Affects collections:** [list Mongoose models touched]

---

## New collection(s)

<!-- Skip this section if no new collection is needed. -->

### `[CollectionName]`

```js
// models/[CollectionName].js
{
  field: { type: String, required: true },
  ref:   { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  createdAt: Date,  // auto via { timestamps: true }
}
```

**Why this collection exists:** [One sentence — what it stores that no existing collection handles]

---

## Changes to existing collections

<!-- One subsection per collection modified. -->

### `Product`

| Field | Type | Default | Required | Why added |
|-------|------|---------|----------|-----------|
| `[field]` | `String` | `null` | no | [reason] |

**Migration needed:** yes / no
<!-- If yes, describe what happens to existing documents. -->

---

## Indexes

```js
// Add to the model file
[CollectionName].index({ field: 1 });
[CollectionName].index({ field: 1, otherField: -1 });
```

**Why:** [Query pattern this index supports — e.g. "filter by brand + sort by price"]

---

## Seed / test data

<!-- Any specific data needed in dev to test this feature. -->

```js
// Example document
{
  field: "value",
}
```
