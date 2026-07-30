# Active Work Plan

`PLAN.md` tracks the current active work only. It should contain enough context for a new developer
or agent to continue without reading chat history.

Do not use this file as a changelog, roadmap, or architecture document. Completed work is condensed
into `PROJECT_ROADMAP.md`; stable design information lives in `PROJECT_STRUCTURE.md`.

## Current Status

**Current stage:** Stage 1 — Scaffold and availability engine

**Status:** Defined, not started. **Awaiting user authorization before the scaffold is created.**

**Done ahead of the stage:** a dependency-free static skeleton (`app/index.html`,
`app/src/styles/skeleton.css`) marking out the page's layout regions, built so the stack could stay
undecided. It carries no behaviour and no design decisions, and both files are expected to be
replaced or absorbed once the framework is chosen.

**Open decision blocking this stage:** the stack in `PROJECT_STRUCTURE.md` (Vite + React + Tailwind)
has not been confirmed by the user. Confirm it, or revise that file, before scaffolding.

**Immediate next step:** Settle the stack question, then create the project and the pure availability
module.

## Active Task: Scaffold and Availability Engine

### Objective

Produce a runnable, deployable static app whose only real feature is a correct, well-tested
availability engine. No keyboard rendering yet — Stage 2 owns that.

The goal is a trustworthy foundation, not a demo. Prior attempt `ab47adc` failed by spreading effort
across the entire feature list at once; this stage is deliberately narrow.

### Files In Scope

- `app/package.json`, `app/tsconfig.json`, `app/vite.config.ts`
- ESLint and Prettier configuration, inside `app/`
- `app/src/types/` — shared typed models
- `app/src/utils/keyNormalization.ts` — canonical key identifiers
- `app/src/domain/availability.ts` — the engine
- `app/src/data/keyboardLayouts.ts` — one layout only (ANSI full-size)
- `app/src/data/reservedKeys.ts` — reserved-key rules
- `app/tests/keyNormalization.test.ts`, `app/tests/availability.test.ts`

### Tasks

- Initialize the Vite + React + TypeScript project with strict mode enabled.
- Add ESLint, Prettier, and Vitest with working scripts.
- Define the typed models listed in `PROJECT_STRUCTURE.md`.
- Implement key normalization so one physical key has exactly one identifier.
- Implement the availability engine as pure functions with no React or browser dependencies.
- Write table-driven tests covering every case listed under "Availability Engine" in
  `PROJECT_STRUCTURE.md`.
- Add a minimal placeholder UI proving the build runs; do not invest in visual design yet.
- Update `README.md` commands and `AGENTS.md` command table with the real, verified commands.

### Constraints

- Static output only. No server runtime, no database, no required runtime network calls.
- `app/src/domain/` must not import React, browser APIs, or data modules.
- Do not build the SVG keyboard, game search, filters, or import/export in this stage.
- Do not implement the language switcher, theme switcher, or final responsive shell here — those are
  Stage 2 / Stage 5 (D10–D12). Do not hardcode patterns that block them (e.g. English-only chrome
  baked into many files with no extraction path, or fixed-width desktop-only layout assumptions).
- Do not create empty placeholder modules for future features. The prior attempt shipped stub files
  like `extensionPoints.ts` and `databaseAdapter.ts` with no callers; do not repeat that.
- Do not add seed game data beyond the small fixtures the tests need. Stage 3 owns curated data.
- Do not commit. Propose a commit message and let the user decide.

### Verification

Run the focused suite first, then everything, and confirm the production build succeeds. All npm
commands run from inside `app/`:

```sh
cd app
npm test -- tests/availability.test.ts
npm test
npm run lint
npm run build
```

Then add `make` targets wrapping these, so the root task runner stays the entry point.

Report actual output. If a check fails, say so rather than describing the stage as complete.

### Tests Must Prove

- A key used in any selected profile is removed from the free set.
- Reserved keys are never returned as safe.
- Custom profiles override default profiles where intended.
- Duplicate bindings and multiple actions on one key do not corrupt the summary.
- Keys absent from the active layout are handled explicitly, not silently dropped.
- Malformed input is rejected cleanly rather than failing silently.

### Blockers

Stage 1 has not been authorized. No other blockers.

## After Completion

- Replace this detailed section with the Stage 2 task.
- Add a short completed-work summary for Stage 1 to `PROJECT_ROADMAP.md` and mark it Complete.
- Update `PROJECT_STRUCTURE.md` so the repository layout reflects what now actually exists, and
  narrow the "target, not reality" warning to the sections that are still unbuilt.
