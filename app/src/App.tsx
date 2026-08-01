import { useState } from 'react'
import { GameSearch } from './components/GameSearch'
import { KeyboardVisualizer } from './components/KeyboardVisualizer'
import { KeyDetailPanel } from './components/KeyDetailPanel'
import { Legend } from './components/Legend'
import { PrefsControls } from './components/PrefsControls'
import { ProfileIO } from './components/ProfileIO'
import { SelectedGames } from './components/SelectedGames'
import { CATALOG_GAMES, GAMES_BY_ID, pickRandomStarter } from './data/catalog'
import { ANSI_FULL_LAYOUT } from './data/keyboardLayouts'
import { RESERVED_KEY_RULES } from './data/reservedKeys'
import { computeAvailability, resolveProfiles } from './domain/availability'
import { useI18n } from './i18n/useI18n'
import {
  buildSafeKeysDocument,
  downloadJson,
  parseImportDocument,
  readFileAsText,
  serializeProfilesDocument,
} from './lib/importExport'
import {
  buildEnabledLayers,
  gamesNameMapForSelection,
  profilesForSelection,
  type EnabledLayersByGame,
  type ExtraGameNames,
  type ProfileOverridesByGame,
} from './lib/selection'
import type { Game, KeyboardKey, KeyAvailabilityState } from './types'
import { LEGEND_STATES } from './ui/keyStateMeta'

function createInitialSelection(): {
  selectedIds: string[]
  layers: EnabledLayersByGame
} {
  const starter = pickRandomStarter()
  const selectedIds = [starter]
  return { selectedIds, layers: buildEnabledLayers(selectedIds) }
}

export default function App() {
  const { t } = useI18n()
  const [initial] = useState(createInitialSelection)
  const [selectedIds, setSelectedIds] = useState<string[]>(initial.selectedIds)
  const [enabledLayersByGame, setEnabledLayersByGame] = useState<EnabledLayersByGame>(
    initial.layers,
  )
  const [overridesByGame, setOverridesByGame] = useState<ProfileOverridesByGame>({})
  const [extraNames, setExtraNames] = useState<ExtraGameNames>({})
  const [activeFilters, setActiveFilters] = useState<Set<KeyAvailabilityState>>(() => new Set())
  const [selectedKey, setSelectedKey] = useState<KeyboardKey | null>(null)

  const profiles = profilesForSelection(selectedIds, enabledLayersByGame, overridesByGame)
  const gamesById = gamesNameMapForSelection(selectedIds, extraNames)
  const summary = computeAvailability({
    profiles,
    layout: ANSI_FULL_LAYOUT,
    reservedRules: RESERVED_KEY_RULES,
    gamesById,
  })
  const selectedIdSet = new Set(selectedIds)
  const effectiveProfiles = resolveProfiles(profiles)

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
    setOverridesByGame((prev) => {
      if (!(gameId in prev)) return prev
      const next = { ...prev }
      delete next[gameId]
      return next
    })
  }

  function toggleLayer(gameId: string, layerId: string) {
    if (overridesByGame[gameId]) return
    setEnabledLayersByGame((prev) => {
      const current = new Set(prev[gameId] ?? [])
      if (current.has(layerId)) current.delete(layerId)
      else current.add(layerId)
      return { ...prev, [gameId]: [...current] }
    })
  }

  function clearOverride(gameId: string) {
    setOverridesByGame((prev) => {
      if (!(gameId in prev)) return prev
      const next = { ...prev }
      delete next[gameId]
      return next
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

  async function handleImportFile(file: File): Promise<string> {
    const text = await readFileAsText(file)
    const result = parseImportDocument(text)

    const nextOverrides: ProfileOverridesByGame = { ...overridesByGame }
    for (const profile of result.profiles) {
      nextOverrides[profile.gameId] = profile
    }
    setOverridesByGame(nextOverrides)

    const nextExtras: ExtraGameNames = { ...extraNames }
    for (const game of result.document.games ?? []) {
      if (!GAMES_BY_ID[game.id]) nextExtras[game.id] = { name: game.name }
    }
    for (const profile of result.profiles) {
      if (!GAMES_BY_ID[profile.gameId] && !nextExtras[profile.gameId]) {
        nextExtras[profile.gameId] = { name: profile.name }
      }
    }
    setExtraNames(nextExtras)

    const importedIds = result.profiles.map((profile) => profile.gameId)
    const nextIds = [...selectedIds]
    for (const gameId of importedIds) {
      if (!nextIds.includes(gameId)) nextIds.push(gameId)
    }
    setSelectedIds(nextIds)
    setEnabledLayersByGame((prev) => buildEnabledLayers(nextIds, prev))

    if (result.skippedBindings === 0 && result.skippedProfiles === 0) {
      return t('importSuccess', { count: result.profiles.length })
    }
    return t('importPartial', {
      count: result.profiles.length,
      skippedBindings: result.skippedBindings,
      skippedProfiles: result.skippedProfiles,
    })
  }

  function handleExportProfiles() {
    if (effectiveProfiles.length === 0) return
    const games: Game[] = effectiveProfiles.map((profile) => {
      const catalog = GAMES_BY_ID[profile.gameId]
      if (catalog) return catalog
      return {
        id: profile.gameId,
        name: gamesById[profile.gameId]?.name ?? profile.name,
        kind: 'game',
        profileIds: [profile.id],
      }
    })
    const document = serializeProfilesDocument(effectiveProfiles, { games })
    downloadJson('bindscope-profiles.json', document)
  }

  function handleExportSafeKeys() {
    if (selectedIds.length === 0) return
    downloadJson('bindscope-safe-keys.json', buildSafeKeysDocument(summary))
  }

  return (
    <div className="min-h-screen">
      <header
        className="border-b px-4 py-4"
        style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}
      >
        <div className="mx-auto flex max-w-6xl flex-wrap items-end justify-between gap-3">
          <div className="flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-1">
            <h1 className="text-xl font-semibold">{t('appTitle')}</h1>
            <p className="text-sm" style={{ color: 'var(--fg-muted)' }}>
              {t('appTagline')}
            </p>
          </div>
          <PrefsControls />
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
                overridesByGame={overridesByGame}
                extraNames={extraNames}
                onRemove={removeGame}
                onToggleLayer={toggleLayer}
                onClearOverride={clearOverride}
              />
            </div>
            <div className="mt-4 border-t pt-4" style={{ borderColor: 'var(--border)' }}>
              <ProfileIO
                onImportFile={handleImportFile}
                onExportProfiles={handleExportProfiles}
                onExportSafeKeys={handleExportSafeKeys}
                canExport={effectiveProfiles.length > 0}
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
                {t('keyboardHeading')}
              </h2>
              <p className="text-xs" style={{ color: 'var(--fg-muted)' }}>
                {t('starterNote')}
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
