# BindScope

> AI agents: read `AGENTS.md` before working in this repository.

BindScope lets you select several games at once, overlay their default or custom keymaps on an
interactive keyboard, and instantly see **which keys are still free** across all of them.

## Project Status

**Stage 0 — documentation only.** The repository contains no application code yet. The setup and
usage sections below describe the target, not something you can run today. See `PROJECT_ROADMAP.md`
for the real state and `PLAN.md` for active work.

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

## Getting Started

Pending until the scaffold exists. The planned commands are:

```sh
npm install     # install dependencies
npm run dev     # development server
npm test        # unit tests
npm run build   # static artifact for deployment
```

## Deployment

The `npm run build` artifact is static and published to GitHub Pages through a GitHub Actions
workflow. It requires no server runtime.

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
