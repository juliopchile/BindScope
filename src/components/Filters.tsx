import type { AvailabilityFilter } from '../types'

interface FiltersProps {
  filters: AvailabilityFilter
  onChange: (filters: AvailabilityFilter) => void
}

const FILTER_OPTIONS: { key: keyof AvailabilityFilter; label: string }[] = [
  { key: 'free', label: 'Free' },
  { key: 'used', label: 'Used' },
  { key: 'reserved', label: 'Reserved' },
  { key: 'conflicted', label: 'Conflicted' },
]

export function Filters({ filters, onChange }: FiltersProps) {
  return (
    <section className="panel p-4" aria-label="Key filters">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">Filters</h2>
      <div className="flex flex-wrap gap-2">
        {FILTER_OPTIONS.map(({ key, label }) => (
          <label key={key} className="chip cursor-pointer">
            <input
              type="checkbox"
              className="accent-accent"
              checked={filters[key]}
              onChange={(event) => onChange({ ...filters, [key]: event.target.checked })}
            />
            {label}
          </label>
        ))}
      </div>
    </section>
  )
}
