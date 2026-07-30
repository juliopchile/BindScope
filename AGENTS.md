# AGENTS.md

This file is written for AI coding agents working in BindScope. It should help agents avoid avoidable mistakes and ramp up quickly.

## Project State — Read This First

**The repository has no build and no dependencies.** It contains documentation plus a static HTML skeleton (`app/index.html`, `app/src/styles/skeleton.css`) that renders layout regions and nothing else. There is no `package.json`, no test suite, and no framework chosen yet — the stack named in `PROJECT_STRUCTURE.md` is a target, not a decision that has been acted on. Verify before referencing any command.

The skeleton is scaffolding: no behaviour, no design system, no palette. Do not build features on top of it or treat `skeleton.css` as a style foundation.

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
| `make run` | Serve with live reload via `npx live-server` | Works |
| `make serve` | Same, without opening a browser | Works |
| `make port` | Print the port `make run` would use | Works |
| `npm install` | Install dependencies | Pending scaffold |
| `npm run dev` | Development server with HMR | Pending scaffold |
| `npm test` | Run unit tests | Pending scaffold |
| `npm run lint` | Run linting | Pending scaffold |
| `npm run build` | Build static artifact | Pending scaffold |

`PORT` and `HOST` are read from an optional git-ignored `.env`, falling back to `8080` and
`127.0.0.1`. `.env.example` is the committed template. Overrides also work inline:
`make run PORT=8090`.

## Additional Documentation

| File | When to Reference | Status |
|---|---|---|
| `DECISIONS.md` | Architectural tradeoffs and their rationale | Exists |
| `STYLES.md` | Visual design tokens, light/dark themes, key-state colors, responsive breakpoints, component rules | Create when UI work starts; interim rules are in `PROJECT_STRUCTURE.md` |
| `CONTRIBUTING.md` | Binding-data submission workflow | Create only if community contributions open |
