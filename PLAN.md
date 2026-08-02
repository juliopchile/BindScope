# Active Work Plan

`PLAN.md` tracks the current active work only. It should contain enough context for a new developer
or agent to continue without reading chat history.

Do not use this file as a changelog, roadmap, or architecture document. Completed work is condensed
into `PROJECT_ROADMAP.md`; stable design information lives in `PROJECT_STRUCTURE.md`.

## Current Status

**Current track:** UI Refresh (post-MVP) — keyboard-first shell inspired by Keybindr IA

**Status:** UR1–UR4 complete; UR5 awaiting authorization (do not start UR5 until green-lit)

**Source of requirements:** `qa.md` (user QA notes). Reference screenshots: `example_csbinds.png`,
`example_keybindr.png`. Competitive brief: `docs/keybindr-analysis.md`. Auto-extracted Keybindr
token dump in `qa.md` was verified/discarded in that brief — do not treat the dump as authoritative.

**Product constraint (do not lose):** BindScope’s differentiator remains multi-profile availability
(`available = allKeys − union(usedKeys)`). This track improves presentation and device coverage; it
must not turn the app into a single-profile keymap editor. See **D13** in `DECISIONS.md`.

**MVP note:** Stages 0–5 are complete and committed on `main` (local branch may be ahead of
`origin/main`). Further work is this UI Refresh track, then **Later Direction** in
`PROJECT_ROADMAP.md`.

---

## Problem Summary (from `qa.md`)

| Pain | Desired outcome |
|---|---|
| Keyboard sits below a tall control stack; feels secondary | Keyboard is the hero under the header, with more horizontal room |
| Full layout truncates / forces awkward horizontal scroll | Entire active layout visible at typical desktop widths; scroll only as last resort |
| Free keys are green (traffic-light) | Free keys are neutral (transparent / gray), closer to Keybindr’s unused keys |
| Chrome feels “slop”: flat cards, always-open panels | Collapsible menus / sections; denser, structured shell |
| No form-factor control | Keyboard type selector (Full, TKL, …) |
| No mouse | Mouse visualizer beside/near keyboard (CS binds / Keybindr class of UI) |
| Layout not Keybindr-like enough | Study Keybindr end-to-end, then adopt IA/density patterns — not a visual clone |

---

## Design Principles for This Track

1. **Keyboard first.** First viewport after the header is the device visualizer (keyboard ± mouse).
2. **Controls collapse.** Selection, layers, import/export, and prefs live in menus or expandable
   panels — not a permanent tall block above the keyboard.
3. **Neutral free state.** Occupied / conflicted / reserved carry emphasis; free keys recede.
4. **Inspired, not cloned.** Steal structure and density from Keybindr; keep BindScope tokens,
   light/dark/system, i18n, and intersection semantics (D10–D13).
5. **Data-driven devices.** Layout variants and mouse geometry stay in `data/`, rendered as SVG
   (D4). Domain stays pure (D5).
6. **D11 still holds.** State is never color alone — marks / patterns / text remain required even
   when free becomes gray/transparent.
7. **One phase, one verifiable surface.** Prefer finishing hierarchy before adding mouse or new
   layouts if capacity is tight (lesson from discarded `ab47adc` / D9).

---

## Phase Plan

Phases are sized for one orchestrated sub-agent each (`/orquestando-agentes`). Do not start Phase N+1
until Phase N is summarized in `PROJECT_ROADMAP.md` and this file is updated.

### Phase UR1 — Competitive analysis & design brief

**Status:** Complete

**Goal.** Know what Keybindr actually does (markup, scripts, layout, mouse, menus) and write an
implementation brief BindScope can follow without copying brand or product model.

**Delivered**

- Live exploration of https://keybindr.github.io/ (HTML shell, CSS tokens, React chunks, settings,
  layouts, mouse/HOTAS tables, modals, ≤768px behaviour).
- Cross-check of https://keybindr.app/ (separate product; form-factor-in-chrome noted).
- Screenshot walkthroughs + verification of the `qa.md` DESIGN.md dump.
- `docs/keybindr-analysis.md` — IA, keyboard/mouse, free-key language, adopt/reject, UR2–UR5 recs,
  resolved open questions.
- `STYLES.md` **Design direction (planned)** updated with breakpoints, free-key intent, panel rules.

**Acceptance**

- [x] `docs/keybindr-analysis.md` exists and answers: shell regions, keyboard primacy, free-key look,
      menus, layout selector, mouse.
- [x] `STYLES.md` lists planned shell breakpoints, free-key token intent, and panel collapse rules.
- [x] Explicit adopt/reject table relative to Keybindr.
- [x] Open product questions resolved in the brief (see below).

---

### Phase UR2 — Keyboard-first shell & free-key retoken

