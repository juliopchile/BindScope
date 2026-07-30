import type { KeyboardKey, Modifier } from '../types'

const LETTER_MAP: Record<string, KeyboardKey> = Object.fromEntries(
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((l) => [l, `Key${l}`]),
)

const DIGIT_MAP: Record<string, KeyboardKey> = Object.fromEntries(
  '0123456789'.split('').map((d) => [d, `Digit${d}`]),
)

const ALIAS_MAP: Record<string, KeyboardKey> = {
  ...LETTER_MAP,
  ...Object.fromEntries(Object.entries(LETTER_MAP).map(([k, v]) => [k.toLowerCase(), v])),
  ...DIGIT_MAP,
  SPACE: 'Space',
  SPACEBAR: 'Space',
  ENTER: 'Enter',
  RETURN: 'Enter',
  ESC: 'Escape',
  ESCAPE: 'Escape',
  TAB: 'Tab',
  BACKSPACE: 'Backspace',
  DELETE: 'Delete',
  DEL: 'Delete',
  INSERT: 'Insert',
  INS: 'Insert',
  HOME: 'Home',
  END: 'End',
  PAGEUP: 'PageUp',
  PGUP: 'PageUp',
  PAGEDOWN: 'PageDown',
  PGDN: 'PageDown',
  UP: 'ArrowUp',
  DOWN: 'ArrowDown',
  LEFT: 'ArrowLeft',
  RIGHT: 'ArrowRight',
  ARROWUP: 'ArrowUp',
  ARROWDOWN: 'ArrowDown',
  ARROWLEFT: 'ArrowLeft',
  ARROWRIGHT: 'ArrowRight',
  '`': 'Backquote',
  BACKQUOTE: 'Backquote',
  TILDE: 'Backquote',
  '-': 'Minus',
  MINUS: 'Minus',
  '=': 'Equal',
  EQUAL: 'Equal',
  PLUS: 'Equal',
  '[': 'BracketLeft',
  LBRACKET: 'BracketLeft',
  ']': 'BracketRight',
  RBRACKET: 'BracketRight',
  '\\': 'Backslash',
  BACKSLASH: 'Backslash',
  ';': 'Semicolon',
  SEMICOLON: 'Semicolon',
  "'": 'Quote',
  QUOTE: 'Quote',
  ',': 'Comma',
  COMMA: 'Comma',
  '.': 'Period',
  PERIOD: 'Period',
  '/': 'Slash',
  SLASH: 'Slash',
  CAPSLOCK: 'CapsLock',
  CAPS: 'CapsLock',
  LSHIFT: 'ShiftLeft',
  SHIFT: 'ShiftLeft',
  RSHIFT: 'ShiftRight',
  LCTRL: 'ControlLeft',
  CTRL: 'ControlLeft',
  CONTROL: 'ControlLeft',
  RCTRL: 'ControlRight',
  LALT: 'AltLeft',
  ALT: 'AltLeft',
  RALT: 'AltRight',
  LWIN: 'MetaLeft',
  META: 'MetaLeft',
  WIN: 'MetaLeft',
  RWIN: 'MetaRight',
  PRINTSCREEN: 'PrintScreen',
  PRTSC: 'PrintScreen',
  NUMPAD0: 'Numpad0',
  NUMPAD1: 'Numpad1',
  NUMPAD2: 'Numpad2',
  NUMPAD3: 'Numpad3',
  NUMPAD4: 'Numpad4',
  NUMPAD5: 'Numpad5',
  NUMPAD6: 'Numpad6',
  NUMPAD7: 'Numpad7',
  NUMPAD8: 'Numpad8',
  NUMPAD9: 'Numpad9',
  NUMPADADD: 'NumpadAdd',
  NUMPADSUBTRACT: 'NumpadSubtract',
  NUMPADMULTIPLY: 'NumpadMultiply',
  NUMPADDIVIDE: 'NumpadDivide',
  NUMPADENTER: 'NumpadEnter',
  NUMPADDECIMAL: 'NumpadDecimal',
}

for (let i = 1; i <= 12; i++) {
  ALIAS_MAP[`F${i}`] = `F${i}`
  ALIAS_MAP[`f${i}`] = `F${i}`
}

