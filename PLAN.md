# Active Work Plan

`PLAN.md` tracks the current active work only. It should contain enough context for a new developer
or agent to continue without reading chat history.

Do not use this file as a changelog, roadmap, or architecture document. Completed work is condensed
into `PROJECT_ROADMAP.md`; stable design information lives in `PROJECT_STRUCTURE.md`.

## Current Status

**Current stage:** Stage 5 — Deployment and polish

**Status:** Defined, not started. Awaiting authorization.

**Stage 4 delivered (condensed):**

1. JSON profile import/export (`ImportExportDocument` v1) via `app/src/lib/importExport.ts`
2. Imported overrides win over seed defaults for the same `gameId` (`resolveProfiles`)
3. Safe-key JSON export from the current free (non-reserved) key set
4. UI: import/export controls; clear override restores seed layers
5. Verified: `make test` (46), `make lint`, `make build`

**Immediate next step:** GitHub Pages workflow, i18n switcher, theme switcher, responsive/a11y polish.

## Active Task: Deployment and polish

### Objective

Ship a polished static site: GitHub Pages deploy, switchable UI locale, light/dark/system theme
control with persistence, and verification that the app works across phone, tablet, and desktop
with solid accessibility and performance.

### Files In Scope (expected)

- `.github/workflows/` — Pages build/deploy from `app/`
- `app/src/i18n/` — locale catalogs + switcher (D10)
- `app/src/styles/` / theme control UI — light / dark / system with local persistence (D11)
- Responsive and a11y pass across components (D12)
- Optional Playwright E2E smoke if time allows

### Constraints

- Stay static-only; no backend.
- Do not scrape wikis. Do not commit unless the user asks; propose a commit message.
- Prefer extending existing `messages.ts` extraction into locale catalogs rather than inventing a
  parallel copy system.

### Verification

```sh
make test
make lint
make build
make serve
```

Report actual output. Manually confirm theme and locale switches and a narrow viewport.

## After Completion

- Clear this section or leave a short “MVP complete / later direction” note.
- Summarize Stage 5 in `PROJECT_ROADMAP.md`.
- Update `PROJECT_STRUCTURE.md`, `README.md`, and `AGENTS.md` for deploy/i18n/theme as needed.
