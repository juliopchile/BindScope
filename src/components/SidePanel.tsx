import type { ConflictSummary, KeyboardKey } from '../types'
import { KEY_STATE_META } from '../utils/keyStateStyles'
import { bindingChordLabel } from '../utils/keyNormalization'

interface SidePanelProps {
  summary: ConflictSummary
  selectedKey: KeyboardKey | null
}

export function SidePanel({ summary, selectedKey }: SidePanelProps) {
  const selected = selectedKey ? summary.keys.find((item) => item.key === selectedKey) : undefined

  return (
    <aside className="panel flex h-full flex-col p-4" aria-label="Key details panel">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">Details</h2>

      {!selected ? (
        <div className="text-sm text-muted">
          <p>Select a key on the keyboard to inspect bindings across selected profiles.</p>
          <dl className="mt-4 grid grid-cols-2 gap-2 text-xs">
            <div>
              <dt>Free</dt>
              <dd className="text-lg font-semibold text-text">{summary.freeCount}</dd>
            </div>
            <div>
              <dt>Conflicted</dt>
              <dd className="text-lg font-semibold text-text">
                {summary.partialCount + summary.heavyCount}
              </dd>
            </div>
            <div>
              <dt>Reserved</dt>
              <dd className="text-lg font-semibold text-text">{summary.reservedCount}</dd>
            </div>
            <div>
              <dt>Used</dt>
              <dd className="text-lg font-semibold text-text">
                {summary.singleCount + summary.sharedCount}
              </dd>
            </div>
          </dl>
        </div>
      ) : (
        <div className="space-y-3 text-sm">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted">Selected key</p>
            <p className="text-2xl font-semibold">{selected.label}</p>
            <p className="text-muted">{KEY_STATE_META[selected.state].label}</p>
            {selected.reservedReason ? (
              <p className="mt-1 text-xs text-muted">{selected.reservedReason}</p>
            ) : null}
          </div>

          {selected.bindings.length === 0 ? (
            <p className="text-muted">This key is available across all selected profiles.</p>
          ) : (
            <ul className="space-y-2">
              {selected.bindings.map((ref) => (
                <li
                  key={`${ref.profileId}-${ref.binding.action}`}
                  className="rounded-lg bg-surface-2 p-3"
                >
                  <p className="font-medium">{ref.gameName}</p>
                  <p className="text-muted">{ref.profileName}</p>
                  <p className="mt-1">
                    {bindingChordLabel(ref.binding.key, ref.binding.modifiers)} →{' '}
                    {ref.binding.action}
                  </p>
                  {ref.binding.context ? (
                    <p className="text-xs text-muted">Context: {ref.binding.context}</p>
                  ) : null}
                  {ref.binding.notes ? (
                    <p className="text-xs text-muted">{ref.binding.notes}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </aside>
  )
}
