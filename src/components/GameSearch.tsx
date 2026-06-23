import { useMemo } from 'react'
import type { Game } from '../types'
import { searchGames } from '../utils/search'

interface GameSearchProps {
  games: Game[]
  search: string
  onSearchChange: (value: string) => void
  onSelectGame: (gameId: string) => void
  selectedProfileIds: string[]
}

export function GameSearch({
  games,
  search,
  onSearchChange,
  onSelectGame,
  selectedProfileIds,
}: GameSearchProps) {
  const results = useMemo(() => searchGames(games, search).slice(0, 12), [games, search])

  return (
    <section className="panel p-4" aria-label="Game search">
      <label htmlFor="game-search" className="mb-2 block text-sm font-medium text-muted">
        Search games
      </label>
      <input
        id="game-search"
        className="input"
        placeholder="Skyrim, Genshin, Warframe..."
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        autoComplete="off"
      />
      <ul
        className="mt-3 max-h-64 space-y-1 overflow-y-auto"
        role="listbox"
        aria-label="Search results"
      >
        {results.map((game) => {
          const activeCount = game.profileIds.filter((id) => selectedProfileIds.includes(id)).length
          return (
            <li key={game.id}>
              <button
                type="button"
                className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm hover:bg-surface-2"
                onClick={() => onSelectGame(game.id)}
                role="option"
              >
                <span>
                  <span className="font-medium">{game.name}</span>
                  {game.tags?.length ? (
                    <span className="ml-2 text-xs text-muted">
                      {game.tags.slice(0, 2).join(' · ')}
                    </span>
                  ) : null}
                </span>
                <span className="text-xs text-muted">
                  {activeCount > 0 ? `${activeCount} active` : `${game.profileIds.length} profiles`}
                </span>
              </button>
            </li>
          )
        })}
        {results.length === 0 ? (
          <li className="px-3 py-2 text-sm text-muted">No games match your search.</li>
        ) : null}
      </ul>
    </section>
  )
}
