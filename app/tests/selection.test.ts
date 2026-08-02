import { describe, expect, it } from 'vitest'
import {
  CATALOG_ENTRIES,
  defaultEnabledLayerIds,
  GAMES_BY_ID,
  pickRandomStarter,
  SEED_PROFILES_BY_GAME_ID,
  STARTER_POOL,
  toInputProfile,
} from '../src/data/catalog'
import {
  buildEnabledLayers,
  isStateVisible,
  profilesForSelection,
} from '../src/lib/selection'
import { normalizeKey } from '../src/utils/keyNormalization'
import { makeProfile } from './fixtures'

describe('catalog seeds', () => {
  it('exposes layered profiles with verification on every binding', () => {
    expect(CATALOG_ENTRIES.length).toBeGreaterThanOrEqual(20)
    expect(CATALOG_ENTRIES.length).toBeLessThanOrEqual(30)
    for (const entry of CATALOG_ENTRIES) {
      expect(entry.game.profileIds).toContain(entry.profile.id)
      expect(entry.profile.gameId).toBe(entry.game.id)
      expect(entry.profile.layers.length).toBeGreaterThan(0)
      expect(entry.profile.layers.some((layer) => layer.defaultEnabled)).toBe(true)
      for (const layer of entry.profile.layers) {
        expect(layer.id.length).toBeGreaterThan(0)
        expect(layer.bindings.length).toBeGreaterThan(0)
        for (const binding of layer.bindings) {
          expect(binding.verification).toBeTruthy()
        }
      }
    }
  })

  it('keeps unique game and profile ids with matching lookup maps', () => {
    const gameIds = CATALOG_ENTRIES.map((e) => e.game.id)
    const profileIds = CATALOG_ENTRIES.map((e) => e.profile.id)
    expect(new Set(gameIds).size).toBe(gameIds.length)
    expect(new Set(profileIds).size).toBe(profileIds.length)
    for (const entry of CATALOG_ENTRIES) {
      expect(GAMES_BY_ID[entry.game.id]).toBe(entry.game)
      expect(SEED_PROFILES_BY_GAME_ID[entry.game.id]).toBe(entry.profile)
    }
  })

  it('uses already-normalized key identifiers on every binding', () => {
    for (const entry of CATALOG_ENTRIES) {
      for (const layer of entry.profile.layers) {
        for (const binding of layer.bindings) {
          const normalized = normalizeKey(binding.key)
          expect(normalized, `${entry.game.id}:${binding.key}`).toBe(binding.key)
        }
      }
    }
  })

  it('includes required example titles and tool profiles', () => {
    const ids = new Set(CATALOG_ENTRIES.map((e) => e.game.id))
    for (const id of [
      'league-of-legends',
      'warframe',
      'genshin-impact',
      'world-of-warcraft',
      'obs-studio',
      'msi-afterburner',
      'discord',
      'minecraft',
      'dota-2',
    ]) {
      expect(ids.has(id)).toBe(true)
    }
    expect(CATALOG_ENTRIES.some((e) => e.game.kind === 'tool')).toBe(true)
    expect(CATALOG_ENTRIES.filter((e) => e.game.kind === 'tool').length).toBeGreaterThanOrEqual(4)
  })

  it('keeps STARTER_POOL ids inside the catalog', () => {
    for (const id of STARTER_POOL) {
      expect(GAMES_BY_ID[id]).toBeTruthy()
    }
  })
})

describe('layer flattening', () => {
  it('includes only enabled layers', () => {
    const profile = CATALOG_ENTRIES[0]!.profile
    const defaults = defaultEnabledLayerIds(profile)
    const flat = toInputProfile(profile, defaults)
    expect(flat.bindings.length).toBeGreaterThan(0)

    const empty = toInputProfile(profile, [])
    expect(empty.bindings).toHaveLength(0)
  })
})

describe('selection helpers', () => {
  it('builds default layers for newly selected games', () => {
    const layers = buildEnabledLayers(['warframe'])
    expect(layers.warframe?.length).toBeGreaterThan(0)
    const profiles = profilesForSelection(['warframe'], layers)
    expect(profiles).toHaveLength(1)
    expect(profiles[0]?.bindings.length).toBeGreaterThan(0)
  })

  it('includes imported overrides alongside seeds for the same game', () => {
    const layers = buildEnabledLayers(['warframe'])
    const override = makeProfile({
      id: 'warframe-imported',
      gameId: 'warframe',
      name: 'Imported',
      sourceType: 'imported',
      verificationStatus: 'custom',
      bindings: [{ key: 'KeyP', action: 'Ping' }],
    })
    const profiles = profilesForSelection(['warframe'], layers, { warframe: override })
    expect(profiles).toHaveLength(2)
    expect(profiles.some((p) => p.sourceType === 'official')).toBe(true)
    expect(profiles.some((p) => p.id === 'warframe-imported')).toBe(true)
  })

  it('treats empty filter set as show-all', () => {
    expect(isStateVisible('free', new Set())).toBe(true)
    expect(isStateVisible('heavy', new Set(['free']))).toBe(false)
  })
})

describe('pickRandomStarter', () => {
  it('picks from the editable starter pool', () => {
    const pick = pickRandomStarter(STARTER_POOL, () => 0)
    expect(STARTER_POOL).toContain(pick)
    expect(pick).toBe(STARTER_POOL[0])
  })
})
