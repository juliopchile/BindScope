import { useId, useState } from 'react'
import type { Game } from '../types'
import { searchGames } from '../utils/search'
import { messages } from '../ui/messages'

interface GameSearchProps {
  catalog: readonly Game[]
  selectedIds: ReadonlySet<string>
  onAdd: (gameId: string) => void
}

export function GameSearch({ catalog, selectedIds, onAdd }: GameSearchProps) {
  const inputId = useId()
  const listId = useId()
  const [query, setQuery] = useState('')
  const matches = searchGames(catalog, query).filter((game) => !selectedIds.has(game.id))

  return (
    <div className="space-y-2">
      <label
        htmlFor={inputId}
        className="text-xs font-semibold tracking-wide uppercase"
        style={{ color: 'var(--fg-muted)' }}
      >
        {messages.selectionHeading}
      </label>
      <input
        id={inputId}
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={messages.searchPlaceholder}
        aria-label={messages.searchAriaLabel}
        aria-controls={listId}
        className="w-full rounded-md border px-3 py-2 text-sm outline-none focus-visible:ring-2"
        style={{
          background: 'var(--bg)',
          borderColor: 'var(--border)',
          color: 'var(--fg)',
        }}
      />
      <ul id={listId} className="max-h-40 space-y-1 overflow-y-auto text-sm" role="listbox">
        {matches.length === 0 ? (
          <li style={{ color: 'var(--fg-muted)' }}>{messages.searchNoResults}</li>
        ) : (
          matches.map((game) => (
            <li key={game.id}>
              <button
                type="button"
                role="option"
                className="flex w-full items-center justify-between gap-2 rounded-md border px-3 py-2 text-left hover:opacity-90 focus-visible:outline focus-visible:outline-2"
                style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}
                onClick={() => {
                  onAdd(game.id)
                  setQuery('')
                }}
              >
                <span>
                  <span className="font-medium">{game.name}</span>
                  <span className="ml-2 text-xs" style={{ color: 'var(--fg-muted)' }}>
                    {game.kind === 'tool' ? messages.kindTool : messages.kindGame}
                  </span>
                </span>
                <span className="text-xs font-medium" style={{ color: 'var(--accent)' }}>
                  {messages.addGame}
                </span>
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  )
}
