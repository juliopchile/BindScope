import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import {
  DEFAULT_LAYOUT,
  DEFAULT_SHOW_CHORD_MARKS,
  DEFAULT_SHOW_MOUSE,
  DEFAULT_THEME,
  isLayoutId,
  isThemePreference,
  LAYOUT_IDS,
  readStoredSelection,
  THEME_PREFERENCES,
  writeStoredSelection,
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

describe('selection persistence', () => {
  const store = new Map<string, string>()

  beforeEach(() => {
    store.clear()
    Object.defineProperty(globalThis, 'localStorage', {
      configurable: true,
      value: {
        getItem: (key: string) => store.get(key) ?? null,
        setItem: (key: string, value: string) => {
          store.set(key, String(value))
        },
        removeItem: (key: string) => {
          store.delete(key)
        },
        clear: () => {
          store.clear()
        },
      },
    })
  })

  afterEach(() => {
    Reflect.deleteProperty(globalThis, 'localStorage')
  })

  it('returns null when unset', () => {
    expect(readStoredSelection()).toBeNull()
  })

  it('round-trips selected ids, layers, overrides, and extra names', () => {
    writeStoredSelection({
      selectedIds: ['warframe', 'custom-mod'],
      enabledLayersByGame: { warframe: ['movement'] },
      overridesByGame: {
        'custom-mod': {
          id: 'custom-mod-imported',
          gameId: 'custom-mod',
          name: 'Custom Mod',
          sourceType: 'imported',
          verificationStatus: 'custom',
          bindings: [{ key: 'KeyP', action: 'Ping' }],
        },
      },
      extraNames: { 'custom-mod': { name: 'Custom Mod' } },
    })
    const stored = readStoredSelection()
    expect(stored?.selectedIds).toEqual(['warframe', 'custom-mod'])
    expect(stored?.enabledLayersByGame.warframe).toEqual(['movement'])
    expect(stored?.overridesByGame['custom-mod']?.bindings[0]?.action).toBe('Ping')
    expect(stored?.extraNames['custom-mod']?.name).toBe('Custom Mod')
  })

  it('ignores malformed selection JSON', () => {
    localStorage.setItem('bindscope.selection', '{not-json')
    expect(readStoredSelection()).toBeNull()
    localStorage.setItem('bindscope.selection', JSON.stringify({ selectedIds: 'nope' }))
    expect(readStoredSelection()).toBeNull()
  })
})
