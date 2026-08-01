# Styles

Visual design tokens and UI conventions for BindScope. Update this file when tokens, key-state
cues, or breakpoints change.

## Design direction (UI Refresh)

Active plan: `PLAN.md` (UR2 complete; UR3–UR5 pending). Decision: **D13**. Competitive brief:
`docs/keybindr-analysis.md`.

### Shell hierarchy & chrome (UR2 shipped)

| Topic | Direction |
|---|---|
| Hierarchy | Header → keyboard stage (+ selection detail) → collapsed Games & tools rail |
| Open chrome | Brand, tagline, prefs — no heavy card wrappers above the keyboard |
| Closed chrome | Keyboard sits in a bordered `.keyboard-stage` surface |
| Controls | Minimal `<details>` rail below the stage (full disclosure/menu system = UR3) |
| Detail panel | Selection-driven; opens beside the stage on desktop when a key is selected; dismiss clears selection |
| Density | Slim legend + availability counts under the keyboard; controls off the critical path by default |

### Overflow & breakpoints (UR2 shipped)

| Class | Width | Layout intent |
|---|---|---|
| Phone | `< 1024px` | Single column; visualizer full width; controls in collapsed rail; detail stacks under keyboard when selected |
| Desktop | `≥ 1024px` (`lg`) | Visualizer-dominant; detail beside stage only when a key is selected |
| Wide target | `≥ 1280px` | ANSI full (alpha + nav + numpad) fully visible without horizontal clipping |

- Content column / stage: `max-width: 1400px`.
- SVG: `width: 100%` + layout `viewBox`; **no** artificial SVG max-width cap (removed MVP `max-w-5xl`).
- Horizontal scroll only as last resort on very narrow widths (`overflow-x-auto` wrapper).
- Do **not** auto-switch form factor on resize. User preference wins (UR4).

### Free-key tokens (UR2 shipped)

| Theme | `--key-free-bg` | `--key-free-border` |
|---|---|---|
| Light | `transparent` | `#a1a1aa` (muted gray) |
| Dark | `#27272a` (recessive gray) | `#52525b` |
| System | Follows active light/dark computed theme | same |

Occupied / conflicted / reserved stay emphatic. Free recedes. D11 marks/patterns/text remain for every
state (free uses legend `·` only; no on-key mark).

### Panel collapse rules (UR3 planned)

| Panel / group | Default | Opens when |
|---|---|---|
| Game search + selection + layers | Collapsed (UR2: native `<details>`) | User opens “Games & tools” |
| Import / export / safe-key | Inside same rail for now | Same disclosure (UR3 may split) |
| Locale + theme prefs | Header | Always in header |
| Key/mouse detail | Collapsed | User selects a key; Close / re-click dismisses |
| Legend + availability summary | Visible (slim) | Always under keyboard |

UR3 will replace the minimal rail with denser header/toolbar disclosures (`aria-expanded`, focus order).

### Devices (UR4–UR5 planned)

| Topic | Planned direction |
|---|---|
| Form factor | Toolbar selector: at least Full + TKL; persist `localStorage`; default ANSI Full |
| Mouse | Data-driven SVG beside/below keyboard in the same stage; CS-binds placement pattern |
| Mouse ids | Canonical `Mouse1`…`Mouse5` (+ wheel if needed) in normalization; first-class in availability |
| Mouse chrome | Optional show/hide; same free/partial/heavy/reserved token language as keys |

### Explicit non-copies (D13)

Do not ship Keybindr Inter/Fira-only stacks, gold-on-black identity, dark-only mode, bind-editor
modals, or category-color-as-primary-state. BindScope tokens, i18n, and occupancy semantics stay.

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
| Free | · (legend only) | none | `--key-free-*` (neutral / transparent — not green) |
| Partial | ≈ | horizontal lines | `--key-partial-*` |
| Heavy | ! | diagonal cross | `--key-heavy-*` |
| Reserved | × | checker | `--key-reserved-*` |
| Unknown | ? | light diagonal | `--key-unknown-*` |

Meta lives in `app/src/ui/keyStateMeta.ts`. Aria labels include the state name.

## Breakpoints

| Class | Width | Layout intent |
|---|---|---|
| Phone | `< 1024px` | Single column: keyboard stage, then detail (when selected), then controls rail |
| Desktop | `≥ 1024px` (`lg`) | Keyboard stage full width; detail beside stage only when selected |
| Wide | `≥ 1280px` | ANSI full fits without clipping inside the 1400px column |

The SVG keyboard uses a `viewBox` from layout data and `width: 100%` so it scales with its
container.

## Components

- Keyboard: `app/src/components/KeyboardVisualizer.tsx` — data-driven from `KeyboardLayout`; dims
  keys whose state is filtered out via the legend
- Detail: `app/src/components/KeyDetailPanel.tsx` — selection-driven; optional dismiss
- Legend: `app/src/components/Legend.tsx` — toggles state filters
- Search / selection: `GameSearch.tsx`, `SelectedGames.tsx` (inside collapsed controls rail)
- Prefs: `PrefsControls.tsx` — locale + theme selects
- Chrome copy: locale catalogs in `app/src/i18n/locales/` via `useI18n()`

## Design rules

- Clean, high-contrast, minimal. The keyboard should look like a keyboard.
- Obvious hover/focus/selected states; visible `:focus-visible`.
- No gratuitous animation or flashy branding.
- Free keys must read as neutral/recessive, never traffic-light green.
