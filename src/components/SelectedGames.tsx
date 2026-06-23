import type { Game, InputProfile } from '../types'

interface SelectedGamesProps {
  games: Game[]
  selectedProfileIds: string[]
  profilesById: Record<string, InputProfile>
  onToggleProfile: (profileId: string) => void
  onRemoveGame: (gameId: string) => void
}

export function SelectedGames({
  games,
  selectedProfileIds,
  profilesById,
  onToggleProfile,
  onRemoveGame,
}: SelectedGamesProps) {
  const selectedGames = games.filter((game) =>
    game.profileIds.some((id) => selectedProfileIds.includes(id)),
  )

  if (selectedGames.length === 0) return null

  return (
    <section className="panel p-4" aria-label="Selected games">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">Selected</h2>
      <div className="space-y-3">
        {selectedGames.map((game) => (
          <article key={game.id} className="rounded-lg border border-border bg-surface-2/70 p-3">
            <div className="mb-2 flex items-center justify-between gap-2">
              <h3 className="font-medium">{game.name}</h3>
              <button
                type="button"
                className="btn px-2 py-1 text-xs"
                onClick={() => onRemoveGame(game.id)}
              >
                Remove
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {game.profileIds.map((profileId) => {
                const profile = profilesById[profileId]
                if (!profile) return null
                const active = selectedProfileIds.includes(profileId)
                return (
                  <button
                    key={profileId}
                    type="button"
                    className={`chip ${active ? 'border-accent text-accent' : ''}`}
                    aria-pressed={active}
                    onClick={() => onToggleProfile(profileId)}
                  >
                    {profile.name}
                  </button>
                )
              })}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
