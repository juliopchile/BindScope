import { DEFAULT_LOCALE, isLocale, type Locale } from '../i18n'

export type ThemePreference = 'light' | 'dark' | 'system'

const LOCALE_KEY = 'bindscope.locale'
const THEME_KEY = 'bindscope.theme'

export const THEME_PREFERENCES: readonly ThemePreference[] = ['light', 'dark', 'system']
export const DEFAULT_THEME: ThemePreference = 'system'

export function isThemePreference(value: string): value is ThemePreference {
  return (THEME_PREFERENCES as readonly string[]).includes(value)
}

export function readStoredLocale(): Locale {
  try {
    const raw = localStorage.getItem(LOCALE_KEY)
    if (raw && isLocale(raw)) return raw
  } catch {
    /* private mode / blocked storage */
  }
  return DEFAULT_LOCALE
}

export function writeStoredLocale(locale: Locale): void {
  try {
    localStorage.setItem(LOCALE_KEY, locale)
  } catch {
    /* ignore */
  }
}

export function readStoredTheme(): ThemePreference {
  try {
    const raw = localStorage.getItem(THEME_KEY)
    if (raw && isThemePreference(raw)) return raw
  } catch {
    /* ignore */
  }
  return DEFAULT_THEME
}

export function writeStoredTheme(theme: ThemePreference): void {
  try {
    localStorage.setItem(THEME_KEY, theme)
  } catch {
    /* ignore */
  }
}
