import { describe, expect, it } from 'vitest'
import {
  ANSI_60_LAYOUT,
  ANSI_FULL_LAYOUT,
  ANSI_TKL_LAYOUT,
  getLayout,
  isLayoutId,
  ISO_FULL_LAYOUT,
  LAYOUT_IDS,
  LAYOUT_REGISTRY,
} from '../src/data/keyboardLayouts'
import type { KeyboardLayout, LayoutId, LayoutKey, LayoutRect } from '../src/types'

function assertLayoutInvariants(layout: KeyboardLayout) {
  expect(layout.width).toBeGreaterThan(0)
  expect(layout.height).toBeGreaterThan(0)
  expect(layout.keys.length).toBeGreaterThan(0)

  const ids = layout.keys.map((key) => key.id)
  expect(new Set(ids).size).toBe(ids.length)

  for (const key of layout.keys) {
    expect(key.width).toBeGreaterThan(0)
    expect(key.height).toBeGreaterThan(0)
    expect(key.x).toBeGreaterThanOrEqual(0)
    expect(key.y).toBeGreaterThanOrEqual(0)
    expect(key.x + key.width).toBeLessThanOrEqual(layout.width)
    expect(key.y + key.height).toBeLessThanOrEqual(layout.height)

    if (key.collisionRects) {
      expect(key.collisionRects.length).toBeGreaterThan(0)
      for (const rect of key.collisionRects) {
        expect(rect.width).toBeGreaterThan(0)
        expect(rect.height).toBeGreaterThan(0)
        expect(rect.x).toBeGreaterThanOrEqual(key.x - 0.001)
        expect(rect.y).toBeGreaterThanOrEqual(key.y - 0.001)
        expect(rect.x + rect.width).toBeLessThanOrEqual(key.x + key.width + 0.001)
        expect(rect.y + rect.height).toBeLessThanOrEqual(key.y + key.height + 0.001)
      }
    }

    if (key.pathD) {
      expect(key.pathD.length).toBeGreaterThan(0)
      expect(key.collisionRects?.length).toBeGreaterThan(0)
    }
  }
}

function rectsOf(key: LayoutKey): readonly LayoutRect[] {
  return key.collisionRects ?? [{ x: key.x, y: key.y, width: key.width, height: key.height }]
}

function rectsOverlap(a: LayoutRect, b: LayoutRect): boolean {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  )
}

/** Overlap of two keycaps using collision rects when present (L-shaped ISO Enter). */
function keysOverlap(a: LayoutKey, b: LayoutKey): boolean {
  for (const ra of rectsOf(a)) {
    for (const rb of rectsOf(b)) {
      if (rectsOverlap(ra, rb)) return true
    }
  }
  return false
}

function assertNoOverlaps(layout: KeyboardLayout) {
  for (let i = 0; i < layout.keys.length; i++) {
    for (let j = i + 1; j < layout.keys.length; j++) {
      const a = layout.keys[i]!
      const b = layout.keys[j]!
      expect(keysOverlap(a, b), `${layout.id}: ${a.id} overlaps ${b.id}`).toBe(false)
    }
  }
}

const NUMPAD_PREFIX = 'Numpad'
const SYSTEM_IDS = ['PrintScreen', 'ScrollLock', 'Pause'] as const
const NAV_IDS = new Set([
  ...SYSTEM_IDS,
  'Insert',
  'Home',
  'PageUp',
  'Delete',
  'End',
  'PageDown',
  'ArrowUp',
  'ArrowLeft',
  'ArrowDown',
  'ArrowRight',
])

