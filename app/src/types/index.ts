/** Canonical key id (KeyboardEvent.code style), e.g. KeyW, Digit1, F5. */
export type KeyboardKey = string

export type Modifier = 'shift' | 'ctrl' | 'alt' | 'meta'

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

/** Conflict scoring: free → partial → heavy → reserved (+ unknown for out-of-layout). */
export type KeyAvailabilityState = 'free' | 'partial' | 'heavy' | 'reserved' | 'unknown'

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

export type LayoutId = 'ansi-full'
