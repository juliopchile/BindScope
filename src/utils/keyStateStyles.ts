import type { AvailabilityFilter, KeyAvailabilityState } from '../types'

export const KEY_STATE_META: Record<
  KeyAvailabilityState,
  { label: string; description: string; className: string; patternId: string }
> = {
  free: {
    label: 'Free',
    description: 'Not bound by any selected profile',
    className: 'fill-key-free stroke-key-free-border',
    patternId: 'pattern-free',
  },
  single: {
    label: 'Single use',
    description: 'Bound by one selected profile',
    className: 'fill-key-single stroke-key-single-border',
    patternId: 'pattern-single',
  },
  shared: {
    label: 'Shared',
    description: 'Same action across multiple profiles',
    className: 'fill-key-shared stroke-key-shared-border',
    patternId: 'pattern-shared',
  },
  partial: {
    label: 'Partial conflict',
    description: 'Two profiles disagree on this key',
    className: 'fill-key-partial stroke-key-partial-border',
    patternId: 'pattern-partial',
  },
  heavy: {
    label: 'Heavy conflict',
    description: 'Three or more profiles conflict',
    className: 'fill-key-heavy stroke-key-heavy-border',
    patternId: 'pattern-heavy',
  },
  reserved: {
    label: 'Reserved',
    description: 'OS or system shortcut',
    className: 'fill-key-reserved stroke-key-reserved-border',
    patternId: 'pattern-reserved',
  },
  unknown: {
    label: 'Unknown',
    description: 'Binding exists outside current layout',
    className: 'fill-key-unknown stroke-key-unknown-border',
    patternId: 'pattern-unknown',
  },
}

export const DEFAULT_FILTERS: AvailabilityFilter = {
  free: true,
  used: true,
  reserved: true,
  conflicted: true,
}

export function matchesFilter(state: KeyAvailabilityState, filters: AvailabilityFilter): boolean {
  if (state === 'free') return filters.free
  if (state === 'reserved') return filters.reserved
  if (state === 'partial' || state === 'heavy') return filters.conflicted
  if (state === 'single' || state === 'shared' || state === 'unknown') return filters.used
  return true
}