**Status:** Complete

**Goal.** Fix the two highest-visibility “slop” issues: hierarchy/overflow and green free keys.

**Depends on:** UR1 brief (at least the shell + free-key sections).

**Delivered**

- `App.tsx` restructured: header → closed keyboard stage (legend + slim summary) → selection-driven
  detail → collapsed Games & tools `<details>` rail (search / layers / import-export).
- Content column `max-w-[1400px]`; SVG `max-w-5xl` removed so ANSI full scales without clipping at
  ≥1280px.
- `--key-free-*` retokened to neutral transparent/gray (light + dark + system); reserved dark fill
  nudged so free stays distinct. D11 marks unchanged.
- New chrome strings (`controlsToggle`, `controlsToggleHint`, `detailDismiss`, `summaryHeading`) in
  en/es/pt/fr/zh; empty-selection copy updated for below-keyboard controls.
- `STYLES.md` updated to match shipped shell + tokens.

**Acceptance**

- [x] On a ≥1280px viewport, ANSI full keyboard shows all regions (alpha, nav, numpad) without
      horizontal clipping; horizontal scroll only as last resort on narrow widths.
- [x] Keyboard is the dominant element below the header (controls do not push it below the fold on
      desktop when panels are collapsed/default).
- [x] Free keys read as neutral/gray/transparent in light and dark themes — not green.
- [x] `make test`, `make lint`, `make build` pass; D11 cues still present for every state.
- [x] `STYLES.md` tokens and breakpoints updated to match shipped CSS.

**Likely touch points:** `App.tsx`, `KeyboardVisualizer.tsx`, `styles/index.css`, `STYLES.md`,
`ui/keyStateMeta.ts`, locale catalogs, possibly `Legend.tsx`.

---

### Phase UR3 — Collapsible chrome & denser shell

**Status:** Complete

**Goal.** Replace always-open stacked cards with menus / disclosure panels so the page feels
structured rather than a dashboard dump.

**Depends on:** UR2 shell skeleton.

**Delivered**

- `ChromeToolbar` header action cluster: **Games**, **Import / Export**, **Preferences** — exclusive
  disclosures with `aria-expanded` / `aria-controls`, Escape + outside-click dismiss, focus return.
- Replaced UR2 `<details>` Games & tools rail; prefs moved into the Preferences disclosure.
- Games panel: search + selection + layers; Import / Export: `ProfileIO`; default collapsed so
  keyboard + legend dominate the first viewport.
- Phone detail: fixed bottom drawer + backdrop (`< 1024px`); desktop keeps selection side panel.
- New i18n keys (`menuGames`, `menuImportExport`, `menuPrefs`, …) in en/es/pt/fr/zh; empty-selection
  copy points at the header Games control.
- `STYLES.md` updated for disclosure/responsive behaviour.

**Acceptance**

- [x] User can open/close primary control groups without leaving the page.
- [x] With all groups collapsed, first viewport is dominated by the keyboard (desktop).
- [x] Empty selection, import errors, and detail empty states still reachable and localized.
- [x] No hardcoded chrome strings; disclosures keyboard-operable with `aria-expanded`.
- [x] `make test` / `lint` / `build` pass.

**Out of scope (unchanged)**

- Layout form-factor selector (UR4), mouse SVG (UR5).

---

### Phase UR4 — Keyboard form-factor selector

**Status:** Complete

**Goal.** Let the user switch keyboard type (at least Full and TKL), matching competitor expectation
and unblocking horizontal clarity on smaller widths.

**Depends on:** UR2 (visualizer sizing). Can run after or in parallel planning with UR3 if UR2 is
done; prefer after UR3 so the selector has a stable toolbar home.

**Delivered**

- Layout registry: `ansi-full` + `ansi-tkl` (shared alpha/nav helpers; TKL omits numpad, narrower
  `viewBox`). Optional 60%/ISO deferred to V2.
- Visible `LayoutSelector` in `ChromeToolbar` actions (before Games / Import / Prefs); preference
  persisted as `bindscope.layout` (default `ansi-full`; no viewport auto-switch).
- Selected layout wired into `computeAvailability` + `KeyboardVisualizer`; selection cleared when
  the active key is absent from the new layout.
- Registry invariant tests; layout chrome strings in en/es/pt/fr/zh.

**Acceptance**

- [x] User can switch Full ↔ TKL; keyboard and availability summary update immediately.
- [x] Preference survives reload.
- [x] TKL view has no empty numpad gap and improves fit on mid-width viewports.
- [x] `LayoutId` / `PROJECT_STRUCTURE.md` / `STYLES.md` updated.
- [x] `make test` / `lint` / `build` pass.

**Out of scope (unchanged)**

- ISO / regional variants (V2).
- Mouse (UR5).

