# Active Work Plan

`PLAN.md` tracks the current active work only. It should contain enough context for a new developer
or agent to continue without reading chat history.

Do not use this file as a changelog, roadmap, or architecture document. Completed work is condensed
into `PROJECT_ROADMAP.md`; stable design information lives in `PROJECT_STRUCTURE.md`.

## Current Status

**Current stage:** Stage 5 — Deployment and polish

**Status:** Complete (awaiting user commit).

### Milestones delivered

1. Light custom i18n — shared keys + catalogs `en` / `es` / `pt` / `fr` / `zh` under `app/src/i18n/`
2. Locale switcher + `document.documentElement.lang`; preference in `localStorage`
3. Theme switcher light / dark / system via `html[data-theme]`; preference in `localStorage`
4. Boot script applies stored theme/locale before React paint (`app/src/boot.ts`)
5. GitHub Pages workflow `.github/workflows/deploy-pages.yml` (`VITE_BASE_PATH=/BindScope/`)
6. Header `PrefsControls`; chrome components use `useI18n()`; touch-target / aria polish
7. Verified: `make test` (52), `make lint` (clean), `make build` (~91 kB gzip JS)

**Playwright:** skipped (optional; stage not blocked).

### Immediate next step

User commits Stage 5. MVP product scope from the roadmap is complete; further work follows
**Later Direction** in `PROJECT_ROADMAP.md` (not a Stage 6).

## After Completion

- Stage 5 summarized in `PROJECT_ROADMAP.md`.
- `PROJECT_STRUCTURE.md`, `README.md`, `STYLES.md`, and `AGENTS.md` updated for deploy/i18n/theme.
- This file left as a short “MVP complete” note until the next active task appears.
