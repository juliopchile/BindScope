import type { KeyboardLayout } from '../types'

const U = 48
const H = 48
const GAP = 6

function key(
  id: KeyboardLayout['keys'][number]['id'],
  label: string,
  x: number,
  y: number,
  width = U,
  height = H,
): KeyboardLayout['keys'][number] {
  return { id, label, x, y, width, height }
}

/** Shared ANSI alpha block used by full, TKL, and compact layouts. */
function alphaBlock(offsetX = 0, offsetY = 0) {
  const k = (
    id: KeyboardLayout['keys'][number]['id'],
    label: string,
    x: number,
    y: number,
    w = U,
    h = H,
  ) => key(id, label, offsetX + x, offsetY + y, w, h)

  return [
    k('Escape', 'Esc', 0, 0, U * 0.9, H),
    k('F1', 'F1', U * 1.2, 0),
    k('F2', 'F2', U * 1.2 + U + GAP, 0),
    k('F3', 'F3', U * 1.2 + (U + GAP) * 2, 0),
    k('F4', 'F4', U * 1.2 + (U + GAP) * 3, 0),
    k('F5', 'F5', U * 1.2 + (U + GAP) * 4 + GAP * 4, 0),
    k('F6', 'F6', U * 1.2 + (U + GAP) * 5 + GAP * 4, 0),
    k('F7', 'F7', U * 1.2 + (U + GAP) * 6 + GAP * 4, 0),
    k('F8', 'F8', U * 1.2 + (U + GAP) * 7 + GAP * 4, 0),
    k('F9', 'F9', U * 1.2 + (U + GAP) * 8 + GAP * 8, 0),
    k('F10', 'F10', U * 1.2 + (U + GAP) * 9 + GAP * 8, 0),
    k('F11', 'F11', U * 1.2 + (U + GAP) * 10 + GAP * 8, 0),
    k('F12', 'F12', U * 1.2 + (U + GAP) * 11 + GAP * 8, 0),

    k('Backquote', '`', 0, H + GAP * 2),
    k('Digit1', '1', U + GAP, H + GAP * 2),
    k('Digit2', '2', (U + GAP) * 2, H + GAP * 2),
    k('Digit3', '3', (U + GAP) * 3, H + GAP * 2),
    k('Digit4', '4', (U + GAP) * 4, H + GAP * 2),
    k('Digit5', '5', (U + GAP) * 5, H + GAP * 2),
    k('Digit6', '6', (U + GAP) * 6, H + GAP * 2),
    k('Digit7', '7', (U + GAP) * 7, H + GAP * 2),
    k('Digit8', '8', (U + GAP) * 8, H + GAP * 2),
    k('Digit9', '9', (U + GAP) * 9, H + GAP * 2),
    k('Digit0', '0', (U + GAP) * 10, H + GAP * 2),
    k('Minus', '-', (U + GAP) * 11, H + GAP * 2),
    k('Equal', '=', (U + GAP) * 12, H + GAP * 2),
    k('Backspace', 'Bksp', (U + GAP) * 13, H + GAP * 2, U * 1.8, H),

    k('Tab', 'Tab', 0, (H + GAP) * 2, U * 1.3, H),
    k('KeyQ', 'Q', U * 1.3 + GAP, (H + GAP) * 2),
    k('KeyW', 'W', U * 1.3 + GAP + U + GAP, (H + GAP) * 2),
    k('KeyE', 'E', U * 1.3 + GAP + (U + GAP) * 2, (H + GAP) * 2),
    k('KeyR', 'R', U * 1.3 + GAP + (U + GAP) * 3, (H + GAP) * 2),
    k('KeyT', 'T', U * 1.3 + GAP + (U + GAP) * 4, (H + GAP) * 2),
    k('KeyY', 'Y', U * 1.3 + GAP + (U + GAP) * 5, (H + GAP) * 2),
    k('KeyU', 'U', U * 1.3 + GAP + (U + GAP) * 6, (H + GAP) * 2),
    k('KeyI', 'I', U * 1.3 + GAP + (U + GAP) * 7, (H + GAP) * 2),
    k('KeyO', 'O', U * 1.3 + GAP + (U + GAP) * 8, (H + GAP) * 2),
    k('KeyP', 'P', U * 1.3 + GAP + (U + GAP) * 9, (H + GAP) * 2),
    k('BracketLeft', '[', U * 1.3 + GAP + (U + GAP) * 10, (H + GAP) * 2),
    k('BracketRight', ']', U * 1.3 + GAP + (U + GAP) * 11, (H + GAP) * 2),
    k('Backslash', '\\', U * 1.3 + GAP + (U + GAP) * 12, (H + GAP) * 2, U * 1.2, H),

    k('CapsLock', 'Caps', 0, (H + GAP) * 3, U * 1.5, H),
    k('KeyA', 'A', U * 1.5 + GAP, (H + GAP) * 3),
    k('KeyS', 'S', U * 1.5 + GAP + U + GAP, (H + GAP) * 3),
    k('KeyD', 'D', U * 1.5 + GAP + (U + GAP) * 2, (H + GAP) * 3),
    k('KeyF', 'F', U * 1.5 + GAP + (U + GAP) * 3, (H + GAP) * 3),
    k('KeyG', 'G', U * 1.5 + GAP + (U + GAP) * 4, (H + GAP) * 3),
    k('KeyH', 'H', U * 1.5 + GAP + (U + GAP) * 5, (H + GAP) * 3),
    k('KeyJ', 'J', U * 1.5 + GAP + (U + GAP) * 6, (H + GAP) * 3),
    k('KeyK', 'K', U * 1.5 + GAP + (U + GAP) * 7, (H + GAP) * 3),
    k('KeyL', 'L', U * 1.5 + GAP + (U + GAP) * 8, (H + GAP) * 3),
    k('Semicolon', ';', U * 1.5 + GAP + (U + GAP) * 9, (H + GAP) * 3),
    k('Quote', "'", U * 1.5 + GAP + (U + GAP) * 10, (H + GAP) * 3),
    k('Enter', 'Enter', U * 1.5 + GAP + (U + GAP) * 11, (H + GAP) * 3, U * 1.9, H),

    k('ShiftLeft', 'Shift', 0, (H + GAP) * 4, U * 2, H),
    k('KeyZ', 'Z', U * 2 + GAP, (H + GAP) * 4),
    k('KeyX', 'X', U * 2 + GAP + U + GAP, (H + GAP) * 4),
    k('KeyC', 'C', U * 2 + GAP + (U + GAP) * 2, (H + GAP) * 4),
    k('KeyV', 'V', U * 2 + GAP + (U + GAP) * 3, (H + GAP) * 4),
    k('KeyB', 'B', U * 2 + GAP + (U + GAP) * 4, (H + GAP) * 4),
    k('KeyN', 'N', U * 2 + GAP + (U + GAP) * 5, (H + GAP) * 4),
    k('KeyM', 'M', U * 2 + GAP + (U + GAP) * 6, (H + GAP) * 4),
    k('Comma', ',', U * 2 + GAP + (U + GAP) * 7, (H + GAP) * 4),
    k('Period', '.', U * 2 + GAP + (U + GAP) * 8, (H + GAP) * 4),
    k('Slash', '/', U * 2 + GAP + (U + GAP) * 9, (H + GAP) * 4),
    k('ShiftRight', 'Shift', U * 2 + GAP + (U + GAP) * 10, (H + GAP) * 4, U * 2.3, H),

    k('ControlLeft', 'Ctrl', 0, (H + GAP) * 5, U * 1.2, H),
    k('MetaLeft', 'Win', U * 1.2 + GAP, (H + GAP) * 5, U, H),
    k('AltLeft', 'Alt', U * 1.2 + GAP + U + GAP, (H + GAP) * 5, U, H),
    k('Space', 'Space', U * 1.2 + GAP + (U + GAP) * 2, (H + GAP) * 5, U * 6.2, H),
    k('AltRight', 'Alt', U * 1.2 + GAP + (U + GAP) * 2 + U * 6.2 + GAP, (H + GAP) * 5, U, H),
    k(
      'MetaRight',
      'Win',
      U * 1.2 + GAP + (U + GAP) * 2 + U * 6.2 + GAP * 2 + U,
      (H + GAP) * 5,
      U,
      H,
    ),
    k(
      'ControlRight',
      'Ctrl',
      U * 1.2 + GAP + (U + GAP) * 2 + U * 6.2 + GAP * 3 + U * 2,
      (H + GAP) * 5,
      U * 1.2,
      H,
    ),
  ]
}

