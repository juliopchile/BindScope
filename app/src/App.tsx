import { useState } from 'react'
import { GameSearch } from './components/GameSearch'
import { KeyboardVisualizer } from './components/KeyboardVisualizer'
import { KeyDetailPanel } from './components/KeyDetailPanel'
import { Legend } from './components/Legend'
import { SelectedGames } from './components/SelectedGames'
import { CATALOG_GAMES, pickRandomStarter } from './data/catalog'
import { ANSI_FULL_LAYOUT } from './data/keyboardLayouts'
import { RESERVED_KEY_RULES } from './data/reservedKeys'
import { computeAvailability } from './domain/availability'
import {
  buildEnabledLayers,
  gamesNameMapForSelection,
  profilesForSelection,
  type EnabledLayersByGame,
} from './lib/selection'
import type { KeyAvailabilityState, KeyboardKey } from './types'
import { LEGEND_STATES } from './ui/keyStateMeta'
import { messages } from './ui/messages'

function createInitialSelection(): {
  selectedIds: string[]
  layers: EnabledLayersByGame
} {
  const starter = pickRandomStarter()
  const selectedIds = [starter]
  return { selectedIds, layers: buildEnabledLayers(selectedIds) }
}

export default function App() {
  const [initial] = useState(createInitialSelection)
  const [selectedIds, setSelectedIds] = useState<string[]>(initial.selectedIds)
  const [enabledLayersByGame, setEnabledLayersByGame] = useState<EnabledLayersByGame>(
    initial.layers,
  )
  const [activeFilters, setActiveFilters] = useState<Set<KeyAvailabilityState>>(() => new Set())
  const [selectedKey, setSelectedKey] = useState<KeyboardKey | null>(null)

  const profiles = profilesForSelection(selectedIds, enabledLayersByGame)
  const summary = computeAvailability({
    profiles,
    layout: ANSI_FULL_LAYOUT,
    reservedRules: RESERVED_KEY_RULES,
    gamesById: gamesNameMapForSelection(selectedIds),
  })
  const selectedIdSet = new Set(selectedIds)

  function addGame(gameId: string) {
    if (selectedIdSet.has(gameId)) return
    const nextIds = [...selectedIds, gameId]
    setSelectedIds(nextIds)
    setEnabledLayersByGame((prev) => buildEnabledLayers(nextIds, prev))
  }

  function removeGame(gameId: string) {
    const nextIds = selectedIds.filter((id) => id !== gameId)
    setSelectedIds(nextIds)
    setEnabledLayersByGame((prev) => buildEnabledLayers(nextIds, prev))
  }

  function toggleLayer(gameId: string, layerId: string) {
    setEnabledLayersByGame((prev) => {
      const current = new Set(prev[gameId] ?? [])
      if (current.has(layerId)) current.delete(layerId)
      else current.add(layerId)
      return { ...prev, [gameId]: [...current] }
    })
  }

  function toggleFilter(state: KeyAvailabilityState) {
    setActiveFilters((prev) => {
      const base =
        prev.size === 0 ? new Set<KeyAvailabilityState>(LEGEND_STATES) : new Set(prev)
      if (base.has(state)) base.delete(state)
      else base.add(state)
      if (base.size === LEGEND_STATES.length) return new Set()
      return base
    })
  }

  return (
    <div className="min-h-screen">
      <header
        className="border-b px-4 py-4"
        style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}
      >
        <div className="mx-auto flex max-w-6xl flex-wrap items-baseline gap-x-3 gap-y-1">
          <h1 className="text-xl font-semibold">{messages.appTitle}</h1>
          <p className="text-sm" style={{ color: 'var(--fg-muted)' }}>
            {messages.appTagline}
          </p>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-4 px-4 py-4 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="space-y-4">
          <section
            className="rounded-lg border p-4"
            style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
          >
            <GameSearch catalog={CATALOG_GAMES} selectedIds={selectedIdSet} onAdd={addGame} />
            <div className="mt-4 border-t pt-4" style={{ borderColor: 'var(--border)' }}>
              <SelectedGames
                selectedIds={selectedIds}
                enabledLayersByGame={enabledLayersByGame}
                onRemove={removeGame}
                onToggleLayer={toggleLayer}
              />
            </div>
          </section>

          <section
            className="rounded-lg border p-4"
            style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
            aria-labelledby="keyboard-heading"
          >
            <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
              <h2
                id="keyboard-heading"
                className="text-xs font-semibold tracking-wide uppercase"
                style={{ color: 'var(--fg-muted)' }}
              >
                {messages.keyboardHeading}
              </h2>
              <p className="text-xs" style={{ color: 'var(--fg-muted)' }}>
                {messages.starterNote}
              </p>
            </div>

            <KeyboardVisualizer
              layout={ANSI_FULL_LAYOUT}
              keys={summary.keys}
              selectedKey={selectedKey}
              onSelectKey={setSelectedKey}
              activeFilters={activeFilters}
            />

            <div className="mt-4 border-t pt-3" style={{ borderColor: 'var(--border)' }}>
              <Legend activeFilters={activeFilters} onToggleFilter={toggleFilter} />
            </div>
          </section>
        </div>

        <KeyDetailPanel summary={summary} selectedKey={selectedKey} />
      </main>
    </div>
  )
}
