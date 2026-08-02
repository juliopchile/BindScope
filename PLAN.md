# Active Work Plan

`PLAN.md` tracks the current active work only. It should contain enough context for a new developer
or agent to continue without reading chat history.

Do not use this file as a changelog, roadmap, or architecture document. Completed work is condensed
into `PROJECT_ROADMAP.md`; stable design information lives in `PROJECT_STRUCTURE.md`.

## Current Status

**Current track:** Product Depth (post–UI Refresh)

**Status:** PD3 complete; authorize **PD4** next (default)

**Context:** MVP (Stages 0–5) and UI Refresh (UR1–UR5) are complete. The shell is keyboard-first with
Full/TKL layouts, mouse visualizer, collapsible chrome, i18n, and theme. Remaining work is
**data coverage**, **deeper interaction features**, and **real-config import** — not another visual
overhaul unless QA reopens one.

**Product constraint (do not lose):** multi-profile availability
(`available = allKeys − union(usedKeys)`). Domain stays pure (D5). Seeds stay hand-curated (D7).
Static-only deploy (D2). Keybindr-inspired shell rules still apply (D13).

**Prior closed track:** UI Refresh — see `PROJECT_ROADMAP.md` and `docs/keybindr-analysis.md`.

---

## Why this track

Binding **data quality and catalog breadth** remain the real product bottleneck (Technical Debt in
the roadmap). V2 features unlock more of the engine and shell already built. Config parsers are the
defensible long-term advantage (Later Direction). Cloud sync and recommendations come only after
parsers and a credible catalog.

---

## Phase Plan

Phases are sized for one orchestrated sub-agent each (`/orquestando-agentes`). Do not start Phase N+1
until Phase N is summarized in `PROJECT_ROADMAP.md` and this file is updated — unless the user
explicitly parallelizes independent phases (e.g. Playwright vs catalog).

### Suggested order

```
PD1 (catalog) → PD2 (modifiers UI) → PD3 (action search) → PD4 (60% / ISO layouts)
     ↘ PD5 (Playwright smoke) can run anytime after PD1 if capacity allows
PD6 (config parsers) → then V3 / V4 from the roadmap (not detailed here until opened)
PD7 (extra UI locales) — as needed, not blocking
```

Prefer **PD1 before feature polish** when capacity is limited (D7 / D9).

---

### Phase PD1 — Catalog growth (~20–30 titles) ✅

**Status:** Complete

**Goal.** Grow the hand-curated seed catalog so multi-game overlays are useful for a typical library.

**Delivered**

- Catalog grown to **26** curated entries (**22 games + 4 tools**) under `app/src/data/catalog/`.
- New games: Overwatch 2, Destiny 2, Minecraft, Fortnite, Dota 2, Rocket League, Path of Exile,
  Escape from Tarkov, Dead by Daylight, Baldur's Gate 3, Elden Ring, Final Fantasy XIV, Rust,
  Diablo IV.
- New tools: Discord, ShareX (alongside OBS Studio, MSI Afterburner).
- Layered profiles with verification on every binding; deliberate cross-title conflicts (MOBA QWER,
  MMO hotbars, FPS WASD/voice, Discord PTT remaps).
- `STARTER_POOL` expanded with CS2, Minecraft, VALORANT.
- Catalog invariant tests extended (unique ids, key normalization, layer structure, band size);
  `NumLock` added to key normalization for existing WoW/FFXIV seeds.
- Mouse binds on several FPS/ARPG titles beyond CS2.

**Acceptance**

- [x] Catalog reaches roughly **20–30** curated entries (games + tools).
- [x] `make test` / `lint` / `build` pass; search finds new titles; layers flatten correctly.
- [x] `PROJECT_ROADMAP.md` notes new count; verification discipline maintained.

---

### Phase PD2 — Modifier combinations in the UI (V2 slice) ✅

**Status:** Complete

**Goal.** Surface chords that already exist in the model so users can distinguish bare keys from
modifier+key occupancy (engine already stores modifiers).

**Delivered**

- Additive UI only — **no availability scoring change**. Chords still aggregate on the physical key.
- `+` chord mark on keyboard/mouse keys that have ≥1 modifier binding; aria suffix; D11 text cue.
- Legend **Chords** control filters to keys with chords (dims the rest); Preferences toggle persists
  show/hide of chord marks (`bindscope.showChordMarks`).
- Detail panel groups **Bare key** vs **Modifier chords**; status line notes when chords are present.
- Helpers + tests in `lib/chords.ts` / `tests/chords.test.ts`; i18n en/es/pt/fr/zh; `STYLES.md` cues.

**Acceptance**

- [x] User can see which bindings are chords vs bare keys in the visualizer and/or detail.
- [x] Tests cover chord display / any scoring change.
- [x] `make test` / `lint` / `build` pass; STYLES.md updated if new cues ship.

---

### Phase PD3 — Action-name search ✅

**Status:** Complete

**Goal.** Find keys/bindings by action text across selected profiles (e.g. “push to talk”, “reload”).

**Delivered**

- Compact stage-level **Find action** control (idle: input + Selected/Catalog scope; results overlay
  only while querying — does not push the visualizer).
- Default scope = **selected** overlay profiles; optional **Catalog** searches default-layer seeds.
- Match helpers in `lib/actionSearch.ts` reuse `utils/search.ts` normalization; action + context only
  (D10 — curated source strings, chrome i18n only).
