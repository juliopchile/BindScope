import {
  defaultEnabledLayerIds,
  GAMES_BY_ID,
  GAMES_NAME_BY_ID,
  SEED_PROFILES_BY_GAME_ID,
  toInputProfile,
} from '../data/catalog'
import type { Game, InputProfile, KeyAvailabilityState, SeedProfile } from '../types'

export type EnabledLayersByGame = Record<string, string[]>

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

export function profilesForSelection(
  selectedGameIds: readonly string[],
  enabledLayersByGame: EnabledLayersByGame,
): InputProfile[] {
  const profiles: InputProfile[] = []
  for (const gameId of selectedGameIds) {
    const seed = SEED_PROFILES_BY_GAME_ID[gameId]
    if (!seed) continue
    const layers = enabledLayersByGame[gameId] ?? defaultEnabledLayerIds(seed)
    profiles.push(toInputProfile(seed, layers))
  }
  return profiles
}

export function gamesNameMapForSelection(
  selectedGameIds: readonly string[],
): Record<string, { name: string }> {
  const map: Record<string, { name: string }> = {}
  for (const gameId of selectedGameIds) {
    const known = GAMES_NAME_BY_ID[gameId]
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

/** Empty filter set means "show every legend state". */
export function isStateVisible(
  state: KeyAvailabilityState,
  activeFilters: ReadonlySet<KeyAvailabilityState>,
): boolean {
  if (activeFilters.size === 0) return true
  return activeFilters.has(state)
}
