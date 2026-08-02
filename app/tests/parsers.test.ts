import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { computeAvailability, resolveProfiles } from '../src/domain/availability'
import { parseImportFile } from '../src/lib/importExport'
import {
  detectImportFormat,
  parseBindXml,
  parseConfigFormat,
  parseSimpleIni,
  parseSourceCfg,
  resolveGameIdFromFileName,
} from '../src/lib/parsers'
import { profilesForSelection } from '../src/lib/selection'
import { GAMES_BY_ID, TEST_LAYOUT } from './fixtures'

const fixturesDir = join(dirname(fileURLToPath(import.meta.url)), 'fixtures')

function readFixture(name: string): string {
  return readFileSync(join(fixturesDir, name), 'utf8')
}

describe('detectImportFormat', () => {
  it.each([
    ['autoexec.cfg', 'bind "w" "+forward"', 'cfg'],
    ['binds.ini', '[A]\nW=Forward', 'ini'],
    ['binds.xml', '<binds><bind key="W" action="Forward"/></binds>', 'xml'],
    ['profiles.json', '{"schemaVersion":1}', 'json'],
    ['unknown.txt', 'hello world', null],
  ] as const)('detects %s', (fileName, content, expected) => {
    expect(detectImportFormat(fileName, content)).toBe(expected)
  })

  it('sniffs content when extension is missing', () => {
    expect(detectImportFormat('autoexec', 'bind "e" "+use"\n')).toBe('cfg')
    expect(detectImportFormat('data', '<bind key="W" action="Forward"/>')).toBe('xml')
  })
})

describe('parseSourceCfg', () => {
  it('parses sample-cs2.cfg and skips unknown keys on lift', () => {
    const raw = readFixture('sample-cs2.cfg')
    const parsed = parseSourceCfg(raw)
    expect(parsed.bindings.length).toBeGreaterThanOrEqual(14)
    expect(parsed.bindings.some((b) => b.key.toLowerCase() === 'w')).toBe(true)
    expect(parsed.bindings.some((b) => b.action === '+forward')).toBe(true)

    const result = parseConfigFormat(raw, 'cfg', {
      gameId: 'counter-strike-2',
      fileName: 'sample-cs2.cfg',
    })
    expect(result.profile.sourceType).toBe('imported')
    expect(result.profile.gameId).toBe('counter-strike-2')
    expect(result.profile.bindings.some((b) => b.key === 'KeyW')).toBe(true)
    expect(result.profile.bindings.some((b) => b.key === 'Mouse1')).toBe(true)
    expect(result.profile.bindings.some((b) => b.key === 'WheelUp')).toBe(true)
    // KP_END is not in the alias map → skipped
    expect(result.skippedBindings).toBeGreaterThanOrEqual(1)
  })

  it('ignores comments and non-bind commands; rejects all-invalid keys', () => {
    const parsed = parseSourceCfg(`
// comment
# also
; semicolon
unbind "x"
echo hi
bind "w" "+forward"
`)
    expect(parsed.bindings).toEqual([{ key: 'w', action: '+forward' }])
    expect(() =>
      parseConfigFormat('bind "NOT_REAL" "x"\n', 'cfg', { gameId: 'x' }),
    ).toThrow(/No profiles/)
  })

  it('table: bind line variants', () => {
    const cases: Array<{ line: string; key: string; action: string }> = [
      { line: 'bind "w" "+forward"', key: 'w', action: '+forward' },
      { line: 'bind MOUSE1 +attack', key: 'MOUSE1', action: '+attack' },
      { line: '  bind "r" "+reload" // trailing', key: 'r', action: '+reload' },
    ]
    for (const c of cases) {
      const { bindings } = parseSourceCfg(c.line)
      expect(bindings).toEqual([{ key: c.key, action: c.action }])
    }
  })
})

