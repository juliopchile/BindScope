import { useI18n } from '../i18n/useI18n'
import { CHORD_MARK, keyHasChordBindings } from '../lib/chords'
import type { KeyAvailability, KeyAvailabilityState, KeyboardKey, KeyboardLayout, LayoutKey } from '../types'
import { isKeyVisible } from '../lib/selection'
import { getKeyStateMeta } from '../ui/keyStateMeta'

interface KeyboardVisualizerProps {
  layout: KeyboardLayout
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

function keyLabelX(layoutKey: LayoutKey): number {
  return layoutKey.labelX ?? layoutKey.x + layoutKey.width / 2
}

function keyLabelY(layoutKey: LayoutKey): number {
  return layoutKey.labelY ?? layoutKey.y + layoutKey.height / 2
}

/** Tallest collision rect (ISO Enter stem) or the bounding box — for chord-mark anchoring. */
function keyStemOrigin(layoutKey: LayoutKey): { x: number; y: number; height: number; width: number } {
  const rects = layoutKey.collisionRects
  if (!rects || rects.length === 0) {
    return { x: layoutKey.x, y: layoutKey.y, width: layoutKey.width, height: layoutKey.height }
  }
  return rects.reduce((best, rect) => (rect.height > best.height ? rect : best))
}

function KeyCapShape({
  layoutKey,
  className,
  strokeWidth,
  selected,
}: {
  layoutKey: LayoutKey
  className?: string
  strokeWidth: number
  selected: boolean
}) {
  const selectedStroke = selected ? { stroke: 'var(--accent)' } : undefined

  if (layoutKey.pathD) {
    return (
      <path
        d={layoutKey.pathD}
        className={className}
        strokeWidth={strokeWidth}
        style={selectedStroke}
      />
    )
  }

  return (
    <rect
      x={layoutKey.x}
      y={layoutKey.y}
      width={layoutKey.width}
      height={layoutKey.height}
      rx={5}
      className={className}
      strokeWidth={strokeWidth}
      style={selectedStroke}
    />
  )
}

export function KeyboardVisualizer({
  layout,
  keys,
  selectedKey,
  onSelectKey,
  activeFilters = new Set(),
  chordsOnly = false,
  showChordMarks = true,
}: KeyboardVisualizerProps) {
  const { t } = useI18n()
  const byKey = new Map(keys.map((item) => [item.key, item]))

  return (
    <div className="w-full overflow-x-auto">
      <svg
        role="group"
        aria-label={t('keyboardAriaLabel')}
        viewBox={`0 0 ${layout.width} ${layout.height}`}
        className="mx-auto block h-auto w-full"
      >
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
          const labelX = keyLabelX(layoutKey)
          const labelY = keyLabelY(layoutKey)
          const stem = keyStemOrigin(layoutKey)

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
              <KeyCapShape
                layoutKey={layoutKey}
                className={meta.fillClass}
                strokeWidth={selected ? 3 : 1.5}
                selected={selected}
              />
              <text
                className="key-label"
                x={labelX}
                y={labelY + (meta.mark || showChord ? 2 : 0)}
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
              {showChord ? (
                <text
                  className="key-chord-mark"
                  x={stem.x + 6}
                  y={stem.y + stem.height - 5}
                  textAnchor="start"
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
