import { getKeyStateMeta, LEGEND_STATES } from '../ui/keyStateMeta'
import { messages } from '../ui/messages'

export function Legend() {
  return (
    <section aria-label={messages.legendHeading}>
      <h2
        className="mb-2 text-xs font-semibold tracking-wide uppercase"
        style={{ color: 'var(--fg-muted)' }}
      >
        {messages.legendHeading}
      </h2>
      <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
        {LEGEND_STATES.map((state) => {
          const meta = getKeyStateMeta(state)
          return (
            <li key={state} className="flex items-center gap-2">
              <span className={`legend-swatch legend-swatch--${state}`} aria-hidden="true">
                {meta.mark || '·'}
              </span>
              <span>
                <span className="font-medium">{meta.label}</span>
                <span className="ml-1 text-xs" style={{ color: 'var(--fg-muted)' }}>
                  {meta.description}
                </span>
              </span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
