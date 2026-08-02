import {
  defaultEnabledLayerIds,
  GAMES_BY_ID,
  GAMES_NAME_BY_ID,
  SEED_PROFILES_BY_GAME_ID,
  toInputProfile,
} from '../data/catalog'
import type { Game, InputProfile, KeyAvailabilityState, SeedProfile } from '../types'

export type EnabledLayersByGame = Record<string, string[]>
export type ProfileOverridesByGame = Record<string, InputProfile>
export type ExtraGameNames = Record<string, { name: string }>

export function initialLayersForGame(gameId: string): string[] {
  const profile = SEED_PROFILES_BY_GAME_ID[gameId]
  return profile ? defaultEnabledLayerIds(profile) : []
}

export function buildEnabledLayers(
  selectedGameIds: readonly string[],
  previous: EnabledLayersByGame = {},
): EnabledLayersByGame {
  const next: EnabledLayersByGame = {}
  for (const gameId of selectedGameIds) {
    next[gameId] = previous[gameId] ?? initialLayersForGame(gameId)
  }
  return next
}

/**
 * Keep stored layer ids that still exist on the seed; drop unknown ids.
 * Games without a seed (import-only) keep the stored list as-is.
 */
export function sanitizeEnabledLayers(
  selectedGameIds: readonly string[],
  stored: EnabledLayersByGame,
): EnabledLayersByGame {
  const previous: EnabledLayersByGame = {}
  for (const gameId of selectedGameIds) {
    const seed = SEED_PROFILES_BY_GAME_ID[gameId]
    const storedLayers = stored[gameId]
    if (!seed) {
      if (storedLayers) previous[gameId] = storedLayers
      continue
    }
    if (!storedLayers) continue
    const valid = new Set(seed.layers.map((layer) => layer.id))
    previous[gameId] = storedLayers.filter((id) => valid.has(id))
  }
  return buildEnabledLayers(selectedGameIds, previous)
}

/**
 * Seed flatten plus any imported/custom overrides. The engine's
 * `resolveProfiles` prefers custom/imported over official for the same gameId.
 */
export function profilesForSelection(
  selectedGameIds: readonly string[],
  enabledLayersByGame: EnabledLayersByGame,
  overridesByGame: ProfileOverridesByGame = {},
): InputProfile[] {
  const profiles: InputProfile[] = []
  for (const gameId of selectedGameIds) {
    const seed = SEED_PROFILES_BY_GAME_ID[gameId]
    if (seed) {
      const layers = enabledLayersByGame[gameId] ?? defaultEnabledLayerIds(seed)
      profiles.push(toInputProfile(seed, layers))
    }
    const override = overridesByGame[gameId]
    if (override) profiles.push(override)
  }
  return profiles
}

export function gamesNameMapForSelection(
  selectedGameIds: readonly string[],
  extraNames: ExtraGameNames = {},
): Record<string, { name: string }> {
  const map: Record<string, { name: string }> = {}
  for (const gameId of selectedGameIds) {
    const known = GAMES_NAME_BY_ID[gameId] ?? extraNames[gameId]
    if (known) map[gameId] = known
  }
  return map
}

export function getSeedProfile(gameId: string): SeedProfile | undefined {
  return SEED_PROFILES_BY_GAME_ID[gameId]
}

export function getGame(gameId: string): Game | undefined {
  return GAMES_BY_ID[gameId]
}

export function displayNameForGame(
  gameId: string,
  extraNames: ExtraGameNames = {},
): string {
  return GAMES_BY_ID[gameId]?.name ?? extraNames[gameId]?.name ?? gameId
}

/** Empty filter set means "show every legend state". */
export function isStateVisible(
  state: KeyAvailabilityState,
  activeFilters: ReadonlySet<KeyAvailabilityState>,
): boolean {
  if (activeFilters.size === 0) return true
  return activeFilters.has(state)
}

/**
 * Combines legend state filters with the optional "chords only" cue.
 * Does not change availability scoring — visual dimming only.
 */
export function isKeyVisible(
  state: KeyAvailabilityState,
  hasChords: boolean,
  activeFilters: ReadonlySet<KeyAvailabilityState>,
  chordsOnly: boolean,
): boolean {
  if (!isStateVisible(state, activeFilters)) return false
  if (chordsOnly && !hasChords) return false
  return true
}
