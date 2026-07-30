import { z } from 'zod'
import type {
  ConflictSummary,
  InputProfile,
  KeyboardKey,
  KeyAvailability,
  KeyAvailabilityState,
  KeyBindingRef,
  Modifier,
  ReservedKeyRule,
} from '../types'
import { normalizeModifiers } from '../utils/keyNormalization'

const modifierSchema = z.enum(['shift', 'ctrl', 'alt', 'meta'])

const bindingSchema = z.object({
  key: z.string().min(1),
  action: z.string().min(1),
  context: z.string().optional(),
  modifiers: z.array(modifierSchema).optional(),
  verification: z.enum(['verified', 'unverified', 'community', 'custom']).optional(),
  notes: z.string().optional(),
})

const profileSchema = z.object({
  id: z.string().min(1),
  gameId: z.string().min(1),
  name: z.string().min(1),
  sourceType: z.enum(['official', 'community', 'custom', 'imported']),
  versionLabel: z.string().optional(),
  bindings: z.array(bindingSchema),
  verificationStatus: z.enum(['verified', 'unverified', 'community', 'custom']),
  notes: z.string().optional(),
})

const layoutKeySchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  x: z.number(),
  y: z.number(),
  width: z.number().positive(),
  height: z.number().positive(),
  row: z.number().optional(),
})

const layoutSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string(),
  width: z.number().positive(),
  height: z.number().positive(),
  keys: z.array(layoutKeySchema).min(1),
})

const reservedRuleSchema = z.object({
  id: z.string().min(1),
  keys: z.array(z.string().min(1)).min(1),
  modifiers: z.array(modifierSchema).optional(),
  label: z.string().min(1),
  reason: z.string().min(1),
  scope: z.enum(['global', 'windows', 'linux', 'macos']),
})

export const availabilityInputSchema = z.object({
  profiles: z.array(profileSchema),
  layout: layoutSchema,
  reservedRules: z.array(reservedRuleSchema).optional(),
  profilePrecedence: z.array(z.string().min(1)).optional(),
  gamesById: z.record(z.object({ name: z.string().min(1) })),
})

export type AvailabilityInput = z.infer<typeof availabilityInputSchema>

const CUSTOM_SOURCE_RANK: Record<InputProfile['sourceType'], number> = {
  custom: 0,
  imported: 1,
  community: 2,
  official: 3,
}

function modifierSignature(mods?: Modifier[]): string {
  return normalizeModifiers(mods?.map((m) => m) ?? []).join('+')
}

/** Bare-key reserved rules only (empty modifiers). Chord-only rules do not reserve the bare key. */
function findBareReserved(key: KeyboardKey, rules: ReservedKeyRule[]): ReservedKeyRule | undefined {
  return rules.find(
    (rule) => rule.keys.includes(key) && (!rule.modifiers || rule.modifiers.length === 0),
  )
}

function classifyKeyState(
  bindings: KeyBindingRef[],
  selectedProfileCount: number,
  reserved?: ReservedKeyRule,
): KeyAvailabilityState {
  if (reserved) return 'reserved'
  if (bindings.length === 0) return 'free'

  const profileIds = new Set(bindings.map((b) => b.profileId))
  if (selectedProfileCount <= 1 || profileIds.size >= selectedProfileCount) {
    return 'heavy'
  }
  return 'partial'
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

/**
 * Prefer custom/imported profiles over official/community for the same game.
 * Within the same source tier, earlier entries in profilePrecedence win.
 */
export function resolveProfiles(
  profiles: InputProfile[],
  profilePrecedence: string[] = [],
): InputProfile[] {
  const rank = new Map(profilePrecedence.map((id, index) => [id, index]))
  const byGame = new Map<string, InputProfile[]>()

  for (const profile of profiles) {
    const list = byGame.get(profile.gameId) ?? []
    list.push(profile)
    byGame.set(profile.gameId, list)
  }

  const resolved: InputProfile[] = []
  for (const group of byGame.values()) {
    group.sort((a, b) => {
      const sourceDelta = CUSTOM_SOURCE_RANK[a.sourceType] - CUSTOM_SOURCE_RANK[b.sourceType]
      if (sourceDelta !== 0) return sourceDelta
      const aRank = rank.get(a.id) ?? Number.MAX_SAFE_INTEGER
      const bRank = rank.get(b.id) ?? Number.MAX_SAFE_INTEGER
      return aRank - bRank
    })
    const winner = group[0]
    if (winner) resolved.push(winner)
  }

  return resolved
}

export function parseAvailabilityInput(input: unknown): AvailabilityInput {
  return availabilityInputSchema.parse(input)
}

export function computeAvailability(rawInput: AvailabilityInput): ConflictSummary {
  const input = parseAvailabilityInput(rawInput)
  const { layout, reservedRules = [], profilePrecedence = [], gamesById } = input
  const profiles = resolveProfiles(input.profiles, profilePrecedence)
  const precedence =
    profilePrecedence.length > 0 ? profilePrecedence : profiles.map((profile) => profile.id)
  const selectedProfileCount = profiles.length

  const bindingsByKey = new Map<KeyboardKey, KeyBindingRef[]>()

  for (const profile of profiles) {
    const gameName = gamesById[profile.gameId]?.name ?? profile.gameId
    for (const binding of profile.bindings) {
      const ref: KeyBindingRef = {
        profileId: profile.id,
        profileName: profile.name,
        gameId: profile.gameId,
        gameName,
        binding: {
          ...binding,
          modifiers: normalizeModifiers(binding.modifiers),
        },
      }
      const existing = bindingsByKey.get(binding.key) ?? []
      bindingsByKey.set(binding.key, mergeBindings(existing, [ref], precedence))
    }
  }

  const layoutKeyIds = new Set(layout.keys.map((k) => k.id))
  const keys: KeyAvailability[] = layout.keys.map((layoutKey) => {
    const bindings = bindingsByKey.get(layoutKey.id) ?? []
    const reserved = findBareReserved(layoutKey.id, reservedRules)
    const state = classifyKeyState(bindings, selectedProfileCount, reserved)

    return {
      key: layoutKey.id,
      label: layoutKey.label,
      state,
      bindings,
      distinctActions: [...new Set(bindings.map((b) => b.binding.action))].sort(),
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
