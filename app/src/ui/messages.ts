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
  selectionHeading: 'Games & tools',
  searchPlaceholder: 'Search games or tools…',
  searchAriaLabel: 'Search catalog',
  searchNoResults: 'No matches in the catalog.',
  selectedHeading: 'Selected',
  emptySelection:
    'No games selected. Search above and add a title — or a tool like OBS — to see free keys.',
  removeGame: 'Remove',
  layersHeading: 'Binding layers',
  filtersHeading: 'Show states',
  filterHint: 'Click a legend item to show or hide that state on the keyboard.',
  kindGame: 'Game',
  kindTool: 'Tool (Yours)',
  addGame: 'Add',
  starterNote: 'Started with a random title from the starter pool.',
} as const

export type MessageKey = keyof typeof messages
