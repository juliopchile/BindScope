# BindScope

> AI agents: read `AGENTS.md` before working in this repository.

BindScope lets you select several games at once, overlay their default or custom keymaps on an
interactive keyboard, and instantly see **which keys are still free** across all of them.

## Project Status

**Stage 1 complete — scaffold and availability engine.** The app under `app/` is a Vite + React +
TypeScript project with a pure, tested availability engine and a minimal placeholder UI. The SVG
keyboard and full product UI are Stage 2+. See `PROJECT_ROADMAP.md` and `PLAN.md`.

To run it, see **Getting Started** below.

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

Requires Node.js. Install dependencies once, then start the Vite dev server:

```sh
make install   # npm install inside app/
make run       # http://127.0.0.1:8080 with HMR
make help      # list all targets
```

Useful targets:

```sh
make test      # Vitest unit tests
make lint      # ESLint
make build     # static artifact in app/dist
make serve     # same as run, without opening a browser
```

The application lives in `app/`. Repository documentation is never part of the Vite app root or the
deployed site.

### Configuration

The port and host come from an optional `.env` file, which is git-ignored:

```sh
cp .env.example .env    # then edit PORT
```

| Variable | Default | Purpose |
|---|---|---|
| `PORT` | `8080` | Port for `make run` / `make serve` |
| `HOST` | `127.0.0.1` | Bind address; use `0.0.0.0` to reach the server from another device |

A one-off override works too: `make run PORT=8090`. If the port is already taken, `make run` says
what is holding it and suggests the next free one instead of failing obscurely.

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
