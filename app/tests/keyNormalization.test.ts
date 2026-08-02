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
    ['Mouse1', 'Mouse1'],
    ['MOUSE1', 'Mouse1'],
    ['lmb', 'Mouse1'],
    ['MOUSE2', 'Mouse2'],
    ['rmb', 'Mouse2'],
    ['MOUSE3', 'Mouse3'],
    ['mmb', 'Mouse3'],
    ['MOUSE4', 'Mouse4'],
    ['MOUSE5', 'Mouse5'],
    ['MWHEELUP', 'WheelUp'],
    ['mwheeldown', 'WheelDown'],
    ['WheelUp', 'WheelUp'],
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
    expect(bindingChordLabel('Mouse1')).toBe('M1')
    expect(bindingChordLabel('WheelUp')).toBe('Wheel↑')
  })
})
