import { useState } from 'react'
import { KeyboardVisualizer } from './components/KeyboardVisualizer'
import { KeyDetailPanel } from './components/KeyDetailPanel'
import { Legend } from './components/Legend'
import { DEMO_GAMES_BY_ID, DEMO_PROFILES } from './data/demoProfiles'
import { ANSI_FULL_LAYOUT } from './data/keyboardLayouts'
import { RESERVED_KEY_RULES } from './data/reservedKeys'
import { computeAvailability } from './domain/availability'
import type { KeyboardKey } from './types'
import { messages } from './ui/messages'

const summary = computeAvailability({
  profiles: DEMO_PROFILES,
  layout: ANSI_FULL_LAYOUT,
  reservedRules: RESERVED_KEY_RULES,
  gamesById: DEMO_GAMES_BY_ID,
})

export default function App() {
  const [selectedKey, setSelectedKey] = useState<KeyboardKey | null>(null)

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

      <main className="mx-auto grid max-w-6xl gap-4 px-4 py-4 lg:grid-cols-[minmax(0,1fr)_260px]">
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
              {messages.stageNote}
            </p>
          </div>

          <KeyboardVisualizer
            layout={ANSI_FULL_LAYOUT}
            keys={summary.keys}
            selectedKey={selectedKey}
            onSelectKey={setSelectedKey}
          />

          <div className="mt-4 border-t pt-3" style={{ borderColor: 'var(--border)' }}>
            <Legend />
          </div>
        </section>

        <KeyDetailPanel summary={summary} selectedKey={selectedKey} />
      </main>
    </div>
  )
}
