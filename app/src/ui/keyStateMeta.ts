import type { MessageKey } from '../i18n'
import type { KeyAvailabilityState } from '../types'

export interface KeyStateMeta {
  state: KeyAvailabilityState
  /** Short label for legend and aria. */
  labelKey: MessageKey
  descriptionKey: MessageKey
  /** Non-color mark drawn on the key (D11). Empty for free. */
  mark: string
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
    fillClass: 'key-fill-free',
  },
  partial: {
    state: 'partial',
    labelKey: 'summaryPartial',
    descriptionKey: 'statePartialDesc',
    mark: '≈',
    fillClass: 'key-fill-partial',
  },
  heavy: {
    state: 'heavy',
    labelKey: 'summaryHeavy',
    descriptionKey: 'stateHeavyDesc',
    mark: '!',
    fillClass: 'key-fill-heavy',
  },
  reserved: {
    state: 'reserved',
    labelKey: 'summaryReserved',
    descriptionKey: 'stateReservedDesc',
    mark: '×',
    fillClass: 'key-fill-reserved',
  },
  unknown: {
    state: 'unknown',
    labelKey: 'summaryUnknown',
    descriptionKey: 'stateUnknownDesc',
    mark: '?',
    fillClass: 'key-fill-unknown',
  },
}

export function getKeyStateMeta(state: KeyAvailabilityState): KeyStateMeta {
  return META[state]
}
