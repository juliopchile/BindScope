# Keybindr Competitive Analysis & BindScope Design Brief

**Phase:** UR1 (UI Refresh)  
**Primary reference:** https://keybindr.github.io/ (fetched 2026-08-01)  
**Secondary cross-check:** https://keybindr.app/ (different product; see §7)  
**Screenshots:** `example_keybindr.png`, `example_csbinds.png`  
**Decisions:** D1 (intersection product), D13 (inspired shell, not a clone), D4/D5/D10–D12  

This brief is the implementation contract for UR2–UR5. It must not be read as permission to clone Keybindr’s brand or editor model.

---

## 1. Sources & method

| Source | Role |
|---|---|
| Live SPA at `keybindr.github.io` | Authoritative for Keybindr IA, CSS tokens, JS behaviour, settings, mouse/HOTAS |
| Assets `index-*.css` / `index-*.js` + lazy chunks | Confirmed markup patterns, layout registry, key styling, modals |
| `example_keybindr.png` | Visual hierarchy walkthrough (Spanish UI snapshot of github.io) |
| `example_csbinds.png` | Mouse SVG + form-factor chrome + category-colored binds (CS:GO visualizer) |
| Auto `DESIGN.md` dump in `qa.md` | Unverified; each major claim confirmed or discarded in §8 |
| `keybindr.app` | Product-surface differences only; not the D13 primary reference |

---

## 2. What Keybindr (github.io) actually is

A **single-profile / single-layout keybind editor and visualizer**:

- React (Vite/Rolldown) SPA, static GitHub Pages host.
- User builds named **formats** (context tabs, e.g. “On Foot”), binds keys with modifiers + action labels + optional key colors.
- Game **presets** (“Game Defaults”), JSON/PNG import-export, share URL, help/settings modals.
- Optional **mouse** and **HOTAS** binding *tables* (toggleable in Settings). Help copy states explicitly: mouse/HOTAS **visualization is not currently supported**.
- Dark-only chrome; Inter (UI) + Fira Code / Courier (keys); gold/orange accent identity.
- Persistence in `localStorage`; no accounts.

BindScope’s product remains the opposite core loop (D1): **multi-profile availability** (`available = allKeys − union(usedKeys)`), not a keymap editor.

---

## 3. Information architecture

### 3.1 Shell regions (top → bottom)

| Region | Chrome | Contents |
|---|---|---|
| **Global header** | Open (border-bottom only) | Brand + tagline (left); action cluster (right): Game Defaults, Import/Export dropdown, Share, Help, Settings. ≤768px: hamburger replaces desktop nav. |
| **Layout identity** | Open | Editable layout name (large accent type). |
| **Legend + format tabs** | Open | Modifier legend (Shift/Alt/Ctrl color triangles); format tabs + add (`On Foot`, …). |
| **Keyboard** | **Closed** (`.keyboard-container`: border, `#111` fill, radius 8px, padding) | Full SVG keyboard — visual hero. |
| **Keyboard bindings table** | **Closed** (`.panel`) | Title + count badge + lock; rows: drag, modifier, key, color, action, delete. |
| **Mouse bindings table** | **Closed** (`.panel`, if `showMouseBindings`) | Same table pattern; “+ Add Mouse Binding”. No mouse SVG. |
| **HOTAS bindings table** | **Closed** (optional) | Same pattern when enabled. |
| **Footer** | Open | Ko-fi / source / bug links. |

### 3.2 Open vs closed chrome (pattern to steal)

- **Open:** brand, layout title, legend, format tabs — identity and context without boxing.
- **Closed:** keyboard stage + data tables — interactive surfaces get a contained frame.
- **Header actions** are compact outlined buttons / icon circles; heavy workflows live in **dropdowns and modals**, not a tall stack above the keyboard.

### 3.3 Menus & modals

| Surface | Behaviour |
|---|---|
| Import/Export | Dropdown: Import JSON, Export JSON, Export PNG |
| Game Defaults | Preset picker (replaces formats/bindings) |
| Share / Share-import | Modal + URL; optional zip via JSZip |
| Help | Focus-trapped modal; documents keyboard, mouse/HOTAS limits, formats |
| Settings | Physical layout, language layout, UI language, modifier L/R split, cross-format warnings, mouse on/off + model, HOTAS on/off + model, clear/reset |
| Bind / Mouse bind / HOTAS bind | Modals to create/edit bindings |
| Orphan warning | When layout change drops keys |
| Mobile warning | Soft notice that the UI is desktop-oriented |

### 3.4 Screenshot walkthrough — `example_keybindr.png`

