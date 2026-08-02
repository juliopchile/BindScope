import type { CatalogEntry, CatalogKind, Game, SeedProfile } from '../../types'
import { apexLegends } from './games/apex-legends'
import { baldursGate3 } from './games/baldurs-gate-3'
import { counterStrike2 } from './games/counter-strike-2'
import { deadByDaylight } from './games/dead-by-daylight'
import { destiny2 } from './games/destiny-2'
import { diabloIv } from './games/diablo-iv'
import { dota2 } from './games/dota-2'
import { eldenRing } from './games/elden-ring'
import { escapeFromTarkov } from './games/escape-from-tarkov'
import { finalFantasyXiv } from './games/final-fantasy-xiv'
import { fortnite } from './games/fortnite'
import { genshinImpact } from './games/genshin-impact'
import { leagueOfLegends } from './games/league-of-legends'
import { minecraft } from './games/minecraft'
import { overwatch2 } from './games/overwatch-2'
import { pathOfExile } from './games/path-of-exile'
import { rocketLeague } from './games/rocket-league'
import { rust } from './games/rust'
import { skyrim } from './games/skyrim'
import { valorant } from './games/valorant'
import { warframe } from './games/warframe'
import { worldOfWarcraft } from './games/world-of-warcraft'
import { discord } from './tools/discord'
import { msiAfterburner } from './tools/msi-afterburner'
import { obsStudio } from './tools/obs-studio'
import { sharex } from './tools/sharex'

/** Add a new seed file and list it here — order is search/list order. */
const ENTRIES: CatalogEntry[] = [
  leagueOfLegends,
  dota2,
  warframe,
  genshinImpact,
  worldOfWarcraft,
  finalFantasyXiv,
  valorant,
  counterStrike2,
  apexLegends,
  overwatch2,
  destiny2,
  fortnite,
  escapeFromTarkov,
  rust,
  minecraft,
  pathOfExile,
  diabloIv,
  skyrim,
  eldenRing,
  baldursGate3,
  deadByDaylight,
  rocketLeague,
  obsStudio,
  msiAfterburner,
  discord,
  sharex,
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
  'counter-strike-2',
  'minecraft',
  'valorant',
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
