import { describe, expect, it } from 'vitest'
import {
  DEFAULT_LAYOUT,
  DEFAULT_SHOW_CHORD_MARKS,
  DEFAULT_SHOW_MOUSE,
  DEFAULT_THEME,
  isLayoutId,
  isThemePreference,
  LAYOUT_IDS,
  THEME_PREFERENCES,
} from '../src/lib/preferences'
import { isLocale } from '../src/i18n'

describe('preferences helpers', () => {
  it('accepts light, dark, and system themes', () => {
    expect(THEME_PREFERENCES).toEqual(['light', 'dark', 'system'])
    expect(DEFAULT_THEME).toBe('system')
    expect(isThemePreference('dark')).toBe(true)
    expect(isThemePreference('neon')).toBe(false)
  })

  it('defaults keyboard layout to ANSI Full and validates ids', () => {
    expect(DEFAULT_LAYOUT).toBe('ansi-full')
    expect(LAYOUT_IDS).toEqual(['ansi-full', 'ansi-tkl', 'ansi-60', 'iso-full'])
    expect(isLayoutId('ansi-tkl')).toBe(true)
    expect(isLayoutId('ansi-60')).toBe(true)
    expect(isLayoutId('iso-full')).toBe(true)
    expect(isLayoutId('layout-60')).toBe(false)
  })

  it('defaults to showing the mouse visualizer', () => {
    expect(DEFAULT_SHOW_MOUSE).toBe(true)
  })

  it('defaults to showing chord marks on occupied keys', () => {
    expect(DEFAULT_SHOW_CHORD_MARKS).toBe(true)
  })

  it('shares locale validation with i18n', () => {
    expect(isLocale('fr')).toBe(true)
    expect(isLocale('de')).toBe(true)
    expect(isLocale('ja')).toBe(true)
    expect(isLocale('')).toBe(false)
  })
})
