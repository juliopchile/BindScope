import type { KeyboardKey, KeyboardLayout, LayoutId, LayoutKey, LayoutRect } from '../types'

const U = 48
const H = 48
const GAP = 6
/** Uniform row pitch (key height + inter-row gap). */
const ROW = H + GAP
/** Slightly larger gap between the function row and the number row (real boards). */
const F_TO_NUMBER_GAP = GAP * 2
/** Horizontal gap between alpha, nav/system, and numpad clusters. */
const CLUSTER_GAP = GAP * 4
/** Corner radius matching KeyboardVisualizer rounded rects. */
const KEY_RADIUS = 5

const F_ROW_Y = 0
const NUMBER_ROW_Y = H + F_TO_NUMBER_GAP
const Q_ROW_Y = NUMBER_ROW_Y + ROW
const HOME_ROW_Y = Q_ROW_Y + ROW
const SHIFT_ROW_Y = HOME_ROW_Y + ROW
const MOD_ROW_Y = SHIFT_ROW_Y + ROW

/** Form-factor ids shipped in UR4 + PD4. Ergo / split remain out of scope. */
export const LAYOUT_IDS: readonly LayoutId[] = [
  'ansi-full',
  'ansi-tkl',
  'ansi-60',
  'iso-full',
]

function key(
  id: KeyboardKey,
  label: string,
  x: number,
  y: number,
  width = U,
  height = H,
  extra?: Pick<LayoutKey, 'pathD' | 'collisionRects' | 'labelX' | 'labelY'>,
): LayoutKey {
  return { id, label, x, y, width, height, ...extra }
}

/**
 * Rounded L-path for ISO Enter (wider top bar over home-row Backslash, tall stem on the right).
 * Vertex order matches KLE-style ISO geometry: top overhang + right stem, not a plain 1.5×2 rect.
 * References: keyboard-layout-editor `x2/y2/w2/h2` Enter; Keybindr / SVG keyboard L-caps.
 */
function roundedIsoEnterPath(
  topX: number,
  topY: number,
  right: number,
  bottom: number,
  stemX: number,
  stepY: number,
  radius = KEY_RADIUS,
): string {
  const points = [
    { x: topX, y: topY },
    { x: right, y: topY },
    { x: right, y: bottom },
    { x: stemX, y: bottom },
    { x: stemX, y: stepY },
    { x: topX, y: stepY },
  ]

  const n = points.length
  const parts: string[] = []

  for (let i = 0; i < n; i++) {
    const prev = points[(i + n - 1) % n]!
    const curr = points[i]!
    const next = points[(i + 1) % n]!

    const toPrevX = prev.x - curr.x
    const toPrevY = prev.y - curr.y
    const toNextX = next.x - curr.x
    const toNextY = next.y - curr.y
    const lenPrev = Math.hypot(toPrevX, toPrevY)
    const lenNext = Math.hypot(toNextX, toNextY)
    const r = Math.min(radius, lenPrev / 2, lenNext / 2)

    const startX = curr.x + (toPrevX / lenPrev) * r
    const startY = curr.y + (toPrevY / lenPrev) * r
    const endX = curr.x + (toNextX / lenNext) * r
    const endY = curr.y + (toNextY / lenNext) * r

    // Cross product z-sign: ISO Enter outline is clockwise → sweep-flag 1 for outer arcs.
    const cross = toPrevX * toNextY - toPrevY * toNextX
    const sweep = cross < 0 ? 1 : 0

    if (i === 0) {
      parts.push(`M ${startX} ${startY}`)
    } else {
      parts.push(`L ${startX} ${startY}`)
    }
    parts.push(`A ${r} ${r} 0 0 ${sweep} ${endX} ${endY}`)
  }

  parts.push('Z')
  return parts.join(' ')
}

