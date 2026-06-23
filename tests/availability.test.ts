import { describe, expect, it } from 'vitest'
import { GAMES_BY_ID, PROFILES_BY_ID } from '../src/data/games'
import { RESERVED_KEY_RULES } from '../src/data/reservedKeys'
import { ANSI_TKL_LAYOUT } from '../src/data/keyboardLayouts'
import { computeAvailability, getConflictedKeys, getFreeKeys } from '../src/domain/availability'

describe('availability computation', () => {
  const skyrim = PROFILES_BY_ID['skyrim-default']!
  const genshin = PROFILES_BY_ID['genshin-default']!
  const warframe = PROFILES_BY_ID['warframe-default']!

  it('marks unbound layout keys as free', () => {
    const summary = computeAvailability({
      profiles: [skyrim],
      layout: ANSI_TKL_LAYOUT,
      reservedRules: RESERVED_KEY_RULES,
      gamesById: GAMES_BY_ID,
    })

    expect(summary.freeCount).toBeGreaterThan(0)
    expect(getFreeKeys(summary)).toContain('KeyH')
  })

  it('detects shared WASD movement bindings', () => {
    const summary = computeAvailability({
      profiles: [skyrim, genshin],
      layout: ANSI_TKL_LAYOUT,
      reservedRules: [],
      gamesById: GAMES_BY_ID,
    })

    const w = summary.keys.find((k) => k.key === 'KeyW')
    expect(w?.state).toBe('shared')
    expect(w?.bindings).toHaveLength(2)
  })

  it('detects partial conflicts on multi-purpose keys', () => {
    const summary = computeAvailability({
      profiles: [skyrim, genshin, warframe],
      layout: ANSI_TKL_LAYOUT,
      reservedRules: [],
      gamesById: GAMES_BY_ID,
    })

    const e = summary.keys.find((k) => k.key === 'KeyE')
    expect(e?.state === 'partial' || e?.state === 'heavy').toBe(true)
    expect(getConflictedKeys(summary).length).toBeGreaterThan(0)
  })

  it('marks reserved keys from rules', () => {
    const summary = computeAvailability({
      profiles: [],
      layout: ANSI_TKL_LAYOUT,
      reservedRules: RESERVED_KEY_RULES,
      gamesById: GAMES_BY_ID,
    })

    const f4 = summary.keys.find((k) => k.key === 'F4')
    expect(f4?.state).toBe('reserved')
  })

  it('reports unknown bindings outside layout', () => {
    const customProfile = {
      ...skyrim,
      id: 'custom-print',
      bindings: [
        { key: 'PrintScreen' as const, action: 'Screenshot', confidence: 'high' as const },
      ],
    }

    const summary = computeAvailability({
      profiles: [customProfile],
      layout: ANSI_TKL_LAYOUT,
      reservedRules: [],
      gamesById: GAMES_BY_ID,
    })

    expect(summary.unknownCount).toBeGreaterThan(0)
  })
})
