import type { MouseLayout } from '../types'

/**
 * CS-binds-style top-down mouse: primary buttons 1–5 plus wheel directions.
 * Coordinates are SVG units; the visualizer scales via viewBox.
 */
export const STANDARD_MOUSE: MouseLayout = {
  id: 'standard-mouse',
  name: 'Standard mouse',
  description: 'Five-button mouse with scroll wheel up/down',
  width: 140,
  height: 240,
  keys: [
    { id: 'Mouse1', label: '1', x: 28, y: 28, width: 40, height: 68 },
    { id: 'Mouse2', label: '2', x: 72, y: 28, width: 40, height: 68 },
    { id: 'WheelUp', label: '↑', x: 58, y: 42, width: 24, height: 14 },
    { id: 'Mouse3', label: '3', x: 56, y: 58, width: 28, height: 28 },
    { id: 'WheelDown', label: '↓', x: 58, y: 88, width: 24, height: 14 },
    { id: 'Mouse4', label: '4', x: 8, y: 108, width: 18, height: 28 },
    { id: 'Mouse5', label: '5', x: 8, y: 142, width: 18, height: 28 },
  ],
}

export function getMouseLayout(): MouseLayout {
  return STANDARD_MOUSE
}

export function isMouseKeyId(id: string): boolean {
  return STANDARD_MOUSE.keys.some((key) => key.id === id)
}