function navCluster(offsetX: number, offsetY: number) {
  const k = (
    id: KeyboardLayout['keys'][number]['id'],
    label: string,
    x: number,
    y: number,
    w = U,
    h = H,
  ) => key(id, label, offsetX + x, offsetY + y, w, h)

  return [
    k('Insert', 'Ins', 0, 0),
    k('Home', 'Home', U + GAP, 0),
    k('PageUp', 'PgUp', (U + GAP) * 2, 0),
    k('Delete', 'Del', 0, H + GAP),
    k('End', 'End', U + GAP, H + GAP),
    k('PageDown', 'PgDn', (U + GAP) * 2, H + GAP),
    k('ArrowUp', '↑', U + GAP, (H + GAP) * 2),
    k('ArrowLeft', '←', 0, (H + GAP) * 3),
    k('ArrowDown', '↓', U + GAP, (H + GAP) * 3),
    k('ArrowRight', '→', (U + GAP) * 2, (H + GAP) * 3),
  ]
}

function numpad(offsetX: number, offsetY: number) {
  const k = (
    id: KeyboardLayout['keys'][number]['id'],
    label: string,
    x: number,
    y: number,
    w = U,
    h = H,
  ) => key(id, label, offsetX + x, offsetY + y, w, h)

  return [
    k('NumpadDivide', '/', 0, 0),
    k('NumpadMultiply', '*', U + GAP, 0),
    k('NumpadSubtract', '-', (U + GAP) * 2, 0),
    k('Numpad7', '7', 0, H + GAP),
    k('Numpad8', '8', U + GAP, H + GAP),
    k('Numpad9', '9', (U + GAP) * 2, H + GAP),
    k('NumpadAdd', '+', (U + GAP) * 3, H + GAP, U, H * 2 + GAP),
    k('Numpad4', '4', 0, (H + GAP) * 2),
    k('Numpad5', '5', U + GAP, (H + GAP) * 2),
    k('Numpad6', '6', (U + GAP) * 2, (H + GAP) * 2),
    k('Numpad1', '1', 0, (H + GAP) * 3),
    k('Numpad2', '2', U + GAP, (H + GAP) * 3),
    k('Numpad3', '3', (U + GAP) * 2, (H + GAP) * 3),
    k('NumpadEnter', 'Ent', (U + GAP) * 3, (H + GAP) * 3, U, H * 2 + GAP),
    k('Numpad0', '0', 0, (H + GAP) * 4, U * 2 + GAP, H),
    k('NumpadDecimal', '.', (U + GAP) * 2, (H + GAP) * 4),
  ]
}

