import type { CatalogEntry } from '../../../types'
import { bind } from '../bind'

/** Tool profile — "Yours" layer: OSD / overlay hotkeys. */
export const msiAfterburner: CatalogEntry = {
  game: {
    id: 'msi-afterburner',
    name: 'MSI Afterburner',
    kind: 'tool',
    aliases: ['Afterburner', 'RTSS'],
    tags: ['overlay', 'tool', 'yours'],
    profileIds: ['msi-afterburner-default'],
  },
  profile: {
    id: 'msi-afterburner-default',
    gameId: 'msi-afterburner',
    name: 'Common hotkeys',
    sourceType: 'community',
    versionLabel: 'Typical Afterburner / RTSS defaults (curated)',
    verificationStatus: 'community',
    notes: 'Exact binds vary by install; curated common OSD / profile hotkeys.',
    layers: [
      {
        id: 'osd',
        label: 'OSD & profiles',
        defaultEnabled: true,
        bindings: [
          bind('F12', 'Toggle OSD', 'community', { modifiers: ['ctrl'] }),
          bind('Home', 'Toggle monitoring', 'community', { modifiers: ['ctrl'] }),
          bind('End', 'Toggle framerate limiter', 'community', { modifiers: ['ctrl'] }),
          bind('Insert', 'Screenshot', 'community', { modifiers: ['ctrl'] }),
          bind('Delete', 'Video capture', 'community', { modifiers: ['ctrl'] }),
          bind('PageUp', 'Profile up', 'community', { modifiers: ['ctrl'] }),
          bind('PageDown', 'Profile down', 'community', { modifiers: ['ctrl'] }),
          bind('KeyO', 'Toggle OSD (bare remap)', 'unverified'),
          bind('KeyF', 'Toggle FPS overlay (bare remap)', 'unverified'),
        ],
      },
      {
        id: 'fan',
        label: 'Fan & server',
        defaultEnabled: false,
        bindings: [
          bind('KeyU', 'Unlock fan control', 'community', { modifiers: ['ctrl', 'shift'] }),
          bind('KeyL', 'Lock UI', 'community', { modifiers: ['ctrl', 'shift'] }),
          bind('KeyS', 'Save profile', 'community', { modifiers: ['ctrl', 'alt'] }),
          bind('F11', 'Server / remote', 'unverified', { modifiers: ['ctrl'] }),
        ],
      },
    ],
  },
}
