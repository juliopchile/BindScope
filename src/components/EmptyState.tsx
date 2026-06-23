interface EmptyStateProps {
  onReset: () => void
}

export function EmptyState({ onReset }: EmptyStateProps) {
  return (
    <section className="panel flex flex-col items-center justify-center gap-3 p-10 text-center">
      <h2 className="text-xl font-semibold">Start by selecting games</h2>
      <p className="max-w-xl text-sm text-muted">
        Search for one or more games, toggle their input profiles, and BindScope will overlay
        bindings to highlight free keys, conflicts, and OS-reserved shortcuts.
      </p>
      <button type="button" className="btn" onClick={onReset}>
        Clear workspace
      </button>
    </section>
  )
}
