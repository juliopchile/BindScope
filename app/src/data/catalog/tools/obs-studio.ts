import type { CatalogEntry } from '../../../types'
import { bind } from '../bind'

/** Tool profile — "Yours" layer: streaming/recording hotkeys that collide with games. */
export const obsStudio: CatalogEntry = {
  game: {
    id: 'obs-studio',
    name: 'OBS Studio',
    kind: 'tool',
    aliases: ['OBS'],
    tags: ['streaming', 'tool', 'yours'],
    profileIds: ['obs-studio-default'],
  },
  profile: {
    id: 'obs-studio-default',
    gameId: 'obs-studio',
    name: 'Common hotkeys',
    sourceType: 'community',
    versionLabel: 'Typical community defaults (curated)',
    verificationStatus: 'community',
    notes: 'OBS has empty defaults; these are common community assignments treated as a Yours layer.',
    layers: [
      {
        id: 'recording',
        label: 'Stream & record',
        defaultEnabled: true,
        bindings: [
          bind('F5', 'Start / stop streaming', 'community', { modifiers: ['ctrl', 'alt'] }),
          bind('F6', 'Start / stop recording', 'community', { modifiers: ['ctrl', 'alt'] }),
          bind('F7', 'Pause recording', 'community', { modifiers: ['ctrl', 'alt'] }),
          bind('F8', 'Studio mode toggle', 'community', { modifiers: ['ctrl', 'alt'] }),
          bind('KeyR', 'Start recording (bare, common remap)', 'unverified'),
          bind('KeyS', 'Stop streaming (bare, common remap)', 'unverified'),
          bind('Numpad0', 'Mute desktop audio'),
          bind('Numpad1', 'Mute mic'),
        ],
      },
      {
        id: 'scenes',
        label: 'Scenes & sources',
        defaultEnabled: true,
        bindings: [
          bind('Digit1', 'Scene 1', 'community', { modifiers: ['ctrl', 'alt'] }),
          bind('Digit2', 'Scene 2', 'community', { modifiers: ['ctrl', 'alt'] }),
          bind('Digit3', 'Scene 3', 'community', { modifiers: ['ctrl', 'alt'] }),
          bind('Digit4', 'Scene 4', 'community', { modifiers: ['ctrl', 'alt'] }),
          bind('Digit5', 'Scene 5', 'community', { modifiers: ['ctrl', 'alt'] }),
          bind('KeyB', 'Toggle browser source', 'community', { modifiers: ['ctrl', 'shift'] }),
          bind('KeyG', 'Toggle game capture', 'community', { modifiers: ['ctrl', 'shift'] }),
        ],
      },
      {
        id: 'advanced',
        label: 'Advanced / rare',
        defaultEnabled: false,
        bindings: [
          bind('F9', 'Replay buffer save', 'community', { modifiers: ['ctrl', 'alt'] }),
          bind('F10', 'Replay buffer toggle', 'community', { modifiers: ['ctrl', 'alt'] }),
          bind('KeyM', 'Mute mic toggle', 'unverified'),
          bind('KeyN', 'Mute desktop toggle', 'unverified'),
          bind('KeyP', 'Toggle projector', 'community', { modifiers: ['ctrl', 'alt'] }),
        ],
      },
    ],
  },
}
