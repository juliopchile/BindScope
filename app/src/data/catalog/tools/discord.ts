import type { CatalogEntry } from '../../../types'
import { bind } from '../bind'

/** Tool profile — "Yours" layer: voice / chat hotkeys that collide with games. */
export const discord: CatalogEntry = {
  game: {
    id: 'discord',
    name: 'Discord',
    kind: 'tool',
    aliases: ['Discord App'],
    tags: ['voice', 'tool', 'yours'],
    profileIds: ['discord-default'],
  },
  profile: {
    id: 'discord-default',
    gameId: 'discord',
    name: 'Common hotkeys',
    sourceType: 'community',
    versionLabel: 'Desktop defaults / common remaps (curated)',
    verificationStatus: 'community',
    notes:
      'Official Discord uses modifier chords; bare KeyV/KeyY remaps are common and collide with FPS voice binds.',
    layers: [
      {
        id: 'voice',
        label: 'Voice & mute',
        defaultEnabled: true,
        bindings: [
          bind('Backquote', 'Push to talk (default-ish)', 'community', {
            modifiers: ['ctrl'],
          }),
          bind('KeyM', 'Toggle mute', 'community', { modifiers: ['ctrl', 'shift'] }),
          bind('KeyD', 'Toggle deafen', 'community', { modifiers: ['ctrl', 'shift'] }),
          bind('KeyV', 'Push to talk (bare remap)', 'unverified'),
          bind('KeyY', 'Push to talk (bare remap)', 'unverified'),
          bind('KeyU', 'Toggle mute (bare remap)', 'unverified'),
        ],
      },
      {
        id: 'overlay',
        label: 'Overlay & navigation',
        defaultEnabled: true,
        bindings: [
          bind('Backslash', 'Toggle overlay', 'community', { modifiers: ['ctrl', 'shift'] }),
          bind('KeyK', 'Toggle overlay lock', 'community', { modifiers: ['ctrl', 'shift'] }),
          bind('AltLeft', 'Push to mute (hold)', 'community'),
          bind('KeyG', 'Go live / stream', 'community', { modifiers: ['ctrl', 'alt'] }),
        ],
      },
      {
        id: 'advanced',
        label: 'Advanced',
        defaultEnabled: false,
        bindings: [
          bind('KeyI', 'Answer call', 'community', { modifiers: ['ctrl', 'alt'] }),
          bind('KeyH', 'Decline / disconnect call', 'community', { modifiers: ['ctrl', 'alt'] }),
          bind('Digit1', 'Switch to server 1', 'unverified', { modifiers: ['ctrl'] }),
          bind('Digit2', 'Switch to server 2', 'unverified', { modifiers: ['ctrl'] }),
          bind('KeyN', 'Create / join voice', 'unverified'),
        ],
      },
    ],
  },
}
