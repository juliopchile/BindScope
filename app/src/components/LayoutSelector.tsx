import { LAYOUT_IDS } from '../data/keyboardLayouts'
import { useI18n } from '../i18n/useI18n'
import type { MessageKey } from '../i18n'
import type { LayoutId } from '../types'

interface LayoutSelectorProps {
  value: LayoutId
  onChange: (layoutId: LayoutId) => void
}

const LAYOUT_LABEL_KEYS: Record<LayoutId, MessageKey> = {
  'ansi-full': 'layoutAnsiFull',
  'ansi-tkl': 'layoutAnsiTkl',
  'ansi-60': 'layoutAnsi60',
  'iso-full': 'layoutIsoFull',
}

const selectClass =
  'chrome-toolbar__layout min-h-10 min-w-[7.5rem] rounded-md border py-2 pl-3 text-sm focus-visible:outline focus-visible:outline-2'

export function LayoutSelector({ value, onChange }: LayoutSelectorProps) {
  const { t } = useI18n()

  return (
    <select
      className={selectClass}
      style={{
        // backgroundColor (not shorthand) so CSS can keep the custom chevron image
        backgroundColor: 'var(--bg)',
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
          {t(LAYOUT_LABEL_KEYS[id])}
        </option>
      ))}
    </select>
  )
}