/** ISO Enter: L-cap with top bar after `]` and stem after home-row `#` / Backslash. */
function isoEnterKey(
  offsetX: number,
  topX: number,
  stemX: number,
  stemWidth: number,
): LayoutKey {
  const absTopX = offsetX + topX
  const absStemX = offsetX + stemX
  const right = absStemX + stemWidth
  const topY = Q_ROW_Y
  const stepY = HOME_ROW_Y
  const bottom = HOME_ROW_Y + H
  const width = right - absTopX
  const height = bottom - topY

  const topBar: LayoutRect = {
    x: absTopX,
    y: topY,
    width,
    height: stepY - topY,
  }
  const stem: LayoutRect = {
    x: absStemX,
    y: topY,
    width: stemWidth,
    height,
  }

  return key('Enter', 'Enter', absTopX, topY, width, height, {
    pathD: roundedIsoEnterPath(absTopX, topY, right, bottom, absStemX, stepY),
    collisionRects: [topBar, stem],
    labelX: absStemX + stemWidth / 2,
    labelY: topY + height / 2,
  })
}

type AlphaVariant = 'ansi' | 'iso'

/**
 * Shared alpha block used by full, TKL, and compact layouts.
 * ISO swaps Enter / Backslash / left-Shift for physical ISO geometry.
 */