describe('parseSimpleIni', () => {
  it('parses sample-binds.ini with sections and chords', () => {
    const raw = readFixture('sample-binds.ini')
    const parsed = parseSimpleIni(raw)
    expect(parsed.bindings.find((b) => b.key === 'W')?.context).toBe('Movement')
    expect(parsed.bindings.find((b) => b.key === 'F')).toEqual({
      key: 'F',
      action: 'Flashlight',
      modifiers: ['Ctrl'],
      context: 'Actions',
    })

    const result = parseConfigFormat(raw, 'ini', { gameId: 'skyrim', fileName: 'sample-binds.ini' })
    expect(result.profile.bindings.some((b) => b.key === 'KeyW')).toBe(true)
    const flashlight = result.profile.bindings.find((b) => b.action === 'Flashlight')
    expect(flashlight?.key).toBe('KeyF')
    expect(flashlight?.modifiers).toEqual(['ctrl'])
    expect(result.skippedBindings).toBeGreaterThanOrEqual(1) // BogusKey
  })
})

describe('parseBindXml', () => {
  it('parses sample-binds.xml and skips invalid elements', () => {
    const raw = readFixture('sample-binds.xml')
    const parsed = parseBindXml(raw)
    expect(parsed.bindings.some((b) => b.key === 'W' && b.action === 'Forward')).toBe(true)
    expect(parsed.bindings.some((b) => b.key === 'R' && b.action === 'Reload')).toBe(true)
    expect(parsed.skippedLines).toBeGreaterThanOrEqual(1)

    const result = parseConfigFormat(raw, 'xml', { gameId: 'skyrim', fileName: 'sample-binds.xml' })
    const use = result.profile.bindings.find((b) => b.action === 'Use')
    expect(use?.modifiers).toEqual(['ctrl'])
    expect(result.skippedBindings).toBeGreaterThanOrEqual(1)
  })
})

describe('parseImportFile + availability', () => {
  it('imports CFG end-to-end into overrides path', () => {
    const raw = readFixture('sample-cs2.cfg')
    const result = parseImportFile(raw, 'cs2.cfg', {
      gameId: 'counter-strike-2',
      fileName: 'cs2.cfg',
    })
    expect(result.profiles).toHaveLength(1)
    expect(result.profiles[0]?.sourceType).toBe('imported')

    const merged = profilesForSelection(
      ['counter-strike-2'],
      { 'counter-strike-2': ['combat'] },
      { 'counter-strike-2': result.profiles[0]! },
    )
    const resolved = resolveProfiles(merged)
    expect(resolved[0]?.id).toContain('imported')

    const summary = computeAvailability({
      profiles: merged,
      layout: TEST_LAYOUT,
      reservedRules: [],
      gamesById: {
        ...GAMES_BY_ID,
        'counter-strike-2': { name: 'Counter-Strike 2' },
      },
    })
    expect(summary.keys.find((k) => k.key === 'KeyW')?.state).not.toBe('free')
  })

  it('rejects empty / garbage without throwing unexpected types', () => {
    expect(() => parseImportFile('lol nope', 'x.zzz')).toThrow()
    expect(() => parseImportFile('bind "NOPE" "x"', 'x.cfg', { gameId: 'g' })).toThrow(
      /No profiles/,
    )
  })
})

describe('resolveGameIdFromFileName', () => {
  const ids = new Set(['counter-strike-2', 'skyrim'])
  const aliases = new Map([
    ['cs2', 'counter-strike-2'],
    ['csgo', 'counter-strike-2'],
  ])

  it('matches catalog id and aliases', () => {
    expect(resolveGameIdFromFileName('counter-strike-2.cfg', ids, aliases)).toBe(
      'counter-strike-2',
    )
    expect(resolveGameIdFromFileName('cs2.cfg', ids, aliases)).toBe('counter-strike-2')
    expect(resolveGameIdFromFileName('autoexec.cfg', ids, aliases)).toBe('autoexec')
  })
})
