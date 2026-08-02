import { describe, expect, it } from 'vitest'
import {
  CHORD_MARK,
  formatModifierList,
  isChordBinding,
  keyHasChordBindings,
  partitionBindingsByChord,
} from '../src/lib/chords'
import { isKeyVisible } from '../src/lib/selection'
import type { KeyBindingRef } from '../src/types'

function ref(
  action: string,
  modifiers?: KeyBindingRef['binding']['modifiers'],
): KeyBindingRef {
  return {
    profileId: 'p1',
    profileName: 'Profile',
    gameId: 'game',
    gameName: 'Game',
    binding: { key: 'KeyW', action, modifiers },
  }
}

describe('chord helpers', () => {
  it('treats empty or missing modifiers as bare keys', () => {
    expect(isChordBinding({ key: 'KeyW', action: 'Forward' })).toBe(false)
    expect(isChordBinding({ key: 'KeyW', action: 'Forward', modifiers: [] })).toBe(false)
    expect(isChordBinding({ key: 'KeyW', action: 'Sprint', modifiers: ['shift'] })).toBe(true)
  })

  it('detects chord occupancy on a physical key', () => {
    expect(keyHasChordBindings([ref('Forward')])).toBe(false)
    expect(keyHasChordBindings([ref('Forward'), ref('Sprint', ['shift'])])).toBe(true)
  })

  it('partitions bare vs chord bindings without dropping either', () => {
    const bindings = [
      ref('Forward'),
      ref('Sprint', ['shift']),
      ref('Smart-cast', ['ctrl']),
    ]
    const { bare, chords } = partitionBindingsByChord(bindings)
    expect(bare.map((b) => b.binding.action)).toEqual(['Forward'])
    expect(chords.map((b) => b.binding.action)).toEqual(['Sprint', 'Smart-cast'])
    expect(CHORD_MARK).toBe('+')
  })

  it('formats modifier lists for short labels', () => {
    expect(formatModifierList()).toBe('')
    expect(formatModifierList(['ctrl', 'alt'])).toBe('ctrl+alt')
  })

  it('dims non-chord keys only when chords-only filter is on', () => {
    expect(isKeyVisible('heavy', false, new Set(), false)).toBe(true)
    expect(isKeyVisible('heavy', false, new Set(), true)).toBe(false)
    expect(isKeyVisible('heavy', true, new Set(), true)).toBe(true)
    expect(isKeyVisible('free', true, new Set(['heavy']), true)).toBe(false)
  })
})
