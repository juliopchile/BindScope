import { useId, useRef, useState } from 'react'
import { useI18n } from '../i18n/useI18n'
import type { ActionSearchHit } from '../lib/actionSearch'
import { searchActions } from '../lib/actionSearch'
import type { InputProfile } from '../types'
import { bindingChordLabel } from '../utils/keyNormalization'

export type ActionSearchScope = 'selected' | 'catalog'

interface ActionSearchProps {
  selectedProfiles: readonly InputProfile[]
  catalogProfiles: readonly InputProfile[]
  selectedGamesById: Record<string, { name: string }>
  catalogGamesById: Record<string, { name: string }>
  onSelectHit: (hit: ActionSearchHit) => void
}

const RESULT_LIMIT = 40

export function ActionSearch({
  selectedProfiles,
  catalogProfiles,
  selectedGamesById,
  catalogGamesById,
  onSelectHit,
}: ActionSearchProps) {
  const { t } = useI18n()
  const inputId = useId()
  const listId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const [query, setQuery] = useState('')
  const [scope, setScope] = useState<ActionSearchScope>('selected')
  const [open, setOpen] = useState(false)

  const profiles = scope === 'selected' ? selectedProfiles : catalogProfiles
  const gamesById = scope === 'selected' ? selectedGamesById : catalogGamesById
  const trimmed = query.trim()
  const emptySelection = scope === 'selected' && selectedProfiles.length === 0
  const allHits = trimmed && !emptySelection ? searchActions(profiles, gamesById, query) : []
  const hits = allHits.slice(0, RESULT_LIMIT)
  const showResults = open && trimmed.length > 0

  function pick(hit: ActionSearchHit) {
    onSelectHit(hit)
    setQuery('')
    setOpen(false)
  }

  return (
    <div ref={rootRef} className="action-search relative w-full max-w-sm shrink-0">
      <div className="flex flex-wrap items-center gap-2">
        <label htmlFor={inputId} className="sr-only">
          {t('actionSearchAriaLabel')}
        </label>
        <input
          id={inputId}
          type="search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          onBlur={(event) => {
            const next = event.relatedTarget as Node | null
            if (next && rootRef.current?.contains(next)) return
            setOpen(false)
          }}
          placeholder={t('actionSearchPlaceholder')}
          aria-label={t('actionSearchAriaLabel')}
          aria-controls={listId}
          aria-expanded={showResults}
          autoComplete="off"
          className="min-h-9 min-w-0 flex-1 rounded-md border px-2.5 py-1.5 text-sm outline-none focus-visible:ring-2"
          style={{
            background: 'var(--bg)',
            borderColor: 'var(--border)',
            color: 'var(--fg)',
          }}
        />
        <div
          className="inline-flex rounded-md border text-xs"
          style={{ borderColor: 'var(--border)' }}
          role="group"
          aria-label={t('actionSearchScopeAriaLabel')}
        >
          <ScopeButton
            active={scope === 'selected'}
            onClick={() => setScope('selected')}
            label={t('actionSearchScopeSelected')}
          />
          <ScopeButton
            active={scope === 'catalog'}
            onClick={() => setScope('catalog')}
            label={t('actionSearchScopeCatalog')}
          />
        </div>
      </div>

      {showResults ? (
        <ul
          id={listId}
          role="listbox"
          className="action-search__results absolute right-0 z-20 mt-1 max-h-56 w-full min-w-[16rem] overflow-y-auto rounded-md border text-sm shadow-md"
          style={{
            background: 'var(--surface)',
            borderColor: 'var(--border)',
          }}
        >
          {emptySelection ? (
            <li className="px-3 py-2" style={{ color: 'var(--fg-muted)' }}>
              {t('actionSearchEmptySelection')}
            </li>
          ) : hits.length === 0 ? (
            <li className="px-3 py-2" style={{ color: 'var(--fg-muted)' }}>
              {t('actionSearchNoResults')}
            </li>
          ) : (
            hits.map((hit) => {
              const chord = bindingChordLabel(hit.key, hit.modifiers)
              return (
                <li key={`${hit.profileId}-${hit.key}-${hit.action}-${chord}`}>
                  <button
                    type="button"
                    role="option"
                    className="flex min-h-10 w-full flex-col items-start gap-0.5 px-3 py-2 text-left hover:opacity-90 focus-visible:outline focus-visible:outline-2"
                    style={{ outlineColor: 'var(--focus)' }}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => pick(hit)}
                  >
                    <span className="font-medium">{hit.action}</span>
                    <span className="text-xs" style={{ color: 'var(--fg-muted)' }}>
                      {hit.gameName}
                      {hit.context ? ` · ${hit.context}` : ''}
                      {' · '}
                      {chord}
                    </span>
                  </button>
                </li>
              )
            })
          )}
        </ul>
      ) : null}
    </div>
  )
}

function ScopeButton({
  active,
  onClick,
  label,
}: {
  active: boolean
  onClick: () => void
  label: string
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className="min-h-9 px-2 py-1 font-medium focus-visible:outline focus-visible:outline-2"
      style={{
        background: active ? 'var(--bg)' : 'transparent',
        color: active ? 'var(--fg)' : 'var(--fg-muted)',
        outlineColor: 'var(--focus)',
      }}
    >
      {label}
    </button>
  )
}
