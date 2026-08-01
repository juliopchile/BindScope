/**
 * UI chrome strings in one place so Stage 5 i18n can swap catalogs
 * without hunting through components (D10).
 */
export const messages = {
  appTitle: 'BindScope',
  appTagline: 'Which keys are still free across your games?',
  keyboardHeading: 'Keyboard',
  keyboardAriaLabel: 'Keyboard availability map',
  detailHeading: 'Detail',
  detailEmpty: 'Select a key to see which games bind it.',
  detailFree: 'This key is free across all selected profiles.',
  detailReserved: 'Reserved — not safe to bind.',
  legendHeading: 'Legend',
  summaryFree: 'Free',
  summaryPartial: 'Partial',
  summaryHeavy: 'Heavy',
  summaryReserved: 'Reserved',
  stageNote: 'Demo profiles — game search arrives in Stage 3.',
} as const

export type MessageKey = keyof typeof messages
