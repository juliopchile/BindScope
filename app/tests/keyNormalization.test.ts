import { describe, expect, it } from 'vitest'
import {
  bindingChordLabel,
  normalizeKey,
  normalizeModifier,
  normalizeModifiers,
} from '../src/utils/keyNormalization'

describe('key normalization', () => {
  it.each([
    ['w', 'KeyW'],
    ['E', 'KeyE'],
    ['1', 'Digit1'],
    ['Space', 'Space'],
    ['spacebar', 'Space'],
    ['esc', 'Escape'],
    ['Tab', 'Tab'],
    ['F5', 'F5'],
    ['f12', 'F12'],
    ['KeyQ', 'KeyQ'],
    ['Digit1', 'Digit1'],
    ['PrtSc', 'PrintScreen'],
    ['numpad5', 'Numpad5'],
  ])('normalizeKey(%j) → %j', (input, expected) => {
    expect(normalizeKey(input)).toBe(expected)
  })

  it.each(['', '   ', 'NotARealKey', 'F13'])('returns null for %j', (input) => {
    expect(normalizeKey(input)).toBeNull()
  })

  it('normalizes modifiers and deduplicates', () => {
    expect(normalizeModifier('CTRL')).toBe('ctrl')
    expect(normalizeModifiers(['Shift', 'ctrl', 'CTRL'])).toEqual(['ctrl', 'shift'])
    expect(normalizeModifiers(undefined)).toEqual([])
  })

  it('formats chord labels', () => {
    expect(bindingChordLabel('KeyC', ['ctrl'])).toBe('Ctrl+C')
  })
})
