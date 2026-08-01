# Styles

Visual design tokens and UI conventions for BindScope. Update this file when tokens, key-state
cues, or breakpoints change.

## Design direction (planned — UI Refresh)

Active plan: `PLAN.md` (phases UR2–UR5). Decision: **D13**. Competitive brief:
`docs/keybindr-analysis.md` (UR1 complete). Intents below are locked for implementation; UR2+
replaces the MVP defaults in **Theme** / **Key-state cues** / **Breakpoints** as each phase ships.

### Shell hierarchy & chrome

| Topic | Planned direction |
|---|---|
| Hierarchy | Header → keyboard (± mouse) stage → slim legend/summary; selection/IO/prefs in collapsible menus |
| Open chrome | Brand, short status, legend — no heavy card wrappers |
| Closed chrome | Keyboard/mouse visualizer sits in a bordered “stage” surface (Keybindr-like containment, BindScope tokens) |
| Header actions | Compact cluster: Games, Import/Export, Prefs (pattern from Keybindr; not their gold/black brand) |
| Detail panel | Collapsed by default; opens on key/mouse selection (desktop side drawer/panel; phone bottom drawer) |
| Density | Tighter gaps/padding than MVP card stack; avoid always-open tall control columns above the keyboard |

### Overflow & breakpoints (planned)

| Class | Width | Layout intent |
|---|---|---|
| Phone | `< 1024px` | Single column; visualizer full width; controls in disclosures; detail as drawer on selection |
| Desktop | `≥ 1024px` | Visualizer-dominant row; disclosures in header/toolbar; detail drawer/panel only when selected |
| Wide target | `≥ 1280px` | ANSI full (alpha + nav + numpad) fully visible without horizontal clipping |

- Content column / stage: aim ~`max-width: 1400px` (Keybindr reference), not MVP `max-w-5xl` on the SVG.
- SVG: `width: 100%` + layout `viewBox`; remove artificial SVG max-width caps that clip the numpad.
- Horizontal scroll only as last resort on very narrow widths when even TKL cannot fit labels comfortably.
- Do **not** auto-switch form factor on resize (reject Keybindr’s force-`layout-60` ≤768px). User preference wins.

### Free-key token intent (UR2)

| Theme | Intent |
|---|---|
| Light | `--key-free-bg` transparent or near-surface gray; `--key-free-border` muted gray (not green) |
| Dark | Recessive dark gray fill (Keybindr-like ~`#2a2a2a` *feel*, BindScope tokenized); muted stroke/label |
| System | Follows active light/dark computed theme |

Keep D11 marks/patterns/text for every state. Occupied/conflicted/reserved stay emphatic; free recedes.
Update legend copy if “free” previously implied “go/green”.

### Panel collapse rules (UR3)

| Panel / group | Default | Opens when |
|---|---|---|
| Game search + selection + layers | Collapsed | User opens “Games” (or equivalent) disclosure |
| Import / export / safe-key | Collapsed | User opens Import/Export menu |
| Locale + theme prefs | Collapsed or header icon menu | User opens Prefs |
| Key/mouse detail | Collapsed | User selects a key or mouse button; closes on dismiss/deselect |
| Legend + availability summary | Visible (slim) | Always available; may wrap on phone without stealing hero space |

All disclosures: keyboard/pointer/touch operable; visible `:focus-visible`; `aria-expanded` + labelled controls.

### Devices (UR4–UR5)

| Topic | Planned direction |
|---|---|
| Form factor | Toolbar selector: at least Full + TKL; persist `localStorage`; default ANSI Full |
| Mouse | Data-driven SVG beside/below keyboard in the same stage; CS-binds placement pattern |
| Mouse ids | Canonical `Mouse1`…`Mouse5` (+ wheel if needed) in normalization; first-class in availability |
| Mouse chrome | Optional show/hide; same free/partial/heavy/reserved token language as keys |

### Explicit non-copies (D13)

Do not ship Keybindr Inter/Fira-only stacks, gold-on-black identity, dark-only mode, bind-editor
modals, or category-color-as-primary-state. BindScope tokens, i18n, and occupancy semantics stay.

Until UR2 lands, the **Theme** / **Key-state cues** / **Breakpoints** sections below still describe the
current MVP.

## Theme

Appearance is driven by CSS custom properties in `app/src/styles/index.css`. The active mode is
`html[data-theme="light"|"dark"|"system"]`, set by `app/src/lib/theme.ts` and the header switcher.
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
| Free | · (legend only) | none | `--key-free-*` |
| Partial | ≈ | horizontal lines | `--key-partial-*` |
| Heavy | ! | diagonal cross | `--key-heavy-*` |
| Reserved | × | checker | `--key-reserved-*` |
| Unknown | ? | light diagonal | `--key-unknown-*` |

Meta lives in `app/src/ui/keyStateMeta.ts`. Aria labels include the state name.

## Breakpoints

| Class | Width | Layout intent |
|---|---|---|
| Phone | `< 1024px` | Single column: keyboard, then detail |
| Desktop | `≥ 1024px` (`lg`) | Keyboard + detail side by side |

The SVG keyboard uses a `viewBox` from layout data and `width: 100%` so it scales with its
container. Horizontal scroll is allowed as a last resort via `min-w-[320px]` on the SVG.

## Components

- Keyboard: `app/src/components/KeyboardVisualizer.tsx` — data-driven from `KeyboardLayout`; dims
  keys whose state is filtered out via the legend
- Detail: `app/src/components/KeyDetailPanel.tsx`
- Legend: `app/src/components/Legend.tsx` — toggles state filters
- Search / selection: `GameSearch.tsx`, `SelectedGames.tsx`
- Prefs: `PrefsControls.tsx` — locale + theme selects
- Chrome copy: locale catalogs in `app/src/i18n/locales/` via `useI18n()`

## Design rules

- Clean, high-contrast, minimal. The keyboard should look like a keyboard.
- Obvious hover/focus/selected states; visible `:focus-visible`.
- No gratuitous animation or flashy branding.
