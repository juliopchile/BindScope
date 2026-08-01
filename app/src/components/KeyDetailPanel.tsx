import { GAMES_BY_ID } from '../data/catalog'
import type { ConflictSummary, KeyboardKey } from '../types'
import { bindingChordLabel } from '../utils/keyNormalization'
import { getKeyStateMeta } from '../ui/keyStateMeta'
import { messages } from '../ui/messages'

interface KeyDetailPanelProps {
  summary: ConflictSummary
  selectedKey: KeyboardKey | null
}

export function KeyDetailPanel({ summary, selectedKey }: KeyDetailPanelProps) {
  const selected = selectedKey ? summary.keys.find((item) => item.key === selectedKey) : undefined

  return (
    <aside
      className="flex h-full flex-col rounded-lg border p-4"
      style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
      aria-label={messages.detailHeading}
    >
      <h2
        className="text-xs font-semibold tracking-wide uppercase"
        style={{ color: 'var(--fg-muted)' }}
      >
        {messages.detailHeading}
      </h2>

      {!selected ? (
        <div className="mt-3 space-y-4 text-sm">
          <p style={{ color: 'var(--fg-muted)' }}>{messages.detailEmpty}</p>
          <dl className="grid grid-cols-2 gap-3">
            <Count label={messages.summaryFree} value={summary.freeCount} />
            <Count label={messages.summaryPartial} value={summary.partialCount} />
            <Count label={messages.summaryHeavy} value={summary.heavyCount} />
            <Count label={messages.summaryReserved} value={summary.reservedCount} />
          </dl>
        </div>
      ) : (
        <SelectedDetail selected={selected} />
      )}
    </aside>
  )
}

function SelectedDetail({ selected }: { selected: NonNullable<ConflictSummary['keys'][number]> }) {
  const meta = getKeyStateMeta(selected.state)

  return (
    <div className="mt-3 space-y-3 text-sm">
      <div>
        <p className="text-3xl font-semibold">{selected.label}</p>
        <p style={{ color: 'var(--fg-muted)' }}>
          {meta.label}
          {meta.mark ? ` ${meta.mark}` : ''}
        </p>
        {selected.reservedReason ? (
          <p className="mt-1 text-xs" style={{ color: 'var(--fg-muted)' }}>
            {selected.reservedReason}
          </p>
        ) : null}
      </div>

      {selected.bindings.length === 0 ? (
        <p style={{ color: 'var(--fg-muted)' }}>
          {selected.state === 'reserved' ? messages.detailReserved : messages.detailFree}
        </p>
      ) : (
        <ul className="space-y-2">
          {selected.bindings.map((ref) => (
            <li
              key={`${ref.profileId}-${ref.binding.action}-${ref.binding.modifiers?.join('+') ?? ''}`}
              className="rounded-md border p-3"
              style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}
            >
              <p className="font-medium">
                {ref.gameName}
                {GAMES_BY_ID[ref.gameId]?.kind === 'tool' ? (
                  <span className="ml-2 text-xs font-normal" style={{ color: 'var(--fg-muted)' }}>
                    {messages.kindTool}
                  </span>
                ) : null}
              </p>
              <p className="text-xs" style={{ color: 'var(--fg-muted)' }}>
                {ref.profileName}
                {ref.binding.context ? ` · ${ref.binding.context}` : ''}
              </p>
              <p className="mt-1">
                {bindingChordLabel(ref.binding.key, ref.binding.modifiers)} → {ref.binding.action}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function Count({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <dt style={{ color: 'var(--fg-muted)' }}>{label}</dt>
      <dd className="text-xl font-semibold">{value}</dd>
    </div>
  )
}
