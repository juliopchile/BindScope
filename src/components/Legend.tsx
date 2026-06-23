import { KEY_STATE_META } from '../utils/keyStateStyles'

export function Legend() {
  const items = Object.entries(KEY_STATE_META).filter(([state]) => state !== 'unknown')

  return (
    <section className="panel p-4" aria-label="Keyboard legend">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">Legend</h2>
      <ul className="grid gap-2 sm:grid-cols-2">
        {items.map(([state, meta]) => (
          <li key={state} className="flex items-start gap-3 text-sm">
            <span
              className={`mt-0.5 inline-block h-5 w-8 rounded border ${meta.className}`}
              aria-hidden="true"
            />
            <span>
              <span className="font-medium">{meta.label}</span>
              <span className="block text-xs text-muted">{meta.description}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}
