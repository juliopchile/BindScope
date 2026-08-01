import type { CatalogEntry, CatalogKind, Game, SeedProfile } from '../../types'
import { apexLegends } from './games/apex-legends'
import { counterStrike2 } from './games/counter-strike-2'
import { genshinImpact } from './games/genshin-impact'
import { leagueOfLegends } from './games/league-of-legends'
import { skyrim } from './games/skyrim'
import { valorant } from './games/valorant'
import { warframe } from './games/warframe'
import { worldOfWarcraft } from './games/world-of-warcraft'
import { msiAfterburner } from './tools/msi-afterburner'
import { obsStudio } from './tools/obs-studio'

/** Add a new seed file and list it here — order is search/list order. */
const ENTRIES: CatalogEntry[] = [
  leagueOfLegends,
  warframe,
  genshinImpact,
  worldOfWarcraft,
  valorant,
  counterStrike2,
  apexLegends,
  skyrim,
  obsStudio,
  msiAfterburner,
]

/**
 * Pool used for the random first-load selection. Edit freely;
 * ids must exist in the catalog.
 */
export const STARTER_POOL = [
  'league-of-legends',
  'warframe',
  'genshin-impact',
  'world-of-warcraft',
] as const

export type StarterPoolId = (typeof STARTER_POOL)[number]

export const CATALOG_ENTRIES: CatalogEntry[] = ENTRIES

export const CATALOG_GAMES: Game[] = ENTRIES.map((entry) => entry.game)

export const SEED_PROFILES_BY_GAME_ID: Record<string, SeedProfile> = Object.fromEntries(
  ENTRIES.map((entry) => [entry.game.id, entry.profile]),
)

export const GAMES_BY_ID: Record<string, Game> = Object.fromEntries(
  ENTRIES.map((entry) => [entry.game.id, entry.game]),
)

/** Name map for `computeAvailability`. */
export const GAMES_NAME_BY_ID: Record<string, { name: string }> = Object.fromEntries(
  ENTRIES.map((entry) => [entry.game.id, { name: entry.game.name }]),
)

export function getCatalogByKind(kind: CatalogKind): Game[] {
  return CATALOG_GAMES.filter((game) => game.kind === kind)
}

export function pickRandomStarter(
  pool: readonly string[] = STARTER_POOL,
  random: () => number = Math.random,
): string {
  if (pool.length === 0) {
    throw new Error('STARTER_POOL must not be empty')
  }
  const index = Math.floor(random() * pool.length)
  return pool[index] ?? pool[0]!
}

export { defaultEnabledLayerIds, toInputProfile } from './flatten'
