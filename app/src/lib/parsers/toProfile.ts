import type { InputProfile } from '../../types'
import { normalizeKey, normalizeModifiers } from '../../utils/keyNormalization'
import type { ConfigBindingsResult, ConfigImportOptions } from './types'

export interface ConfigImportParseResult {
  profile: InputProfile
  skippedBindings: number
}

function displayNameFromFile(fileName: string | undefined): string {
  if (!fileName) return 'Imported config'
  const base = fileName.split(/[/\\]/).pop() ?? fileName
  return base.replace(/\.[^.]+$/, '') || 'Imported config'
}

function slugFromFileName(fileName: string | undefined): string {
  if (!fileName) return 'imported'
  const base = fileName.split(/[/\\]/).pop() ?? fileName
  const withoutExt = base.replace(/\.[^.]+$/, '')
  const slug = withoutExt
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return slug || 'imported'
}

/** Resolve gameId when the UI chose "from filename". */
export function resolveGameIdFromFileName(
  fileName: string | undefined,
  catalogIds: ReadonlySet<string>,
  aliasToId?: ReadonlyMap<string, string>,
): string {
  const slug = slugFromFileName(fileName)
  if (catalogIds.has(slug)) return slug

  const stem = (fileName?.split(/[/\\]/).pop() ?? '')
    .replace(/\.[^.]+$/, '')
    .trim()
    .toLowerCase()
  if (stem && aliasToId?.has(stem)) return aliasToId.get(stem)!
  if (aliasToId?.has(slug)) return aliasToId.get(slug)!

  return slug
}

/**
 * Lift parser output into an imported InputProfile.
 * Invalid keys are skipped (counted); empty result throws.
 */
export function configBindingsToProfile(
  parsed: ConfigBindingsResult,
  options: ConfigImportOptions,
): ConfigImportParseResult {
  const gameId = options.gameId.trim() || 'imported'
  const profileName = options.profileName?.trim() || displayNameFromFile(options.fileName)
  const profileId = options.profileId?.trim() || `${gameId}-imported`

  let skippedBindings = parsed.skippedLines
  const bindings: InputProfile['bindings'] = []

  for (const raw of parsed.bindings) {
    const key = normalizeKey(raw.key)
    if (!key) {
      skippedBindings += 1
      continue
    }
    const modifiers = normalizeModifiers(raw.modifiers)
    bindings.push({
      key,
      action: raw.action,
      context: raw.context,
      modifiers: modifiers.length > 0 ? modifiers : undefined,
      verification: 'custom',
    })
  }

  if (bindings.length === 0) {
    throw new Error('No profiles with valid bindings')
  }

  const profile: InputProfile = {
    id: profileId,
    gameId,
    name: profileName,
    sourceType: 'imported',
    verificationStatus: 'custom',
    notes: options.fileName ? `Imported from ${options.fileName}` : undefined,
    bindings,
  }

  return { profile, skippedBindings }
}
