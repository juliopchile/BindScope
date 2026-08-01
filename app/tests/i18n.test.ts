import { describe, expect, it } from 'vitest'
import {
  catalogs,
  DEFAULT_LOCALE,
  formatMessage,
  getCatalog,
  isLocale,
  LOCALES,
  translate,
  type MessageKey,
} from '../src/i18n'
import { en } from '../src/i18n/locales/en'

const EN_KEYS = Object.keys(en) as MessageKey[]

describe('i18n catalogs', () => {
  it('lists the expected locales', () => {
    expect(LOCALES).toEqual(['en', 'es', 'pt', 'fr', 'zh'])
    expect(DEFAULT_LOCALE).toBe('en')
  })

  it('keeps every locale key-complete with English', () => {
    for (const locale of LOCALES) {
      const catalog = catalogs[locale]
      for (const key of EN_KEYS) {
        expect(catalog[key], `${locale}.${key}`).toBeTypeOf('string')
        expect(catalog[key].length, `${locale}.${key}`).toBeGreaterThan(0)
      }
      expect(Object.keys(catalog).sort()).toEqual([...EN_KEYS].sort())
    }
  })

  it('formats placeholders', () => {
    expect(formatMessage('Imported {count} profile(s).', { count: 2 })).toBe(
      'Imported 2 profile(s).',
    )
    expect(translate('en', 'importSuccess', { count: 1 })).toBe('Imported 1 profile(s).')
  })

  it('validates locale codes', () => {
    expect(isLocale('es')).toBe(true)
    expect(isLocale('de')).toBe(false)
    expect(getCatalog('zh')).toBe(catalogs.zh)
  })
})
