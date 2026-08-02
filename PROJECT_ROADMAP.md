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
| 4. Custom profiles | Complete | JSON import/export, profile precedence, safe-key export |
| 5. Deployment and polish | Complete | GitHub Pages workflow, i18n (en/es/pt/fr/zh), theme switcher, responsive/a11y polish |

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

### Stage 4: Custom profiles

Delivered client-side JSON import/export with seed precedence and a safe-key download.

Delivered:

- `app/src/lib/importExport.ts` — Zod parse/serialize for `ImportExportDocument` v1; key
  normalization on import; skip invalid bindings; coerce `sourceType: 'imported'`
- Selection merge: seed flatten + overrides → `computeAvailability` / `resolveProfiles`
- `SafeKeysDocument` export of free (non-reserved) keys from the live summary
- `ProfileIO` UI + clear-override path; seed layer toggles disabled while an override is active
- Tests for round-trip, skip-invalid, precedence, and safe-key export (`make test` 46 passing)

### Stage 5: Deployment and polish

Shipped a polished static MVP with deploy, locale, and theme controls.

Delivered:

- `.github/workflows/deploy-pages.yml` — build `app/` with `VITE_BASE_PATH=/BindScope/`, publish
  `app/dist` to GitHub Pages
- Light custom i18n under `app/src/i18n/` — catalogs `en`, `es`, `pt`, `fr`, `zh`; switcher +
  `document.documentElement.lang`; preferences in `localStorage` (chrome only)
- Theme light / dark / system via `html[data-theme]` on existing CSS tokens; boot script avoids flash
- Header preference controls; touch-target and aria polish on the existing shell
- Catalog key-parity tests; `make test` 52 passing; production JS ~91 kB gzip
- Playwright E2E deferred (optional; not required for stage close)

## In Progress

**UI Refresh track (post-MVP)** — keyboard-first shell, Keybindr-inspired IA (not a clone). Detailed
phase plan lives in `PLAN.md`. Requirements source: `qa.md`. Decision: **D13**. Brief:
`docs/keybindr-analysis.md`.

**UR1 (complete):** Explored live `keybindr.github.io` (React SPA, CSS tokens, layout registry
Full/TKL/75%/60%, mouse/HOTAS *tables* only — no mouse SVG; help states viz unsupported) and
cross-checked `keybindr.app` (separate product with chrome form-factor control). Adopt keyboard-first
shell, neutral free keys, closed visualizer stage, compact header menus, Full/TKL selector, and a
CS-binds-style mouse SVG with first-class availability ids. Reject Keybindr brand, dark-only theme,
bind-editor workflows, and auto-force 60% on mobile. Open questions resolved in the brief.

**UR2 (complete):** Keyboard-first shell — visualizer stage directly under the header; selection-driven
detail. Content column ~1400px; SVG `max-w-5xl` removed so ANSI full fits at ≥1280px. Free keys
retokened to neutral transparent/gray (light + dark + system); D11 cues retained. Engine path
unchanged. (UR2’s temporary `<details>` controls rail was replaced in UR3.)

**UR3 (complete):** Compact header action cluster (`ChromeToolbar`): Games, Import / Export,
Preferences as exclusive disclosures (`aria-expanded`, Escape / outside-click). Default collapsed so
keyboard + legend stay primary. Phone key detail uses a bottom drawer + backdrop; desktop keeps the
side panel. All new chrome strings localized (en/es/pt/fr/zh).

**UR4 (complete):** Form-factor selector in the header toolbar — ANSI Full (default) and ANSI TKL
(no numpad). Preference persists in `localStorage` (`bindscope.layout`); no auto-switch on narrow
viewports. Selected layout drives the SVG visualizer and `computeAvailability`. Compact/ISO deferred
to V2.

| Phase | Status | Summary |
|---|---|---|
| UR1. Competitive analysis & design brief | Complete | Live Keybindr + screenshots → `docs/keybindr-analysis.md`; STYLES planned direction; open Qs resolved |
| UR2. Keyboard-first shell & free-key retoken | Complete | Hero keyboard stage, 1400px column, neutral free keys |
| UR3. Collapsible chrome & denser shell | Complete | Header disclosures (Games / Import-Export / Prefs); phone detail drawer |
| UR4. Keyboard form-factor selector | Complete | ANSI Full + TKL registry; toolbar selector; persisted preference |
| UR5. Mouse visualizer | Planned | Data-driven mouse SVG; first-class availability ids |

## Pending Work

- UI Refresh UR5 (see In Progress / `PLAN.md`; UR1–UR4 complete)
- Grow the hand-curated catalog toward ~20–30 games (layout already extensible)
- Parsers for real config formats (INI, CFG, XML)
- Optional Playwright smoke / broader E2E
- Further UI locales beyond en/es/pt/fr/zh if needed

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
| UI Refresh (UR1–UR5) | Active plan in `PLAN.md`: Keybindr-inspired shell, free-key retoken, collapsible chrome, layout selector, mouse visualizer |
| V2 | Modifier combinations, action-name search, remaining layout variants (60%, ISO), more UI locales |
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