const alpha = alphaBlock()
const nav = navCluster(alpha[alpha.length - 1]!.x + U * 4, H + GAP * 2)
const pad = numpad(nav[0]!.x + U * 3 + GAP * 6, H + GAP * 2)

export const ANSI_FULL_LAYOUT: KeyboardLayout = {
  id: 'ansi-full',
  name: 'ANSI Full',
  description: 'Full-size ANSI keyboard with numpad',
  width: pad[pad.length - 1]!.x + U + GAP * 2,
  height: (H + GAP) * 6 + H,
  keys: [...alpha, ...nav, ...pad],
}

const tklAlpha = alphaBlock()
const tklNav = navCluster(tklAlpha[tklAlpha.length - 1]!.x + U * 2, H + GAP * 2)

export const ANSI_TKL_LAYOUT: KeyboardLayout = {
  id: 'ansi-tkl',
  name: 'ANSI TKL',
  description: 'Tenkeyless ANSI keyboard without numpad',
  width: tklNav[tklNav.length - 1]!.x + U + GAP * 2,
  height: (H + GAP) * 6 + H,
  keys: [...tklAlpha, ...tklNav],
}

function compactAlpha() {
  const k = (
    id: KeyboardLayout['keys'][number]['id'],
    label: string,
    x: number,
    y: number,
    w = U,
    h = H,
  ) => key(id, label, x, y, w, h)

  return [
    k('Escape', 'Esc', 0, 0, U * 0.9, H),
    k('Digit1', '1', U + GAP, 0),
    k('Digit2', '2', (U + GAP) * 2, 0),
    k('Digit3', '3', (U + GAP) * 3, 0),
    k('Digit4', '4', (U + GAP) * 4, 0),
    k('Digit5', '5', (U + GAP) * 5, 0),
    k('Digit6', '6', (U + GAP) * 6, 0),
    k('Digit7', '7', (U + GAP) * 7, 0),
    k('Digit8', '8', (U + GAP) * 8, 0),
    k('Digit9', '9', (U + GAP) * 9, 0),
    k('Digit0', '0', (U + GAP) * 10, 0),
    k('Minus', '-', (U + GAP) * 11, 0),
    k('Equal', '=', (U + GAP) * 12, 0),
    k('Backspace', 'Bksp', (U + GAP) * 13, 0, U * 1.5, H),

    k('Tab', 'Tab', 0, H + GAP, U * 1.1, H),
    k('KeyQ', 'Q', U * 1.1 + GAP, H + GAP),
    k('KeyW', 'W', U * 1.1 + GAP + U + GAP, H + GAP),
    k('KeyE', 'E', U * 1.1 + GAP + (U + GAP) * 2, H + GAP),
    k('KeyR', 'R', U * 1.1 + GAP + (U + GAP) * 3, H + GAP),
    k('KeyT', 'T', U * 1.1 + GAP + (U + GAP) * 4, H + GAP),
    k('KeyY', 'Y', U * 1.1 + GAP + (U + GAP) * 5, H + GAP),
    k('KeyU', 'U', U * 1.1 + GAP + (U + GAP) * 6, H + GAP),
    k('KeyI', 'I', U * 1.1 + GAP + (U + GAP) * 7, H + GAP),
    k('KeyO', 'O', U * 1.1 + GAP + (U + GAP) * 8, H + GAP),
    k('KeyP', 'P', U * 1.1 + GAP + (U + GAP) * 9, H + GAP),
    k('BracketLeft', '[', U * 1.1 + GAP + (U + GAP) * 10, H + GAP),
    k('BracketRight', ']', U * 1.1 + GAP + (U + GAP) * 11, H + GAP),
    k('Backslash', '\\', U * 1.1 + GAP + (U + GAP) * 12, H + GAP, U, H),

    k('CapsLock', 'Caps', 0, (H + GAP) * 2, U * 1.3, H),
    k('KeyA', 'A', U * 1.3 + GAP, (H + GAP) * 2),
    k('KeyS', 'S', U * 1.3 + GAP + U + GAP, (H + GAP) * 2),
    k('KeyD', 'D', U * 1.3 + GAP + (U + GAP) * 2, (H + GAP) * 2),
    k('KeyF', 'F', U * 1.3 + GAP + (U + GAP) * 3, (H + GAP) * 2),
    k('KeyG', 'G', U * 1.3 + GAP + (U + GAP) * 4, (H + GAP) * 2),
    k('KeyH', 'H', U * 1.3 + GAP + (U + GAP) * 5, (H + GAP) * 2),
    k('KeyJ', 'J', U * 1.3 + GAP + (U + GAP) * 6, (H + GAP) * 2),
    k('KeyK', 'K', U * 1.3 + GAP + (U + GAP) * 7, (H + GAP) * 2),
    k('KeyL', 'L', U * 1.3 + GAP + (U + GAP) * 8, (H + GAP) * 2),
    k('Semicolon', ';', U * 1.3 + GAP + (U + GAP) * 9, (H + GAP) * 2),
    k('Quote', "'", U * 1.3 + GAP + (U + GAP) * 10, (H + GAP) * 2),
    k('Enter', 'Enter', U * 1.3 + GAP + (U + GAP) * 11, (H + GAP) * 2, U * 1.7, H),

    k('ShiftLeft', 'Shift', 0, (H + GAP) * 3, U * 1.7, H),
    k('KeyZ', 'Z', U * 1.7 + GAP, (H + GAP) * 3),
    k('KeyX', 'X', U * 1.7 + GAP + U + GAP, (H + GAP) * 3),
    k('KeyC', 'C', U * 1.7 + GAP + (U + GAP) * 2, (H + GAP) * 3),
    k('KeyV', 'V', U * 1.7 + GAP + (U + GAP) * 3, (H + GAP) * 3),
    k('KeyB', 'B', U * 1.7 + GAP + (U + GAP) * 4, (H + GAP) * 3),
    k('KeyN', 'N', U * 1.7 + GAP + (U + GAP) * 5, (H + GAP) * 3),
    k('KeyM', 'M', U * 1.7 + GAP + (U + GAP) * 6, (H + GAP) * 3),
    k('Comma', ',', U * 1.7 + GAP + (U + GAP) * 7, (H + GAP) * 3),
    k('Period', '.', U * 1.7 + GAP + (U + GAP) * 8, (H + GAP) * 3),
    k('Slash', '/', U * 1.7 + GAP + (U + GAP) * 9, (H + GAP) * 3),
    k('ShiftRight', 'Shift', U * 1.7 + GAP + (U + GAP) * 10, (H + GAP) * 3, U * 1.5, H),

    k('ControlLeft', 'Ctrl', 0, (H + GAP) * 4, U, H),
    k('AltLeft', 'Alt', U + GAP, (H + GAP) * 4, U, H),
    k('Space', 'Space', U * 2 + GAP, (H + GAP) * 4, U * 5.5, H),
    k('AltRight', 'Alt', U * 2 + GAP + U * 5.5 + GAP, (H + GAP) * 4, U, H),
    k('ControlRight', 'Ctrl', U * 2 + GAP + U * 5.5 + GAP * 2 + U, (H + GAP) * 4, U, H),

    k('ArrowUp', '↑', U * 2 + GAP + U * 5.5 + GAP * 4 + U, (H + GAP) * 3),
    k('ArrowLeft', '←', U * 2 + GAP + U * 5.5 + GAP * 3, (H + GAP) * 4),
    k('ArrowDown', '↓', U * 2 + GAP + U * 5.5 + GAP * 4 + U, (H + GAP) * 4),
    k('ArrowRight', '→', U * 2 + GAP + U * 5.5 + GAP * 5 + U * 2, (H + GAP) * 4),
  ]
}

const compactKeys = compactAlpha()

export const ANSI_COMPACT_LAYOUT: KeyboardLayout = {
  id: 'ansi-compact',
  name: 'ANSI Compact',
  description: '75% compact ANSI layout without F-row or numpad',
  width: compactKeys[compactKeys.length - 1]!.x + U + GAP,
  height: (H + GAP) * 5 + H,
  keys: compactKeys,
}

export const KEYBOARD_LAYOUTS: Record<string, KeyboardLayout> = {
  'ansi-full': ANSI_FULL_LAYOUT,
  'ansi-tkl': ANSI_TKL_LAYOUT,
  'ansi-compact': ANSI_COMPACT_LAYOUT,
}

export const DEFAULT_LAYOUT_ID = 'ansi-tkl'
