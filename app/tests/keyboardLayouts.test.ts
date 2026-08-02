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
import type { KeyboardLayout, LayoutId } from '../src/types'

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
  }
}

const NUMPAD_PREFIX = 'Numpad'
const NAV_IDS = new Set([
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

  it('omits the numpad from TKL and keeps Full wider', () => {
    const numpadIds = ANSI_FULL_LAYOUT.keys
      .map((key) => key.id)
      .filter((id) => id.startsWith(NUMPAD_PREFIX))

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
    const ansiEnter = ANSI_FULL_LAYOUT.keys.find((key) => key.id === 'Enter')
    const ansiShift = ANSI_FULL_LAYOUT.keys.find((key) => key.id === 'ShiftLeft')

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
