# Active Work Plan

`PLAN.md` tracks the current active work only. It should contain enough context for a new developer
or agent to continue without reading chat history.

Do not use this file as a changelog, roadmap, or architecture document. Completed work is condensed
into `PROJECT_ROADMAP.md`; stable design information lives in `PROJECT_STRUCTURE.md`.

## Current Status

**Current stage:** Stage 3 — Selection and seed data

**Status:** Defined, not started. Awaiting authorization.

**Done ahead of the stage (Stage 2 milestones):**

1. Theme tokens in `app/src/styles/index.css` (system light/dark via `prefers-color-scheme`)
2. `STYLES.md` — tokens, key-state cues, breakpoints
3. Extractable chrome copy in `app/src/ui/messages.ts` + state meta in `keyStateMeta.ts`
4. Data-driven `KeyboardVisualizer` over `ANSI_FULL_LAYOUT` (marks + SVG patterns, not color alone)
5. `KeyDetailPanel` + `Legend`; `App` composes keyboard + detail (demo profiles only)
6. Verified: `make test` (30), `make lint`, `make build`

**Immediate next step:** Game search, selected-game chips, curated seed profiles, filters wired to
the keyboard.

## Active Task: Selection and seed data

### Objective

Let the user pick real games and see the overlay update. Hand-curate a first batch of seed profiles
with deliberate conflicts and verification states. Wire filters and keep the legend accurate.

### Files In Scope

- `app/src/data/` — game catalog + seed profiles (replace `demoProfiles.ts`)
- `app/src/components/` — game search, selected chips, filters (as needed)
- `app/src/utils/search.ts` — forgiving search helper
- `app/src/App.tsx` / small state hook — selection state driving `computeAvailability`
- Tests for search and any pure selection helpers

### Constraints

- Seed data is hand-curated; every binding carries a verification state (D7). No wiki scraping.
- Include deliberate conflicts so the overlay is visually checkable.
- Do not implement import/export (Stage 4) or deploy/i18n switcher (Stage 5).
- Keep chrome strings in `messages.ts` (or expand that catalog).
- Do not commit. Propose a commit message and let the user decide.

### Verification

```sh
make test
make lint
make build
make serve
```

Report actual output.

## After Completion

- Replace this section with the Stage 4 task.
- Summarize Stage 3 in `PROJECT_ROADMAP.md`.
- Update `PROJECT_STRUCTURE.md` for the seed data layout.
