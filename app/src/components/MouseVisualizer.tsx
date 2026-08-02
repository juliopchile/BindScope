import { useI18n } from '../i18n/useI18n'
import { CHORD_MARK, keyHasChordBindings } from '../lib/chords'
import type { KeyAvailability, KeyAvailabilityState, KeyboardKey, MouseLayout } from '../types'
import { isKeyVisible } from '../lib/selection'
import { getKeyStateMeta } from '../ui/keyStateMeta'

interface MouseVisualizerProps {
  layout: MouseLayout
  keys: KeyAvailability[]
  selectedKey: KeyboardKey | null
  onSelectKey: (key: KeyboardKey) => void
  /** Empty set = all states visible. */
  activeFilters?: ReadonlySet<KeyAvailabilityState>
  /** When true, dim keys that have no modifier chords. */
  chordsOnly?: boolean
  /** When true, draw the + chord cue on keys that have chords. */
  showChordMarks?: boolean
}

export function MouseVisualizer({
  layout,
  keys,
  selectedKey,
  onSelectKey,
  activeFilters = new Set(),
  chordsOnly = false,
  showChordMarks = true,
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
          const hasChords = keyHasChordBindings(availability?.bindings ?? [])
          const visible = isKeyVisible(state, hasChords, activeFilters, chordsOnly)
          const showChord = showChordMarks && hasChords
          const stateLabel = t(meta.labelKey)
          const ariaLabel = showChord
            ? `${layoutKey.label}, ${stateLabel}, ${t('chordAriaSuffix')}`
            : `${layoutKey.label}, ${stateLabel}`
          const rx = layoutKey.id.startsWith('Mouse') && layoutKey.width >= 28 ? 8 : 4

          return (
            <g
              key={layoutKey.id}
              role="button"
              tabIndex={visible ? 0 : -1}
              aria-label={ariaLabel}
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
              <text
                className="key-label"
                x={layoutKey.x + layoutKey.width / 2}
                y={layoutKey.y + layoutKey.height / 2 + (meta.mark || showChord ? 2 : 0)}
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
              {showChord ? (
                <text
                  className="key-chord-mark"
                  x={layoutKey.x + 4}
                  y={layoutKey.y + layoutKey.height - 3}
                  textAnchor="start"
                  fontSize={10}
                >
                  {CHORD_MARK}
                </text>
              ) : null}
            </g>
          )
        })}
      </svg>
    </div>
  )
}
