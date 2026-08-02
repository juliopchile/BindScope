import type { KeyboardLayout, LayoutId } from '../types'

const U = 48
const H = 48
const GAP = 6

/** Form-factor ids shipped in UR4 + PD4. Ergo / split remain out of scope. */
export const LAYOUT_IDS: readonly LayoutId[] = [
  'ansi-full',
  'ansi-tkl',
  'ansi-60',
  'iso-full',
]

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

type AlphaVariant = 'ansi' | 'iso'

/**
 * Shared alpha block used by full, TKL, and compact layouts.
 * ISO swaps Enter / Backslash / left-Shift for physical ISO geometry.
 */
function alphaBlock(offsetX = 0, offsetY = 0, variant: AlphaVariant = 'ansi') {
  const k = (
    id: KeyboardLayout['keys'][number]['id'],
    label: string,
    x: number,
    y: number,
    w = U,
    h = H,
  ) => key(id, label, offsetX + x, offsetY + y, w, h)

  const fRow = [
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
  ]

  const numberRowY = H + GAP * 2
  const numberRow = [
    k('Backquote', '`', 0, numberRowY),
    k('Digit1', '1', U + GAP, numberRowY),
    k('Digit2', '2', (U + GAP) * 2, numberRowY),
    k('Digit3', '3', (U + GAP) * 3, numberRowY),
    k('Digit4', '4', (U + GAP) * 4, numberRowY),
    k('Digit5', '5', (U + GAP) * 5, numberRowY),
    k('Digit6', '6', (U + GAP) * 6, numberRowY),
    k('Digit7', '7', (U + GAP) * 7, numberRowY),
    k('Digit8', '8', (U + GAP) * 8, numberRowY),
    k('Digit9', '9', (U + GAP) * 9, numberRowY),
    k('Digit0', '0', (U + GAP) * 10, numberRowY),
    k('Minus', '-', (U + GAP) * 11, numberRowY),
    k('Equal', '=', (U + GAP) * 12, numberRowY),
    k('Backspace', 'Bksp', (U + GAP) * 13, numberRowY, U * 1.8, H),
  ]

  const qRowY = (H + GAP) * 2
  const homeY = (H + GAP) * 3
  const shiftY = (H + GAP) * 4
  const modY = (H + GAP) * 5

  const qStart = U * 1.3 + GAP
  const homeStart = U * 1.5 + GAP

  const qRowCore = [
    k('Tab', 'Tab', 0, qRowY, U * 1.3, H),
    k('KeyQ', 'Q', qStart, qRowY),
    k('KeyW', 'W', qStart + U + GAP, qRowY),
    k('KeyE', 'E', qStart + (U + GAP) * 2, qRowY),
    k('KeyR', 'R', qStart + (U + GAP) * 3, qRowY),
    k('KeyT', 'T', qStart + (U + GAP) * 4, qRowY),
    k('KeyY', 'Y', qStart + (U + GAP) * 5, qRowY),
    k('KeyU', 'U', qStart + (U + GAP) * 6, qRowY),
    k('KeyI', 'I', qStart + (U + GAP) * 7, qRowY),
    k('KeyO', 'O', qStart + (U + GAP) * 8, qRowY),
    k('KeyP', 'P', qStart + (U + GAP) * 9, qRowY),
    k('BracketLeft', '[', qStart + (U + GAP) * 10, qRowY),
    k('BracketRight', ']', qStart + (U + GAP) * 11, qRowY),
  ]

  const homeCore = [
    k('CapsLock', 'Caps', 0, homeY, U * 1.5, H),
    k('KeyA', 'A', homeStart, homeY),
    k('KeyS', 'S', homeStart + U + GAP, homeY),
    k('KeyD', 'D', homeStart + (U + GAP) * 2, homeY),
    k('KeyF', 'F', homeStart + (U + GAP) * 3, homeY),
    k('KeyG', 'G', homeStart + (U + GAP) * 4, homeY),
    k('KeyH', 'H', homeStart + (U + GAP) * 5, homeY),
    k('KeyJ', 'J', homeStart + (U + GAP) * 6, homeY),
    k('KeyK', 'K', homeStart + (U + GAP) * 7, homeY),
    k('KeyL', 'L', homeStart + (U + GAP) * 8, homeY),
    k('Semicolon', ';', homeStart + (U + GAP) * 9, homeY),
    k('Quote', "'", homeStart + (U + GAP) * 10, homeY),
  ]

  const modRow = [
    k('ControlLeft', 'Ctrl', 0, modY, U * 1.2, H),
    k('MetaLeft', 'Win', U * 1.2 + GAP, modY, U, H),
    k('AltLeft', 'Alt', U * 1.2 + GAP + U + GAP, modY, U, H),
    k('Space', 'Space', U * 1.2 + GAP + (U + GAP) * 2, modY, U * 6.2, H),
    k('AltRight', 'Alt', U * 1.2 + GAP + (U + GAP) * 2 + U * 6.2 + GAP, modY, U, H),
    k(
      'MetaRight',
      'Win',
      U * 1.2 + GAP + (U + GAP) * 2 + U * 6.2 + GAP * 2 + U,
      modY,
      U,
      H,
    ),
    k(
      'ControlRight',
      'Ctrl',
      U * 1.2 + GAP + (U + GAP) * 2 + U * 6.2 + GAP * 3 + U * 2,
      modY,
      U * 1.2,
      H,
    ),
  ]

  if (variant === 'iso') {
    const quote = homeCore[homeCore.length - 1]!
    const bracketRight = qRowCore[qRowCore.length - 1]!
    const isoBackslashX = quote.x - offsetX + quote.width + GAP
    const isoEnterX = Math.max(
      bracketRight.x - offsetX + bracketRight.width + GAP,
      isoBackslashX + U + GAP,
    )
    const isoEnterW = U * 1.5
    const shiftLeftW = U * 1.25
    const intlX = shiftLeftW + GAP
    const zStart = intlX + U + GAP

    return [
      ...fRow,
      ...numberRow,
      ...qRowCore,
      ...homeCore,
      k('Backslash', '#', isoBackslashX, homeY, U, H),
      k('Enter', 'Enter', isoEnterX, qRowY, isoEnterW, H * 2 + GAP),
      k('ShiftLeft', 'Shift', 0, shiftY, shiftLeftW, H),
      k('IntlBackslash', '\\', intlX, shiftY, U, H),
      k('KeyZ', 'Z', zStart, shiftY),
      k('KeyX', 'X', zStart + U + GAP, shiftY),
      k('KeyC', 'C', zStart + (U + GAP) * 2, shiftY),
      k('KeyV', 'V', zStart + (U + GAP) * 3, shiftY),
      k('KeyB', 'B', zStart + (U + GAP) * 4, shiftY),
      k('KeyN', 'N', zStart + (U + GAP) * 5, shiftY),
      k('KeyM', 'M', zStart + (U + GAP) * 6, shiftY),
      k('Comma', ',', zStart + (U + GAP) * 7, shiftY),
      k('Period', '.', zStart + (U + GAP) * 8, shiftY),
      k('Slash', '/', zStart + (U + GAP) * 9, shiftY),
      k('ShiftRight', 'Shift', zStart + (U + GAP) * 10, shiftY, U * 1.75, H),
      ...modRow,
    ]
  }

  return [
    ...fRow,
    ...numberRow,
    ...qRowCore,
    k('Backslash', '\\', qStart + (U + GAP) * 12, qRowY, U * 1.2, H),
    ...homeCore,
    k('Enter', 'Enter', homeStart + (U + GAP) * 11, homeY, U * 1.9, H),
    k('ShiftLeft', 'Shift', 0, shiftY, U * 2, H),
    k('KeyZ', 'Z', U * 2 + GAP, shiftY),
    k('KeyX', 'X', U * 2 + GAP + U + GAP, shiftY),
    k('KeyC', 'C', U * 2 + GAP + (U + GAP) * 2, shiftY),
    k('KeyV', 'V', U * 2 + GAP + (U + GAP) * 3, shiftY),
    k('KeyB', 'B', U * 2 + GAP + (U + GAP) * 4, shiftY),
    k('KeyN', 'N', U * 2 + GAP + (U + GAP) * 5, shiftY),
    k('KeyM', 'M', U * 2 + GAP + (U + GAP) * 6, shiftY),
    k('Comma', ',', U * 2 + GAP + (U + GAP) * 7, shiftY),
    k('Period', '.', U * 2 + GAP + (U + GAP) * 8, shiftY),
    k('Slash', '/', U * 2 + GAP + (U + GAP) * 9, shiftY),
    k('ShiftRight', 'Shift', U * 2 + GAP + (U + GAP) * 10, shiftY, U * 2.3, H),
    ...modRow,
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

const ansiAlpha = alphaBlock(0, 0, 'ansi')
const isoAlpha = alphaBlock(0, 0, 'iso')

function navFor(alpha: KeyboardLayout['keys']) {
  return navCluster(alpha[alpha.length - 1]!.x + U * 4, H + GAP * 2)
}

const ansiNav = navFor(ansiAlpha)
const isoNav = navFor(isoAlpha)
const ansiPad = numpad(ansiNav[0]!.x + U * 3 + GAP * 6, H + GAP * 2)
const isoPad = numpad(isoNav[0]!.x + U * 3 + GAP * 6, H + GAP * 2)

const LAYOUT_HEIGHT = (H + GAP) * 6 + H

function layoutWidth(keys: KeyboardLayout['keys']): number {
  let right = 0
  for (const layoutKey of keys) {
    right = Math.max(right, layoutKey.x + layoutKey.width)
  }
  return right + GAP * 2
}

export const ANSI_FULL_LAYOUT: KeyboardLayout = {
  id: 'ansi-full',
  name: 'ANSI Full',
  description: 'Full-size ANSI keyboard with numpad',
  width: layoutWidth([...ansiAlpha, ...ansiNav, ...ansiPad]),
  height: LAYOUT_HEIGHT,
  keys: [...ansiAlpha, ...ansiNav, ...ansiPad],
}

/** Tenkeyless: alpha + nav cluster, no numpad — tighter mid-width fit. */
export const ANSI_TKL_LAYOUT: KeyboardLayout = {
  id: 'ansi-tkl',
  name: 'ANSI TKL',
  description: 'Tenkeyless ANSI keyboard without numpad',
  width: layoutWidth([...ansiAlpha, ...ansiNav]),
  height: LAYOUT_HEIGHT,
  keys: [...ansiAlpha, ...ansiNav],
}

/** Compact 60%: main alpha cluster only — no nav or numpad. */
export const ANSI_60_LAYOUT: KeyboardLayout = {
  id: 'ansi-60',
  name: 'ANSI 60%',
  description: 'Compact ANSI keyboard without nav cluster or numpad',
  width: layoutWidth(ansiAlpha),
  height: LAYOUT_HEIGHT,
  keys: [...ansiAlpha],
}

/** Full-size ISO: tall Enter, IntlBackslash left of Z, Backslash on the home row. */
export const ISO_FULL_LAYOUT: KeyboardLayout = {
  id: 'iso-full',
  name: 'ISO Full',
  description: 'Full-size ISO keyboard with numpad',
  width: layoutWidth([...isoAlpha, ...isoNav, ...isoPad]),
  height: LAYOUT_HEIGHT,
  keys: [...isoAlpha, ...isoNav, ...isoPad],
}

export const LAYOUT_REGISTRY: Record<LayoutId, KeyboardLayout> = {
  'ansi-full': ANSI_FULL_LAYOUT,
  'ansi-tkl': ANSI_TKL_LAYOUT,
  'ansi-60': ANSI_60_LAYOUT,
  'iso-full': ISO_FULL_LAYOUT,
}

export function isLayoutId(value: string): value is LayoutId {
  return (LAYOUT_IDS as readonly string[]).includes(value)
}

export function getLayout(id: LayoutId): KeyboardLayout {
  return LAYOUT_REGISTRY[id]
}
