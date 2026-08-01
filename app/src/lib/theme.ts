import type { ThemePreference } from './preferences'

/** Apply theme preference to <html data-theme="…"> for CSS tokens (D11). */
export function applyTheme(theme: ThemePreference): void {
  document.documentElement.dataset.theme = theme
}

export function applyLocaleLang(locale: string): void {
  document.documentElement.lang = locale
}
