import type { Binding, Modifier, VerificationStatus } from '../../types'

/** Compact binding factory for seed files. */
export function bind(
  key: string,
  action: string,
  verification: VerificationStatus = 'community',
  extras?: { modifiers?: Modifier[]; context?: string; notes?: string },
): Binding {
  return {
    key,
    action,
    verification,
    ...extras,
  }
}
