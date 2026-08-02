import { useI18n } from '../i18n/useI18n'
import type { ExtraGameNames, EnabledLayersByGame, ProfileOverridesByGame } from '../lib/selection'
import { displayNameForGame, getGame, getSeedProfile } from '../lib/selection'

interface SelectedGamesProps {
  selectedIds: readonly string[]
  enabledLayersByGame: EnabledLayersByGame
  overridesByGame: ProfileOverridesByGame
  extraNames?: ExtraGameNames
  onRemove: (gameId: string) => void
  onToggleLayer: (gameId: string, layerId: string) => void
  onClearOverride: (gameId: string) => void
}

export function SelectedGames({
  selectedIds,
  enabledLayersByGame,
  overridesByGame,
  extraNames = {},
  onRemove,
  onToggleLayer,
  onClearOverride,
}: SelectedGamesProps) {
  const { t } = useI18n()

  if (selectedIds.length === 0) {
    return (
      <p className="text-sm" style={{ color: 'var(--fg-muted)' }}>
        {t('emptySelection')}
      </p>
    )
  }

  return (
    <div className="space-y-3">
      <h3
        className="text-xs font-semibold tracking-wide uppercase"
        style={{ color: 'var(--fg-muted)' }}
      >
        {t('selectedHeading')}
      </h3>
      <ul className="flex flex-wrap gap-2">
        {selectedIds.map((gameId) => {
          const game = getGame(gameId)
          const name = displayNameForGame(gameId, extraNames)
          const hasOverride = Boolean(overridesByGame[gameId])
          return (
            <li
              key={gameId}
              className="inline-flex min-h-10 items-center gap-2 rounded-full border px-3 py-1.5 text-sm"
              style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}
            >
              <span className="font-medium">{name}</span>
              {game?.kind === 'tool' ? (
                <span className="text-xs" style={{ color: 'var(--fg-muted)' }}>
                  {t('kindTool')}
                </span>
              ) : null}
              {hasOverride ? (
                <button
                  type="button"
                  className="min-h-8 text-xs underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2"
                  style={{ color: 'var(--fg-muted)' }}
                  onClick={() => onClearOverride(gameId)}
                >
                  {t('clearOverride')}
                </button>
              ) : null}
              <button
                type="button"
                className="min-h-8 text-xs underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2"
                style={{ color: 'var(--fg-muted)' }}
                onClick={() => onRemove(gameId)}
                aria-label={`${t('removeGame')} ${name}`}
              >
                {t('removeGame')}
              </button>
            </li>
          )
        })}
      </ul>

      <div className="space-y-3">
        <h3
          className="text-xs font-semibold tracking-wide uppercase"
          style={{ color: 'var(--fg-muted)' }}
        >
          {t('layersHeading')}
        </h3>
        {selectedIds.map((gameId) => {
          const name = displayNameForGame(gameId, extraNames)
          const profile = getSeedProfile(gameId)
          const hasOverride = Boolean(overridesByGame[gameId])
          if (!profile) {
            return hasOverride ? (
              <p key={gameId} className="text-sm" style={{ color: 'var(--fg-muted)' }}>
                {name}: {t('overrideActive')}
              </p>
            ) : null
          }
          const enabled = new Set(enabledLayersByGame[gameId] ?? [])
          return (
            <fieldset
              key={gameId}
              className="rounded-md border p-3"
              style={{ borderColor: 'var(--border)' }}
              disabled={hasOverride}
            >
              <legend className="px-1 text-sm font-medium">{name}</legend>
              {hasOverride ? (
                <p className="mb-2 text-xs" style={{ color: 'var(--fg-muted)' }}>
                  {t('overrideActive')}
                </p>
              ) : null}
              <ul className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                {profile.layers.map((layer) => (
                  <li key={layer.id} className="min-w-0">
                    <label className="inline-flex min-h-10 cursor-pointer items-center gap-2">
                      <input
                        type="checkbox"
                        checked={enabled.has(layer.id)}
                        disabled={hasOverride}
                        onChange={() => onToggleLayer(gameId, layer.id)}
                      />
                      <span>
                        {layer.label}
                        {!layer.defaultEnabled ? (
                          <span className="ml-1 text-xs" style={{ color: 'var(--fg-muted)' }}>
                            ({t('layerOptIn')})
                          </span>
                        ) : null}
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            </fieldset>
          )
        })}
      </div>
    </div>
  )
}
