import type { KeyboardLayout } from '../types'

/** Future: ISO and regional keyboard layouts (ISO enter, split shift, etc.). */
export interface RegionalLayoutProvider {
  readonly region: 'iso' | 'jis' | 'ansi'
  getLayouts(): KeyboardLayout[]
}

export const REGIONAL_LAYOUT_PLACEHOLDER: RegionalLayoutProvider = {
  region: 'iso',
  getLayouts: () => {
    throw new Error('Regional layouts not implemented')
  },
}

/** Future: modifier-aware chord display and grouping on the keyboard. */
export interface ModifierDisplayOptions {
  showChordOnKey: boolean
  collapseDuplicateModifiers: boolean
}

export const DEFAULT_MODIFIER_DISPLAY: ModifierDisplayOptions = {
  showChordOnKey: false,
  collapseDuplicateModifiers: true,
}
