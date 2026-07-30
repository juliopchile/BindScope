# Project Structure

`PROJECT_STRUCTURE.md` documents how BindScope is organized and how its pieces fit together. It
should let a human or an agent understand the repository without guessing from filenames.

> **Status:** Stage 1 is real — scaffold, types, normalization, layout/reserved data, and the
> availability engine exist under `app/`. Components, i18n, seed game catalog, import/export, and the
> SVG keyboard are still target. Update this file as each stage lands.

## Architecture

```
Seed data (static)      ─┐
User profiles           ─┤
Layout definition       ─┼─→  domain/availability  ─→  Conflict summary  ─→  SVG keyboard
Reserved-key rules      ─┘          (pure)                (per key)          Detail panel
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
│   │   ├── App.tsx             # Placeholder UI (Stage 1); real composition in Stage 2+
│   │   ├── domain/             # Pure logic: availability and conflicts (exists)
│   │   ├── data/               # Layout + reserved keys (exists); game seeds in Stage 3
│   │   ├── types/              # Shared typed models (exists)
│   │   ├── utils/              # Key normalization (exists)
│   │   ├── styles/             # Minimal global CSS; theme tokens in Stage 2
│   │   ├── components/         # UI components — Stage 2+
│   │   ├── i18n/               # Locale catalogs — Stage 5
│   │   └── lib/                # Import/export, parsers, app state — Stage 4+
│   ├── public/                 # Static assets
│   ├── tests/                  # Unit tests (exists)
│   └── dist/                   # Production build output (git-ignored)
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

## Components

Paths are relative to `app/src/`.

| Directory | Responsibility |
|---|---|
| `domain/` | Availability and conflict computation. Pure, no React or browser APIs |
| `data/` | Game catalog, seed profiles, layout definitions, reserved-key rules |
| `i18n/` | UI message catalogs and locale selection helpers. No domain logic |
| `components/` | Presentation. Contains no business rules |
| `lib/` | Profile import/export, config parsers, application state |
| `utils/` | Key identifier normalization, forgiving search |
| `types/` | Models shared across domain, data, and UI |
| `styles/` | Global CSS and theme tokens for light / dark / system modes |

## Stack

| Layer | Tool | Status |
|---|---|---|
| Language | TypeScript in strict mode | In use |
| UI | React 19 | In use (placeholder UI) |
| Build | Vite, static output to `app/dist` | In use |
| Styling | Tailwind CSS v4 plus CSS custom properties for themes | Tailwind in use; theme tokens Stage 2 |
| i18n | Client-side message catalogs; library chosen at implementation | Stage 5 |
| Keyboard | SVG (every key is an interactive element) | Stage 2 |
| Validation | Zod | In use (availability input) |
| Unit tests | Vitest | In use |
| E2E tests | Playwright | Stage 5 |
| Quality | ESLint + Prettier | In use |

## Data Model

Minimum typed models:

`Game` · `ProfileSource` · `InputProfile` · `Binding` · `Action` · `KeyboardKey` · `KeyboardLayout` ·
`ConflictSummary` · `ReservedKeyRule` · `ImportExportDocument`

**`Binding`** — key identifier, action name, optional context, optional modifiers, source metadata,
verification state, and notes.

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

**Panels:** game search · selected-game chips · keyboard · key detail side panel · profile toggles ·
filters (free / used / reserved / conflicted) · legend · reset · empty state with guidance text ·
language switcher · theme switcher (light / dark / system).

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
Exact breakpoints live in `STYLES.md` when UI work starts; until then, treat the skeleton’s ~900px
collapse as a temporary stand-in, not the final system.

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
