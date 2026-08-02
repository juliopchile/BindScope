import { describe, expect, it } from 'vitest'
import { getMouseLayout, isMouseKeyId, STANDARD_MOUSE } from '../src/data/mouseLayout'
import { normalizeKey } from '../src/utils/keyNormalization'

describe('mouse layout', () => {
  it('exposes Mouse1–Mouse5 and wheel directions with unique ids', () => {
    const layout = getMouseLayout()
    expect(layout).toBe(STANDARD_MOUSE)
    const ids = layout.keys.map((key) => key.id)
    expect(ids).toEqual([
      'Mouse1',
      'Mouse2',
      'WheelUp',
      'Mouse3',
      'WheelDown',
      'Mouse4',
      'Mouse5',
    ])
    expect(new Set(ids).size).toBe(ids.length)
    expect(layout.width).toBeGreaterThan(0)
    expect(layout.height).toBeGreaterThan(0)
  })

  it('marks product mouse ids and normalizes Source-style aliases', () => {
    expect(isMouseKeyId('Mouse1')).toBe(true)
    expect(isMouseKeyId('WheelDown')).toBe(true)
    expect(isMouseKeyId('KeyW')).toBe(false)
    expect(normalizeKey('MOUSE4')).toBe('Mouse4')
    expect(normalizeKey('MWHEELUP')).toBe('WheelUp')
  })
})
