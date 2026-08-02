import { DEFAULT_LOCALE, isLocale, type Locale } from '../i18n'
import { isLayoutId, LAYOUT_IDS } from '../data/keyboardLayouts'
import type { LayoutId } from '../types'

export type ThemePreference = 'light' | 'dark' | 'system'

const LOCALE_KEY = 'bindscope.locale'
const THEME_KEY = 'bindscope.theme'
const LAYOUT_KEY = 'bindscope.layout'
const SHOW_MOUSE_KEY = 'bindscope.showMouse'
const SHOW_CHORD_MARKS_KEY = 'bindscope.showChordMarks'

export const THEME_PREFERENCES: readonly ThemePreference[] = ['light', 'dark', 'system']
export const DEFAULT_THEME: ThemePreference = 'system'
export const DEFAULT_LAYOUT: LayoutId = 'ansi-full'
export const DEFAULT_SHOW_MOUSE = true
export const DEFAULT_SHOW_CHORD_MARKS = true
export { LAYOUT_IDS, isLayoutId }

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

export function readStoredLayout(): LayoutId {
  try {
    const raw = localStorage.getItem(LAYOUT_KEY)
    if (raw && isLayoutId(raw)) return raw
  } catch {
    /* ignore */
  }
  return DEFAULT_LAYOUT
}

export function writeStoredLayout(layoutId: LayoutId): void {
  try {
    localStorage.setItem(LAYOUT_KEY, layoutId)
  } catch {
    /* ignore */
  }
}

export function readStoredShowMouse(): boolean {
  try {
    const raw = localStorage.getItem(SHOW_MOUSE_KEY)
    if (raw === '0' || raw === 'false') return false
    if (raw === '1' || raw === 'true') return true
  } catch {
    /* ignore */
  }
  return DEFAULT_SHOW_MOUSE
}

export function writeStoredShowMouse(show: boolean): void {
  try {
    localStorage.setItem(SHOW_MOUSE_KEY, show ? '1' : '0')
  } catch {
    /* ignore */
  }
}

export function readStoredShowChordMarks(): boolean {
  try {
    const raw = localStorage.getItem(SHOW_CHORD_MARKS_KEY)
    if (raw === '0' || raw === 'false') return false
    if (raw === '1' || raw === 'true') return true
  } catch {
    /* ignore */
  }
  return DEFAULT_SHOW_CHORD_MARKS
}

export function writeStoredShowChordMarks(show: boolean): void {
  try {
    localStorage.setItem(SHOW_CHORD_MARKS_KEY, show ? '1' : '0')
  } catch {
    /* ignore */
  }
}
