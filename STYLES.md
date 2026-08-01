# Styles

Visual design tokens and UI conventions for BindScope. Update this file when tokens, key-state
cues, or breakpoints change.

## Theme

Appearance is driven by CSS custom properties in `app/src/styles/index.css`.

| Mode | How it works today |
|---|---|
| System | Follows `prefers-color-scheme` (light / dark token sets) |
| Light / Dark override | Stage 5 — user switch + local persistence |

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

- Keyboard: `app/src/components/KeyboardVisualizer.tsx` — data-driven from `KeyboardLayout`
- Detail: `app/src/components/KeyDetailPanel.tsx`
- Legend: `app/src/components/Legend.tsx`
- Chrome copy: `app/src/ui/messages.ts` (extractable for i18n)

## Design rules

- Clean, high-contrast, minimal. The keyboard should look like a keyboard.
- Obvious hover/focus/selected states; visible `:focus-visible`.
- No gratuitous animation or flashy branding.
