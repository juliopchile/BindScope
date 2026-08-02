import { useState } from 'react'
import { ActionSearch } from './components/ActionSearch'
import { ChromeToolbar, type ChromePanelId } from './components/ChromeToolbar'
import { GameSearch } from './components/GameSearch'
import { KeyboardVisualizer } from './components/KeyboardVisualizer'
import { KeyDetailPanel } from './components/KeyDetailPanel'
import { LayoutSelector } from './components/LayoutSelector'
import { Legend } from './components/Legend'
import { MouseVisualizer } from './components/MouseVisualizer'
import { PrefsControls } from './components/PrefsControls'
import { ProfileIO } from './components/ProfileIO'
import { SelectedGames } from './components/SelectedGames'
import {
  CATALOG_GAMES,
  CATALOG_INPUT_PROFILES,
  GAMES_BY_ID,
  GAMES_NAME_BY_ID,
  pickRandomStarter,
} from './data/catalog'
import { getLayout } from './data/keyboardLayouts'
import { getMouseLayout, isMouseKeyId } from './data/mouseLayout'
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
  readStoredLayout,
  readStoredShowChordMarks,
  readStoredShowMouse,
  writeStoredLayout,
  writeStoredShowChordMarks,
  writeStoredShowMouse,
} from './lib/preferences'
import type { ActionSearchHit } from './lib/actionSearch'
import {
  buildEnabledLayers,
  gamesNameMapForSelection,
  profilesForSelection,
  type EnabledLayersByGame,
  type ExtraGameNames,
  type ProfileOverridesByGame,
} from './lib/selection'
import type { Game, KeyboardKey, KeyAvailabilityState, LayoutId } from './types'
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
  const [openPanel, setOpenPanel] = useState<ChromePanelId | null>(null)
  const [layoutId, setLayoutId] = useState<LayoutId>(() => readStoredLayout())
  const [showMouse, setShowMouse] = useState(() => readStoredShowMouse())
  const [showChordMarks, setShowChordMarks] = useState(() => readStoredShowChordMarks())
  const [chordsOnly, setChordsOnly] = useState(false)

  const layout = getLayout(layoutId)
  const mouseLayout = getMouseLayout()
  const profiles = profilesForSelection(selectedIds, enabledLayersByGame, overridesByGame)
  const gamesById = gamesNameMapForSelection(selectedIds, extraNames)
  const summary = computeAvailability({
    profiles,
    layout,
    deviceLayouts: showMouse ? [mouseLayout] : undefined,
    reservedRules: RESERVED_KEY_RULES,
    gamesById,
  })
  const selectedIdSet = new Set(selectedIds)
  const effectiveProfiles = resolveProfiles(profiles)

  function handleLayoutChange(nextId: LayoutId) {
    setLayoutId(nextId)
    writeStoredLayout(nextId)
    const nextLayout = getLayout(nextId)
    setSelectedKey((prev) => {
      if (!prev) return prev
      if (nextLayout.keys.some((key) => key.id === prev)) return prev
      if (showMouse && isMouseKeyId(prev)) return prev
      return null
    })
  }

  function handleShowMouseChange(next: boolean) {
    setShowMouse(next)
    writeStoredShowMouse(next)
    if (!next) {
      setSelectedKey((prev) => (prev && isMouseKeyId(prev) ? null : prev))
    }
  }

  function handleShowChordMarksChange(next: boolean) {
    setShowChordMarks(next)
    writeStoredShowChordMarks(next)
  }

  function toggleChordsOnly() {
    setChordsOnly((prev) => !prev)
  }

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

  function handleSelectKey(key: KeyboardKey) {
    setSelectedKey((prev) => (prev === key ? null : key))
  }

  function focusKey(key: KeyboardKey) {
    if (isMouseKeyId(key) && !showMouse) {
      handleShowMouseChange(true)
    }
    setSelectedKey(key)
  }

  function handleActionSearchHit(hit: ActionSearchHit) {
    if (!selectedIdSet.has(hit.gameId)) {
      addGame(hit.gameId)
    }
    setOpenPanel(null)
    focusKey(hit.key)
  }

  function dismissDetail() {
    setSelectedKey(null)
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
        className="border-b px-4 py-3"
        style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}
      >
        <ChromeToolbar
          leading={
            <div className="flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-1">
              <h1 className="text-xl font-semibold">{t('appTitle')}</h1>
              <p className="text-sm" style={{ color: 'var(--fg-muted)' }}>
                {t('appTagline')}
              </p>
            </div>
          }
          layoutControl={<LayoutSelector value={layoutId} onChange={handleLayoutChange} />}
          openPanel={openPanel}
          onOpenPanelChange={setOpenPanel}
          gamesBadge={selectedIds.length}
          gamesPanel={
            <div className="space-y-4">
              <GameSearch catalog={CATALOG_GAMES} selectedIds={selectedIdSet} onAdd={addGame} />
              <div className="border-t pt-4" style={{ borderColor: 'var(--border)' }}>
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
            </div>
          }
          ioPanel={
            <ProfileIO
              onImportFile={handleImportFile}
              onExportProfiles={handleExportProfiles}
              onExportSafeKeys={handleExportSafeKeys}
              canExport={effectiveProfiles.length > 0}
            />
          }
          prefsPanel={
            <PrefsControls
              showMouse={showMouse}
              onShowMouseChange={handleShowMouseChange}
              showChordMarks={showChordMarks}
              onShowChordMarksChange={handleShowChordMarksChange}
            />
          }
        />
      </header>

      <main className="mx-auto max-w-[1400px] space-y-3 px-4 py-4">
        <div
          className={
            selectedKey
              ? 'lg:grid lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start lg:gap-3'
              : undefined
          }
        >
          <section
            className="keyboard-stage rounded-lg border p-3 sm:p-4"
            style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
            aria-labelledby="keyboard-heading"
          >
            <div className="mb-3 flex flex-wrap items-end justify-between gap-x-3 gap-y-2">
              <div className="min-w-0 space-y-1">
                <h2
                  id="keyboard-heading"
                  className="text-xs font-semibold tracking-wide uppercase"
                  style={{ color: 'var(--fg-muted)' }}
                >
                  {showMouse ? t('devicesHeading') : t('keyboardHeading')}
                </h2>
                <p className="text-xs" style={{ color: 'var(--fg-muted)' }}>
                  {t('starterNote')}
                </p>
              </div>
              <ActionSearch
                selectedProfiles={effectiveProfiles}
                catalogProfiles={CATALOG_INPUT_PROFILES}
                selectedGamesById={gamesById}
                catalogGamesById={GAMES_NAME_BY_ID}
                onSelectHit={handleActionSearchHit}
              />
            </div>

            <div className="flex flex-col items-stretch gap-4 lg:flex-row lg:items-start lg:gap-3">
              <div className="min-w-0 flex-1">
                <KeyboardVisualizer
                  layout={layout}
                  keys={summary.keys}
                  selectedKey={selectedKey}
                  onSelectKey={handleSelectKey}
                  activeFilters={activeFilters}
                  chordsOnly={chordsOnly}
                  showChordMarks={showChordMarks}
                />
              </div>
              {showMouse ? (
                <div className="mx-auto w-full max-w-[180px] shrink-0 lg:mx-0 lg:w-[160px] lg:pt-1">
                  <MouseVisualizer
                    layout={mouseLayout}
                    keys={summary.keys}
                    selectedKey={selectedKey}
                    onSelectKey={handleSelectKey}
                    activeFilters={activeFilters}
                    chordsOnly={chordsOnly}
                    showChordMarks={showChordMarks}
                  />
                </div>
              ) : null}
            </div>

            <div
              className="mt-3 flex flex-col gap-3 border-t pt-3 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between"
              style={{ borderColor: 'var(--border)' }}
            >
              <div className="min-w-0 flex-1">
                <Legend
                  activeFilters={activeFilters}
                  onToggleFilter={toggleFilter}
                  chordsOnly={chordsOnly}
                  onToggleChordsOnly={toggleChordsOnly}
                />
              </div>
              <dl
                className="flex flex-wrap gap-x-4 gap-y-1 text-sm"
                aria-label={t('summaryHeading')}
              >
                <SummaryCount label={t('summaryFree')} value={summary.freeCount} />
                <SummaryCount label={t('summaryPartial')} value={summary.partialCount} />
                <SummaryCount label={t('summaryHeavy')} value={summary.heavyCount} />
                <SummaryCount label={t('summaryReserved')} value={summary.reservedCount} />
              </dl>
            </div>
          </section>

          {selectedKey ? (
            <>
              <button
                type="button"
                className="key-detail-backdrop"
                aria-label={t('detailDismiss')}
                onClick={dismissDetail}
              />
              <KeyDetailPanel
                summary={summary}
                selectedKey={selectedKey}
                onDismiss={dismissDetail}
              />
            </>
          ) : null}
        </div>
      </main>
    </div>
  )
}

function SummaryCount({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-baseline gap-1.5">
      <dt style={{ color: 'var(--fg-muted)' }}>{label}</dt>
      <dd className="font-semibold tabular-nums">{value}</dd>
    </div>
  )
}
