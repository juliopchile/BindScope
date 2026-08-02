import type { CatalogEntry } from '../../../types'
import { bind } from '../bind'

/** Tool profile — "Yours" layer: screenshot / capture hotkeys that collide with games. */
export const sharex: CatalogEntry = {
  game: {
    id: 'sharex',
    name: 'ShareX',
    kind: 'tool',
    aliases: ['Share X'],
    tags: ['screenshot', 'tool', 'yours'],
    profileIds: ['sharex-default'],
  },
  profile: {
    id: 'sharex-default',
    gameId: 'sharex',
    name: 'Common hotkeys',
    sourceType: 'community',
    versionLabel: 'Typical ShareX defaults (curated)',
    verificationStatus: 'community',
    notes: 'Exact binds are user-configurable; curated common PrintScreen / chord assignments.',
    layers: [
      {
        id: 'capture',
        label: 'Capture',
        defaultEnabled: true,
        bindings: [
          bind('PrintScreen', 'Capture region'),
          bind('PrintScreen', 'Capture entire screen', 'community', { modifiers: ['ctrl'] }),
          bind('PrintScreen', 'Capture active window', 'community', { modifiers: ['alt'] }),
          bind('PrintScreen', 'Start screen recorder', 'community', { modifiers: ['shift'] }),
          bind('KeyS', 'Capture region (bare remap)', 'unverified'),
          bind('KeyR', 'Screen record (bare remap)', 'unverified'),
        ],
      },
      {
        id: 'upload',
        label: 'Upload & tools',
        defaultEnabled: false,
        bindings: [
          bind('KeyU', 'Upload from clipboard', 'community', { modifiers: ['ctrl', 'shift'] }),
          bind('KeyC', 'Color picker', 'community', { modifiers: ['ctrl', 'shift'] }),
          bind('KeyH', 'Hash check / tools', 'unverified', { modifiers: ['ctrl', 'shift'] }),
          bind('KeyO', 'OCR capture', 'community', { modifiers: ['ctrl', 'shift'] }),
          bind('F12', 'Capture last region', 'community', { modifiers: ['ctrl'] }),
        ],
      },
    ],
  },
}