---

### Phase UR5 — Mouse visualizer

**Goal.** Show a mouse alongside the keyboard (CS binds / Keybindr class), with buttons that reflect
bindings from selected profiles when present.

**Depends on:** UR2 hierarchy (placement region). Prefer UR3 toolbar for any mouse-related toggles.

**Must do**

- Data-driven mouse layout (SVG paths or simple geometry in `data/`), consistent with D4.
- Canonical ids for mouse buttons in normalization (e.g. `Mouse1`…`Mouse5`, wheel if needed) —
  extend `keyNormalization` + types carefully; table-driven tests.
- Render mouse near keyboard (placement per UR1 brief — typically right of or below keyboard).
- Map existing/imported bindings that use mouse ids onto the visualizer; detail panel works for
  mouse targets.
- Availability: mouse buttons participate when present in layout input **or** are shown as a
  companion device with the same conflict states — choose one approach in UR1 brief and implement
  consistently (prefer extending layout input with a `DeviceLayout` or separate mouse layout fed
  into a small pure helper rather than special-casing React).
- Seed data: optional mouse bindings on one tool/game only if needed to demo; do not block on full
  catalog mouse coverage.

**Out of scope**

- Gamepad/controller (Known Limitations).
- Editing binds by clicking mouse (Keybindr-style editor) — BindScope remains an availability
  overlay unless a later stage says otherwise.

**Acceptance**

- [ ] Mouse is visible in the primary visualizer region; buttons selectable; detail shows occupants.
- [ ] Free/partial/heavy/reserved (or equivalent) styling matches keyboard token language.
- [ ] Normalization + availability tests cover mouse ids.
- [ ] Docs: `PROJECT_STRUCTURE.md` device model, `STYLES.md` mouse component notes.
- [ ] `make test` / `lint` / `build` pass.

**Likely touch points:** `types/`, `utils/keyNormalization.ts`, `domain/` (if multi-device summary),
`data/mouseLayout.ts` (new), `components/MouseVisualizer.tsx` (new), `App.tsx`, catalog optional
binds, tests, docs.

---

## Suggested Execution Order

```
UR1 (analysis) → UR2 (shell + free tokens) → UR3 (collapsible chrome)
                                              ↘ UR4 (layout selector)
                                              ↘ UR5 (mouse)
```

UR4 and UR5 both depend on UR2; UR3 should land before them so controls have a stable home. If only
one of UR4/UR5 can ship next, prefer **UR4** for truncation/fit on real keyboards, then **UR5**.

---

## Explicit Non-Goals (this track)

- Cloning Keybindr’s Inter/orange brand, black-only theme, or single-profile editor workflows.
- Auto-scraping wikis for bindings (D7).
- Backend, accounts, Steam sync (V3).
- Playwright suite (still optional unless a phase explicitly adds smoke for the new shell).
- Growing the game catalog (separate pending work).
- Restoring discarded commit `ab47adc` wholesale.

---

## Open Questions — resolved in UR1

Full rationale in `docs/keybindr-analysis.md` §9. Summary:

1. **Mouse vs availability engine:** First-class mouse button ids in the pure availability pipeline
   (data-driven mouse layout + normalization). Not companion-only cosmetics.
2. **Default layout after UR4:** Keep ANSI Full as default; persist user Full/TKL choice; do **not**
   auto-force TKL/60% on resize.
3. **Detail panel:** Selection-driven drawer/panel; collapsed by default on desktop; drawer on phone.
   Escalate only if product owners insist on a permanent rail (would override the brief).
4. **Keybindr.app vs github.io:** Different products. No brand/model adopt changes; reinforces a
   **visible** form-factor selector for UR4. Primary reference remains github.io.

---

## Documentation Updates Tied to This Plan

| File | Role |
|---|---|
| `PLAN.md` | This file — active phase detail |
| `qa.md` | Immutable-ish user QA source; do not treat as architecture |
| `DECISIONS.md` | **D13** — Keybindr-inspired IA, not a clone |
| `PROJECT_ROADMAP.md` | UI Refresh track status; pending phases |
| `STYLES.md` | Planned design direction; updated per phase as tokens ship |
| `PROJECT_STRUCTURE.md` | Update when layouts/mouse/device model land (UR4–UR5) |
| `docs/keybindr-analysis.md` | **Create in UR1** — competitive brief |
| `AGENTS.md` | Point agents at active UI Refresh plan |

---

## Immediate Next Step

Authorize **Phase UR5** (mouse visualizer). Do not start UR5 until green-lit.

## Verification Commands (every implementation phase)

```sh
make test
make lint
make build
```

Manual QA: desktop ≥1280px and phone-width pass for hierarchy, overflow, theme light/dark, and
keyboard operability of new disclosures.
