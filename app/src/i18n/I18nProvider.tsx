import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { DEFAULT_LOCALE, getCatalog, translate, type Locale } from './index'
import { I18nContext, type I18nContextValue } from './I18nContext'
import { applyLocaleLang } from '../lib/theme'
import { readStoredLocale, writeStoredLocale } from '../lib/preferences'

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window === 'undefined') return DEFAULT_LOCALE
    return readStoredLocale()
  })

  useEffect(() => {
    applyLocaleLang(locale)
    writeStoredLocale(locale)
  }, [locale])

  const value = useMemo<I18nContextValue>(() => {
    const messages = getCatalog(locale)
    return {
      locale,
      setLocale: setLocaleState,
      messages,
      t: (key, vars) => translate(locale, key, vars),
    }
  }, [locale])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}
