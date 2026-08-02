# AGENTS.md

This file is written for AI coding agents working in BindScope. It should help agents avoid avoidable mistakes and ramp up quickly.

## Project State — Read This First

**Stage 5 (MVP) is complete.** `app/` is a Vite + React + TypeScript app with a pure availability
engine, data-driven SVG keyboard + mouse, game/tool search, layered seed catalog, JSON custom-profile
import/export, locale catalogs under `app/src/i18n/` (en/es/pt/fr/zh/de/ja), light/dark/system theme
via `html[data-theme]`, and GitHub Pages deploy from `.github/workflows/deploy-pages.yml`. Visual
tokens live in `STYLES.md`.

**Product Depth (PD1–PD7) is complete** — seed catalog has **26** curated entries (22 games + 4
tools); modifier chords; stage **action-name search**; form factors **Full / TKL / 60% / ISO Full**;
Playwright smoke via `make e2e`; client-side **CFG / INI / XML** config import; UI locales include
**German** and **Japanese**. UI Refresh (UR1–UR5) is complete. Next default: open **V3** when
authorized. Do not start a roadmap phase until the user authorizes it. Requirements archive: `qa.md`;
competitive brief: `docs/keybindr-analysis.md` (D13).

Use `make install`, `make run`, `make test`, `make lint`, `make build`, and `make e2e` from the repo
root. Do not invent commands; prefer the Makefile.

A previous full implementation existed in commit `ab47adc` and was deliberately discarded in `ebe8889`. Do not restore it wholesale. See `PROJECT_ROADMAP.md` for why it was rejected.

## Primary Documentation Sources

Read these files before making changes:

1. `README.md` — product overview, problem statement, setup, documentation map
2. `PROJECT_STRUCTURE.md` — target architecture, data model, availability engine contract, conventions
3. `PROJECT_ROADMAP.md` — stages, completed work, pending work, technical debt, project history
4. `DECISIONS.md` — why the project is built this way; read before proposing architectural changes
5. `PLAN.md` — active work only; consult when it exists and the user asks for implementation work

`PLAN.md` is not permanent project documentation. Use it to understand the current task, blockers, and next steps.

`docs/source-conversation.md` is the archived source conversation that produced the concept. It is an immutable historical record, not a specification. Do not edit it and do not treat its recommendations as binding — the permanent docs above supersede it.

All documentation in this repository is written in English.

## Agent Rules

- Prefer project commands from `README.md` or the root task runner. Do not invent commands.
- If docs conflict with executable config, trust executable config and update docs if requested.
- Do not commit, push, release, or deploy unless the user explicitly asks.
- Preserve user changes; do not revert unrelated work.
- When a stage completes, summarize it in `PROJECT_ROADMAP.md` and clear the detail out of `PLAN.md`.

## Domain Invariants

These are easy to get wrong and expensive to fix later:

- **Static-only.** No server runtime, no database, no required network calls at runtime. The build must deploy to GitHub Pages unchanged. Any persistence is a future adapter behind an interface, never a dependency.
- **The availability engine is pure.** `app/src/domain/` must not import React, browser APIs, or data files. It takes profiles + layout + reserved rules and returns a summary. It is tested in isolation with table-driven tests.
- **Key identifiers are normalized once.** Every layer refers to the same physical key by the same identifier. Never compare raw display labels.
- **Modifiers are in the model from day one**, even if the MVP does not render chords. Do not design them out.
- **Do not auto-scrape wikis for binding data.** Seed data is hand-curated and marked with a verification state.
- **UI chrome is localizable.** Do not hardcode user-facing copy in components once i18n lands; use catalogs. Domain logic stays locale-agnostic (D10).
- **Appearance is theme-token driven.** Support light, dark, and system modes; do not convey key state by color alone (D11).
- **Layouts must reflow.** Phone, tablet, and desktop are all first-class; do not assume a fixed desktop width (D12).

## Agent Roles: Orchestrator and Orchestrated

An agent in this project can act as an **orchestrator** (coordinates sub-agents that implement stages of the plan) or as an **orchestrated** agent (implements one concrete stage). The role is recognized from the prompt received; no configuration is needed.

- **Orchestrated**: follows familiarization → stage summary (with questions, if any) → authorized execution. On completion, it documents in `PLAN.md` and `PROJECT_ROADMAP.md`, and **proposes** a commit message without committing.
- **Orchestrator**: launches a fresh sub-agent per stage, evaluates its summaries, resolves questions with its own judgment when possible, and escalates only product or scope decisions to the user. It never authorizes commits on its own.

The methodology and its three canonical prompts live in the user-level `orquestando-agentes` skill. It is **not** vendored into this repository — invoke it with `/orquestando-agentes`. Stages in `PROJECT_ROADMAP.md` are sized to be delegated one per sub-agent.

## Commands

The `Makefile` is the task runner. Use it rather than calling `npx` directly, and add new entry
points there as they appear.

| Command | Purpose | Status |
|---|---|---|
| `make help` | List targets and show the active port | Works |
| `make install` | `npm install` inside `app/` | Works |
| `make run` | Vite dev server with HMR (opens browser) | Works |
| `make serve` | Same, without opening a browser | Works |
| `make port` | Print the port `make run` would use | Works |
| `make test` | Vitest unit tests | Works |
| `make lint` | ESLint | Works |
| `make build` | Static production build into `app/dist` | Works |
| `make e2e-install` | Download Playwright Chromium browser | Works |
| `make e2e` | Build + Playwright smoke against Vite preview | Works |

`PORT` and `HOST` are read from an optional git-ignored `.env`, falling back to `8080` and
`127.0.0.1`. `.env.example` is the committed template. Overrides also work inline:
`make run PORT=8090`.

## Additional Documentation

| File | When to Reference | Status |
|---|---|---|
| `DECISIONS.md` | Architectural tradeoffs and their rationale | Exists |
| `STYLES.md` | Visual design tokens, key-state cues, breakpoints, component rules | Exists |
| `qa.md` | Post-MVP UI QA notes (UI Refresh requirements) | Exists |
| `docs/keybindr-analysis.md` | UR1 competitive brief (Keybindr IA adopt/reject) | Exists |
| `PLAN.md` | Product Depth PD1–PD7 complete; next = V3 when authorized | Track closed |
| `CONTRIBUTING.md` | Binding-data submission workflow | Create only if community contributions open |
