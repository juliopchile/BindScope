import { describe, expect, it } from 'vitest'
import {
  CATALOG_ENTRIES,
  defaultEnabledLayerIds,
  pickRandomStarter,
  STARTER_POOL,
  toInputProfile,
} from '../src/data/catalog'
import {
  buildEnabledLayers,
  isStateVisible,
  profilesForSelection,
} from '../src/lib/selection'

describe('catalog seeds', () => {
  it('exposes layered profiles with verification on every binding', () => {
    expect(CATALOG_ENTRIES.length).toBeGreaterThan(0)
    for (const entry of CATALOG_ENTRIES) {
      expect(entry.game.profileIds).toContain(entry.profile.id)
      expect(entry.profile.layers.length).toBeGreaterThan(0)
      for (const layer of entry.profile.layers) {
        expect(layer.bindings.length).toBeGreaterThan(0)
        for (const binding of layer.bindings) {
          expect(binding.verification).toBeTruthy()
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
    ]) {
      expect(ids.has(id)).toBe(true)
    }
    expect(CATALOG_ENTRIES.some((e) => e.game.kind === 'tool')).toBe(true)
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
