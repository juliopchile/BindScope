# Architecture Decisions

A record of the decisions that shape BindScope and why they were made. Its purpose is to stop settled
discussions from being reopened and to prevent a deliberate constraint from being undone by accident.

Before proposing an architectural change, read the corresponding decision. If the context has
changed, update the entry instead of silently contradicting it.

## D1 — The Product Is the Intersection, Not the Visualization

**Context.** Keyboard visualizers already exist: KeyBindr plans bindings with templates and profiles;
ED KB Map visualizes the Elite Dangerous bindings file; Visual Keymap does the same inside Minecraft
modding; PCGamingWiki and the Fandom wikis document controls per game. All of them operate on **one**
game or **one** profile at a time.

**Decision.** The product is not "another keymap picture." It is the computation
`available = allKeys − union(usedKeys)` across several simultaneous profiles.

**Consequences.** Any feature that does not move the user closer to answering *"which keys do I have
left?"* is secondary. The SVG keyboard is the visible face of that computation, not an end in itself.

## D2 — Fully Frontend and Static

**Context.** The project must be publishable and maintainable with no infrastructure or operational
cost.

**Decision.** The entire MVP runs as static client-side code, deployable to GitHub Pages. No server
runtime, no database, no mandatory network calls. Data is bundled or loaded from static files.

**Consequences.** No SSR and no Node runtime assumptions in app code. Bundle size matters: seed data
will grow and the initial payload has to be watched.

## D3 — The Backend Is a Future Adapter, Never a Dependency

**Context.** Storing profiles and custom keymaps in the cloud is desirable later on.

**Decision.** All persistence is modeled as an optional adapter behind an interface, addable without
rewriting the UI or the domain. Nothing in the app may assume an API exists.

**Consequences.** Do not create empty "backend-ready" modules. Define the boundary when a real
consumer exists; until then it is enough not to couple the domain to storage. See D9.

## D4 — SVG Keyboard

**Context.** The keyboard needs individually interactive keys that can be highlighted, given
tooltips, stacked in layers for heatmaps, and scaled responsively.

**Decision.** Render in SVG, with the layout defined by data.

**Consequences.** This rules out canvas, which would force reimplementing interaction and
accessibility, and rules out a grid of DOM elements, which is harder to scale proportionally. The
layout must not be hardcoded inside component logic: ANSI, TKL, compact, and ISO are data.

## D5 — The Domain Is Pure and Isolated From the UI

**Context.** The correctness of the availability computation is the one thing the user cannot verify
at a glance.

**Decision.** The computation lives in a standalone module of pure functions, with no React and no
browser APIs, tested in isolation with table-driven tests.

**Consequences.** The engine can later be reused in another context (CLI, extension, service) without
dragging the UI along. The tests are the real specification of the behavior.

## D6 — Normalized Key Identifiers and Modifiers From Day One

**Context.** Every game names keys its own way. Comparing display labels produces silent false
negatives.

**Decision.** One physical key has exactly one canonical identifier throughout the app. The `Binding`
model includes modifiers from the start, even though the MVP does not render chords.

**Consequences.** Normalization is a single point of failure and needs its own tests. Adding chords
and multiple layers later does not require migrating already-loaded data.

## D7 — Hand-Curated Data, No Early Automatic Scraping

**Context.** The obvious temptation is to scrape wikis to populate the catalog quickly.

**Decision.** The first 20–30 games are curated by hand from official control menus, exported config
files, and community-verified sources. Every binding carries a verification state.

**Consequences.** Catalog growth is slower at first. In exchange the data is trustworthy, which is
precisely what no existing tool offers. Automatic parsers and community contributions come once the
core is stable.

## D8 — Deliberately Narrow MVP Scope

**Context.** The problem admits almost unlimited scope: controllers, accounts, sync, desktop app.

**Decision.** Out of the MVP: controller bindings, accounts, social features, backend, database,
scraping in the critical path, and a desktop application. In scope for the product polish path
(see D10–D12): switchable UI language, light/dark theme control, and responsive layouts across phone,
tablet, and desktop.

**Consequences.** What must be excellent instead: correct data, keyboard visualization, and fast
filtering. Localization, theme, and responsive work are real requirements, but they must not dilute
Stage 1’s engine focus — they land in the stages named in `PROJECT_ROADMAP.md`.

