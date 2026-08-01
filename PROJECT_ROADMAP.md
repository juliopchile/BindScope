# Project Roadmap

`PROJECT_ROADMAP.md` summarizes project progress over time. It works as a lightweight changelog plus
a forward-looking roadmap.

Unlike `PLAN.md`, it must not contain detailed active implementation notes. Once a stage is complete,
its details are condensed here into a short summary.

Stages are sized to be delegated **one per sub-agent**, following the `orquestando-agentes` skill
methodology.

## Timeline

| Stage | Status | Summary |
|---|---|---|
| 0. Documentation | Complete | Concept, target architecture, decisions, and documentation system |
| 1. Scaffold and engine | Complete | Vite + React + TS scaffold, typed models, key normalization, pure availability engine + tests |
| 2. SVG keyboard | Complete | Data-driven SVG keyboard, detail panel, legend, theme tokens, non-color state cues |
| 3. Selection and seed data | Complete | Game search, layered seed catalog (games + tools), filters, legend |
| 4. Custom profiles | Pending | JSON import/export, profile precedence, safe-key export |
| 5. Deployment and polish | Pending | GitHub Pages workflow, i18n switcher, theme switcher, responsive verification, accessibility, performance, E2E |

After stage 5 the product enters the longer phases described in **Later Direction**.

## Completed Work

### Stage 0: Documentation

Established the product concept and the repository documentation system.

Delivered:

- Problem statement and differentiator (intersection of free keys across several profiles)
- Target architecture, data model, and availability engine contract
- Decision record with rationale
- Documentation system aligned to the `doc-template` standard
- Archived the source conversation as a primary source
- Product requirements for switchable i18n, light/dark/system theme, and responsive device support
  (D10–D12)

### Stage 1: Scaffold and availability engine

Delivered a runnable Vite + React + TypeScript app whose only real feature is a correct, tested
availability engine.

Delivered:

- `app/` package: Vite, React 19, TypeScript strict, Tailwind v4, Zod, ESLint, Prettier, Vitest
- Shared typed models (`Game`, `InputProfile`, `Binding`, `KeyboardLayout`, `ConflictSummary`, …)
- Key normalization to KeyboardEvent.code-style identifiers, with modifier helpers
- Pure `computeAvailability` / `resolveProfiles` (no React, no browser APIs, no data imports)
- ANSI full-size layout data and reserved-key rules (bare-key vs chord-only distinguished)
- Table-driven tests for normalization and every availability case listed in Stage 1
- Minimal placeholder UI showing engine counts; Makefile targets for install/run/test/lint/build

### Stage 2: SVG keyboard

Made the availability engine visible with a data-driven keyboard and detail panel.

Delivered:

- Theme tokens (system light/dark) in `app/src/styles/index.css`; documented in `STYLES.md`
- `KeyboardVisualizer` — SVG keys from `ANSI_FULL_LAYOUT`, selection, focusable keys
- Non-color state cues: marks (≈ / ! / ×) plus SVG fill patterns (D11)
- `KeyDetailPanel` and `Legend`; chrome strings centralized in `app/src/ui/messages.ts`
- Demo profiles only (Stage 3 replaces with curated seeds); responsive keyboard + detail layout

### Stage 3: Selection and seed data

Delivered searchable multi-select over a hand-curated, file-per-title seed catalog.

Delivered:

- `app/src/data/catalog/` — one module per game/tool, aggregated in `index.ts` with editable
  `STARTER_POOL`
- Layered seed profiles (`BindingLayer`: default-on vs opt-in); flattened for the pure engine
- Games plus tool profiles (`kind: 'tool'`) for OBS Studio and MSI Afterburner (Yours layer)
- Game search, selected chips, layer toggles, interactive legend filters on the keyboard
- Random first-load pick from the starter pool; empty-selection guidance when cleared
- Tests for search, selection/flattening, and catalog invariants (`make test` 40 passing)

## In Progress

No stage is running. Stage 4 is defined in `PLAN.md`, awaiting authorization.

## Pending Work

- Grow the hand-curated catalog toward ~20–30 games (layout already extensible)
- Custom profile import/export in JSON
- Parsers for real config formats (INI, CFG, XML)
- Switchable UI localization (i18n) with at least English plus one additional locale
- Light / dark / system theme switch with persisted preference
- Responsive verification on phone, tablet, and desktop viewports

## Technical Debt

Known risks that become debt if neglected:

- Binding data quality is the real bottleneck of the product, not the UI. Curate by hand and record a
  verification state from the very first entry.
- Badly normalized key identifiers contaminate every layer and are expensive to fix later.
- Seed data will grow; the model must support a large catalog without a redesign.
- Hardcoded UI chrome strings or theme colors lock out i18n and dark mode; keep copy and colors
  extractable from the first real UI stage onward (D10–D12).

## Known Limitations

- No controller or gamepad bindings.
- No user accounts or sync.
- No backend or database.
- No automatic wiki scraping in the critical path.
- No desktop application.
- Seed binding action names are not translated in the MVP unless a profile-specific catalog exists.

## Later Direction

| Phase | Scope |
|---|---|
| V2 | Modifier combinations, action-name search, layout variants (60%, TKL, ISO), more UI locales |
| V3 | Real config file import, Steam sync, cloud profiles, game detection |
| V4 | Recommendations: *"the best push-to-talk key for your library"* |

Real config import is the defensible advantage: once BindScope reads the user's own config files, it
becomes much harder to copy.

## History

| Commit | What happened |
|---|---|
| `ab47adc` | First full implementation: ~50 files, Vite + React + TS, SVG keyboard, availability engine, 20 seed games, GitHub Pages workflow |
| `ebe8889` | Discarded entirely |

The prompt that produced `ab47adc` specified around forty deliverables at equal priority, so effort
was spread evenly across seed data, three layouts, an import/export schema, a database adapter
boundary, and E2E tests — and the SVG keyboard, which **is** the product, never got the attention it
needed. The lesson for later stages is to prioritize explicitly instead of treating the whole scope
as equivalent.

The original prompt is preserved in full inside `docs/source-conversation.md`. Read it as a statement
of intent, not as a specification to re-run.

## Maintenance Rule

When a task, refactor, or implementation is completed, add a short summary here and remove the
detailed implementation notes from `PLAN.md`.
