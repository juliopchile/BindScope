import type {
  ConflictSummary,
  InputProfile,
  KeyboardKey,
  KeyboardLayout,
  KeyAvailability,
  KeyAvailabilityState,
  KeyBindingRef,
  Modifier,
  ReservedKeyRule,
} from '../types'
import { normalizeModifiers } from '../utils/keyNormalization'

export interface AvailabilityInput {
  profiles: InputProfile[]
  layout: KeyboardLayout
  reservedRules?: ReservedKeyRule[]
  profilePrecedence?: string[]
  gamesById: Record<string, { name: string }>
}

function modifierSignature(mods?: Modifier[]): string {
  return normalizeModifiers(mods?.map((m) => m) ?? []).join('+')
}

function bindingIdentity(binding: KeyBindingRef): string {
  return `${binding.binding.action}|${modifierSignature(binding.binding.modifiers)}`
}

function isReserved(key: KeyboardKey, rules: ReservedKeyRule[]): ReservedKeyRule | undefined {
  return rules.find((rule) => rule.keys.includes(key))
}

function classifyKeyState(
  bindings: KeyBindingRef[],
  reserved?: ReservedKeyRule,
): KeyAvailabilityState {
  if (reserved) return 'reserved'
  if (bindings.length === 0) return 'free'

  const profileIds = new Set(bindings.map((b) => b.profileId))
  const actions = new Set(bindings.map(bindingIdentity))

  if (profileIds.size === 1) return 'single'
  if (actions.size === 1) return 'shared'
  if (profileIds.size === 2) return 'partial'
  return 'heavy'
}

function mergeBindings(
  existing: KeyBindingRef[],
  incoming: KeyBindingRef[],
  precedence: string[],
): KeyBindingRef[] {
  const rank = new Map(precedence.map((id, index) => [id, index]))
  const merged = [...existing, ...incoming]
  const seen = new Map<string, KeyBindingRef>()

  for (const ref of merged) {
    const dedupeKey = `${ref.profileId}|${ref.binding.action}|${modifierSignature(ref.binding.modifiers)}`
    const current = seen.get(dedupeKey)
    if (!current) {
      seen.set(dedupeKey, ref)
      continue
    }
    const currentRank = rank.get(current.profileId) ?? Number.MAX_SAFE_INTEGER
    const nextRank = rank.get(ref.profileId) ?? Number.MAX_SAFE_INTEGER
    if (nextRank < currentRank) seen.set(dedupeKey, ref)
  }

  return [...seen.values()].sort((a, b) => a.gameName.localeCompare(b.gameName))
}

export function computeAvailability(input: AvailabilityInput): ConflictSummary {
  const { profiles, layout, reservedRules = [], profilePrecedence = [], gamesById } = input
  const precedence = profilePrecedence.length > 0 ? profilePrecedence : profiles.map((p) => p.id)

  const bindingsByKey = new Map<KeyboardKey, KeyBindingRef[]>()

  for (const profile of profiles) {
    const gameName = gamesById[profile.gameId]?.name ?? profile.gameId
    for (const binding of profile.bindings) {
      const ref: KeyBindingRef = {
        profileId: profile.id,
        profileName: profile.name,
        gameId: profile.gameId,
        gameName,
        binding,
      }
      const existing = bindingsByKey.get(binding.key) ?? []
      bindingsByKey.set(binding.key, mergeBindings(existing, [ref], precedence))
    }
  }

  const layoutKeyIds = new Set(layout.keys.map((k) => k.id))
  const keys: KeyAvailability[] = layout.keys.map((layoutKey) => {
    const bindings = bindingsByKey.get(layoutKey.id) ?? []
    const reserved = isReserved(layoutKey.id, reservedRules)
    const distinctActions = [...new Set(bindings.map((b) => b.binding.action))].sort()
    const state = classifyKeyState(bindings, reserved)

    return {
      key: layoutKey.id,
      label: layoutKey.label,
      state,
      bindings,
      distinctActions,
      reservedReason: reserved?.reason,
    }
  })

  const unknownBindings: KeyAvailability[] = []
  for (const [key, bindings] of bindingsByKey) {
    if (!layoutKeyIds.has(key)) {
      unknownBindings.push({
        key,
        label: key,
        state: 'unknown',
        bindings,
        distinctActions: [...new Set(bindings.map((b) => b.binding.action))].sort(),
      })
    }
  }

  const allKeys = [...keys, ...unknownBindings]
  const counts = {
    freeCount: 0,
    singleCount: 0,
    sharedCount: 0,
    partialCount: 0,
    heavyCount: 0,
    reservedCount: 0,
    unknownCount: 0,
  }

  for (const item of allKeys) {
    switch (item.state) {
      case 'free':
        counts.freeCount++
        break
      case 'single':
        counts.singleCount++
        break
      case 'shared':
        counts.sharedCount++
        break
      case 'partial':
        counts.partialCount++
        break
      case 'heavy':
        counts.heavyCount++
        break
      case 'reserved':
        counts.reservedCount++
        break
      case 'unknown':
        counts.unknownCount++
        break
    }
  }

  return {
    totalKeys: allKeys.length,
    ...counts,
    keys: allKeys,
  }
}

export function getFreeKeys(summary: ConflictSummary): KeyboardKey[] {
  return summary.keys.filter((k) => k.state === 'free').map((k) => k.key)
}

export function getConflictedKeys(summary: ConflictSummary): KeyAvailability[] {
  return summary.keys.filter((k) => k.state === 'partial' || k.state === 'heavy')
}