describe('keyboard layout registry', () => {
  it('lists Full, TKL, 60%, and ISO Full as the shipped form factors', () => {
    expect(LAYOUT_IDS).toEqual(['ansi-full', 'ansi-tkl', 'ansi-60', 'iso-full'])
    expect(isLayoutId('ansi-full')).toBe(true)
    expect(isLayoutId('ansi-tkl')).toBe(true)
    expect(isLayoutId('ansi-60')).toBe(true)
    expect(isLayoutId('iso-full')).toBe(true)
    expect(isLayoutId('iso-tkl')).toBe(false)
  })

  it('registers every LayoutId with matching layout.id', () => {
    for (const id of LAYOUT_IDS) {
      const layout = LAYOUT_REGISTRY[id]
      expect(layout.id).toBe(id)
      expect(getLayout(id)).toBe(layout)
    }
  })

  it('keeps unique key ids and keys inside layout bounds', () => {
    for (const id of LAYOUT_IDS) {
      assertLayoutInvariants(LAYOUT_REGISTRY[id])
    }
  })

  it('has no overlapping keycaps on any shipped layout', () => {
    for (const id of LAYOUT_IDS) {
      assertNoOverlaps(LAYOUT_REGISTRY[id])
    }
  })

  it('places system keys and NumLock on full / TKL form factors', () => {
    for (const layout of [ANSI_FULL_LAYOUT, ANSI_TKL_LAYOUT, ISO_FULL_LAYOUT]) {
      for (const id of SYSTEM_IDS) {
        expect(layout.keys.some((key) => key.id === id), `${layout.id} missing ${id}`).toBe(true)
      }
    }

    for (const layout of [ANSI_FULL_LAYOUT, ISO_FULL_LAYOUT]) {
      expect(layout.keys.some((key) => key.id === 'NumLock')).toBe(true)
    }

    expect(ANSI_TKL_LAYOUT.keys.some((key) => key.id === 'NumLock')).toBe(false)
    expect(ANSI_60_LAYOUT.keys.some((key) => key.id === 'NumLock')).toBe(false)
    for (const id of SYSTEM_IDS) {
      expect(ANSI_60_LAYOUT.keys.some((key) => key.id === id)).toBe(false)
    }
  })

  it('aligns nav Insert with the number row and arrows with the mod row', () => {
    const insert = ANSI_FULL_LAYOUT.keys.find((key) => key.id === 'Insert')
    const digit1 = ANSI_FULL_LAYOUT.keys.find((key) => key.id === 'Digit1')
    const arrowDown = ANSI_FULL_LAYOUT.keys.find((key) => key.id === 'ArrowDown')
    const space = ANSI_FULL_LAYOUT.keys.find((key) => key.id === 'Space')
    const printScreen = ANSI_FULL_LAYOUT.keys.find((key) => key.id === 'PrintScreen')
    const escape = ANSI_FULL_LAYOUT.keys.find((key) => key.id === 'Escape')
    const numLock = ANSI_FULL_LAYOUT.keys.find((key) => key.id === 'NumLock')

    expect(insert!.y).toBe(digit1!.y)
    expect(arrowDown!.y).toBe(space!.y)
    expect(printScreen!.y).toBe(escape!.y)
    expect(numLock!.y).toBe(digit1!.y)
  })

  it('omits the numpad from TKL and keeps Full wider', () => {
    const numpadIds = ANSI_FULL_LAYOUT.keys
      .map((key) => key.id)
      .filter((id) => id.startsWith(NUMPAD_PREFIX) || id === 'NumLock')

    expect(numpadIds.length).toBeGreaterThan(0)
    for (const id of numpadIds) {
      expect(ANSI_TKL_LAYOUT.keys.some((key) => key.id === id)).toBe(false)
    }

    expect(ANSI_TKL_LAYOUT.width).toBeLessThan(ANSI_FULL_LAYOUT.width)
    expect(ANSI_TKL_LAYOUT.keys.length).toBeLessThan(ANSI_FULL_LAYOUT.keys.length)
  })

  it('shares the alpha + nav block between Full and TKL', () => {
    const tklIds = new Set(ANSI_TKL_LAYOUT.keys.map((key) => key.id))
    const shared = ANSI_FULL_LAYOUT.keys.filter((key) => tklIds.has(key.id))
    expect(shared).toHaveLength(ANSI_TKL_LAYOUT.keys.length)

    for (const key of ANSI_TKL_LAYOUT.keys) {
      const full = ANSI_FULL_LAYOUT.keys.find((candidate) => candidate.id === key.id)
      expect(full).toMatchObject({
        x: key.x,
        y: key.y,
        width: key.width,
        height: key.height,
        label: key.label,
      })
    }
  })

  it('uses the shared ANSI alpha as the 60% compact layout without nav or numpad', () => {
    for (const id of NAV_IDS) {
      expect(ANSI_60_LAYOUT.keys.some((key) => key.id === id)).toBe(false)
    }
    expect(ANSI_60_LAYOUT.keys.some((key) => key.id.startsWith(NUMPAD_PREFIX))).toBe(false)
    expect(ANSI_60_LAYOUT.keys.some((key) => key.id === 'NumLock')).toBe(false)

    expect(ANSI_60_LAYOUT.width).toBeLessThan(ANSI_TKL_LAYOUT.width)
    expect(ANSI_60_LAYOUT.keys.length).toBeLessThan(ANSI_TKL_LAYOUT.keys.length)

    const sixtyIds = new Set(ANSI_60_LAYOUT.keys.map((key) => key.id))
    const shared = ANSI_FULL_LAYOUT.keys.filter((key) => sixtyIds.has(key.id))
    expect(shared).toHaveLength(ANSI_60_LAYOUT.keys.length)

    for (const key of ANSI_60_LAYOUT.keys) {
      const full = ANSI_FULL_LAYOUT.keys.find((candidate) => candidate.id === key.id)
      expect(full).toMatchObject({
        x: key.x,
        y: key.y,
        width: key.width,
        height: key.height,
        label: key.label,
      })
    }
  })

  it('uses ISO Enter / left-Shift / IntlBackslash geometry', () => {
    const enter = ISO_FULL_LAYOUT.keys.find((key) => key.id === 'Enter')
    const shiftLeft = ISO_FULL_LAYOUT.keys.find((key) => key.id === 'ShiftLeft')
    const intl = ISO_FULL_LAYOUT.keys.find((key) => key.id === 'IntlBackslash')
    const backslash = ISO_FULL_LAYOUT.keys.find((key) => key.id === 'Backslash')
    const bracketRight = ISO_FULL_LAYOUT.keys.find((key) => key.id === 'BracketRight')
    const ansiEnter = ANSI_FULL_LAYOUT.keys.find((key) => key.id === 'Enter')
    const ansiShift = ANSI_FULL_LAYOUT.keys.find((key) => key.id === 'ShiftLeft')
    const del = ISO_FULL_LAYOUT.keys.find((key) => key.id === 'Delete')

    expect(enter).toBeDefined()
    expect(shiftLeft).toBeDefined()
    expect(intl).toBeDefined()
    expect(backslash).toBeDefined()
    expect(ansiEnter).toBeDefined()
    expect(ansiShift).toBeDefined()

    expect(enter!.height).toBeGreaterThan(ansiEnter!.height)
    expect(enter!.y).toBeLessThan(ansiEnter!.y)
    expect(shiftLeft!.width).toBeLessThan(ansiShift!.width)
    expect(intl!.x).toBeGreaterThan(shiftLeft!.x + shiftLeft!.width - 0.001)
    expect(backslash!.y).toBe(ansiEnter!.y)

    // L-shaped ISO Enter: path + dual collision rects; top bar after `]`, stem after `#`.
    expect(enter!.pathD).toBeTruthy()
    expect(enter!.collisionRects).toHaveLength(2)
    expect(enter!.x).toBeCloseTo(bracketRight!.x + bracketRight!.width + 6, 5)

    const stem = enter!.collisionRects!.reduce((a, b) => (a.height >= b.height ? a : b))
    expect(enter!.x).toBeLessThan(stem.x)
    expect(enter!.x).toBeLessThan(backslash!.x + backslash!.width)
    expect(enter!.x + enter!.width).toBeGreaterThan(backslash!.x + backslash!.width)
    expect(stem.x).toBeCloseTo(backslash!.x + backslash!.width + 6, 5)
    expect(stem.y).toBe(enter!.y)
    expect(stem.height).toBe(enter!.height)

    // Bounding boxes may nest (Enter over `#` on Q-row), but collision rects must not overlap.
    expect(keysOverlap(enter!, backslash!)).toBe(false)

    // ISO Enter must clear the nav Delete key.
    expect(enter!.x + enter!.width).toBeLessThanOrEqual(del!.x)

    // ANSI Enter stays a single-row wide rectangle (no path geometry).
    expect(ansiEnter!.pathD).toBeUndefined()
    expect(ansiEnter!.height).toBe(backslash!.height)

    expect(ISO_FULL_LAYOUT.keys.some((key) => key.id === 'IntlBackslash')).toBe(true)
    expect(ANSI_FULL_LAYOUT.keys.some((key) => key.id === 'IntlBackslash')).toBe(false)
  })

  it('exposes only registry LayoutIds from the type union check', () => {
    const ids: LayoutId[] = [...LAYOUT_IDS]
    expect(ids).toContain('ansi-full')
    expect(ids).toContain('ansi-tkl')
    expect(ids).toContain('ansi-60')
    expect(ids).toContain('iso-full')
  })
})
