import type { CatalogEntry } from '../../../types'
import { bind } from '../bind'

export const rocketLeague: CatalogEntry = {
  game: {
    id: 'rocket-league',
    name: 'Rocket League',
    kind: 'game',
    aliases: ['RL'],
    tags: ['sports', 'driving'],
    profileIds: ['rocket-league-default'],
  },
  profile: {
    id: 'rocket-league-default',
    gameId: 'rocket-league',
    name: 'Default',
    sourceType: 'official',
    versionLabel: 'PC defaults (curated)',
    verificationStatus: 'community',
    layers: [
      {
        id: 'drive',
        label: 'Driving & ball',
        defaultEnabled: true,
        bindings: [
          bind('KeyW', 'Throttle / accelerate'),
          bind('KeyS', 'Brake / reverse'),
          bind('KeyA', 'Steer Left'),
          bind('KeyD', 'Steer Right'),
          bind('Space', 'Jump / double jump'),
          bind('ShiftLeft', 'Powerslide / handbrake'),
          bind('ControlLeft', 'Air roll (common remap)', 'community'),
          bind('KeyX', 'Boost'),
          bind('KeyC', 'Air roll left (common)', 'community'),
          bind('KeyV', 'Air roll right (common)', 'community'),
          bind('KeyQ', 'Scoreboard / look back'),
          bind('KeyE', 'Ball cam toggle'),
          bind('KeyR', 'Rear view'),
          bind('Mouse1', 'Steer / look (mouse steer layouts)', 'unverified'),
        ],
      },
      {
        id: 'comms',
        label: 'Comms & UI',
        defaultEnabled: false,
        bindings: [
          bind('Digit1', 'Quick chat: I got it!'),
          bind('Digit2', 'Quick chat: Need boost'),
          bind('Digit3', 'Quick chat: Take the shot!'),
          bind('Digit4', 'Quick chat: Defending'),
          bind('Tab', 'Scoreboard'),
          bind('Escape', 'Menu'),
          bind('Enter', 'Chat'),
          bind('KeyT', 'Chat'),
          bind('KeyY', 'Team chat'),
          bind('KeyF', 'Focus on ball'),
        ],
      },
    ],
  },
}
