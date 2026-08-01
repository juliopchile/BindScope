/**
 * Apply stored theme/locale to <html> before React paints (avoids flash).
 * Safe to import from main; no React dependency.
 */
import { DEFAULT_LOCALE, isLocale } from './i18n'
import { DEFAULT_THEME, isThemePreference } from './lib/preferences'
import { applyLocaleLang, applyTheme } from './lib/theme'

function read(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

const storedTheme = read('bindscope.theme')
applyTheme(storedTheme && isThemePreference(storedTheme) ? storedTheme : DEFAULT_THEME)

const storedLocale = read('bindscope.locale')
applyLocaleLang(storedLocale && isLocale(storedLocale) ? storedLocale : DEFAULT_LOCALE)
