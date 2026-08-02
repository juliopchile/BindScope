# Styles

Visual design tokens and UI conventions for BindScope. Update this file when tokens, key-state
cues, or breakpoints change.

## Design direction (UI Refresh)

UI Refresh UR1–UR5 is **complete**. Decision: **D13**. Competitive brief: `docs/keybindr-analysis.md`.
Closed-track summary: `PLAN.md`.

### Shell hierarchy & chrome (UR3–UR5 shipped)

| Topic | Direction |
|---|---|
| Hierarchy | Header (brand + action cluster) → keyboard/mouse stage (+ selection detail) |
| Open chrome | Brand, tagline; visible layout selector; compact toolbar triggers (Games, Import / Export, Preferences) |
| Closed chrome | Devices sit in a bordered `.keyboard-stage` surface |
| Controls | Exclusive header disclosures via `ChromeToolbar` — collapsed by default |
| Detail panel | Selection-driven; beside stage on desktop; bottom drawer + backdrop on phone |
| Density | Slim legend + availability counts under the devices; heavy controls off the critical path |

### Overflow & breakpoints

| Class | Width | Layout intent |
|---|---|---|
| Phone | `< 1024px` | Single column; visualizer full width; chrome panels under header; detail as bottom drawer |
| Desktop | `≥ 1024px` (`lg`) | Visualizer-dominant; detail beside stage only when a key is selected |
| Wide target | `≥ 1280px` | ANSI full (alpha + nav + numpad) fully visible without horizontal clipping |

- Content column / stage: `max-width: 1400px`.
- SVG: `width: 100%` + layout `viewBox`; **no** artificial SVG max-width cap.
- Horizontal scroll only as last resort on very narrow widths (`overflow-x-auto` wrapper).
- Do **not** auto-switch form factor on resize. User preference wins (UR4 shipped).

### Free-key tokens (UR2 shipped)

| Theme | `--key-free-bg` | `--key-free-border` |
|---|---|---|
| Light | `transparent` | `#a1a1aa` (muted gray) |
| Dark | `#27272a` (recessive gray) | `#52525b` |
| System | Follows active light/dark computed theme | same |

Occupied / conflicted / reserved stay emphatic. Free recedes. D11 marks/patterns/text remain for every
state (free uses legend `·` only; no on-key mark).

### Panel / disclosure rules (UR3 shipped)

| Panel / group | Default | Opens when |
|---|---|---|
| Games (search + selection + layers) | Collapsed | User opens **Games** in the header toolbar |
| Import / export / safe-key | Collapsed | User opens **Import / Export** |
| Locale + theme + show mouse | Collapsed | User opens **Preferences** |
| Keyboard form factor | Visible | Header toolbar select (Full / TKL); persists `bindscope.layout` |
| Key/mouse detail | Collapsed | User selects a key or mouse button; Close / backdrop / re-click dismisses |
| Legend + availability summary | Visible (slim) | Always under the device stage |

Toolbar behaviour:

- Exclusive open: only one chrome panel at a time.
- Triggers use `aria-expanded`, `aria-controls`, `aria-haspopup="true"`.
- Escape closes the open panel and returns focus to its trigger; pointer-down outside closes.
- Games trigger may show a selected-count badge.
- Open panel is a full-width region under the header row (scrolls internally if tall).

### Devices (UR4–UR5 shipped)

| Topic | Direction |
|---|---|
| Form factor | Toolbar selector: ANSI Full (default) + TKL; persist `localStorage` (`bindscope.layout`); no auto-switch on resize |
| Mouse | Data-driven SVG beside keyboard on `lg+`, stacked below on narrow; CS-binds placement pattern |
| Mouse ids | Canonical `Mouse1`…`Mouse5`, `WheelUp`, `WheelDown` in normalization; first-class via `deviceLayouts` |
| Mouse chrome | Preferences “Show mouse” (`bindscope.showMouse`, default on); same free/partial/heavy/reserved tokens as keys |

### Explicit non-copies (D13)