- Hierarchy: header → layout name/legend/format → **keyboard dominates** → binding table below.
- Free keys: dark charcoal fill, low-contrast labels — recede into the stage.
- Bound keys: gold border + warmer fill; modifiers painted solid (Shift blue, Alt green, Ctrl orange) with corner triangles on chords.
- Header actions are a dense right cluster; nothing tall sits above the keyboard.
- No mouse graphic in this frame (matches live site: table-only mouse).

### 3.5 Screenshot walkthrough — `example_csbinds.png`

- Minimal header with **Keyboard: Full** form-factor control.
- Keyboard hero; unbound keys thin/dark; bound keys thick **category-colored** borders + occasional icons.
- Legend under keyboard (Movement / Equipment / Actions / …).
- Bottom: config paste (left) + **top-down mouse SVG** (right) with buttons 1–5 reflecting binds.
- Utilitarian single-page viz; one-way config → visual. Closest reference for **UR5 mouse placement and visual language**.

---

## 4. Keyboard & mouse composition

### 4.1 Keyboard (github.io)

| Item | Detail |
|---|---|
| Render | Data-driven SVG (`viewBox` from layout; `width: 100%`; `display: block`) |
| Stage | `.keyboard-container` inside `.app` (`max-width: 1400px`) |
| Layouts | `ansi-104` (1040×288), `iso-105` (1040×288), `tkl-ansi` / `tkl-iso` (844×288), `layout-75` (712×288), `layout-60` (668×228) |
| Selector | Settings → **Physical Layout** (not a permanent toolbar control) |
| Defaults | Desktop: ANSI 104, or ISO 105 when UI language implies ISO; **viewport ≤768px forces `layout-60`** (overrides stored layout while narrow) |
| Overflow | Scales with container via viewBox; no artificial `max-w` on the SVG itself. Narrow widths shrink keys rather than clip the numpad first. |
| Interaction | Click key → bind modal; hover → tooltip of bindings; mouse/HOTAS remaps can badge keys (`🖱` / `🕹`) |
| Export | PNG via offscreen canvas + SVG snapshot |

### 4.2 Mouse (github.io vs CS binds)

| | Keybindr github.io | CS binds screenshot |
|---|---|---|
| Visual mouse | **Absent** (help: viz not supported) | Present, beside/below keyboard region |
| Data | Button ids `Mouse1`…`MouseN`, `WheelUp`/`WheelDown`; vendor profiles (Razer, Logitech, SteelSeries, …) | Parsed from `bind "MOUSE1" …` config text |
| UI | Binding table + add modal | Outline mouse with colored button zones |

**BindScope UR5** should follow the **CS binds visual pattern** (SVG companion), while borrowing Keybindr’s **canonical button ids** and optional “show mouse” preference — not Keybindr’s table-as-only-UI approach.

### 4.3 Form-factor controls

- **github.io:** Physical layout in Settings modal; auto-60% on mobile.
- **keybindr.app:** Explicit **Form factor** control in the app chrome (Full / TKL / 60% / ergo).
- **CS binds:** Header dropdown `Keyboard: Full`.

**BindScope UR4:** Prefer a **visible toolbar/header selector** (CS binds / keybindr.app pattern) over burying Full↔TKL only in a settings modal. Still persist like theme/locale.

---

## 5. Visual language — unused vs used keys

### 5.1 Keybindr (live CSS + SVG logic)

| State | Fill | Stroke | Label |
|---|---|---|---|
| Unbound / cleared | `#2a2a2a` (recessive gray) | `#444`, width 1 | `#aaa` |
| Bound (default) | `#3d3420` (warm dark) | `#e0a84b` accent, width 1.5 | `#f5e0b0` |
| Bound + custom `keyColors` | User hex | Accent border | Light label |
| Selected | Same fill rules | `#f0c060` | — |
| Modifier keys (when “painted”) | `--shift` / `--alt` / `--ctrl` solids | — | White/light |
| Chord indicators | Corner triangles in modifier colors | — | — |

Keyboard stage background `#111`; page `--bg: #1a1a1a`. Unbound keys intentionally **do not** read as “success/go”.

### 5.2 CS binds

- Unbound: thin dark border, low emphasis.
- Bound: thick category-colored border (± icons). Color encodes **action category**, not occupancy count.

### 5.3 BindScope implication (D11 + D13)

- **Adopt** recessive free keys (neutral gray / transparent) — not green.
- **Keep** BindScope occupancy semantics: free / partial / heavy / reserved / unknown with **marks + patterns + text** (D11). Do not replace that system with Keybindr’s single-profile “bound vs unbound + category color” model.
- Occupied emphasis may use BindScope tokens (partial/heavy/reserved); free must recede in both light and dark themes.

---

## 6. Adopt vs reject

