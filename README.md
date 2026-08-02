# BindScope

> AI agents: read `AGENTS.md` before working in this repository.

BindScope lets you select several games at once, overlay their default or custom keymaps on an
interactive keyboard and mouse, and instantly see **which keys are still free** across all of them.

## Project Status

**Stage 5 complete — Deployment and polish (MVP).** Search and select curated games and tools, toggle
binding layers, import/export profiles (JSON, Source CFG, INI, BindScope XML), switch UI language
(en / es / pt / fr / zh / de / ja) and theme (light / dark / system), and download the current free
(safe) key set. Static deploy to GitHub Pages is wired via Actions.

**UI Refresh (UR1–UR5) complete:** keyboard-first shell, neutral free keys, collapsible chrome,
Full/TKL/60%/ISO selector, and mouse visualizer with first-class availability ids. See
`PROJECT_ROADMAP.md`.

**Product Depth (PD1–PD7) complete** — **26** curated catalog entries; chord marks; stage action-name
search; Full / TKL / 60% / ISO Full layouts; Playwright smoke (`make e2e`); client-side config
parsers; German and Japanese UI locales.

**V2.5 Visual polish complete** — full/TKL system keys + NumLock, even keyboard geometry, aligned
header toolbar, horizontal binding-layer toggles. See `PROJECT_ROADMAP.md`.

**Next:** authorize **V3** (Steam sync, cloud profiles, game detection) when ready.

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
keymaps on an interactive keyboard and mouse and distinguishes keys used by every game, keys used by
some, keys free across all of them, and keys reserved by the operating system or by the app's own
safety rules. The user can load a custom profile for any game and the result updates instantly.

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
make test         # Vitest unit tests
make lint         # ESLint
make build        # static artifact in app/dist
make serve        # same as run, without opening a browser
make e2e-install  # once: download Playwright Chromium
make e2e          # build + Playwright smoke (home, Games, visualizer, layout)
```

The application lives in `app/`. Repository documentation is never part of the Vite app root or the
deployed site.

Playwright smoke (`make e2e`) builds the app, serves Vite preview on `127.0.0.1:4173`, and runs one
Chromium scenario against English chrome. Install browsers once with `make e2e-install`. An optional
GitHub Actions workflow (`.github/workflows/e2e.yml`) runs the same smoke on `main` / PRs; it does
**not** gate the Pages deploy job.

### Configuration

The port and host come from an optional `.env` file, which is git-ignored:

```sh
cp .env.example .env    # then edit PORT
```

| Variable | Default | Purpose |
|---|---|---|
| `PORT` | `8080` | Port for `make run` / `make serve` |
| `HOST` | `127.0.0.1` | Bind address; use `0.0.0.0` to reach the server from another device |
| `VITE_BASE_PATH` | `/` | Vite asset base path; CI sets `/BindScope/` for project Pages |

A one-off override works too: `make run PORT=8090`. If the port is already taken, `make run` says
what is holding it and suggests the next free one instead of failing obscurely.

Locale and theme preferences persist in the browser (`localStorage` keys `bindscope.locale` and
`bindscope.theme`). They are chrome-only; seed binding action names stay in their curated language.

## Deployment

Everything deployable lives in `app/`. On push to `main`, `.github/workflows/deploy-pages.yml` runs
`npm ci` + `npm run build` in `app/` with `VITE_BASE_PATH=/BindScope/`, then publishes `app/dist` to
GitHub Pages. No server runtime.

Enable **Settings → Pages → Source: GitHub Actions** once on the repository. The workflow builds from
`app/` rather than the "deploy from `/docs`" setting, so `docs/` stays free for project documentation
and never reaches the published site.

Local preview of the production build: `make build` then `npm --prefix app run preview`.

## Documentation Map

| File | Contents |
|---|---|
| `README.md` | Entry point: what it is, why it exists, how to run it |
| `PROJECT_STRUCTURE.md` | Target architecture, data model, availability engine, conventions |
| `PROJECT_ROADMAP.md` | Stages, completed and pending work, technical debt, history |
| `DECISIONS.md` | Architecture decisions and their rationale |
| `PLAN.md` | Active work only: current task, blockers, next step |
| `AGENTS.md` | AI agent instructions: reading order, invariants, commands |
| `STYLES.md` | Theme tokens, key-state cues, breakpoints |
| `qa.md` | Post-MVP UI QA notes (requirements source for the UI Refresh track) |
| `docs/keybindr-analysis.md` | UR1 competitive brief: Keybindr IA adopt/reject for UR2–UR5 |
| `docs/source-conversation.md` | Conversation that produced the concept; immutable historical record |

## Documentation Rule

Stable knowledge belongs in the permanent documentation; in-flight implementation detail belongs in
`PLAN.md`. Do not accumulate everything in one file.
