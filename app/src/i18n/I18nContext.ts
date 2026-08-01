import { createContext } from 'react'
import type { Locale, MessageCatalog, MessageKey } from './index'

export interface I18nContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  messages: MessageCatalog
  t: (key: MessageKey, vars?: Record<string, string | number>) => string
}

export const I18nContext = createContext<I18nContextValue | null>(null)
