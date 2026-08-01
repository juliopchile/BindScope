import type { InputProfile } from '../types'

/** Temporary demo profiles so the keyboard shows real conflicts. Stage 3 replaces these. */
export const DEMO_PROFILES: InputProfile[] = [
  {
    id: 'demo-a',
    gameId: 'demo-a',
    name: 'Demo A',
    sourceType: 'official',
    verificationStatus: 'unverified',
    bindings: [
      { key: 'KeyW', action: 'Forward' },
      { key: 'KeyA', action: 'Left' },
      { key: 'KeyS', action: 'Back' },
      { key: 'KeyD', action: 'Right' },
      { key: 'KeyE', action: 'Interact' },
      { key: 'Space', action: 'Jump' },
      { key: 'KeyC', action: 'Crouch' },
      { key: 'KeyF', action: 'Flashlight' },
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
      { key: 'KeyA', action: 'Move Left' },
      { key: 'KeyS', action: 'Move Back' },
      { key: 'KeyD', action: 'Move Right' },
      { key: 'KeyE', action: 'Ability' },
      { key: 'KeyR', action: 'Reload' },
      { key: 'Space', action: 'Jump' },
      { key: 'KeyQ', action: 'Ultimate' },
      { key: 'KeyF', action: 'Ping' },
    ],
  },
  {
    id: 'demo-c',
    gameId: 'demo-c',
    name: 'Demo C',
    sourceType: 'official',
    verificationStatus: 'unverified',
    bindings: [
      { key: 'KeyW', action: 'Walk' },
      { key: 'KeyE', action: 'Use' },
      { key: 'KeyR', action: 'Reload' },
      { key: 'Tab', action: 'Map' },
      { key: 'KeyM', action: 'Map' },
      { key: 'KeyI', action: 'Inventory' },
    ],
  },
]

export const DEMO_GAMES_BY_ID: Record<string, { name: string }> = {
  'demo-a': { name: 'Demo A' },
  'demo-b': { name: 'Demo B' },
  'demo-c': { name: 'Demo C' },
}
