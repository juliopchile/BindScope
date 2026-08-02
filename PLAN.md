# Active Work Plan

`PLAN.md` tracks the current active work only. It should contain enough context for a new developer
or agent to continue without reading chat history.

Do not use this file as a changelog, roadmap, or architecture document. Completed work is condensed
into `PROJECT_ROADMAP.md`; stable design information lives in `PROJECT_STRUCTURE.md`.

## Current Status

**Current track:** Product Depth (post–UI Refresh)

**Status:** Product Depth **complete** (PD1–PD7). Next: open **V3** when authorized.

**Context:** MVP (Stages 0–5) and UI Refresh (UR1–UR5) are complete. The shell is keyboard-first with
Full / TKL / 60% / ISO Full layouts, mouse visualizer, collapsible chrome, i18n
(en/es/pt/fr/zh/de/ja), and theme. Client-side CFG / INI / XML import lands via PD6; PD7 adds German
and Japanese chrome locales. Playwright smoke lands via `make e2e` (optional CI workflow does not
gate Pages).

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
PD1 (catalog) → PD2 (modifiers UI) → PD3 (action search) → PD4 (60% / ISO layouts) → PD5 (Playwright) ✓
PD6 (config parsers) ✓ → then V3 / V4 from the roadmap (not detailed here until opened)
PD7 (extra UI locales) ✓
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

- [x] User can select Full, TKL, and new variants; availability updates; preference persists.
- [x] Docs (`PROJECT_STRUCTURE.md`, `STYLES.md`) list shipped `LayoutId`s.
- [x] `make test` / `lint` / `build` pass.

**Done (PD4):** Shipped `ansi-60` (alpha-only compact) and `iso-full` (tall Enter, home-row
`Backslash`, `IntlBackslash` left of Z). Selector + `bindscope.layout` unchanged in pattern; clears
selection when the key leaves the layout. Ergo / ISO-TKL deferred.

---

### Phase PD5 — Optional Playwright smoke ✅

**Status:** Complete

**Goal.** Thin E2E safety net for the static app (load, select game, keyboard visible, layout switch).

**Delivered**

- `@playwright/test` in `app/`; config + `app/e2e/smoke.spec.ts` (Chromium only).
- Makefile: `make e2e-install` (browser download), `make e2e` (build + smoke vs Vite preview).
- Smoke: home load, open Games, add OBS Studio, assert keyboard + legend, toggle Full → TKL.
- Docs in README / AGENTS commands table.
- Optional CI: `.github/workflows/e2e.yml` on `main` / PRs — **does not** gate Pages deploy.

**Acceptance**

- [x] `make` target runs smoke locally; documented.
- [x] Flakes addressed or test narrowed; does not block Pages deploy unless CI is explicitly added.

---

### Phase PD6 — Real config parsers (INI / CFG / XML)

**Status:** Complete

**Goal.** Import bindings from real game/tool config files client-side, feeding the same
`InputProfile` / availability path as JSON import (defensible advantage).

**Done**

- Pure parsers under `app/src/lib/parsers/` (Source CFG, simple INI, BindScope XML) +
  `parseImportFile` routing in `lib/importExport.ts`.
- Import panel accepts `.json` / `.cfg` / `.ini` / `.xml`; target-game select for CFG/INI/XML
  (catalog, selected, or from filename / alias).
- Samples + schema notes in `app/tests/fixtures/` and `docs/samples/`; table-driven parser tests.
- i18n errors/hints in en/es/pt/fr/zh.

**Acceptance**

- [x] User can import at least one real config format and see keys update on the visualizer.
- [x] Table-driven parser tests; invalid input does not crash the app.
- [x] `PROJECT_STRUCTURE.md` documents parser boundary; `make test` / `lint` / `build` pass.

---

### Phase PD7 — Further UI locales ✅

**Status:** Complete

**Goal.** Add chrome locales beyond en/es/pt/fr/zh when product demand exists.

**Delivered**

- German (`de`) and Japanese (`ja`) catalogs under `app/src/i18n/locales/`; registered in i18n index
  with native switcher labels (Deutsch / 日本語).
- Key parity vs `en` enforced by extended `tests/i18n.test.ts`; prefs / boot already route through
  `isLocale` so `bindscope.locale` and `document.documentElement.lang` accept the new codes.
- Seed binding action names remain untranslated (D10).

**Acceptance**

- [x] Key parity tests vs `en`; switcher lists de/ja; prefs persist.
- [x] `make test` / `lint` / `build` pass.

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
| `PLAN.md` | This file — Product Depth PD1–PD7 complete; clear or replace when V3 opens |
| `PROJECT_ROADMAP.md` | Condensed status; V3/V4 remain high-level until opened |
| `PROJECT_STRUCTURE.md` | Update when parsers / layouts / catalog conventions change |
| `DECISIONS.md` | D1–D13 still govern; add entries only if a phase forces a new constraint |
| `AGENTS.md` / `README.md` | Point at active track |

---

## Immediate Next Step

Product Depth (PD1–PD7) is complete. Open **V3** (Steam sync / cloud adapter / game detection) only
when authorized — do not stub backend modules (D3 / D9).

## Verification Commands (every implementation phase)

```sh
make test
make lint
make build
make e2e   # when touching shell / chrome / deploy path
```
