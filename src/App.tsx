import { useState } from 'react'
import { EmptyState } from './components/EmptyState'
import { Filters } from './components/Filters'
import { GameSearch } from './components/GameSearch'
import { ImportExportDialog } from './components/ImportExportDialog'
import { KeyboardVisualizer } from './components/KeyboardVisualizer'
import { LayoutSelector } from './components/LayoutSelector'
import { Legend } from './components/Legend'
import { SelectedGames } from './components/SelectedGames'
import { SidePanel } from './components/SidePanel'
import { useBindScopeState } from './lib/useBindScopeState'

function App() {
  const state = useBindScopeState()
  const [importExportOpen, setImportExportOpen] = useState(false)

  const hasSelection = state.selectedProfileIds.length > 0

  return (
    <div className="min-h-screen">
      <header className="border-b border-border bg-surface-1/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-accent">BindScope</p>
            <h1 className="text-2xl font-bold">Game Keymap Availability</h1>
            <p className="text-sm text-muted">
              Overlay multiple game profiles and instantly see which keys stay free.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn" onClick={() => setImportExportOpen(true)}>
              Import / Export
            </button>
            <button type="button" className="btn" onClick={state.reset}>
              Reset
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-4 px-4 py-6 lg:grid-cols-[320px_minmax(0,1fr)_320px]">
        <div className="space-y-4">
          <GameSearch
            games={state.games}
            search={state.search}
            onSearchChange={state.setSearch}
            onSelectGame={state.addGameProfiles}
            selectedProfileIds={state.selectedProfileIds}
          />
          <SelectedGames
            games={state.games}
            selectedProfileIds={state.selectedProfileIds}
            profilesById={state.profilesById}
            onToggleProfile={state.toggleProfile}
            onRemoveGame={state.removeGame}
          />
          <LayoutSelector layoutId={state.layoutId} onChange={state.setLayoutId} />
          <Filters filters={state.filters} onChange={state.setFilters} />
          <Legend />
        </div>

        <section className="space-y-4">
          {!hasSelection ? (
            <EmptyState onReset={state.reset} />
          ) : (
            <div className="panel p-4">
              <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
                <div>
                  <h2 className="text-lg font-semibold">Keyboard overlay</h2>
                  <p className="text-sm text-muted">
                    {state.summary.freeCount} free ·{' '}
                    {state.summary.partialCount + state.summary.heavyCount} conflicted ·{' '}
                    {state.selectedProfiles.length} profiles
                  </p>
                </div>
              </div>
              <KeyboardVisualizer
                layout={state.layout}
                keys={state.summary.keys}
                filters={state.filters}
                selectedKey={state.selectedKey}
                onSelectKey={state.setSelectedKey}
              />
            </div>
          )}
        </section>

        <SidePanel summary={state.summary} selectedKey={state.selectedKey} />
      </main>

      <ImportExportDialog
        open={importExportOpen}
        onClose={() => setImportExportOpen(false)}
        selectedProfiles={state.selectedProfiles}
        onImport={(profiles) => state.setCustomProfiles((current) => [...current, ...profiles])}
      />
    </div>
  )
}

export default App