function alphaBlock(offsetX = 0, offsetY = 0, variant: AlphaVariant = 'ansi') {
  const k = (id: KeyboardKey, label: string, x: number, y: number, w = U, h = H) =>
    key(id, label, offsetX + x, offsetY + y, w, h)

  const fRow = [
    k('Escape', 'Esc', 0, F_ROW_Y, U * 0.9, H),
    k('F1', 'F1', U * 1.2, F_ROW_Y),
    k('F2', 'F2', U * 1.2 + U + GAP, F_ROW_Y),
    k('F3', 'F3', U * 1.2 + (U + GAP) * 2, F_ROW_Y),
    k('F4', 'F4', U * 1.2 + (U + GAP) * 3, F_ROW_Y),
    k('F5', 'F5', U * 1.2 + (U + GAP) * 4 + GAP * 4, F_ROW_Y),
    k('F6', 'F6', U * 1.2 + (U + GAP) * 5 + GAP * 4, F_ROW_Y),
    k('F7', 'F7', U * 1.2 + (U + GAP) * 6 + GAP * 4, F_ROW_Y),
    k('F8', 'F8', U * 1.2 + (U + GAP) * 7 + GAP * 4, F_ROW_Y),
    k('F9', 'F9', U * 1.2 + (U + GAP) * 8 + GAP * 8, F_ROW_Y),
    k('F10', 'F10', U * 1.2 + (U + GAP) * 9 + GAP * 8, F_ROW_Y),
    k('F11', 'F11', U * 1.2 + (U + GAP) * 10 + GAP * 8, F_ROW_Y),
    k('F12', 'F12', U * 1.2 + (U + GAP) * 11 + GAP * 8, F_ROW_Y),
  ]

  const numberRow = [
    k('Backquote', '`', 0, NUMBER_ROW_Y),
    k('Digit1', '1', U + GAP, NUMBER_ROW_Y),
    k('Digit2', '2', (U + GAP) * 2, NUMBER_ROW_Y),
    k('Digit3', '3', (U + GAP) * 3, NUMBER_ROW_Y),
    k('Digit4', '4', (U + GAP) * 4, NUMBER_ROW_Y),
    k('Digit5', '5', (U + GAP) * 5, NUMBER_ROW_Y),
    k('Digit6', '6', (U + GAP) * 6, NUMBER_ROW_Y),
    k('Digit7', '7', (U + GAP) * 7, NUMBER_ROW_Y),
    k('Digit8', '8', (U + GAP) * 8, NUMBER_ROW_Y),
    k('Digit9', '9', (U + GAP) * 9, NUMBER_ROW_Y),
    k('Digit0', '0', (U + GAP) * 10, NUMBER_ROW_Y),
    k('Minus', '-', (U + GAP) * 11, NUMBER_ROW_Y),
    k('Equal', '=', (U + GAP) * 12, NUMBER_ROW_Y),
    k('Backspace', 'Bksp', (U + GAP) * 13, NUMBER_ROW_Y, U * 1.8, H),
  ]

  const qStart = U * 1.3 + GAP
  const homeStart = U * 1.5 + GAP

  const qRowCore = [
    k('Tab', 'Tab', 0, Q_ROW_Y, U * 1.3, H),
    k('KeyQ', 'Q', qStart, Q_ROW_Y),
    k('KeyW', 'W', qStart + U + GAP, Q_ROW_Y),
    k('KeyE', 'E', qStart + (U + GAP) * 2, Q_ROW_Y),
    k('KeyR', 'R', qStart + (U + GAP) * 3, Q_ROW_Y),
    k('KeyT', 'T', qStart + (U + GAP) * 4, Q_ROW_Y),
    k('KeyY', 'Y', qStart + (U + GAP) * 5, Q_ROW_Y),
    k('KeyU', 'U', qStart + (U + GAP) * 6, Q_ROW_Y),
    k('KeyI', 'I', qStart + (U + GAP) * 7, Q_ROW_Y),
    k('KeyO', 'O', qStart + (U + GAP) * 8, Q_ROW_Y),
    k('KeyP', 'P', qStart + (U + GAP) * 9, Q_ROW_Y),
    k('BracketLeft', '[', qStart + (U + GAP) * 10, Q_ROW_Y),
    k('BracketRight', ']', qStart + (U + GAP) * 11, Q_ROW_Y),
  ]

  const homeCore = [
    k('CapsLock', 'Caps', 0, HOME_ROW_Y, U * 1.5, H),
    k('KeyA', 'A', homeStart, HOME_ROW_Y),
    k('KeyS', 'S', homeStart + U + GAP, HOME_ROW_Y),
    k('KeyD', 'D', homeStart + (U + GAP) * 2, HOME_ROW_Y),
    k('KeyF', 'F', homeStart + (U + GAP) * 3, HOME_ROW_Y),
    k('KeyG', 'G', homeStart + (U + GAP) * 4, HOME_ROW_Y),
    k('KeyH', 'H', homeStart + (U + GAP) * 5, HOME_ROW_Y),
    k('KeyJ', 'J', homeStart + (U + GAP) * 6, HOME_ROW_Y),
    k('KeyK', 'K', homeStart + (U + GAP) * 7, HOME_ROW_Y),
    k('KeyL', 'L', homeStart + (U + GAP) * 8, HOME_ROW_Y),
    k('Semicolon', ';', homeStart + (U + GAP) * 9, HOME_ROW_Y),
    k('Quote', "'", homeStart + (U + GAP) * 10, HOME_ROW_Y),
  ]

  const modRow = [
    k('ControlLeft', 'Ctrl', 0, MOD_ROW_Y, U * 1.2, H),
    k('MetaLeft', 'Win', U * 1.2 + GAP, MOD_ROW_Y, U, H),
    k('AltLeft', 'Alt', U * 1.2 + GAP + U + GAP, MOD_ROW_Y, U, H),
    k('Space', 'Space', U * 1.2 + GAP + (U + GAP) * 2, MOD_ROW_Y, U * 6.2, H),
    k('AltRight', 'Alt', U * 1.2 + GAP + (U + GAP) * 2 + U * 6.2 + GAP, MOD_ROW_Y, U, H),
    k(
      'MetaRight',
      'Win',
      U * 1.2 + GAP + (U + GAP) * 2 + U * 6.2 + GAP * 2 + U,
      MOD_ROW_Y,
      U,
      H,
    ),
    k(
      'ControlRight',
      'Ctrl',
      U * 1.2 + GAP + (U + GAP) * 2 + U * 6.2 + GAP * 3 + U * 2,
      MOD_ROW_Y,
      U * 1.2,
      H,
    ),
  ]

  if (variant === 'iso') {
    const quote = homeCore[homeCore.length - 1]!
    const bracketRight = qRowCore[qRowCore.length - 1]!
    // Local (pre-offset) X: top bar starts after `]`; stem after home-row `#`.
    const isoTopX = bracketRight.x - offsetX + bracketRight.width + GAP
    const isoBackslashX = quote.x - offsetX + quote.width + GAP
    const isoStemX = isoBackslashX + U + GAP
    const isoStemW = U * 1.5
    const shiftLeftW = U * 1.25
    const intlX = shiftLeftW + GAP
    const zStart = intlX + U + GAP

    return [
      ...fRow,
      ...numberRow,
      ...qRowCore,
      ...homeCore,
      k('Backslash', '#', isoBackslashX, HOME_ROW_Y, U, H),
      isoEnterKey(offsetX, isoTopX, isoStemX, isoStemW),
      k('ShiftLeft', 'Shift', 0, SHIFT_ROW_Y, shiftLeftW, H),
      k('IntlBackslash', '\\', intlX, SHIFT_ROW_Y, U, H),
      k('KeyZ', 'Z', zStart, SHIFT_ROW_Y),
      k('KeyX', 'X', zStart + U + GAP, SHIFT_ROW_Y),
      k('KeyC', 'C', zStart + (U + GAP) * 2, SHIFT_ROW_Y),
      k('KeyV', 'V', zStart + (U + GAP) * 3, SHIFT_ROW_Y),
      k('KeyB', 'B', zStart + (U + GAP) * 4, SHIFT_ROW_Y),
      k('KeyN', 'N', zStart + (U + GAP) * 5, SHIFT_ROW_Y),
      k('KeyM', 'M', zStart + (U + GAP) * 6, SHIFT_ROW_Y),
      k('Comma', ',', zStart + (U + GAP) * 7, SHIFT_ROW_Y),
      k('Period', '.', zStart + (U + GAP) * 8, SHIFT_ROW_Y),
      k('Slash', '/', zStart + (U + GAP) * 9, SHIFT_ROW_Y),
      k('ShiftRight', 'Shift', zStart + (U + GAP) * 10, SHIFT_ROW_Y, U * 1.75, H),
      ...modRow,
    ]
  }

  return [
    ...fRow,
    ...numberRow,
    ...qRowCore,
    k('Backslash', '\\', qStart + (U + GAP) * 12, Q_ROW_Y, U * 1.2, H),
    ...homeCore,
    k('Enter', 'Enter', homeStart + (U + GAP) * 11, HOME_ROW_Y, U * 1.9, H),
    k('ShiftLeft', 'Shift', 0, SHIFT_ROW_Y, U * 2, H),
    k('KeyZ', 'Z', U * 2 + GAP, SHIFT_ROW_Y),
    k('KeyX', 'X', U * 2 + GAP + U + GAP, SHIFT_ROW_Y),
    k('KeyC', 'C', U * 2 + GAP + (U + GAP) * 2, SHIFT_ROW_Y),
    k('KeyV', 'V', U * 2 + GAP + (U + GAP) * 3, SHIFT_ROW_Y),
    k('KeyB', 'B', U * 2 + GAP + (U + GAP) * 4, SHIFT_ROW_Y),
    k('KeyN', 'N', U * 2 + GAP + (U + GAP) * 5, SHIFT_ROW_Y),
    k('KeyM', 'M', U * 2 + GAP + (U + GAP) * 6, SHIFT_ROW_Y),
    k('Comma', ',', U * 2 + GAP + (U + GAP) * 7, SHIFT_ROW_Y),
    k('Period', '.', U * 2 + GAP + (U + GAP) * 8, SHIFT_ROW_Y),
    k('Slash', '/', U * 2 + GAP + (U + GAP) * 9, SHIFT_ROW_Y),
    k('ShiftRight', 'Shift', U * 2 + GAP + (U + GAP) * 10, SHIFT_ROW_Y, U * 2.3, H),
    ...modRow,
  ]
}

