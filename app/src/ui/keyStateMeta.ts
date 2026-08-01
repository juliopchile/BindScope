import type { KeyAvailabilityState } from '../types'
import { messages } from './messages'

export interface KeyStateMeta {
  state: KeyAvailabilityState
  /** Short label for legend and aria. */
  label: string
  description: string
  /** Non-color mark drawn on the key (D11). Empty for free. */
  mark: string
  patternId: string
  fillClass: string
}

/** Legend order — unknown is omitted from the legend but still renderable. */
export const LEGEND_STATES: KeyAvailabilityState[] = ['free', 'partial', 'heavy', 'reserved']

const META: Record<KeyAvailabilityState, KeyStateMeta> = {
  free: {
    state: 'free',
    label: messages.summaryFree,
    description: 'Unused in every selected profile',
    mark: '',
    patternId: 'pattern-free',
    fillClass: 'key-fill-free',
  },
  partial: {
    state: 'partial',
    label: messages.summaryPartial,
    description: 'Used by some selected games',
    mark: '≈',
    patternId: 'pattern-partial',
    fillClass: 'key-fill-partial',
  },
  heavy: {
    state: 'heavy',
    label: messages.summaryHeavy,
    description: 'Used by all selected games',
    mark: '!',
    patternId: 'pattern-heavy',
    fillClass: 'key-fill-heavy',
  },
  reserved: {
    state: 'reserved',
    label: messages.summaryReserved,
    description: 'OS or explicitly unsafe',
    mark: '×',
    patternId: 'pattern-reserved',
    fillClass: 'key-fill-reserved',
  },
  unknown: {
    state: 'unknown',
    label: 'Unknown',
    description: 'Binding outside the active layout',
    mark: '?',
    patternId: 'pattern-unknown',
    fillClass: 'key-fill-unknown',
  },
}

export function getKeyStateMeta(state: KeyAvailabilityState): KeyStateMeta {
  return META[state]
}
