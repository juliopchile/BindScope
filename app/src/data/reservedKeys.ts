import type { ReservedKeyRule } from '../types'

/**
 * Bare-key rules (empty modifiers) mark a physical key as never safe.
 * Chord-only rules are retained for later chord-aware UI; they do not reserve the bare key.
 */
export const RESERVED_KEY_RULES: ReservedKeyRule[] = [
  {
    id: 'f11-fullscreen',
    keys: ['F11'],
    modifiers: [],
    label: 'F11',
    reason: 'Toggle fullscreen in many apps',
    scope: 'global',
  },
  {
    id: 'print-screen',
    keys: ['PrintScreen'],
    modifiers: [],
    label: 'PrtSc',
    reason: 'Screenshot (OS)',
    scope: 'windows',
  },
  {
    id: 'alt-f4',
    keys: ['F4'],
    modifiers: ['alt'],
    label: 'Alt+F4',
    reason: 'Close window (Windows/Linux)',
    scope: 'global',
  },
  {
    id: 'ctrl-alt-del',
    keys: ['Delete'],
    modifiers: ['ctrl', 'alt'],
    label: 'Ctrl+Alt+Del',
    reason: 'Security screen / task manager',
    scope: 'windows',
  },
  {
    id: 'alt-tab',
    keys: ['Tab'],
    modifiers: ['alt'],
    label: 'Alt+Tab',
    reason: 'Application switcher',
    scope: 'global',
  },
  {
    id: 'meta-l',
    keys: ['KeyL'],
    modifiers: ['meta'],
    label: 'Win+L',
    reason: 'Lock workstation',
    scope: 'windows',
  },
  {
    id: 'ctrl-c',
    keys: ['KeyC'],
    modifiers: ['ctrl'],
    label: 'Ctrl+C',
    reason: 'Copy (OS shortcut)',
    scope: 'global',
  },
  {
    id: 'ctrl-v',
    keys: ['KeyV'],
    modifiers: ['ctrl'],
    label: 'Ctrl+V',
    reason: 'Paste (OS shortcut)',
    scope: 'global',
  },
  {
    id: 'ctrl-z',
    keys: ['KeyZ'],
    modifiers: ['ctrl'],
    label: 'Ctrl+Z',
    reason: 'Undo (OS shortcut)',
    scope: 'global',
  },
  {
    id: 'ctrl-s',
    keys: ['KeyS'],
    modifiers: ['ctrl'],
    label: 'Ctrl+S',
    reason: 'Save (OS shortcut)',
    scope: 'global',
  },
]
