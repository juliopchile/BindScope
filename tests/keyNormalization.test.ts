import { describe, expect, it } from 'vitest'
import {
  bindingChordLabel,
  normalizeKey,
  normalizeModifier,
  normalizeModifiers,
} from '../src/utils/keyNormalization'

describe('key normalization', () => {
  it('normalizes letter aliases', () => {
    expect(normalizeKey('w')).toBe('KeyW')
    expect(normalizeKey('E')).toBe('KeyE')
  })

  it('normalizes common key names', () => {
    expect(normalizeKey('Space')).toBe('Space')
    expect(normalizeKey('esc')).toBe('Escape')
    expect(normalizeKey('Tab')).toBe('Tab')
    expect(normalizeKey('F5')).toBe('F5')
  })

  it('preserves canonical codes', () => {
    expect(normalizeKey('KeyQ')).toBe('KeyQ')
    expect(normalizeKey('Digit1')).toBe('Digit1')
  })

  it('returns null for unknown keys', () => {
    expect(normalizeKey('')).toBeNull()
    expect(normalizeKey('NotARealKey')).toBeNull()
  })

  it('normalizes modifiers', () => {
    expect(normalizeModifier('CTRL')).toBe('ctrl')
    expect(normalizeModifiers(['Shift', 'ctrl', 'CTRL'])).toEqual(['ctrl', 'shift'])
  })

  it('formats chord labels', () => {
    expect(bindingChordLabel('KeyC', ['ctrl'])).toBe('Ctrl+C')
  })
})
