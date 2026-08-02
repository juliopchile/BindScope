import type { Binding, Modifier } from '../../types'

/** Supported config import families (JSON stays in importExport.ts). */
export type ConfigFormat = 'cfg' | 'ini' | 'xml'

/** Detected or declared import format including BindScope JSON. */
export type ImportFormat = ConfigFormat | 'json'

/** One bind line before key normalization. */
export interface RawConfigBinding {
  key: string
  action: string
  modifiers?: string[]
  context?: string
}

export interface ConfigBindingsResult {
  bindings: RawConfigBinding[]
  /** Lines or elements that looked like binds but could not be used. */
  skippedLines: number
}

/** Options when lifting config binds into an InputProfile. */
export interface ConfigImportOptions {
  gameId: string
  profileName?: string
  profileId?: string
  fileName?: string
}

export type NormalizedConfigBinding = Binding & {
  modifiers?: Modifier[]
}
