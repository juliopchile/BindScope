import type { Binding, KeyBindingRef, Modifier } from '../types'

/** Non-color mark drawn on keys that carry at least one modifier chord (D11). */
export const CHORD_MARK = '+'

/** True when the binding uses one or more modifiers (not a bare key). */
export function isChordBinding(binding: Pick<Binding, 'modifiers'>): boolean {
  return (binding.modifiers?.length ?? 0) > 0
}

/** True when any occupancy on the physical key is a chord. */
export function keyHasChordBindings(
  bindings: ReadonlyArray<Pick<KeyBindingRef, 'binding'>>,
): boolean {
  return bindings.some((ref) => isChordBinding(ref.binding))
}

export function partitionBindingsByChord(bindings: readonly KeyBindingRef[]): {
  bare: KeyBindingRef[]
  chords: KeyBindingRef[]
} {
  const bare: KeyBindingRef[] = []
  const chords: KeyBindingRef[] = []
  for (const ref of bindings) {
    if (isChordBinding(ref.binding)) chords.push(ref)
    else bare.push(ref)
  }
  return { bare, chords }
}

/** Compact modifier list for aria / short labels (e.g. "ctrl+alt"). */
export function formatModifierList(modifiers?: readonly Modifier[]): string {
  if (!modifiers || modifiers.length === 0) return ''
  return modifiers.join('+')
}
