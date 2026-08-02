import { describe, expect, it } from 'vitest'
import { searchActions } from '../src/lib/actionSearch'
import type { InputProfile } from '../src/types'

const PROFILES: InputProfile[] = [
  {
    id: 'cs2-seed',
    gameId: 'counter-strike-2',
    name: 'CS2 defaults',
    sourceType: 'official',
    verificationStatus: 'community',
    bindings: [
      { key: 'KeyR', action: 'Reload' },
      { key: 'KeyV', action: 'Push to talk', context: 'Voice' },
      { key: 'KeyB', action: 'Buy menu', modifiers: ['shift'] },
    ],
  },
  {
    id: 'discord-seed',
    gameId: 'discord',
    name: 'Discord defaults',
    sourceType: 'community',
    verificationStatus: 'community',
    bindings: [
      { key: 'KeyV', action: 'Push-to-talk (PTT)', context: 'Voice' },
      { key: 'KeyM', action: 'Mute', modifiers: ['ctrl'] },
    ],
  },
]

const GAMES = {
  'counter-strike-2': { name: 'Counter-Strike 2' },
  discord: { name: 'Discord' },
}

describe('searchActions', () => {
  it('returns no hits for an empty query', () => {
    expect(searchActions(PROFILES, GAMES, '')).toEqual([])
    expect(searchActions(PROFILES, GAMES, '   ')).toEqual([])
  })

  it('matches action substrings with forgiving normalization', () => {
    const hits = searchActions(PROFILES, GAMES, 'reload')
    expect(hits).toHaveLength(1)
    expect(hits[0]).toMatchObject({
      key: 'KeyR',
      action: 'Reload',
      gameId: 'counter-strike-2',
    })
  })

  it('matches across action and context tokens', () => {
    const hits = searchActions(PROFILES, GAMES, 'push talk')
    expect(hits.map((h) => h.gameId).sort()).toEqual(['counter-strike-2', 'discord'])
  })

  it('matches punctuation-insensitive action labels', () => {
    const hits = searchActions(PROFILES, GAMES, 'push to talk ptt')
    expect(hits.some((h) => h.gameId === 'discord')).toBe(true)
  })

  it('does not match game names — only action/context (D10 source strings)', () => {
    expect(searchActions(PROFILES, GAMES, 'counter-strike')).toEqual([])
  })

  it('returns empty when nothing matches', () => {
    expect(searchActions(PROFILES, GAMES, 'zzz-nope')).toEqual([])
  })
})
