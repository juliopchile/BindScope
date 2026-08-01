import { en, type MessageCatalog, type MessageKey } from './locales/en'
import { es } from './locales/es'
import { fr } from './locales/fr'
import { pt } from './locales/pt'
import { zh } from './locales/zh'

export type { MessageCatalog, MessageKey }
export type Locale = 'en' | 'es' | 'pt' | 'fr' | 'zh'

export const LOCALES: readonly Locale[] = ['en', 'es', 'pt', 'fr', 'zh']

/** Native labels for the language switcher (not translated). */
export const LOCALE_LABELS: Record<Locale, string> = {
  en: 'English',
  es: 'Español',
  pt: 'Português',
  fr: 'Français',
  zh: '中文',
}

export const catalogs: Record<Locale, MessageCatalog> = {
  en,
  es,
  pt,
  fr,
  zh,
}

export const DEFAULT_LOCALE: Locale = 'en'

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value)
}

export function getCatalog(locale: Locale): MessageCatalog {
  return catalogs[locale] ?? catalogs[DEFAULT_LOCALE]
}

/** Replace `{name}` placeholders in a message template. */
export function formatMessage(
  template: string,
  vars: Record<string, string | number> = {},
): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    vars[key] === undefined ? `{${key}}` : String(vars[key]),
  )
}

export function translate(
  locale: Locale,
  key: MessageKey,
  vars?: Record<string, string | number>,
): string {
  const catalog = getCatalog(locale)
  const template = catalog[key] ?? catalogs.en[key] ?? key
  return vars ? formatMessage(template, vars) : template
}
