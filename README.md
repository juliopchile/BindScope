# BindScope

> AI agents: read `AGENTS.md` before working in this repository.

BindScope lets you select several games at once, overlay their default or custom keymaps on an
interactive keyboard, and instantly see **which keys are still free** across all of them.

## Project Status

**Stage 0 — documentation and a static skeleton.** There is no build, no dependency, and no
framework chosen yet. `app/index.html` renders the page's layout regions and nothing else. The command
list further down describes the target stack, not something you can run today. See
`PROJECT_ROADMAP.md` for the real state and `PLAN.md` for active work.

To view it, see **Getting Started** below.

## The Problem

PC players bind keys outside their games: overlays like MSI Afterburner, push-to-talk, recording
hotkeys, macros, and operating system shortcuts. Those bindings silently collide with in-game
defaults, and you find out mid-match when one key does two things.

No tool answers the question that matters:

> **Which keys are still safe across the games I actually play?**

Existing tools (KeyBindr, ED KB Map, Visual Keymap, PCGamingWiki) show **one** game or **one**
profile at a time. None compute the intersection across several. See `DECISIONS.md` for the
landscape analysis.

## What BindScope Does

The core idea is not "display keybinds" but **computing the intersection of unused keys across
several games and profiles**:

```
available = allKeys − union(usedKeys)
```

That line is the entire engine. Everything else is data quality and UX.

**User flow:** the user selects Skyrim, Genshin Impact, and Warframe. The app overlays the three
keymaps on an interactive keyboard and distinguishes keys used by every game, keys used by some,
keys free across all of them, and keys reserved by the operating system or by the app's own safety
rules. The user can load a custom profile for any game and the result updates instantly.

## Project Constraints

| Constraint | Detail |
|---|---|
| Fully frontend | Static client-side code, deployable to GitHub Pages with no backend or database |
| Optional future backend | Only for storing profiles; always behind an interface, never a dependency |
| Performance | Instant interaction, lean bundle, local computation instead of network calls |
| Pure domain logic | Independent of the UI and covered by tests |
| Localization | Switchable UI language via client-side i18n catalogs |
| Theme | Light, dark, and system modes with a user-facing switch |
| Responsive | Usable on phone, tablet, and desktop viewports |

## Getting Started

There is nothing to install. Serve the skeleton with live reload:

```sh
make run     # http://127.0.0.1:8080, reloads on save
make help    # list all targets
```

`make run` uses `npx live-server`, so the only requirement is Node. The page reloads automatically
whenever you save a file.

The application lives in `app/`, and that is the only directory served. Repository documentation is
never exposed by the dev server or by the deployed site.

### Configuration

The port and host come from an optional `.env` file, which is git-ignored:

```sh
cp .env.example .env    # then edit PORT
```

| Variable | Default | Purpose |
|---|---|---|
| `PORT` | `8080` | Port for `make run` |
| `HOST` | `127.0.0.1` | Bind address; use `0.0.0.0` to reach the server from another device |
| `ROOT` | `app` | Directory served to the browser |

A one-off override works too: `make run PORT=8090`. If the port is already taken, `make run` says
what is holding it and suggests the next free one instead of failing obscurely.

### Planned commands

Once a stack is chosen, these arrive inside `app/` and get wrapped in `make` targets so the root
task runner stays the single entry point:

```sh
npm install     # install dependencies
npm run dev     # development server with hot module replacement
npm test        # unit tests
npm run build   # static artifact for deployment
```

## Deployment

Everything deployable lives in `app/`. The build output from `app/` is static and published to
GitHub Pages through a GitHub Actions workflow, which requires no server runtime.

The workflow builds from `app/` rather than using the "deploy from `/docs`" setting, so `docs/` stays
free for project documentation and never reaches the published site.

## Documentation Map

| File | Contents |
|---|---|
| `README.md` | Entry point: what it is, why it exists, how to run it |
| `PROJECT_STRUCTURE.md` | Target architecture, data model, availability engine, conventions |
| `PROJECT_ROADMAP.md` | Stages, completed and pending work, technical debt, history |
| `DECISIONS.md` | Architecture decisions and their rationale |
| `PLAN.md` | Active work only: current task, blockers, next step |
| `AGENTS.md` | AI agent instructions: reading order, invariants, commands |
| `docs/source-conversation.md` | Conversation that produced the concept; immutable historical record |

## Documentation Rule

Stable knowledge belongs in the permanent documentation; in-flight implementation detail belongs in
`PLAN.md`. Do not accumulate everything in one file.
