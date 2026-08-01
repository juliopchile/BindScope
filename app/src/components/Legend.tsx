import { useI18n } from '../i18n/useI18n'
import type { KeyAvailabilityState } from '../types'
import { getKeyStateMeta, LEGEND_STATES } from '../ui/keyStateMeta'

interface LegendProps {
  /** Active filter states. Empty set = show all. */
  activeFilters: ReadonlySet<KeyAvailabilityState>
  onToggleFilter: (state: KeyAvailabilityState) => void
}

export function Legend({ activeFilters, onToggleFilter }: LegendProps) {
  const { t } = useI18n()
  const showAll = activeFilters.size === 0

  return (
    <section aria-label={t('legendHeading')}>
      <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
        <h2
          className="text-xs font-semibold tracking-wide uppercase"
          style={{ color: 'var(--fg-muted)' }}
        >
          {t('legendHeading')}
        </h2>
        <p className="text-xs" style={{ color: 'var(--fg-muted)' }}>
          {t('filterHint')}
        </p>
      </div>
      <ul className="flex flex-wrap gap-x-3 gap-y-2 text-sm">
        {LEGEND_STATES.map((state) => {
          const meta = getKeyStateMeta(state)
          const active = showAll || activeFilters.has(state)
          return (
            <li key={state}>
              <button
                type="button"
                aria-pressed={active}
                onClick={() => onToggleFilter(state)}
                className="flex min-h-10 items-center gap-2 rounded-md border px-2 py-1.5 focus-visible:outline focus-visible:outline-2"
                style={{
                  borderColor: active ? 'var(--accent)' : 'var(--border)',
                  background: 'var(--bg)',
                  opacity: active ? 1 : 0.45,
                }}
              >
                <span className={`legend-swatch legend-swatch--${state}`} aria-hidden="true">
                  {meta.mark || '·'}
                </span>
                <span>
                  <span className="font-medium">{t(meta.labelKey)}</span>
                  <span className="ml-1 text-xs" style={{ color: 'var(--fg-muted)' }}>
                    {t(meta.descriptionKey)}
                  </span>
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
