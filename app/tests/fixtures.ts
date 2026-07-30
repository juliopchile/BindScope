import type { InputProfile, KeyboardLayout, ReservedKeyRule } from '../src/types'

/** Tiny layout for table-driven tests — not the product ANSI layout. */
export const TEST_LAYOUT: KeyboardLayout = {
  id: 'test-mini',
  name: 'Test Mini',
  description: 'Five-key fixture layout',
  width: 240,
  height: 48,
  keys: [
    { id: 'KeyW', label: 'W', x: 0, y: 0, width: 48, height: 48 },
    { id: 'KeyE', label: 'E', x: 48, y: 0, width: 48, height: 48 },
    { id: 'KeyR', label: 'R', x: 96, y: 0, width: 48, height: 48 },
    { id: 'KeyF', label: 'F', x: 144, y: 0, width: 48, height: 48 },
    { id: 'F11', label: 'F11', x: 192, y: 0, width: 48, height: 48 },
  ],
}

export const TEST_RESERVED: ReservedKeyRule[] = [
  {
    id: 'f11-fullscreen',
    keys: ['F11'],
    modifiers: [],
    label: 'F11',
    reason: 'Toggle fullscreen',
    scope: 'global',
  },
  {
    id: 'alt-f4',
    keys: ['KeyF'],
    modifiers: ['alt'],
    label: 'Alt+F',
    reason: 'Chord only — must not reserve bare F',
    scope: 'global',
  },
]

export const GAMES_BY_ID = {
  skyrim: { name: 'Skyrim' },
  genshin: { name: 'Genshin Impact' },
  warframe: { name: 'Warframe' },
}

export function makeProfile(
  partial: Pick<InputProfile, 'id' | 'gameId' | 'name' | 'sourceType' | 'bindings'> &
    Partial<InputProfile>,
): InputProfile {
  return {
    verificationStatus: 'verified',
    ...partial,
  }
}

export const SKYRIM_DEFAULT = makeProfile({
  id: 'skyrim-default',
  gameId: 'skyrim',
  name: 'Skyrim Default',
  sourceType: 'official',
  bindings: [
    { key: 'KeyW', action: 'Forward' },
    { key: 'KeyE', action: 'Activate' },
  ],
})

export const GENSHIN_DEFAULT = makeProfile({
  id: 'genshin-default',
  gameId: 'genshin',
  name: 'Genshin Default',
  sourceType: 'official',
  bindings: [
    { key: 'KeyW', action: 'Move Forward' },
    { key: 'KeyE', action: 'Elemental Skill' },
  ],
})

export const WARFRAME_DEFAULT = makeProfile({
  id: 'warframe-default',
  gameId: 'warframe',
  name: 'Warframe Default',
  sourceType: 'official',
  bindings: [
    { key: 'KeyW', action: 'Move Forward' },
    { key: 'KeyE', action: 'Use' },
    { key: 'KeyR', action: 'Reload' },
  ],
})

export const SKYRIM_CUSTOM = makeProfile({
  id: 'skyrim-custom',
  gameId: 'skyrim',
  name: 'Skyrim Custom',
  sourceType: 'custom',
  verificationStatus: 'custom',
  bindings: [
    { key: 'KeyR', action: 'Activate' },
    { key: 'KeyF', action: 'Sneak' },
  ],
})
