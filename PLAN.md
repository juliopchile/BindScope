# Active Work Plan

`PLAN.md` tracks the current active work only. It should contain enough context for a new developer
or agent to continue without reading chat history.

Do not use this file as a changelog, roadmap, or architecture document. Completed work is condensed
into `PROJECT_ROADMAP.md`; stable design information lives in `PROJECT_STRUCTURE.md`.

## Current Status

**Current track:** UI Refresh (post-MVP) — **complete** (UR1–UR5)

**Status:** All UI Refresh phases shipped. Next work comes from **Later Direction** in
`PROJECT_ROADMAP.md` (catalog growth, V2 modifiers/layouts, parsers, optional E2E) — not a new
UI Refresh phase unless product owners open one.

**Source of requirements:** `qa.md` (user QA notes). Reference screenshots: `example_csbinds.png`,
`example_keybindr.png`. Competitive brief: `docs/keybindr-analysis.md`.

**Product constraint (do not lose):** BindScope’s differentiator remains multi-profile availability
(`available = allKeys − union(usedKeys)`). See **D13** in `DECISIONS.md`.

**MVP note:** Stages 0–5 are complete and committed on `main` (local branch may be ahead of
`origin/main`).

---

## UI Refresh — closed

| Phase | Status |
|---|---|
| UR1. Competitive analysis & design brief | Complete |
| UR2. Keyboard-first shell & free-key retoken | Complete |
| UR3. Collapsible chrome & denser shell | Complete |
| UR4. Keyboard form-factor selector | Complete |
| UR5. Mouse visualizer | Complete |

### Phase UR5 — Mouse visualizer (delivered)

- Data-driven `MouseLayout` in `data/mouseLayout.ts` (Mouse1–5 + WheelUp/WheelDown).
- Canonical mouse ids in `keyNormalization` + types; table-driven tests.
- `MouseVisualizer` beside keyboard on `lg+` (stacked below on narrow); selectable; detail panel shared.
- Availability: optional `deviceLayouts` on `computeAvailability`; mouse participates when shown.
- Demo mouse binds on Counter-Strike 2 combat layer; prefs “Show mouse” (`bindscope.showMouse`).
- i18n for new chrome (en/es/pt/fr/zh); `PROJECT_STRUCTURE.md` / `STYLES.md` updated.

---

## Immediate Next Step

Pick from **Later Direction** / Pending Work in `PROJECT_ROADMAP.md` (no active UI Refresh phase).

## Verification Commands

```sh
make test
make lint
make build
```
