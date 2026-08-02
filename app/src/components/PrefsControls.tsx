import { LOCALES, LOCALE_LABELS } from '../i18n'
import { useI18n } from '../i18n/useI18n'
import { THEME_PREFERENCES, type ThemePreference } from '../lib/preferences'
import { useTheme } from '../lib/useTheme'

const selectClass =
  'min-h-10 min-w-[7.5rem] rounded-md border px-2 py-2 text-sm focus-visible:outline focus-visible:outline-2'

interface PrefsControlsProps {
  showMouse: boolean
  onShowMouseChange: (show: boolean) => void
}

export function PrefsControls({ showMouse, onShowMouseChange }: PrefsControlsProps) {
  const { locale, setLocale, t } = useI18n()
  const { theme, setTheme } = useTheme()

  const selectStyle = {
    background: 'var(--bg)',
    borderColor: 'var(--border)',
    color: 'var(--fg)',
  }

  return (
    <div
      className="flex flex-wrap items-end gap-3"
      role="group"
      aria-label={t('prefsAriaLabel')}
    >
      <label className="flex flex-col gap-1 text-xs" style={{ color: 'var(--fg-muted)' }}>
        <span className="font-semibold tracking-wide uppercase">{t('languageLabel')}</span>
        <select
          className={selectClass}
          style={selectStyle}
          value={locale}
          onChange={(event) => setLocale(event.target.value as typeof locale)}
          aria-label={t('languageLabel')}
        >
          {LOCALES.map((code) => (
            <option key={code} value={code}>
              {LOCALE_LABELS[code]}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1 text-xs" style={{ color: 'var(--fg-muted)' }}>
        <span className="font-semibold tracking-wide uppercase">{t('themeLabel')}</span>
        <select
          className={selectClass}
          style={selectStyle}
          value={theme}
          onChange={(event) => setTheme(event.target.value as ThemePreference)}
          aria-label={t('themeLabel')}
        >
          {THEME_PREFERENCES.map((value) => (
            <option key={value} value={value}>
              {themeLabel(t, value)}
            </option>
          ))}
        </select>
      </label>

      <label
        className="flex min-h-10 items-center gap-2 self-end rounded-md border px-3 py-2 text-sm"
        style={{ borderColor: 'var(--border)', color: 'var(--fg)' }}
      >
        <input
          type="checkbox"
          checked={showMouse}
          onChange={(event) => onShowMouseChange(event.target.checked)}
          aria-label={t('showMouseLabel')}
        />
        <span>{t('showMouseLabel')}</span>
      </label>
    </div>
  )
}

function themeLabel(
  t: (key: 'themeLight' | 'themeDark' | 'themeSystem') => string,
  value: ThemePreference,
): string {
  if (value === 'light') return t('themeLight')
  if (value === 'dark') return t('themeDark')
  return t('themeSystem')
}
