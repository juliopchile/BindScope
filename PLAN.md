# Active Work Plan

`PLAN.md` tracks the current active work only. It should contain enough context for a new developer
or agent to continue without reading chat history.

Do not use this file as a changelog, roadmap, or architecture document. Completed work is condensed
into `PROJECT_ROADMAP.md`; stable design information lives in `PROJECT_STRUCTURE.md`.

## Current Status

**Current stage:** Stage 2 — SVG keyboard

**Status:** Defined, not started. Awaiting authorization before UI work begins.

**Done ahead of the stage:** Stage 1 delivered the Vite + React + TypeScript scaffold, typed models,
key normalization, ANSI full layout data, reserved-key rules, and a pure availability engine with
table-driven tests. The placeholder `App.tsx` only proves the engine wires up — replace it.

**Immediate next step:** Build a data-driven SVG keyboard that renders `ANSI_FULL_LAYOUT`, maps
`ConflictSummary` key states to visible (non-color-only) states, and shows a key detail panel.

## Active Task: SVG Keyboard

### Objective

Make the availability engine visible. The keyboard is the product face: interactive keys, visual
states, a detail panel, responsive scaling, and theme tokens. Do not expand into game search or seed
catalog work — Stage 3 owns that.

### Files In Scope

- `app/src/components/` — keyboard, detail panel, legend (as needed)
- `app/src/styles/` — theme tokens (light / dark / system foundations)
- `STYLES.md` (repo root) — document tokens, key-state cues, breakpoints
- `app/src/App.tsx` — compose keyboard + detail from engine output (demo or minimal selection OK)
- Tests for any pure helpers extracted for layout/state mapping

### Constraints

- Layouts stay data-driven; do not hardcode key positions in component logic.
- State is never conveyed by color alone (D11).
- Keyboard must scale and remain operable on phone, tablet, and desktop (D12).
- Do not implement full game search, curated seed catalog, or import/export UI (Stages 3–4).
- Do not hardcode patterns that block i18n (D10): keep chrome strings extractable.
- Do not commit. Propose a commit message and let the user decide.

### Verification

```sh
make test
make lint
make build
make serve   # manual: keyboard readable and operable at phone/tablet/desktop widths
```

Report actual output. If a check fails, say so rather than describing the stage as complete.

## After Completion

- Replace this detailed section with the Stage 3 task.
- Add a short completed-work summary for Stage 2 to `PROJECT_ROADMAP.md` and mark it Complete.
- Update `PROJECT_STRUCTURE.md` / `STYLES.md` for what now actually exists.
