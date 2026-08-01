# Project Structure

`PROJECT_STRUCTURE.md` documents how BindScope is organized and how its pieces fit together. It
should let a human or an agent understand the repository without guessing from filenames.

> **Status:** Stages 1–5 (MVP) are real — scaffold, engine, SVG keyboard, selection UI, layered seed
> catalog, JSON custom-profile import/export, i18n/theme switchers, and GitHub Pages deploy exist
> under `app/` / `.github/`. Update this file as the structure changes.

## Architecture

```
Seed catalog (static)   ─┐
Selected games + layers ─┤
Imported overrides      ─┼─→  domain/availability  ─→  Conflict summary  ─→  SVG keyboard
Layout definition       ─┤          (pure)                (per key)          Detail + filters
Reserved-key rules      ─┘                                         └─→ safe-key / profile JSON export
```

Everything happens in the browser. There is no server, no database, and no network call in the
critical path.

## Repository Layout

The application is confined to `app/`. The repository root holds documentation and tooling only.
This keeps the deployable surface obvious: everything GitHub Pages publishes comes from `app/`, and
nothing else can leak into the build by accident.

```
BindScope/
├── app/                        # The application. Everything deployable lives here
│   ├── index.html              # Vite entry point
│   ├── package.json            # App dependencies and scripts
│   ├── vite.config.ts
│   ├── src/
│   │   ├── main.tsx            # Script entry point
│   │   ├── App.tsx             # Selection + keyboard + detail composition
│   │   ├── domain/             # Pure availability engine
│   │   ├── data/
│   │   │   ├── catalog/        # Seed games/tools (one file each) + index
│   │   │   ├── keyboardLayouts.ts
│   │   │   └── reservedKeys.ts
│   │   ├── types/              # Shared typed models
│   │   ├── utils/              # Key normalization + forgiving search
│   │   ├── ui/                 # Key-state meta; EN messages re-export
│   │   ├── styles/             # Theme tokens (light / dark / system)
│   │   ├── components/         # Search, chips, keyboard, detail, prefs
│   │   ├── lib/                # Selection, import/export, theme prefs
│   │   └── i18n/               # Locale catalogs + provider (en/es/pt/fr/zh)
│   ├── public/                 # Static assets
│   ├── tests/                  # Unit tests
│   └── dist/                   # Production build output (git-ignored)
├── .github/workflows/          # GitHub Pages deploy from app/
├── docs/                       # Historical and supporting documentation
├── Makefile                    # Root task runner
├── .env.example
├── README.md
├── PROJECT_STRUCTURE.md
├── PROJECT_ROADMAP.md
├── DECISIONS.md
├── PLAN.md
└── AGENTS.md
```

## Seed catalog

Hand-curated static modules under `app/src/data/catalog/`:

| Path | Role |
|---|---|
| `catalog/index.ts` | Aggregates entries, `STARTER_POOL`, lookup maps |
| `catalog/games/*.ts` | One `CatalogEntry` per game |
| `catalog/tools/*.ts` | Tool / "Yours" profiles (`kind: 'tool'`) |
| `catalog/flatten.ts` | Enabled layers → engine `InputProfile` |
| `catalog/bind.ts` | Compact binding factory for seed authors |

To add a title: create a file exporting a `CatalogEntry`, then append it to the `ENTRIES` array in
`index.ts`. Edit `STARTER_POOL` to change the random first-load set.

Each seed profile uses **layers** (`BindingLayer`: `id`, `label`, `defaultEnabled`, `bindings`).
Default-enabled layers apply on select; deeper layers are opt-in checkboxes in the UI. Every binding
carries a `verification` state. The availability engine still receives flat `InputProfile`s only.

## Components

Paths are relative to `app/src/`.

| Directory | Responsibility |
|---|---|
| `domain/` | Availability and conflict computation. Pure, no React or browser APIs |
| `data/` | Game catalog, seed profiles, layout definitions, reserved-key rules |
| `data/catalog/` | File-per-title seeds; tools marked `kind: 'tool'` |
| `i18n/` | UI message catalogs and locale selection helpers. No domain logic |
| `components/` | Presentation. Contains no business rules |
| `lib/` | Selection helpers, JSON import/export; real config parsers later |
| `utils/` | Key identifier normalization, forgiving search |
| `types/` | Models shared across domain, data, and UI |
| `styles/` | Global CSS and theme tokens for light / dark / system modes |

## Stack

| Layer | Tool | Status |
|---|---|---|
| Language | TypeScript in strict mode | In use |
| UI | React 19 | In use |
| Build | Vite, static output to `app/dist` | In use |
| Styling | Tailwind CSS v4 plus CSS custom properties for themes | In use (light/dark/system) |
| i18n | Light custom catalogs under `app/src/i18n/` (no heavy framework) | In use (en/es/pt/fr/zh) |
| Keyboard | SVG (every key is an interactive element) | In use (ANSI full) |
| Validation | Zod | In use (availability + import) |
| Unit tests | Vitest | In use |
| E2E tests | Playwright | Optional / deferred |
| Deploy | GitHub Actions → Pages from `app/dist` | In use |
| Quality | ESLint + Prettier | In use |

## Data Model