- Selecting a hit focuses the key/mouse control, opens detail, adds the game if missing from
  selection, and enables the mouse when the hit is a mouse id.
- Empty selection / no-match chrome strings in en/es/pt/fr/zh; tests in `tests/actionSearch.test.ts`.

**Acceptance**

- [x] User can query an action string and jump to the occupying control.
- [x] Empty and no-match states localized.
- [x] Tests for match helpers; `make test` / `lint` / `build` pass.

---

### Phase PD4 — Remaining layout variants (60%, ISO)

**Goal.** Extend the form-factor selector beyond ANSI Full / TKL.

**Must do**

- Data-driven layouts: at least **60%/compact** and **ISO** (Enter/left-shift shape) in
  `keyboardLayouts.ts` (or split modules); registry + `LayoutId`; selector + persisted preference
  (existing `bindscope.layout` pattern).
- No auto-switch on viewport width (UR1 decision stands).
- Layout invariant tests (unique ids, dimensions, ISO geometry sanity).

**Out of scope**

- Ergo / split / vendor boards; Keybindr HOTAS catalogs.

**Acceptance**

- [ ] User can select Full, TKL, and new variants; availability updates; preference persists.
- [ ] Docs (`PROJECT_STRUCTURE.md`, `STYLES.md`) list shipped `LayoutId`s.
- [ ] `make test` / `lint` / `build` pass.

---

### Phase PD5 — Optional Playwright smoke

**Goal.** Thin E2E safety net for the static app (load, select game, keyboard visible, layout switch).

**Must do**

- Playwright (or agreed runner) behind Makefile target; CI optional but preferred on `main` if cheap.
- Smoke only: home load, open Games, select a seed, assert visualizer + legend; optional layout toggle.
- Document how to run in README / AGENTS commands table.

**Out of scope**

- Full visual regression suite; cross-browser matrix beyond one CI browser unless trivial.

**Acceptance**

- [ ] `make` target runs smoke locally; documented.
- [ ] Flakes addressed or test narrowed; does not block Pages deploy unless CI is explicitly added.

**Note:** Can be scheduled in parallel with PD2–PD4 if catalog (PD1) is stable enough for selectors.

---

### Phase PD6 — Real config parsers (INI / CFG / XML)

**Goal.** Import bindings from real game/tool config files client-side, feeding the same
`InputProfile` / availability path as JSON import (defensible advantage).

**Must do**

- Parser modules under `lib/` (or `lib/parsers/`), isolated from React (PROJECT_STRUCTURE).
- Support at least one format end-to-end with tests and a documented sample; then generalize toward
  INI, CFG, and XML as scoped.
- Reuse key normalization; skip/report invalid binds like JSON import.
- UI: extend Import / Export chrome — file pickers by format; clear errors via i18n.
- No server upload; fully static (D2).

**Out of scope**

- Steam Cloud sync, accounts, automatic game detection (those are V3).
- Silent scrape of wikis to build parsers’ expected schemas.

**Acceptance**

- [ ] User can import at least one real config format and see keys update on the visualizer.
- [ ] Table-driven parser tests; invalid input does not crash the app.
- [ ] `PROJECT_STRUCTURE.md` documents parser boundary; `make test` / `lint` / `build` pass.

---

### Phase PD7 — Further UI locales (as needed)

**Goal.** Add chrome locales beyond en/es/pt/fr/zh when product demand exists.

**Must do**

- New catalog file under `app/src/i18n/locales/`; register in i18n index; parity with English keys.
- Locale switcher lists the new language; `document.documentElement.lang` updates.

**Out of scope**

- Translating seed action names (unless a per-profile catalog is explicitly added).

**Acceptance**

- [ ] Key parity tests (or checklist) vs `en`; switcher works; prefs persist.

---

## Later phases (roadmap only — open a PLAN section when authorized)

| Phase | Scope | Depends on |
|---|---|---|
| **V3** | Steam sync, cloud profiles (adapter behind interface — D3), game detection | PD6 strongly recommended first |
| **V4** | Recommendations (“best push-to-talk key for your library”) | Credible catalog (PD1) + stable availability UX |

Do not stub empty backend modules (D3 / D9).

---

## Explicit Non-Goals (until a decision changes)

- Controller / gamepad / HOTAS bindings.
- User accounts as an MVP-shaped requirement without an adapter plan.
- Auto wiki scraping in the critical path (D7).
- Desktop application.
- Cloning Keybindr’s bind-editor product (D13).
- Restoring discarded commit `ab47adc` wholesale.

---

## Documentation map for this track

| File | Role |
|---|---|
| `PLAN.md` | This file — active Product Depth phases PD1–PD7 |
| `PROJECT_ROADMAP.md` | Condensed status; V3/V4 remain high-level until opened |
| `PROJECT_STRUCTURE.md` | Update when parsers / layouts / catalog conventions change |
| `DECISIONS.md` | D1–D13 still govern; add entries only if a phase forces a new constraint |
| `AGENTS.md` / `README.md` | Point at active track |

---

## Immediate Next Step

Authorize **Phase PD4** (60% / ISO layouts) unless the user prioritizes another phase
(e.g. PD6 parsers or PD5 Playwright) explicitly.

## Verification Commands (every implementation phase)

```sh
make test
make lint
make build
```
