import { LAYOUT_IDS } from '../data/keyboardLayouts'
import { useI18n } from '../i18n/useI18n'
import type { LayoutId } from '../types'

interface LayoutSelectorProps {
  value: LayoutId
  onChange: (layoutId: LayoutId) => void
}

const selectClass =
  'min-h-10 min-w-[6.5rem] rounded-md border px-2 py-2 text-sm focus-visible:outline focus-visible:outline-2'

export function LayoutSelector({ value, onChange }: LayoutSelectorProps) {
  const { t } = useI18n()

  return (
    <label
      className="chrome-toolbar__layout flex flex-col gap-1 text-xs"
      style={{ color: 'var(--fg-muted)' }}
    >
      <span className="font-semibold tracking-wide uppercase">{t('layoutLabel')}</span>
      <select
        className={selectClass}
        style={{
          background: 'var(--bg)',
          borderColor: 'var(--border)',
          color: 'var(--fg)',
          outlineColor: 'var(--focus)',
        }}
        value={value}
        onChange={(event) => onChange(event.target.value as LayoutId)}
        aria-label={t('layoutLabel')}
      >
        {LAYOUT_IDS.map((id) => (
          <option key={id} value={id}>
            {layoutOptionLabel(t, id)}
          </option>
        ))}
      </select>
    </label>
  )
}

function layoutOptionLabel(
  t: (key: 'layoutAnsiFull' | 'layoutAnsiTkl') => string,
  id: LayoutId,
): string {
  if (id === 'ansi-tkl') return t('layoutAnsiTkl')
  return t('layoutAnsiFull')
}