| Pattern | Verdict | Why |
|---|---|---|
| Keyboard as first viewport hero under header | **Adopt** | Fixes qa.md hierarchy; D13 |
| Closed “stage” around keyboard; open identity chrome | **Adopt** | Density without dashboard card stack |
| Compact header action cluster + dropdowns/modals | **Adopt** | UR3 collapsible chrome |
| Neutral/recessive free keys | **Adopt** | qa.md + D13; drop traffic-light green |
| SVG `width: 100%` + wide content column (no clipping `max-w` on SVG) | **Adopt** | UR2 overflow fix (today BindScope caps SVG at `max-w-5xl`) |
| Form-factor selector (Full, TKL, …) | **Adopt** | UR4; expected competitor control |
| Mouse as visual companion near keyboard | **Adopt** (from CS binds) | qa.md; github.io lacks viz |
| Canonical mouse button ids (`Mouse1`…) | **Adopt** | Interop + UR5 normalization |
| Format/context tabs as *game mode editor* | **Reject as product model** | BindScope layers are multi-profile availability (D1), not per-layout bind editing |
| Click-key bind editor / drag-reorder bind table / color picker per key | **Reject** | Editor workflows; out of D1 scope for this track |
| Gold-on-black / Inter+Fira / orange accent identity | **Reject** | D13 brand clone ban; BindScope owns tokens (D11) |
| Dark-only theme | **Reject** | D11 light/dark/system required |
| Auto-force 60% layout on narrow viewports | **Reject** | Surprising; prefer user-persisted layout + scale (D12) |
| HOTAS / vendor mouse profile catalogs | **Reject for UR track** | Scope; Known Limitations already exclude controllers |
| Mouse/HOTAS as table-only with no viz | **Reject for BindScope mouse** | qa.md asks for visual mouse |
| Heat maps, templates marketplace, share-as-core-loop (keybindr.app) | **Reject** | Different product; not availability |
| Category-colored binds as primary state language | **Reject** | Conflicts with occupancy states; optional later accent only |
| Binding list as primary detail surface | **Adapt lightly** | BindScope already has key detail; prefer selection detail over editable bind spreadsheet |

---

## 7. keybindr.app vs keybindr.github.io

These are **different products** sharing a similar name:

| | github.io (D13 primary) | keybindr.app |
|---|---|---|
| Stack | React SPA, gold/dark gaming chrome | Separate app (`js/main.js`, Chakra Petch, light/dark) |
| Core loop | Edit/visualize one layout’s binds + formats | Assign labels/categories on keys; templates; heat map |
| Form factor | Settings physical layout (+ auto-60% mobile) | Prominent Form factor control (Full/TKL/60%/ergo) |
| Mouse | Binding tables only | No mouse visualizer in surface reviewed |
| i18n | Many UI locales | Marketing/en-focused chrome in fetch |
| Relation to BindScope | IA/density reference | Reinforces **visible form-factor control**; does **not** change the adopt/reject list for brand or editor model |

**Open question 4 — resolved:** No change to the adopt/reject table beyond noting that a **chrome-visible layout selector** (app pattern) is preferable to Settings-only (github.io). Primary reference remains github.io for shell density and free-key look.

---

## 8. qa.md DESIGN.md dump — verify or discard

| Claim from auto dump | Verdict |
|---|---|
| URL `keybindr.github.io` | **Confirm** |
| Font primary Inter; stack Inter, system-ui | **Confirm** (`--font-ui`); keys also use Fira Code / Courier (**dump incomplete**) |
| Base text ~13px | **Confirm** (tables/buttons ~11–13px) |
| `color.text.primary=#d0d0d0`, `secondary=#888` | **Confirm** (`--text`, `--text-dim`) |
| `color.surface.base=#000000` | **Discard** — live `--bg:#1a1a1a`, keyboard stage `#111` |
| `color.text.inverse=#f0c060` | **Partial** — that hex is `--accent2`, used for emphasis/selection, not a general “inverse text” token |
| `surface.muted=#3d3420` | **Confirm as bound-key fill**, not a generic muted surface |
| `surface.raised=#2e2e2e`, `strong=#1a1a1a` | **Confirm** (`--surface2`, `--bg`) |
| Border `#3a3a3a` | **Confirm** |
| Accent gold/orange family | **Confirm** (`--accent:#e0a84b`) |
| Radius 3–6px; motion 100–150ms | **Confirm** (`--t-fast` / `--t-normal`) |
| “Authenticated users / dashboard” audience | **Discard** — no auth; static visualizer/editor |
| WCAG 2.2 AA as stated target | **Unverified** — focus trap exists; contrast of unbound labels (`#aaa` on `#2a2a2a`) is modest; do not copy blindly |
| Component density counts (44 buttons, …) | **Discard** as guidance — snapshot noise |

---

## 9. Resolved product questions (PLAN open list)

