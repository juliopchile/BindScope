import { describe, expect, it } from 'vitest'
import type { Game } from '../src/types'
import { matchesSearch, normalizeSearchText, searchGames } from '../src/utils/search'

const SAMPLE: Game[] = [
  {
    id: 'league-of-legends',
    name: 'League of Legends',
    kind: 'game',
    aliases: ['LoL'],
    tags: ['moba'],
    profileIds: ['x'],
  },
  {
    id: 'obs-studio',
    name: 'OBS Studio',
    kind: 'tool',
    aliases: ['OBS'],
    tags: ['streaming', 'yours'],
    profileIds: ['y'],
  },
]

describe('normalizeSearchText', () => {
  it('strips diacritics and punctuation', () => {
    expect(normalizeSearchText('Pokémon: GO!')).toBe('pokemon go')
  })
})

describe('matchesSearch', () => {
  it('matches aliases and partial tokens', () => {
    expect(matchesSearch('League of Legends LoL moba', 'lol')).toBe(true)
    expect(matchesSearch('League of Legends LoL moba', 'legends')).toBe(true)
    expect(matchesSearch('League of Legends LoL moba', 'zzz')).toBe(false)
  })
})

describe('searchGames', () => {
  it('returns all games for empty query', () => {
    expect(searchGames(SAMPLE, '')).toHaveLength(2)
  })

  it('finds tools by tag and games by alias', () => {
    expect(searchGames(SAMPLE, 'yours').map((g) => g.id)).toEqual(['obs-studio'])
    expect(searchGames(SAMPLE, 'lol').map((g) => g.id)).toEqual(['league-of-legends'])
  })
})