Minimum typed models:

`Game` · `CatalogKind` · `CatalogEntry` · `SeedProfile` · `BindingLayer` · `ProfileSource` ·
`InputProfile` · `Binding` · `KeyboardKey` · `KeyboardLayout` · `ConflictSummary` ·
`ReservedKeyRule` · `ImportExportDocument` · `SafeKeysDocument`

**`Binding`** — key identifier, action name, optional context, optional modifiers, source metadata,
verification state, and notes.

**`BindingLayer` / `SeedProfile`** — curated seed shape; layers flatten into `InputProfile` for the
engine based on UI toggles.

**`Game.kind`** — `game` or `tool` (tools are the Yours overlay: OBS, Afterburner, …).

**`InputProfile`** — profile id, game id, name, source type, version or patch label, bindings list,
and verification status.

The key representation **must be normalized**: the same physical key is identified the same way
throughout the app. The model must not assume bare keys forever; modifier chords and multiple layers
come later and must not be designed out.

Runtime view shape:

```json
{
  "key": "F1",
  "usedBy": [
    { "game": "Skyrim",   "action": "Help" },
    { "game": "Warframe", "action": "Abilities menu" }
  ]
}
```

## Availability Engine

A standalone module that takes the selected profiles, the layout definition, and the reserved-key
rules, and returns the used/free key summary plus per-key conflict metadata. Deterministic, pure, and
testable in isolation.

It must handle:

- duplicate bindings
- multiple actions on the same key
- modifier chords
- reserved keys
- keys missing from some layouts
- unknown or unmapped keys
- custom profiles taking precedence over defaults
- future expansion to multi-layer bindings

Conflict scoring: `free` → `partial conflict` → `heavy conflict` → `reserved`.

## Key States in the Interface

No state is conveyed by color alone; each is always paired with text, pattern, or icon.

| State | Meaning |
|---|---|
| Free | Unused in every selected profile |
| Partial | Used by some selected games |
| Conflicted | Used by all or nearly all selected games |
| Reserved | OS-level or explicitly unsafe (Alt+F4, system shortcuts) |
| Yours | The user's own tool bindings (Afterburner, push-to-talk), as a separate layer |

Hovering a key reveals the actions occupying it, per game:

```
E
  Skyrim:   Activate
  Warframe: Interact
  Genshin:  Elemental Skill
```

**Panels:** game/tool search · selected chips · binding-layer toggles · custom profile
import/export · safe-key export · keyboard · key detail side panel · interactive legend filters
(free / partial / heavy / reserved) · empty-selection guidance · language switcher · theme switcher.

**Yours / tools:** catalog entries with `kind: 'tool'` participate in the same availability
computation as games; the detail panel labels them as tools. A dedicated `yours` key-state is not
required in the engine.

**Layouts:** ANSI full-size, TKL, and a scalable compact abstraction. Data-driven, never hardcoded in
component logic; ISO and regional variants must remain possible.

**Design:** clean, high-contrast, minimal but professional. The keyboard must look like a keyboard.
Obvious hover and selected states. No visual noise, no gratuitous animation, no flashy branding.
Appearance is token-driven so light and dark themes stay consistent (see D11).

**Theme:** three modes — light, dark, and system (follow `prefers-color-scheme`). The user can switch
at any time; the choice persists locally. Key-state colors are theme tokens; every state still needs
a non-color cue (text, pattern, or icon).

**Localization (i18n):** all UI chrome strings come from locale catalogs and are switchable at
runtime (see D10). English is the source locale. Domain identifiers and the availability engine are
locale-agnostic. Curated binding action names stay in their source language unless a translated
profile catalog exists.

**Responsive layout:** the app must be usable on phone, tablet, and desktop (see D12).

| Viewport class | Intent |
|---|---|
| Desktop (wide) | Multi-region shell: games · keyboard · detail |
| Tablet | Reflow or collapse side panels; keyboard remains the focus |
| Phone | Single-column stack; essential controls reachable without horizontal page scroll |

The SVG keyboard scales with its container, stays readable, and remains operable with pointer, touch,
and keyboard input. Touch targets for interactive keys and controls must be large enough for fingers.
Exact breakpoints live in `STYLES.md`.

**Accessibility:** fully operable with mouse, touch, *and* keyboard, with meaningful labels, visible
focus, and usable contrast in both light and dark themes. Locale changes must keep labels coherent
for assistive tech (update document language when the active locale changes).

## Implementation Conventions

- Keep domain logic separate from presentation.
- Use pure functions for the availability computation.
- Prefer typed constants and explicit unions over magic values scattered around.
- Prefer local static data over runtime requests.
- Comment only what explains non-obvious domain decisions.
- Avoid premature abstraction, but do not hardcode assumptions that block future growth.
- Seed data must include deliberate conflicts so the overlay can be verified at a glance.
- Do not hardcode user-facing UI chrome strings in components once i18n is in place; use catalogs.
- Style through theme tokens; do not scatter raw colors that ignore light / dark modes.
- Build layouts so they reflow; do not assume a fixed desktop width.

## Maintenance Rule

Update this file when the structure, architecture, data model, or main conventions change. Do not use
it to track temporary active work; `PLAN.md` is for that.
