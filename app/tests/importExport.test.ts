import { describe, expect, it } from 'vitest'
import { computeAvailability, resolveProfiles } from '../src/domain/availability'
import {
  buildSafeKeysDocument,
  parseImportDocument,
  serializeProfilesDocument,
} from '../src/lib/importExport'
import { profilesForSelection } from '../src/lib/selection'
import { toInputProfile } from '../src/data/catalog'
import { SEED_PROFILES_BY_GAME_ID } from '../src/data/catalog'
import { GAMES_BY_ID, SKYRIM_CUSTOM, SKYRIM_DEFAULT, TEST_LAYOUT } from './fixtures'

describe('importExport', () => {
  it('round-trips profiles through serialize and parse', () => {
    const exported = serializeProfilesDocument(
      [
        {
          ...SKYRIM_CUSTOM,
          sourceType: 'imported',
          verificationStatus: 'custom',
        },
      ],
      {
        exportedAt: '2026-08-01T00:00:00.000Z',
        games: [{ id: 'skyrim', name: 'Skyrim', kind: 'game', profileIds: ['skyrim-custom'] }],
      },
    )

    const raw = JSON.stringify(exported)
    const result = parseImportDocument(raw)

    expect(result.profiles).toHaveLength(1)
    expect(result.profiles[0]?.sourceType).toBe('imported')
    expect(result.profiles[0]?.verificationStatus).toBe('custom')
    expect(result.profiles[0]?.bindings).toEqual([
      { key: 'KeyR', action: 'Activate', verification: 'custom' },
      { key: 'KeyF', action: 'Sneak', verification: 'custom' },
    ])
    expect(result.document.games?.[0]?.name).toBe('Skyrim')
    expect(result.skippedBindings).toBe(0)
    expect(result.skippedProfiles).toBe(0)
  })

  it('normalizes aliases and skips invalid keys', () => {
    const raw = JSON.stringify({
      schemaVersion: 1,
      exportedAt: '2026-08-01T00:00:00.000Z',
      profiles: [
        {
          id: 'alias-profile',
          gameId: 'skyrim',
          name: 'Aliases',
          bindings: [
            { key: 'w', action: 'Forward' },
            { key: 'NOT_A_KEY', action: 'Broken' },
            { key: 'E', action: 'Activate', modifiers: ['CTRL'] },
          ],
        },
      ],
    })

    const result = parseImportDocument(raw)
    expect(result.skippedBindings).toBe(1)
    expect(result.profiles[0]?.bindings).toEqual([
      { key: 'KeyW', action: 'Forward', verification: 'custom' },
      { key: 'KeyE', action: 'Activate', modifiers: ['ctrl'], verification: 'custom' },
    ])
  })

  it('rejects documents with no valid profiles', () => {
    const raw = JSON.stringify({
      schemaVersion: 1,
      exportedAt: '2026-08-01T00:00:00.000Z',
      profiles: [
        {
          id: 'empty',
          gameId: 'skyrim',
          name: 'Empty',
          bindings: [{ key: 'NOPE', action: 'Broken' }],
        },
      ],
    })
    expect(() => parseImportDocument(raw)).toThrow(/No profiles/)
  })

  it('lets imported overrides beat seed profiles for the same game', () => {
    const seed = SEED_PROFILES_BY_GAME_ID.skyrim
    expect(seed).toBeTruthy()
    const defaultLayers = seed!.layers.filter((l) => l.defaultEnabled).map((l) => l.id)
    const seedFlat = toInputProfile(seed!, defaultLayers)
    const imported = parseImportDocument(
      JSON.stringify(
        serializeProfilesDocument([
          {
            id: 'skyrim-imported',
            gameId: 'skyrim',
            name: 'Skyrim Imported',
            sourceType: 'imported',
            verificationStatus: 'custom',
            bindings: [
              { key: 'KeyR', action: 'Activate' },
              { key: 'KeyF', action: 'Sneak' },
            ],
          },
        ]),
      ),
    ).profiles[0]!

    const merged = profilesForSelection(['skyrim'], { skyrim: defaultLayers }, {
      skyrim: imported,
    })
    expect(merged.length).toBeGreaterThanOrEqual(2)

    const resolved = resolveProfiles(merged)
    expect(resolved).toHaveLength(1)
    expect(resolved[0]?.id).toBe('skyrim-imported')

    const summary = computeAvailability({
      profiles: merged,
      layout: TEST_LAYOUT,
      reservedRules: [],
      gamesById: GAMES_BY_ID,
    })
    // Seed W/E lose to imported R/F for Skyrim.
    expect(summary.keys.find((k) => k.key === 'KeyW')?.state).toBe('free')
    expect(summary.keys.find((k) => k.key === 'KeyR')?.state).toBe('heavy')
    expect(summary.keys.find((k) => k.key === 'KeyF')?.state).toBe('heavy')
    // Sanity: seed alone would have used W.
    expect(seedFlat.bindings.some((b) => b.key === 'KeyW')).toBe(true)
  })

  it('exports only free (non-reserved) keys as safe keys', () => {
    const summary = computeAvailability({
      profiles: [SKYRIM_DEFAULT],
      layout: TEST_LAYOUT,
      reservedRules: [
        {
          id: 'f11',
          keys: ['F11'],
          modifiers: [],
          label: 'F11',
          reason: 'Fullscreen',
          scope: 'global',
        },
      ],
      gamesById: GAMES_BY_ID,
    })

    const doc = buildSafeKeysDocument(summary, '2026-08-01T00:00:00.000Z')
    expect(doc.schemaVersion).toBe(1)
    const ids = doc.keys.map((k) => k.id)
    expect(ids).toContain('KeyR')
    expect(ids).toContain('KeyF')
    expect(ids).not.toContain('KeyW')
    expect(ids).not.toContain('F11')
  })
})
