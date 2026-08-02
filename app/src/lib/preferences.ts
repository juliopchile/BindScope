import { DEFAULT_LOCALE, isLocale, type Locale } from '../i18n'
import { isLayoutId, LAYOUT_IDS } from '../data/keyboardLayouts'
import type {
  Binding,
  InputProfile,
  LayoutId,
  ProfileSourceType,
  VerificationStatus,
} from '../types'
import type {
  EnabledLayersByGame,
  ExtraGameNames,
  ProfileOverridesByGame,
} from './selection'

export type ThemePreference = 'light' | 'dark' | 'system'

/** Session selection restored across reloads (empty on first visit). */
export type StoredSelectionState = {
  selectedIds: string[]
  enabledLayersByGame: EnabledLayersByGame
  overridesByGame: ProfileOverridesByGame
  extraNames: ExtraGameNames
}

const LOCALE_KEY = 'bindscope.locale'
const THEME_KEY = 'bindscope.theme'
const LAYOUT_KEY = 'bindscope.layout'
const SHOW_MOUSE_KEY = 'bindscope.showMouse'
const SHOW_CHORD_MARKS_KEY = 'bindscope.showChordMarks'
const SELECTION_KEY = 'bindscope.selection'

const VERIFICATION_STATUSES = new Set<VerificationStatus>([
  'verified',
  'unverified',
  'community',
  'custom',
])
const SOURCE_TYPES = new Set<ProfileSourceType>([
  'official',
  'community',
  'custom',
  'imported',
])

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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string')
}

function parseEnabledLayers(value: unknown): EnabledLayersByGame {
  if (!isRecord(value)) return {}
  const next: EnabledLayersByGame = {}
  for (const [gameId, layers] of Object.entries(value)) {
    if (isStringArray(layers)) next[gameId] = layers
  }
  return next
}

function parseExtraNames(value: unknown): ExtraGameNames {
  if (!isRecord(value)) return {}
  const next: ExtraGameNames = {}
  for (const [gameId, entry] of Object.entries(value)) {
    if (!isRecord(entry) || typeof entry.name !== 'string' || entry.name.length === 0) continue
    next[gameId] = { name: entry.name }
  }
  return next
}

function parseBinding(value: unknown): Binding | null {
  if (!isRecord(value)) return null
  if (typeof value.key !== 'string' || value.key.length === 0) return null
  if (typeof value.action !== 'string' || value.action.length === 0) return null
  const binding: Binding = { key: value.key, action: value.action }
  if (typeof value.context === 'string') binding.context = value.context
  if (isStringArray(value.modifiers)) {
    binding.modifiers = value.modifiers.filter(
      (mod): mod is NonNullable<Binding['modifiers']>[number] =>
        mod === 'shift' || mod === 'ctrl' || mod === 'alt' || mod === 'meta',
    )
    if (binding.modifiers.length === 0) delete binding.modifiers
  }
  if (typeof value.verification === 'string' && VERIFICATION_STATUSES.has(value.verification as VerificationStatus)) {
    binding.verification = value.verification as VerificationStatus
  }
  if (typeof value.notes === 'string') binding.notes = value.notes
  return binding
}

function parseOverrideProfile(value: unknown): InputProfile | null {
  if (!isRecord(value)) return null
  if (typeof value.id !== 'string' || value.id.length === 0) return null
  if (typeof value.gameId !== 'string' || value.gameId.length === 0) return null
  if (typeof value.name !== 'string' || value.name.length === 0) return null
  if (!Array.isArray(value.bindings)) return null
  const bindings: Binding[] = []
  for (const raw of value.bindings) {
    const binding = parseBinding(raw)
    if (binding) bindings.push(binding)
  }
  if (bindings.length === 0) return null
  const sourceType =
    typeof value.sourceType === 'string' && SOURCE_TYPES.has(value.sourceType as ProfileSourceType)
      ? (value.sourceType as ProfileSourceType)
      : 'imported'
  const verificationStatus =
    typeof value.verificationStatus === 'string' &&
    VERIFICATION_STATUSES.has(value.verificationStatus as VerificationStatus)
      ? (value.verificationStatus as VerificationStatus)
      : 'custom'
  const profile: InputProfile = {
    id: value.id,
    gameId: value.gameId,
    name: value.name,
    sourceType,
    bindings,
    verificationStatus,
  }
  if (typeof value.versionLabel === 'string') profile.versionLabel = value.versionLabel
  if (typeof value.notes === 'string') profile.notes = value.notes
  return profile
}

function parseOverrides(value: unknown): ProfileOverridesByGame {
  if (!isRecord(value)) return {}
  const next: ProfileOverridesByGame = {}
  for (const [gameId, raw] of Object.entries(value)) {
    const profile = parseOverrideProfile(raw)
    if (profile && profile.gameId === gameId) next[gameId] = profile
  }
  return next
}

/** Returns null when unset or unreadable — callers treat that as empty selection. */
export function readStoredSelection(): StoredSelectionState | null {
  try {
    const raw = localStorage.getItem(SELECTION_KEY)
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    if (!isRecord(parsed) || !isStringArray(parsed.selectedIds)) return null
    return {
      selectedIds: parsed.selectedIds,
      enabledLayersByGame: parseEnabledLayers(parsed.enabledLayersByGame),
      overridesByGame: parseOverrides(parsed.overridesByGame),
      extraNames: parseExtraNames(parsed.extraNames),
    }
  } catch {
    /* private mode / blocked storage / bad JSON */
  }
  return null
}

export function writeStoredSelection(state: StoredSelectionState): void {
  try {
    localStorage.setItem(SELECTION_KEY, JSON.stringify(state))
  } catch {
    /* ignore */
  }
}
