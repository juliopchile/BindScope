/** Canonical keyboard key identifiers (Web KeyboardEvent.code style). */
export type KeyboardKey =
  | `Key${Uppercase<string>}`
  | `Digit${0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}`
  | `F${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12}`
  | 'Space'
  | 'Enter'
  | 'Escape'
  | 'Tab'
  | 'Backspace'
  | 'Delete'
  | 'Insert'
  | 'Home'
  | 'End'
  | 'PageUp'
  | 'PageDown'
  | 'ArrowUp'
  | 'ArrowDown'
  | 'ArrowLeft'
  | 'ArrowRight'
  | 'ShiftLeft'
  | 'ShiftRight'
  | 'ControlLeft'
  | 'ControlRight'
  | 'AltLeft'
  | 'AltRight'
  | 'MetaLeft'
  | 'MetaRight'
  | 'CapsLock'
  | 'Backquote'
  | 'Minus'
  | 'Equal'
  | 'BracketLeft'
  | 'BracketRight'
  | 'Backslash'
  | 'Semicolon'
  | 'Quote'
  | 'Comma'
  | 'Period'
  | 'Slash'
  | `Numpad${0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}`
  | 'NumpadAdd'
  | 'NumpadSubtract'
  | 'NumpadMultiply'
  | 'NumpadDivide'
  | 'NumpadEnter'
  | 'NumpadDecimal'
  | (string & {})

export type Modifier = 'shift' | 'ctrl' | 'alt' | 'meta'

export type BindingSourceType = 'default' | 'community' | 'custom' | 'imported'

export type VerificationStatus = 'verified' | 'unverified' | 'community' | 'custom'

export type ProfileSourceType = 'official' | 'community' | 'custom' | 'imported'

export interface BindingSourceMetadata {
  label?: string
  url?: string
  author?: string
}

export interface Binding {
  key: KeyboardKey
  action: string
  context?: string
  modifiers?: Modifier[]
  source?: BindingSourceMetadata
  confidence?: 'high' | 'medium' | 'low'
  verification?: VerificationStatus
  notes?: string
}

export interface InputProfile {
  id: string
  gameId: string
  name: string
  sourceType: ProfileSourceType
  versionLabel?: string
  bindings: Binding[]
  verificationStatus: VerificationStatus
  notes?: string
}

export interface GameVersion {
  id: string
  label: string
  patch?: string
}

export interface ProfileSource {
  type: ProfileSourceType
  label: string
  url?: string
}

export interface Game {
  id: string
  name: string
  aliases?: string[]
  tags?: string[]
  versions?: GameVersion[]
  profileIds: string[]
}

export interface LayoutKey {
  id: KeyboardKey
  label: string
  x: number
  y: number
  width: number
  height: number
  row?: number
}

export interface KeyboardLayout {
  id: string
  name: string
  description: string
  width: number
  height: number
  keys: LayoutKey[]
}

export type KeyAvailabilityState =
  | 'free'
  | 'single'
  | 'shared'
  | 'partial'
  | 'heavy'
  | 'reserved'
  | 'unknown'

export interface KeyBindingRef {
  profileId: string
  profileName: string
  gameId: string
  gameName: string
  binding: Binding
}

export interface KeyAvailability {
  key: KeyboardKey
  label: string
  state: KeyAvailabilityState
  bindings: KeyBindingRef[]
  distinctActions: string[]
  reservedReason?: string
}

export interface ConflictSummary {
  totalKeys: number
  freeCount: number
  singleCount: number
  sharedCount: number
  partialCount: number
  heavyCount: number
  reservedCount: number
  unknownCount: number
  keys: KeyAvailability[]
}

export type ReservedKeyScope = 'global' | 'windows' | 'linux' | 'macos'

export interface ReservedKeyRule {
  id: string
  keys: KeyboardKey[]
  modifiers?: Modifier[]
  label: string
  reason: string
  scope: ReservedKeyScope
}

export interface ImportExportDocument {
  schemaVersion: 1
  exportedAt: string
  games?: Game[]
  profiles: InputProfile[]
  notes?: string
}

export interface AvailabilityFilter {
  free: boolean
  used: boolean
  reserved: boolean
  conflicted: boolean
}

export type LayoutId = 'ansi-full' | 'ansi-tkl' | 'ansi-compact'
