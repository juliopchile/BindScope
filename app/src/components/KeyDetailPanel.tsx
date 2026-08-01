import { GAMES_BY_ID } from '../data/catalog'
import { useI18n } from '../i18n/useI18n'
import type { ConflictSummary, KeyboardKey } from '../types'
import { bindingChordLabel } from '../utils/keyNormalization'
import { getKeyStateMeta } from '../ui/keyStateMeta'

interface KeyDetailPanelProps {
  summary: ConflictSummary
  selectedKey: KeyboardKey | null
}

export function KeyDetailPanel({ summary, selectedKey }: KeyDetailPanelProps) {
  const { t } = useI18n()
  const selected = selectedKey ? summary.keys.find((item) => item.key === selectedKey) : undefined

  return (
    <aside
      className="flex h-full flex-col rounded-lg border p-4"
      style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
      aria-label={t('detailHeading')}
    >
      <h2
        className="text-xs font-semibold tracking-wide uppercase"
        style={{ color: 'var(--fg-muted)' }}
      >
        {t('detailHeading')}
      </h2>

      {!selected ? (
        <div className="mt-3 space-y-4 text-sm">
          <p style={{ color: 'var(--fg-muted)' }}>{t('detailEmpty')}</p>
          <dl className="grid grid-cols-2 gap-3">
            <Count label={t('summaryFree')} value={summary.freeCount} />
            <Count label={t('summaryPartial')} value={summary.partialCount} />
            <Count label={t('summaryHeavy')} value={summary.heavyCount} />
            <Count label={t('summaryReserved')} value={summary.reservedCount} />
          </dl>
        </div>
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

function Count({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <dt style={{ color: 'var(--fg-muted)' }}>{label}</dt>
      <dd className="text-xl font-semibold">{value}</dd>
    </div>
  )
}
