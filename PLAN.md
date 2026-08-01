# Active Work Plan

`PLAN.md` tracks the current active work only. It should contain enough context for a new developer
or agent to continue without reading chat history.

Do not use this file as a changelog, roadmap, or architecture document. Completed work is condensed
into `PROJECT_ROADMAP.md`; stable design information lives in `PROJECT_STRUCTURE.md`.

## Current Status

**Current stage:** Stage 4 — Custom profiles

**Status:** Defined, not started. Awaiting authorization.

**Stage 3 delivered (condensed):**

1. Extensible seed catalog under `app/src/data/catalog/` (per-game/tool files + index)
2. Layered bindings with default-on / opt-in layers; tools as `kind: 'tool'` (Yours)
3. Game search, selected chips, layer toggles, legend state filters
4. Random starter from `STARTER_POOL`; empty-selection guidance
5. Verified: `make test` (40), `make lint`, `make build`

**Immediate next step:** JSON import/export, profile precedence against seeds, safe-key export.

## Active Task: Custom profiles

### Objective

Let users import and export binding profiles as JSON, with custom profiles taking precedence over
seed defaults for the same game. Export the current free / safe key set for use elsewhere.

### Files In Scope

- `app/src/lib/` — import/export document parse/serialize, precedence wiring
- `app/src/types/` — extend `ImportExportDocument` only if the schema needs it
- `app/src/components/` / `App.tsx` — import/export controls (keep chrome in `messages.ts`)
- Tests for round-trip import/export and precedence against seeds

### Constraints

- Static-only; no backend. Persistence is file download/upload (or equivalent), not a server.
- Custom/imported profiles must win over official seeds for the same `gameId` (engine already
  prefers `custom` / `imported` in `resolveProfiles`).
- Do not implement GitHub Pages deploy, i18n switcher, or theme switcher (Stage 5).
- Do not scrape wikis. Do not commit; propose a commit message.

### Verification

```sh
make test
make lint
make build
make serve
```

Report actual output.

## After Completion

- Replace this section with the Stage 5 task.
- Summarize Stage 4 in `PROJECT_ROADMAP.md`.
- Update `PROJECT_STRUCTURE.md` if the lib/import layout changes.
