import { GAMES_BY_ID } from '../data/catalog'
import { useI18n } from '../i18n/useI18n'
import type { ConflictSummary, KeyboardKey } from '../types'
import { bindingChordLabel } from '../utils/keyNormalization'
import { getKeyStateMeta } from '../ui/keyStateMeta'

interface KeyDetailPanelProps {
  summary: ConflictSummary
  selectedKey: KeyboardKey
  onDismiss?: () => void
}

export function KeyDetailPanel({ summary, selectedKey, onDismiss }: KeyDetailPanelProps) {
  const { t } = useI18n()
  const selected = summary.keys.find((item) => item.key === selectedKey)

  return (
    <aside
      className="key-detail-panel flex h-full flex-col rounded-lg border p-4"
      style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
      aria-label={t('detailHeading')}
    >
      <div className="flex items-start justify-between gap-2">
        <h2
          className="text-xs font-semibold tracking-wide uppercase"
          style={{ color: 'var(--fg-muted)' }}
        >
          {t('detailHeading')}
        </h2>
        {onDismiss ? (
          <button
            type="button"
            onClick={onDismiss}
            className="rounded-md border px-2 py-1 text-xs"
            style={{ borderColor: 'var(--border)', color: 'var(--fg-muted)' }}
          >
            {t('detailDismiss')}
          </button>
        ) : null}
      </div>

      {!selected ? (
        <p className="mt-3 text-sm" style={{ color: 'var(--fg-muted)' }}>
          {t('detailEmpty')}
        </p>
      ) : (
        <SelectedDetail selected={selected} />
      )}
    </aside>
  )
}

function SelectedDetail({ selected }: { selected: NonNullable<ConflictSummary['keys'][number]> }) {
  const { t } = useI18n()
  const meta = getKeyStateMeta(selected.state)

  return (
    <div className="mt-3 space-y-3 text-sm">
      <div>
        <p className="text-3xl font-semibold">{selected.label}</p>
        <p style={{ color: 'var(--fg-muted)' }}>
          {t(meta.labelKey)}
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
          {selected.state === 'reserved' ? t('detailReserved') : t('detailFree')}
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
                    {t('kindTool')}
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