/** Right edge of the alpha typing block (includes L-shaped ISO Enter bounding box). */
function alphaRightEdge(keys: KeyboardLayout['keys']): number {
  let right = 0
  for (const layoutKey of keys) {
    right = Math.max(right, layoutKey.x + layoutKey.width)
  }
  return right
}

/**
 * System + navigation island: PrtSc/ScrLk/Pause on the F-row, Ins/Del block on number/Q rows,
 * arrows on shift/mod rows (empty home-row gap, matching real full/TKL boards).
 */
function navCluster(offsetX: number) {
  const k = (id: KeyboardKey, label: string, x: number, y: number, w = U, h = H) =>
    key(id, label, offsetX + x, y, w, h)

  return [
    k('PrintScreen', 'PrtSc', 0, F_ROW_Y),
    k('ScrollLock', 'ScrLk', U + GAP, F_ROW_Y),
    k('Pause', 'Pause', (U + GAP) * 2, F_ROW_Y),
    k('Insert', 'Ins', 0, NUMBER_ROW_Y),
    k('Home', 'Home', U + GAP, NUMBER_ROW_Y),
    k('PageUp', 'PgUp', (U + GAP) * 2, NUMBER_ROW_Y),
    k('Delete', 'Del', 0, Q_ROW_Y),
    k('End', 'End', U + GAP, Q_ROW_Y),
    k('PageDown', 'PgDn', (U + GAP) * 2, Q_ROW_Y),
    k('ArrowUp', '↑', U + GAP, SHIFT_ROW_Y),
    k('ArrowLeft', '←', 0, MOD_ROW_Y),
    k('ArrowDown', '↓', U + GAP, MOD_ROW_Y),
    k('ArrowRight', '→', (U + GAP) * 2, MOD_ROW_Y),
  ]
}