Do not ship Keybindr Inter/Fira-only stacks, gold-on-black identity, dark-only mode, bind-editor
modals, or category-color-as-primary-state. BindScope tokens, i18n, and occupancy semantics stay.

## Theme

Appearance is driven by CSS custom properties in `app/src/styles/index.css`. The active mode is
`html[data-theme="light"|"dark"|"system"]`, set by `app/src/lib/theme.ts` and the Preferences panel.
Preference persists in `localStorage` (`bindscope.theme`). `app/src/boot.ts` applies the stored
value before React mounts.

| Mode | How it works |
|---|---|
| Light | Forced light token set |
| Dark | Forced dark token set |
| System (default) | Follows `prefers-color-scheme` |

Do not scatter raw colors in components. Consume tokens (`var(--bg)`, `var(--key-free-bg)`, …).

## Key-state cues (D11)

State is never conveyed by color alone. Every state uses color **and** a mark / pattern / text label.

| State | Mark | Pattern | Token pair |
|---|---|---|---|
| Free | · (legend only) | none | `--key-free-*` (neutral / transparent — not green) |
| Partial | ≈ | horizontal lines | `--key-partial-*` |
| Heavy | ! | diagonal cross | `--key-heavy-*` |
| Reserved | × | checker | `--key-reserved-*` |
| Unknown | ? | light diagonal | `--key-unknown-*` |

Chord occupancy (modifier+key) is an **additive cue**, not a new availability state. Keys with at
least one chord binding show a bottom-left `+` mark (`.key-chord-mark`) when “Show chord marks” is
on. The legend’s **Chords** control filters to those keys only (dims the rest). Detail groups bare
vs chord bindings. Bare-key availability scoring is unchanged.

| Cue | Mark | Where |
|---|---|---|
| Has modifier chords | + | Bottom-left of key / mouse control; legend swatch (dashed accent) |

Meta lives in `app/src/ui/keyStateMeta.ts`. Chord helpers live in `app/src/lib/chords.ts`. Aria
labels include the state name and, when relevant, a chord suffix.

## Breakpoints

| Class | Width | Layout intent |
|---|---|---|
| Phone | `< 1024px` | Keyboard stage; mouse stacks under keyboard; detail as fixed bottom drawer when selected; chrome in header disclosures |
| Desktop | `≥ 1024px` (`lg`) | Keyboard + mouse side-by-side in stage; detail beside stage only when selected |
| Wide | `≥ 1280px` | ANSI full fits without clipping inside the 1400px column |

The SVG keyboard uses a `viewBox` from layout data and `width: 100%` so it scales with its
container.

## Components

- Toolbar: `app/src/components/ChromeToolbar.tsx` — exclusive header disclosures + visible layout select
- Layout selector: `app/src/components/LayoutSelector.tsx` — Full / TKL; preference via `lib/preferences.ts`
- Keyboard: `app/src/components/KeyboardVisualizer.tsx` — data-driven from `KeyboardLayout`; dims
  keys whose state is filtered out via the legend; optional `+` chord marks
- Mouse: `app/src/components/MouseVisualizer.tsx` — data-driven from `MouseLayout` (`data/mouseLayout.ts`);
  same key-state fill/pattern/mark tokens as keyboard; selectable buttons share the detail panel
- Detail: `app/src/components/KeyDetailPanel.tsx` — selection-driven; bare vs chord binding groups
- Legend: `app/src/components/Legend.tsx` — toggles state filters + chords-only filter
- Search / selection: `GameSearch.tsx`, `SelectedGames.tsx` (inside Games disclosure)
- Profile IO: `ProfileIO.tsx` (inside Import / Export disclosure)
- Prefs: `PrefsControls.tsx` — locale + theme + show mouse + show chord marks (Preferences disclosure)
- Chrome copy: locale catalogs in `app/src/i18n/locales/` via `useI18n()`

## Design rules

- Clean, high-contrast, minimal. The keyboard should look like a keyboard.
- Obvious hover/focus/selected states; visible `:focus-visible`.
- No gratuitous animation or flashy branding.
- Free keys must read as neutral/recessive, never traffic-light green.
