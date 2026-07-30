import { computeAvailability, getFreeKeys } from './domain/availability'
import { ANSI_FULL_LAYOUT } from './data/keyboardLayouts'
import { RESERVED_KEY_RULES } from './data/reservedKeys'
import type { InputProfile } from './types'

/**
 * Stage 1 placeholder UI — proves the build runs and the engine wires up.
 * Visual design and the SVG keyboard belong to Stage 2.
 */
const DEMO_PROFILES: InputProfile[] = [
  {
    id: 'demo-a',
    gameId: 'demo-a',
    name: 'Demo A',
    sourceType: 'official',
    verificationStatus: 'unverified',
    bindings: [
      { key: 'KeyW', action: 'Forward' },
      { key: 'KeyE', action: 'Interact' },
    ],
  },
  {
    id: 'demo-b',
    gameId: 'demo-b',
    name: 'Demo B',
    sourceType: 'official',
    verificationStatus: 'unverified',
    bindings: [
      { key: 'KeyW', action: 'Move Forward' },
      { key: 'KeyR', action: 'Reload' },
    ],
  },
]

const summary = computeAvailability({
  profiles: DEMO_PROFILES,
  layout: ANSI_FULL_LAYOUT,
  reservedRules: RESERVED_KEY_RULES,
  gamesById: {
    'demo-a': { name: 'Demo A' },
    'demo-b': { name: 'Demo B' },
  },
})

const freePreview = getFreeKeys(summary).slice(0, 12)

export default function App() {
  return (
    <main className="mx-auto max-w-xl px-4 py-10">
      <h1 className="text-2xl font-semibold">BindScope</h1>
      <p className="mt-2 text-sm opacity-70">
        Stage 1 scaffold — availability engine is live. Keyboard UI arrives in Stage 2.
      </p>

      <dl className="mt-8 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded border border-current/20 p-3">
          <dt className="opacity-70">Free</dt>
          <dd className="text-xl font-medium">{summary.freeCount}</dd>
        </div>
        <div className="rounded border border-current/20 p-3">
          <dt className="opacity-70">Partial</dt>
          <dd className="text-xl font-medium">{summary.partialCount}</dd>
        </div>
        <div className="rounded border border-current/20 p-3">
          <dt className="opacity-70">Heavy</dt>
          <dd className="text-xl font-medium">{summary.heavyCount}</dd>
        </div>
        <div className="rounded border border-current/20 p-3">
          <dt className="opacity-70">Reserved</dt>
          <dd className="text-xl font-medium">{summary.reservedCount}</dd>
        </div>
      </dl>

      <p className="mt-6 text-sm opacity-70">
        Sample free keys (first 12 of {summary.freeCount}): {freePreview.join(', ')}
      </p>
    </main>
  )
}
