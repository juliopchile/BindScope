import { describe, expect, it } from 'vitest'
import {
  ANSI_FULL_LAYOUT,
  ANSI_TKL_LAYOUT,
  getLayout,
  isLayoutId,
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

describe('keyboard layout registry', () => {
  it('lists Full and TKL as the shipped form factors', () => {
    expect(LAYOUT_IDS).toEqual(['ansi-full', 'ansi-tkl'])
    expect(isLayoutId('ansi-full')).toBe(true)
    expect(isLayoutId('ansi-tkl')).toBe(true)
    expect(isLayoutId('ansi-60')).toBe(false)
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
      .filter((id) => id.startsWith('Numpad'))

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

  it('exposes only registry LayoutIds from the type union check', () => {
    const ids: LayoutId[] = [...LAYOUT_IDS]
    expect(ids).toContain('ansi-full')
    expect(ids).toContain('ansi-tkl')
  })
})
