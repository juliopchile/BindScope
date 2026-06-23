import type { Game } from '../types'

export function normalizeSearchTerm(value: string): string {
  return value.trim().toLowerCase()
}

export function searchGames(games: Game[], query: string): Game[] {
  const term = normalizeSearchTerm(query)
  if (!term) return games

  return games.filter((game) => {
    const haystack = [game.name, ...(game.aliases ?? []), ...(game.tags ?? [])]
      .join(' ')
      .toLowerCase()
    return haystack.includes(term) || term.split(/\s+/).every((part) => haystack.includes(part))
  })
}
