import { memo } from 'react'
import type { KeyboardLayout, KeyboardKey, KeyAvailability } from '../types'
import { KEY_STATE_META, matchesFilter } from '../utils/keyStateStyles'
import type { AvailabilityFilter } from '../types'

interface KeyboardVisualizerProps {
  layout: KeyboardLayout
  keys: KeyAvailability[]
  filters: AvailabilityFilter
  selectedKey: KeyboardKey | null
  onSelectKey: (key: KeyboardKey) => void
}

const PATTERNS = (
  <defs>
    <pattern id="pattern-free" width="6" height="6" patternUnits="userSpaceOnUse">
      <rect width="6" height="6" fill="transparent" />
    </pattern>
    <pattern id="pattern-single" width="8" height="8" patternUnits="userSpaceOnUse">
      <path d="M0 8 L8 0" stroke="#93c5fd" strokeWidth="1" opacity="0.35" />
    </pattern>
    <pattern id="pattern-shared" width="8" height="8" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1" fill="#67e8f9" opacity="0.5" />
      <circle cx="6" cy="6" r="1" fill="#67e8f9" opacity="0.5" />
    </pattern>
    <pattern id="pattern-partial" width="8" height="8" patternUnits="userSpaceOnUse">
      <path d="M0 4 H8" stroke="#fbbf24" strokeWidth="2" opacity="0.5" />
    </pattern>
    <pattern id="pattern-heavy" width="8" height="8" patternUnits="userSpaceOnUse">
      <path d="M0 0 L8 8 M8 0 L0 8" stroke="#fca5a5" strokeWidth="1.5" opacity="0.55" />
    </pattern>
    <pattern id="pattern-reserved" width="6" height="6" patternUnits="userSpaceOnUse">
      <rect x="0" y="0" width="3" height="3" fill="#d8b4fe" opacity="0.35" />
      <rect x="3" y="3" width="3" height="3" fill="#d8b4fe" opacity="0.35" />
    </pattern>
    <pattern id="pattern-unknown" width="8" height="8" patternUnits="userSpaceOnUse">
      <path d="M0 8 L8 0" stroke="#d1d5db" strokeWidth="1" opacity="0.25" />
      <path d="M0 0 L8 8" stroke="#d1d5db" strokeWidth="1" opacity="0.25" />
    </pattern>
  </defs>
)

function KeyboardVisualizerComponent({
  layout,
  keys,
  filters,
  selectedKey,
  onSelectKey,
}: KeyboardVisualizerProps) {
  const availabilityByKey = new Map(keys.map((item) => [item.key, item]))

  return (
    <div className="overflow-x-auto">
      <svg
        role="img"
        aria-label="Keyboard availability map"
        viewBox={`0 0 ${layout.width} ${layout.height}`}
        className="mx-auto h-auto w-full max-w-5xl"
      >
        {PATTERNS}
        {layout.keys.map((layoutKey) => {
          const availability = availabilityByKey.get(layoutKey.id)
          const state = availability?.state ?? 'free'
          const visible = matchesFilter(state, filters)
          const meta = KEY_STATE_META[state]
          const isSelected = selectedKey === layoutKey.id

          return (
            <g
              key={layoutKey.id}
              opacity={visible ? 1 : 0.2}
              className="cursor-pointer"
              onClick={() => onSelectKey(layoutKey.id)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  onSelectKey(layoutKey.id)
                }
              }}
              tabIndex={0}
              role="button"
              aria-label={`${layoutKey.label} key, ${meta.label}`}
              aria-pressed={isSelected}
            >
              <rect
                x={layoutKey.x}
                y={layoutKey.y}
                width={layoutKey.width}
                height={layoutKey.height}
                rx={6}
                className={`${meta.className} ${isSelected ? 'stroke-accent stroke-[3]' : 'stroke-2'}`}
                fill={`url(#${meta.patternId})`}
              />
              <rect
                x={layoutKey.x}
                y={layoutKey.y}
                width={layoutKey.width}
                height={layoutKey.height}
                rx={6}
                className={`${meta.className} fill-current opacity-80`}
              />
              <text
                x={layoutKey.x + layoutKey.width / 2}
                y={layoutKey.y + layoutKey.height / 2}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-text pointer-events-none select-none text-[11px] font-semibold"
              >
                {layoutKey.label}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

export const KeyboardVisualizer = memo(KeyboardVisualizerComponent)
