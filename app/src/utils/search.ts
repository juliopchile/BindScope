import type { Game } from '../types'

/** Lowercase, strip diacritics, collapse non-alphanumerics for forgiving match. */
export function normalizeSearchText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ')
}

function haystackFor(game: Game): string {
  return normalizeSearchText(
    [game.name, game.kind, ...(game.aliases ?? []), ...(game.tags ?? [])].join(' '),
  )
}

/** Subsequence match: query tokens must appear in order as substrings of the haystack. */
export function matchesSearch(haystack: string, query: string): boolean {
  const normalizedQuery = normalizeSearchText(query)
  if (!normalizedQuery) return true
  const normalizedHaystack = normalizeSearchText(haystack)
  return normalizedQuery.split(' ').every((token) => normalizedHaystack.includes(token))
}

export function searchGames(games: readonly Game[], query: string): Game[] {
  const q = normalizeSearchText(query)
  if (!q) return [...games]
  return games.filter((game) => matchesSearch(haystackFor(game), q))
}