### Q1 — Mouse vs availability engine

**Resolution: first-class device keys in the availability pipeline.**

- Add canonical mouse ids to normalization (`Mouse1`…`Mouse5`, wheel ids as needed).
- Ship a data-driven `MouseLayout` (D4) and feed its key ids into the pure summary path (extend layout input or a small pure multi-device helper — **domain stays pure**, D5).
- When the mouse visualizer is shown, mouse buttons participate in free/partial/heavy/reserved like keyboard keys.
- Do **not** implement companion-only cosmetics that ignore conflicts (would violate D1 for mouse binds).
- Seed mouse binds optional for demo; absence of catalog mouse data must still render free mouse buttons.

### Q2 — Default layout after UR4

**Resolution: default ANSI Full; persist user choice; do not auto-force TKL/60%.**

- Default remains `ansi-full` (current MVP).
- User can switch Full ↔ TKL (UR4 minimum); preference in `localStorage`.
- Mid-width / phone: **scale the SVG** and rely on TKL as a user option for fit — do not silently change layout on resize the way Keybindr forces `layout-60` ≤768px.
- Optional later (not UR4): soft empty-state hint “Try TKL for more key size” — not an auto switch.

### Q3 — Detail panel persistent vs drawer

**Resolution: selection-driven detail; collapsed by default on desktop; drawer on small screens.**

- **Desktop (≥1024px):** no always-open tall right column competing with the keyboard. Detail opens when a key/mouse target is selected (side drawer or compact side panel); dismissing selection collapses it. Summary counts/legend stay visible in a slim chrome strip.
- **Phone (&lt;1024px):** bottom or full-width drawer on selection (existing phone stack evolves into disclosure).
- Rationale: keyboard-first (qa.md / D13); Keybindr uses tooltip + tables, not a permanent detail column — BindScope keeps richer occupancy detail but must not push the keyboard below the fold.

*Escalation only if product owners prefer a permanent narrow rail:* that would be an explicit override of this brief; UR2/UR3 should implement selection-driven collapse unless overruled.

### Q4 — keybindr.app findings

**Resolved in §7** — no brand/model adopt changes; reinforces visible form-factor control for UR4.

---

## 10. Recommendations by phase (UR2–UR5)

### UR2 — Keyboard-first shell & free-key retoken

1. Restructure composition: header → **visualizer stage** → collapsed controls / legend strip. Move search, layers, import/export off the critical vertical path.
2. Raise/remove SVG `max-w-5xl`; target content width closer to Keybindr’s ~1400px stage so ANSI full (alpha+nav+numpad) fits at ≥1280px without horizontal clip.
3. Retoken `--key-free-*` to neutral gray/transparent (light + dark); keep D11 marks.
4. Keyboard stage: closed chrome (bordered surface), hero sizing.
5. Do not build menus yet beyond what’s needed to get controls out of the way (full disclosures = UR3).

### UR3 — Collapsible chrome

1. Header/toolbar cluster: Games (search+selection+layers), Import/Export, Prefs (locale/theme) — patterned after Keybindr’s compact actions, BindScope tokens.
2. Default: disclosures collapsed; keyboard + legend primary.
3. Implement detail as selection-driven drawer/panel per Q3.
4. a11y: `aria-expanded`, focus order, keyboard operability.

### UR4 — Form-factor selector

1. Minimum: `ansi-full` + `ansi-tkl` in data registry; selector in toolbar (not Settings-only).
2. Persist preference; default Full (Q2).
3. Engine already accepts layouts — wire selection into `computeAvailability`.
4. Skip 60%/ISO/ergo in UR4 unless spare capacity; V2 can add.

### UR5 — Mouse visualizer

1. Data-driven mouse SVG beside or below keyboard inside the same visualizer region (CS binds placement: typically right/below on wide layouts; stack under keyboard on narrow).
2. First-class ids + availability (Q1).
3. Same state tokens/cues as keys; detail panel works for mouse targets.
4. Optional show/hide mouse control in prefs/toolbar.
5. Out of scope: bind editing by clicking, vendor mouse catalogs, HOTAS.

---

## 11. Acceptance mapping (UR1 checklist)

| Checklist item | Where answered |
|---|---|
| Shell regions | §3 |
| Keyboard primacy | §3, §4.1, §10 UR2 |
| Free-key look | §5 |
| Menus | §3.3 |
| Layout selector | §4.3, §10 UR4 |
| Mouse | §4.2, §9 Q1, §10 UR5 |
| Adopt/reject table | §6 |
| Open questions | §9 |

---

## 12. Non-goals restated

- Not a Keybindr skin or substitute editor.
- No wiki scraping, backend, accounts, or controller support in this track.
- No app React/CSS implementation in UR1 (docs only).
