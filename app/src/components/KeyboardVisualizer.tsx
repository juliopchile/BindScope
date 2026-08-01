import type { KeyAvailability, KeyAvailabilityState, KeyboardKey, KeyboardLayout } from '../types'
import { isStateVisible } from '../lib/selection'
import { getKeyStateMeta } from '../ui/keyStateMeta'
import { messages } from '../ui/messages'

interface KeyboardVisualizerProps {
  layout: KeyboardLayout
  keys: KeyAvailability[]
  selectedKey: KeyboardKey | null
  onSelectKey: (key: KeyboardKey) => void
  /** Empty set = all states visible. */
  activeFilters?: ReadonlySet<KeyAvailabilityState>
}

function KeyPatterns() {
  return (
    <defs>
      <pattern id="pattern-free" width="8" height="8" patternUnits="userSpaceOnUse">
        <rect width="8" height="8" fill="transparent" />
      </pattern>
      <pattern id="pattern-partial" width="8" height="8" patternUnits="userSpaceOnUse">
        <path d="M0 4 H8" className="pattern-stroke" strokeWidth="2" opacity="0.45" />
      </pattern>
      <pattern id="pattern-heavy" width="8" height="8" patternUnits="userSpaceOnUse">
        <path d="M0 0 L8 8 M8 0 L0 8" className="pattern-stroke" strokeWidth="1.5" opacity="0.5" />
      </pattern>
      <pattern id="pattern-reserved" width="6" height="6" patternUnits="userSpaceOnUse">
        <path
          d="M0 0 H3 V3 H0 Z M3 3 H6 V6 H3 Z"
          className="pattern-stroke"
          fill="var(--pattern-stroke)"
          opacity="0.3"
        />
      </pattern>
      <pattern id="pattern-unknown" width="8" height="8" patternUnits="userSpaceOnUse">
        <path d="M0 8 L8 0" className="pattern-stroke" strokeWidth="1" opacity="0.3" />
      </pattern>
    </defs>
  )
}

export function KeyboardVisualizer({
  layout,
  keys,
  selectedKey,
  onSelectKey,
  activeFilters = new Set(),
}: KeyboardVisualizerProps) {
  const byKey = new Map(keys.map((item) => [item.key, item]))

  return (
    <div className="w-full overflow-x-auto">
      <svg
        role="group"
        aria-label={messages.keyboardAriaLabel}
        viewBox={`0 0 ${layout.width} ${layout.height}`}
        className="mx-auto h-auto w-full min-w-[320px] max-w-5xl"
      >
        <KeyPatterns />
        {layout.keys.map((layoutKey) => {
          const availability = byKey.get(layoutKey.id)
          const state = availability?.state ?? 'free'
          const meta = getKeyStateMeta(state)
          const selected = selectedKey === layoutKey.id
          const visible = isStateVisible(state, activeFilters)

          return (
            <g
              key={layoutKey.id}
              role="button"
              tabIndex={visible ? 0 : -1}
              aria-label={`${layoutKey.label}, ${meta.label}`}
              aria-pressed={selected}
              aria-hidden={!visible}
              className={visible ? 'cursor-pointer' : 'pointer-events-none'}
              opacity={visible ? 1 : 0.18}
              onClick={() => onSelectKey(layoutKey.id)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  onSelectKey(layoutKey.id)
                }
              }}
            >
              <rect
                x={layoutKey.x}
                y={layoutKey.y}
                width={layoutKey.width}
                height={layoutKey.height}
                rx={5}
                className={meta.fillClass}
                strokeWidth={selected ? 3 : 1.5}
                style={selected ? { stroke: 'var(--accent)' } : undefined}
              />
              <rect
                x={layoutKey.x}
                y={layoutKey.y}
                width={layoutKey.width}
                height={layoutKey.height}
                rx={5}
                fill={`url(#${meta.patternId})`}
                stroke="none"
                pointerEvents="none"
              />
              <text
                className="key-label"
                x={layoutKey.x + layoutKey.width / 2}
                y={layoutKey.y + layoutKey.height / 2 + (meta.mark ? 2 : 0)}
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {layoutKey.label}
              </text>
              {meta.mark ? (
                <text
                  className="key-mark"
                  x={layoutKey.x + layoutKey.width - 6}
                  y={layoutKey.y + 12}
                  textAnchor="end"
                >
                  {meta.mark}
                </text>
              ) : null}
            </g>
          )
        })}
      </svg>
    </div>
  )
}