function numpad(offsetX: number) {
  const k = (id: KeyboardKey, label: string, x: number, y: number, w = U, h = H) =>
    key(id, label, offsetX + x, y, w, h)

  // Numpad top row aligns with the number row (NumLock + operators).
  const r0 = NUMBER_ROW_Y
  const r1 = Q_ROW_Y
  const r2 = HOME_ROW_Y
  const r3 = SHIFT_ROW_Y
  const r4 = MOD_ROW_Y

  return [
    k('NumLock', 'NumLk', 0, r0),
    k('NumpadDivide', '/', U + GAP, r0),
    k('NumpadMultiply', '*', (U + GAP) * 2, r0),
    k('NumpadSubtract', '-', (U + GAP) * 3, r0),
    k('Numpad7', '7', 0, r1),
    k('Numpad8', '8', U + GAP, r1),
    k('Numpad9', '9', (U + GAP) * 2, r1),
    k('NumpadAdd', '+', (U + GAP) * 3, r1, U, H * 2 + GAP),
    k('Numpad4', '4', 0, r2),
    k('Numpad5', '5', U + GAP, r2),
    k('Numpad6', '6', (U + GAP) * 2, r2),
    k('Numpad1', '1', 0, r3),
    k('Numpad2', '2', U + GAP, r3),
    k('Numpad3', '3', (U + GAP) * 2, r3),
    k('NumpadEnter', 'Ent', (U + GAP) * 3, r3, U, H * 2 + GAP),
    k('Numpad0', '0', 0, r4, U * 2 + GAP, H),
    k('NumpadDecimal', '.', (U + GAP) * 2, r4),
  ]
}

const NAV_WIDTH = (U + GAP) * 2 + U

const ansiAlpha = alphaBlock(0, 0, 'ansi')
const isoAlpha = alphaBlock(0, 0, 'iso')

const ansiNavX = alphaRightEdge(ansiAlpha) + CLUSTER_GAP
const isoNavX = alphaRightEdge(isoAlpha) + CLUSTER_GAP
const ansiNav = navCluster(ansiNavX)
const isoNav = navCluster(isoNavX)
const ansiPad = numpad(ansiNavX + NAV_WIDTH + CLUSTER_GAP)
const isoPad = numpad(isoNavX + NAV_WIDTH + CLUSTER_GAP)

const LAYOUT_HEIGHT = MOD_ROW_Y + H + GAP * 2

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

/** Full-size ISO: L-shaped Enter, IntlBackslash left of Z, Backslash on the home row. */
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
