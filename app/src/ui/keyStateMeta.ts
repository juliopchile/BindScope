import type { MessageKey } from '../i18n'
import type { KeyAvailabilityState } from '../types'

export interface KeyStateMeta {
  state: KeyAvailabilityState
  /** Short label for legend and aria. */
  labelKey: MessageKey
  descriptionKey: MessageKey
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
    labelKey: 'summaryFree',
    descriptionKey: 'stateFreeDesc',
    mark: '',
    patternId: 'pattern-free',
    fillClass: 'key-fill-free',
  },
  partial: {
    state: 'partial',
    labelKey: 'summaryPartial',
    descriptionKey: 'statePartialDesc',
    mark: '≈',
    patternId: 'pattern-partial',
    fillClass: 'key-fill-partial',
  },
  heavy: {
    state: 'heavy',
    labelKey: 'summaryHeavy',
    descriptionKey: 'stateHeavyDesc',
    mark: '!',
    patternId: 'pattern-heavy',
    fillClass: 'key-fill-heavy',
  },
  reserved: {
    state: 'reserved',
    labelKey: 'summaryReserved',
    descriptionKey: 'stateReservedDesc',
    mark: '×',
    patternId: 'pattern-reserved',
    fillClass: 'key-fill-reserved',
  },
  unknown: {
    state: 'unknown',
    labelKey: 'summaryUnknown',
    descriptionKey: 'stateUnknownDesc',
    mark: '?',
    patternId: 'pattern-unknown',
    fillClass: 'key-fill-unknown',
  },
}

export function getKeyStateMeta(state: KeyAvailabilityState): KeyStateMeta {
  return META[state]
}
