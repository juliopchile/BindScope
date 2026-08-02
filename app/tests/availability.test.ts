import { describe, expect, it } from 'vitest'
import {
  computeAvailability,
  getConflictedKeys,
  getFreeKeys,
  parseAvailabilityInput,
  resolveProfiles,
} from '../src/domain/availability'
import {
  GAMES_BY_ID,
  GENSHIN_DEFAULT,
  makeProfile,
  SKYRIM_CUSTOM,
  SKYRIM_DEFAULT,
  TEST_LAYOUT,
  TEST_MOUSE_LAYOUT,
  TEST_RESERVED,
  WARFRAME_DEFAULT,
} from './fixtures'

describe('availability computation', () => {
  it('removes a key used in any selected profile from the free set', () => {
    const summary = computeAvailability({
      profiles: [SKYRIM_DEFAULT],
      layout: TEST_LAYOUT,
      reservedRules: [],
      gamesById: GAMES_BY_ID,
    })

    expect(getFreeKeys(summary)).not.toContain('KeyW')
    expect(getFreeKeys(summary)).toContain('KeyR')
    expect(summary.keys.find((k) => k.key === 'KeyW')?.state).toBe('heavy')
  })

  it('never returns bare reserved keys as free', () => {
    const summary = computeAvailability({
      profiles: [],
      layout: TEST_LAYOUT,
      reservedRules: TEST_RESERVED,
      gamesById: GAMES_BY_ID,
    })

    const f11 = summary.keys.find((k) => k.key === 'F11')
    expect(f11?.state).toBe('reserved')
    expect(getFreeKeys(summary)).not.toContain('F11')

    // Chord-only reserved rules must not reserve the bare key.
    expect(summary.keys.find((k) => k.key === 'KeyF')?.state).toBe('free')
  })

  it('lets custom profiles override defaults for the same game', () => {
    const summary = computeAvailability({
      profiles: [SKYRIM_DEFAULT, SKYRIM_CUSTOM],
      layout: TEST_LAYOUT,
      reservedRules: [],
      gamesById: GAMES_BY_ID,
    })

    // Custom wins: W/E from default are gone; R/F from custom remain.
    expect(summary.keys.find((k) => k.key === 'KeyW')?.state).toBe('free')
    expect(summary.keys.find((k) => k.key === 'KeyE')?.state).toBe('free')
    expect(summary.keys.find((k) => k.key === 'KeyR')?.state).toBe('heavy')
    expect(summary.keys.find((k) => k.key === 'KeyF')?.state).toBe('heavy')
  })

  it('resolveProfiles prefers custom over official', () => {
    const resolved = resolveProfiles([SKYRIM_DEFAULT, SKYRIM_CUSTOM])
    expect(resolved).toHaveLength(1)
    expect(resolved[0]?.id).toBe('skyrim-custom')
  })

  it('deduplicates duplicate bindings without corrupting the summary', () => {
    const dupes = makeProfile({
      id: 'dupes',
      gameId: 'skyrim',
      name: 'Dupes',
      sourceType: 'official',
      bindings: [
        { key: 'KeyW', action: 'Forward' },
        { key: 'KeyW', action: 'Forward' },
        { key: 'KeyW', action: 'Sprint', modifiers: ['shift'] },
      ],
    })

    const summary = computeAvailability({
      profiles: [dupes],
      layout: TEST_LAYOUT,
      reservedRules: [],
      gamesById: GAMES_BY_ID,
    })

    const w = summary.keys.find((k) => k.key === 'KeyW')
    expect(w?.bindings).toHaveLength(2)
    expect(w?.distinctActions.sort()).toEqual(['Forward', 'Sprint'])
    expect(summary.heavyCount).toBe(1)
  })

  it('marks partial vs heavy across multiple profiles', () => {
    const summary = computeAvailability({
      profiles: [SKYRIM_DEFAULT, GENSHIN_DEFAULT, WARFRAME_DEFAULT],
      layout: TEST_LAYOUT,
      reservedRules: [],
      gamesById: GAMES_BY_ID,
    })

    expect(summary.keys.find((k) => k.key === 'KeyW')?.state).toBe('heavy')
    expect(summary.keys.find((k) => k.key === 'KeyE')?.state).toBe('heavy')
    expect(summary.keys.find((k) => k.key === 'KeyR')?.state).toBe('partial')
    expect(getConflictedKeys(summary).length).toBeGreaterThan(0)
  })

  it('reports bindings for keys missing from the active layout as unknown', () => {
    const custom = makeProfile({
      id: 'custom-print',
      gameId: 'skyrim',
      name: 'Custom',
      sourceType: 'custom',
      bindings: [{ key: 'PrintScreen', action: 'Screenshot' }],
    })

    const summary = computeAvailability({
      profiles: [custom],
      layout: TEST_LAYOUT,
      reservedRules: [],
      gamesById: GAMES_BY_ID,
    })

    expect(summary.unknownCount).toBe(1)
    expect(summary.keys.find((k) => k.key === 'PrintScreen')?.state).toBe('unknown')
  })

  it('rejects malformed input instead of failing silently', () => {
    expect(() =>
      parseAvailabilityInput({
        profiles: [{ id: '', gameId: 'x', name: 'x', sourceType: 'official', bindings: [] }],
        layout: TEST_LAYOUT,
        gamesById: GAMES_BY_ID,
      }),
    ).toThrow()

    expect(() =>
      computeAvailability({
        profiles: [SKYRIM_DEFAULT],
        layout: { ...TEST_LAYOUT, keys: [] },
        gamesById: GAMES_BY_ID,
      }),
    ).toThrow()
  })

  it('keeps modifier chords in the model on the same physical key', () => {
    const profile = makeProfile({
      id: 'chords',
      gameId: 'skyrim',
      name: 'Chords',
      sourceType: 'official',
      bindings: [
        { key: 'KeyW', action: 'Forward' },
        { key: 'KeyW', action: 'Sprint', modifiers: ['shift'] },
      ],
    })

    const summary = computeAvailability({
      profiles: [profile],
      layout: TEST_LAYOUT,
      reservedRules: [],
      gamesById: GAMES_BY_ID,
    })

    const w = summary.keys.find((k) => k.key === 'KeyW')
    expect(w?.bindings).toHaveLength(2)
    expect(w?.bindings.some((b) => b.binding.modifiers?.includes('shift'))).toBe(true)
  })

  it('includes mouse device keys in the availability universe', () => {
    const mouseOnly = makeProfile({
      id: 'fps-mouse',
      gameId: 'skyrim',
      name: 'FPS Mouse',
      sourceType: 'official',
      bindings: [
        { key: 'Mouse1', action: 'Attack' },
        { key: 'Mouse2', action: 'Aim' },
        { key: 'WheelUp', action: 'Prev weapon' },
      ],
    })

    const withoutMouse = computeAvailability({
      profiles: [mouseOnly],
      layout: TEST_LAYOUT,
      reservedRules: [],
      gamesById: GAMES_BY_ID,
    })
    expect(withoutMouse.keys.find((k) => k.key === 'Mouse1')?.state).toBe('unknown')
    expect(withoutMouse.unknownCount).toBe(3)

    const withMouse = computeAvailability({
      profiles: [mouseOnly],
      layout: TEST_LAYOUT,
      deviceLayouts: [TEST_MOUSE_LAYOUT],
      reservedRules: [],
      gamesById: GAMES_BY_ID,
    })

    expect(withMouse.keys.find((k) => k.key === 'Mouse1')?.state).toBe('heavy')
    expect(withMouse.keys.find((k) => k.key === 'Mouse2')?.state).toBe('heavy')
    expect(withMouse.keys.find((k) => k.key === 'WheelUp')?.state).toBe('heavy')
    expect(withMouse.keys.find((k) => k.key === 'Mouse3')?.state).toBe('free')
    expect(withMouse.keys.find((k) => k.key === 'Mouse4')?.state).toBe('free')
    expect(withMouse.unknownCount).toBe(0)
    expect(withMouse.keys.find((k) => k.key === 'Mouse1')?.bindings[0]?.binding.action).toBe(
      'Attack',
    )
  })

  it('scores partial mouse conflicts across profiles like keyboard keys', () => {
    const a = makeProfile({
      id: 'a',
      gameId: 'skyrim',
      name: 'A',
      sourceType: 'official',
      bindings: [{ key: 'Mouse1', action: 'Fire' }],
    })
    const b = makeProfile({
      id: 'b',
      gameId: 'genshin',
      name: 'B',
      sourceType: 'official',
      bindings: [{ key: 'Mouse2', action: 'Camera' }],
    })

    const summary = computeAvailability({
      profiles: [a, b],
      layout: TEST_LAYOUT,
      deviceLayouts: [TEST_MOUSE_LAYOUT],
      reservedRules: [],
      gamesById: GAMES_BY_ID,
    })

    expect(summary.keys.find((k) => k.key === 'Mouse1')?.state).toBe('partial')
    expect(summary.keys.find((k) => k.key === 'Mouse2')?.state).toBe('partial')
  })
})