const MODIFIER_ALIASES: Record<string, Modifier> = {
  SHIFT: 'shift',
  LSHIFT: 'shift',
  RSHIFT: 'shift',
  CTRL: 'ctrl',
  CONTROL: 'ctrl',
  LCTRL: 'ctrl',
  RCTRL: 'ctrl',
  ALT: 'alt',
  LALT: 'alt',
  RALT: 'alt',
  META: 'meta',
  WIN: 'meta',
  LWIN: 'meta',
  RWIN: 'meta',
  CMD: 'meta',
  COMMAND: 'meta',
}

const CANONICAL_CODES = new Set<string>([
  ...Object.values(LETTER_MAP),
  ...Object.values(DIGIT_MAP),
  ...Array.from({ length: 12 }, (_, i) => `F${i + 1}`),
  'Space',
  'Enter',
  'Escape',
  'Tab',
  'Backspace',
  'Delete',
  'Insert',
  'Home',
  'End',
  'PageUp',
  'PageDown',
  'ArrowUp',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ShiftLeft',
  'ShiftRight',
  'ControlLeft',
  'ControlRight',
  'AltLeft',
  'AltRight',
  'MetaLeft',
  'MetaRight',
  'CapsLock',
  'Backquote',
  'Minus',
  'Equal',
  'BracketLeft',
  'BracketRight',
  'Backslash',
  'Semicolon',
  'Quote',
  'Comma',
  'Period',
  'Slash',
  'PrintScreen',
  'Numpad0',
  'Numpad1',
  'Numpad2',
  'Numpad3',
  'Numpad4',
  'Numpad5',
  'Numpad6',
  'Numpad7',
  'Numpad8',
  'Numpad9',
  'NumpadAdd',
  'NumpadSubtract',
  'NumpadMultiply',
  'NumpadDivide',
  'NumpadEnter',
  'NumpadDecimal',
])

export function normalizeModifier(input: string): Modifier | null {
  const key = input.trim().toUpperCase()
  return MODIFIER_ALIASES[key] ?? null
}

export function normalizeModifiers(inputs: string[] | undefined): Modifier[] {
  if (!inputs?.length) return []
  const seen = new Set<Modifier>()
  const result: Modifier[] = []
  for (const input of inputs) {
    const mod = normalizeModifier(input)
    if (mod && !seen.has(mod)) {
      seen.add(mod)
      result.push(mod)
    }
  }
  return result.sort()
}

/** Normalize user or config key strings to canonical KeyboardKey codes. */
export function normalizeKey(input: string): KeyboardKey | null {
  const trimmed = input.trim()
  if (!trimmed) return null

  if (CANONICAL_CODES.has(trimmed)) {
    return trimmed
  }

  const upper = trimmed.toUpperCase()
  if (upper in ALIAS_MAP) return ALIAS_MAP[upper]!

  if (trimmed.length === 1) {
    const letter = LETTER_MAP[trimmed.toUpperCase()]
    if (letter) return letter
  }

  return null
}

export function formatKeyLabel(key: KeyboardKey): string {
  if (key.startsWith('Key')) return key.slice(3)
  if (key.startsWith('Digit')) return key.slice(5)
  if (key.startsWith('Numpad')) return key.replace('Numpad', 'Num')
  if (key.startsWith('Arrow')) return key.replace('Arrow', '')
  if (key === 'Backquote') return '`'
  if (key === 'Minus') return '-'
  if (key === 'Equal') return '='
  if (key === 'BracketLeft') return '['
  if (key === 'BracketRight') return ']'
  if (key === 'Backslash') return '\\'
  if (key === 'Semicolon') return ';'
  if (key === 'Quote') return "'"
  if (key === 'Comma') return ','
  if (key === 'Period') return '.'
  if (key === 'Slash') return '/'
  if (key === 'ShiftLeft' || key === 'ShiftRight') return 'Shift'
  if (key === 'ControlLeft' || key === 'ControlRight') return 'Ctrl'
  if (key === 'AltLeft' || key === 'AltRight') return 'Alt'
  if (key === 'MetaLeft' || key === 'MetaRight') return 'Win'
  if (key === 'CapsLock') return 'Caps'
  if (key === 'Escape') return 'Esc'
  if (key === 'PrintScreen') return 'PrtSc'
  return key
}

export function bindingChordLabel(key: KeyboardKey, modifiers?: Modifier[]): string {
  const parts = [
    ...(modifiers ?? []).map((m) => m.charAt(0).toUpperCase() + m.slice(1)),
    formatKeyLabel(key),
  ]
  return parts.join('+')
}