## D9 — Explicit Priority Replaces Flat Scope

**Context.** Commit `ab47adc` implemented the whole project at once and was discarded in `ebe8889`.
The prompt that produced it listed around forty deliverables at identical priority.

**Decision.** Work is organized into stages with a declared priority, one per sub-agent. Each stage
delivers something verifiable instead of advancing every front a little.

**Consequences.** No filler files or purposeless components created to "prepare" for the future. An
incomplete but correct stage beats a complete but mediocre scaffold. See `PROJECT_ROADMAP.md` for the
history in detail.

## D10 — Switchable UI Localization (i18n)

**Context.** The product should be usable by players who do not work in English. GitHub Pages is
static, so localization must be entirely client-side.

**Decision.** All user-facing UI chrome (labels, empty states, legend, buttons, errors, settings) is
externalized into locale message catalogs and selectable at runtime through a language switcher.
Preferences persist in local storage. English is the source locale. Additional locales ship as catalog
files; the first extra locale is chosen when the i18n stage is implemented. The availability engine
and key identifiers stay locale-independent. Seed binding **action names** remain in their curated
source language unless a translated catalog for that profile exists later.

**Consequences.** Components must not hardcode chrome copy once i18n lands. Domain logic must never
depend on translated strings. Adding a language is a data change (new catalog), not a redesign.

## D11 — Explicit Light / Dark Theme Control

**Context.** Players use the tool in bright and dark environments. Relying only on OS
`prefers-color-scheme` is not enough when the user wants an override.

**Decision.** The UI supports light, dark, and system (follow OS) modes, switchable in the interface.
The choice persists in local storage. Appearance is driven by CSS custom properties (design tokens),
including key-state colors. State is never conveyed by color alone (text, pattern, or icon remains
required). `STYLES.md` owns the token list once UI work starts.

**Consequences.** Components consume tokens, not ad-hoc hex values. The temporary skeleton’s OS-only
dark styling is not the product behaviour.

## D12 — Responsive Layouts Across Devices

**Context.** Binding planning happens on desktops, but discovery and quick checks happen on phones
and tablets. A three-column desktop shell that does not reflow is unusable on small screens.

**Decision.** The layout must work on phone, tablet, and desktop viewports. The desktop shell stays a
multi-region composition; narrower viewports stack or collapse regions without dropping required
controls. The SVG keyboard scales with its container and remains operable with touch and keyboard.
Breakpoints and mobile behaviour are documented in `PROJECT_STRUCTURE.md` / `STYLES.md` when UI work
starts; Stage 2 builds the keyboard with responsive scaling from the start, and Stage 5 verifies the
full app across device classes.

**Consequences.** Do not treat “desktop first, mobile never” as acceptable. Do not ship a keyboard
that only fits a wide monitor. Touch targets and focus order matter as much as visual polish.

## D13 — Keybindr-Inspired Shell, Not a Clone

**Context.** Post-MVP QA (`qa.md`) found the UI dense in the wrong places: controls above the
keyboard, green “free” keys, truncation of the full layout, missing form-factor and mouse visuals.
Keybindr (https://keybindr.github.io/) is the clearest public reference for a keyboard-first binding
shell. An auto-extracted token dump in `qa.md` is incomplete and unverified.

**Decision.** Study Keybindr’s information architecture, density, free-key neutrality, layout
selector, and mouse presentation, and adopt those **patterns** in BindScope’s UI Refresh track
(`PLAN.md` phases UR1–UR5). Do **not** clone Keybindr’s brand, typography (e.g. Inter-only),
orange-on-black identity, or single-profile editor product model. BindScope remains the multi-profile
availability product (D1). Visual tokens stay BindScope-owned (D11); domain stays pure (D5); devices
stay data-driven SVG (D4).

**Consequences.** Phase UR1 must produce an adopt/reject brief (`docs/keybindr-analysis.md`) before
large shell refactors. Free keys should read as neutral/recessive, not “success green.” New chrome
(collapsible menus, layout selector, mouse) is in scope for the UI Refresh track; becoming a Keybindr
substitute is not.

## Maintenance Rule

Add an entry when a decision constrains future design. Do not document reversible, low-impact choices
here; the code is enough for those.
