# Project Structure

`PROJECT_STRUCTURE.md` documents how BindScope is organized and how its pieces fit together. It
should let a human or an agent understand the repository without guessing from filenames.

> **Status:** the architecture described here is the **target**, not reality. The repository contains
> no code yet. As each stage is implemented, update this file to reflect what actually exists.

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
│   ├── index.html              # Page entry point (also the Vite entry point)
│   ├── src/
│   │   ├── main.tsx            # Script entry point
│   │   ├── App.tsx             # Main view composition
│   │   ├── components/         # UI components (SVG keyboard, search, panel, filters)
│   │   ├── domain/             # Pure logic: availability and conflicts
│   │   ├── data/               # Seed data: games, layouts, reserved keys
│   │   ├── lib/                # Import/export, parsers, app state
│   │   ├── types/              # Shared typed models
│   │   ├── utils/              # Key normalization, search, helpers
│   │   └── styles/             # Global styles and tokens
│   ├── public/                 # Static assets and sample profiles
│   ├── tests/                  # Unit and end-to-end tests
│   └── package.json            # App dependencies (does not exist yet)
├── docs/                       # Historical and supporting documentation
├── Makefile                    # Root task runner; the entry point for all commands
├── .env.example                # Template for local PORT / HOST overrides
├── README.md
├── PROJECT_STRUCTURE.md
├── PROJECT_ROADMAP.md
├── DECISIONS.md
├── PLAN.md
└── AGENTS.md
```

Current contents of `app/` are the static skeleton only: `index.html` and
`src/styles/skeleton.css`. Everything else in the tree above is the target.

## Components

Paths are relative to `app/src/`.

| Directory | Responsibility |
|---|---|
| `domain/` | Availability and conflict computation. Pure, no React or browser APIs |
| `data/` | Game catalog, seed profiles, layout definitions, reserved-key rules |
| `components/` | Presentation. Contains no business rules |
| `lib/` | Profile import/export, config parsers, application state |
| `utils/` | Key identifier normalization, forgiving search |
| `types/` | Models shared across domain, data, and UI |

## Stack

| Layer | Tool |
|---|---|
| Language | TypeScript in strict mode |
| UI | React |
| Build | Vite, static output |
| Styling | Tailwind CSS |
| Keyboard | SVG (every key is an interactive element) |
| Validation | Zod |
| Unit tests | Vitest |
| E2E tests | Playwright |
| Quality | ESLint + Prettier |

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
filters (free / used / reserved / conflicted) · legend · reset · empty state with guidance text.

**Layouts:** ANSI full-size, TKL, and a scalable compact abstraction. Data-driven, never hardcoded in
component logic; ISO and regional variants must remain possible.

**Design:** clean, high-contrast, minimal but professional. The keyboard must look like a keyboard.
Obvious hover and selected states. Responsive. No visual noise, no gratuitous animation, no flashy
branding.

**Accessibility:** fully operable with mouse *and* keyboard, with meaningful labels, visible focus,
and usable contrast.

## Implementation Conventions

- Keep domain logic separate from presentation.
- Use pure functions for the availability computation.
- Prefer typed constants and explicit unions over magic values scattered around.
- Prefer local static data over runtime requests.
- Comment only what explains non-obvious domain decisions.
- Avoid premature abstraction, but do not hardcode assumptions that block future growth.
- Seed data must include deliberate conflicts so the overlay can be verified at a glance.

## Maintenance Rule

Update this file when the structure, architecture, data model, or main conventions change. Do not use
it to track temporary active work; `PLAN.md` is for that.
