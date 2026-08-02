import { useI18n } from '../i18n/useI18n'
import type { KeyAvailability, KeyAvailabilityState, KeyboardKey, MouseLayout } from '../types'
import { isStateVisible } from '../lib/selection'
import { getKeyStateMeta } from '../ui/keyStateMeta'

interface MouseVisualizerProps {
  layout: MouseLayout
  keys: KeyAvailability[]
  selectedKey: KeyboardKey | null
  onSelectKey: (key: KeyboardKey) => void
  /** Empty set = all states visible. */
  activeFilters?: ReadonlySet<KeyAvailabilityState>
}

function MousePatterns() {
  return (
    <defs>
      <pattern id="mouse-pattern-free" width="8" height="8" patternUnits="userSpaceOnUse">
        <rect width="8" height="8" fill="transparent" />
      </pattern>
      <pattern id="mouse-pattern-partial" width="8" height="8" patternUnits="userSpaceOnUse">
        <path d="M0 4 H8" className="pattern-stroke" strokeWidth="2" opacity="0.45" />
      </pattern>
      <pattern id="mouse-pattern-heavy" width="8" height="8" patternUnits="userSpaceOnUse">
        <path d="M0 0 L8 8 M8 0 L0 8" className="pattern-stroke" strokeWidth="1.5" opacity="0.5" />
      </pattern>
      <pattern id="mouse-pattern-reserved" width="6" height="6" patternUnits="userSpaceOnUse">
        <path
          d="M0 0 H3 V3 H0 Z M3 3 H6 V6 H3 Z"
          className="pattern-stroke"
          fill="var(--pattern-stroke)"
          opacity="0.3"
        />
      </pattern>
      <pattern id="mouse-pattern-unknown" width="8" height="8" patternUnits="userSpaceOnUse">
        <path d="M0 8 L8 0" className="pattern-stroke" strokeWidth="1" opacity="0.3" />
      </pattern>
    </defs>
  )
}

function patternIdFor(state: KeyAvailabilityState): string {
  return `mouse-${getKeyStateMeta(state).patternId}`
}

export function MouseVisualizer({
  layout,
  keys,
  selectedKey,
  onSelectKey,
  activeFilters = new Set(),
}: MouseVisualizerProps) {
  const { t } = useI18n()
  const byKey = new Map(keys.map((item) => [item.key, item]))

  return (
    <div className="w-full">
      <svg
        role="group"
        aria-label={t('mouseAriaLabel')}
        viewBox={`0 0 ${layout.width} ${layout.height}`}
        className="mx-auto block h-auto w-full max-w-[180px]"
      >
        <MousePatterns />

        {/* Body outline — decorative, not selectable */}
        <path
          d="M 30 18
             C 30 8, 110 8, 110 18
             L 118 100
             C 122 150, 118 210, 70 228
             C 22 210, 18 150, 22 100
             Z"
          fill="var(--bg)"
          stroke="var(--border)"
          strokeWidth="2"
          pointerEvents="none"
        />

        {layout.keys.map((layoutKey) => {
          const availability = byKey.get(layoutKey.id)
          const state = availability?.state ?? 'free'
          const meta = getKeyStateMeta(state)
          const selected = selectedKey === layoutKey.id
          const visible = isStateVisible(state, activeFilters)
          const rx = layoutKey.id.startsWith('Mouse') && layoutKey.width >= 28 ? 8 : 4

          return (
            <g
              key={layoutKey.id}
              role="button"
              tabIndex={visible ? 0 : -1}
              aria-label={`${layoutKey.label}, ${t(meta.labelKey)}`}
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
                rx={rx}
                className={meta.fillClass}
                strokeWidth={selected ? 3 : 1.5}
                style={selected ? { stroke: 'var(--accent)' } : undefined}
              />
              <rect
                x={layoutKey.x}
                y={layoutKey.y}
                width={layoutKey.width}
                height={layoutKey.height}
                rx={rx}
                fill={`url(#${patternIdFor(state)})`}
                stroke="none"
                pointerEvents="none"
              />
              <text
                className="key-label"
                x={layoutKey.x + layoutKey.width / 2}
                y={layoutKey.y + layoutKey.height / 2 + (meta.mark ? 2 : 0)}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={layoutKey.width < 22 ? 9 : 12}
              >
                {layoutKey.label}
              </text>
              {meta.mark ? (
                <text
                  className="key-mark"
                  x={layoutKey.x + layoutKey.width - 4}
                  y={layoutKey.y + 10}
                  textAnchor="end"
                  fontSize={10}
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
