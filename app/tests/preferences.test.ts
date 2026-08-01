import { describe, expect, it } from 'vitest'
import {
  DEFAULT_THEME,
  isThemePreference,
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

  it('shares locale validation with i18n', () => {
    expect(isLocale('fr')).toBe(true)
    expect(isLocale('')).toBe(false)
  })
})
