# Frontend TODOs: [Feature Name]

> **Last updated:** YYYY-MM-DD
> **Stack:** React 18, RTK Query, Redux Toolkit, React Router v6, plain CSS
> **Conventions:** CLAUDE.md — atomic design, one hook = one action, co-located CSS

---

## Phase 1 — Setup & data layer

> Goal: feature has data flowing from API to console. No UI yet.

- [ ] Add RTK Query endpoint in `features/[x]/rtk[X].js`
- [ ] Verify response shape matches `tech-spec.md → Key types`
- [ ] Add Redux slice if global state is needed (`features/[x]/[x]Slice.js`)
- [ ] Add selectors for derived state
- [ ] Test in browser: endpoint returns expected data (Network tab)

---

## Phase 2 — Core UI

> Goal: feature is functional end-to-end, no polish.

- [ ] Create page shell in `pages/[FeatureName]/[FeatureName].jsx` (zero logic, composition only)
- [ ] Create main organism in `organisms/[FeaturePanel]/`
  - [ ] `[FeaturePanel].jsx`
  - [ ] `[FeaturePanel].css`
  - [ ] `index.js`
- [ ] Wire component to RTK Query hook
- [ ] Handle loading state
- [ ] Handle empty state
- [ ] Handle error state
- [ ] Add route in `App.js`
- [ ] Add to `NavbarAux` / breadcrumb if needed

---

## Phase 3 — Polish & edge cases

> Goal: production-ready. Matches design, handles all edge cases, no regressions.

- [ ] Dark mode — add `html[data-theme="dark"]` overrides at bottom of CSS file
- [ ] Mobile — test at 768px and 375px breakpoints
- [ ] Accessibility — all interactive elements have `type="button"`, labels, no `href="#"`
- [ ] CSS — no hardcoded colors (use `var(--primary)` etc.), BEM class naming
- [ ] Remove any `console.log` statements
- [ ] Check: no prop drilling more than 2 levels (lift to Redux if needed)
- [ ] Run `npm run build` — zero warnings / errors

---

## Files touched

<!-- Fill in as you work. Helps track blast radius. -->

| File | Status | Notes |
|------|--------|-------|
| `features/[x]/rtk[X].js` | [ ] | |
| `pages/[FeatureName]/` | [ ] | |
| `organisms/[FeaturePanel]/` | [ ] | |
| `App.js` | [ ] | route added |
