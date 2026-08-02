import { z } from 'zod'
import type {
  ConflictSummary,
  Game,
  ImportExportDocument,
  InputProfile,
  KeyboardKey,
  SafeKeysDocument,
} from '../types'
import { normalizeKey, normalizeModifiers } from '../utils/keyNormalization'
import {
  detectImportFormat,
  isConfigFormat,
  parseConfigFormat,
  type ConfigImportOptions,
  type ImportFormat,
} from './parsers'

const bindingSchema = z.object({
  key: z.string().min(1),
  action: z.string().min(1),
  context: z.string().optional(),
  modifiers: z.array(z.string()).optional(),
  verification: z.enum(['verified', 'unverified', 'community', 'custom']).optional(),
  notes: z.string().optional(),
})

const profileSchema = z.object({
  id: z.string().min(1),
  gameId: z.string().min(1),
  name: z.string().min(1),
  sourceType: z.enum(['official', 'community', 'custom', 'imported']).optional(),
  versionLabel: z.string().optional(),
  bindings: z.array(bindingSchema),
  verificationStatus: z.enum(['verified', 'unverified', 'community', 'custom']).optional(),
  notes: z.string().optional(),
})

const gameSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  kind: z.enum(['game', 'tool']).optional(),
  aliases: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  profileIds: z.array(z.string()).optional(),
})

const importExportDocumentSchema = z.object({
  schemaVersion: z.literal(1),
  exportedAt: z.string().min(1),
  games: z.array(gameSchema).optional(),
  profiles: z.array(profileSchema).min(1),
  notes: z.string().optional(),
})

export type ImportParseResult = {
  document: ImportExportDocument
  profiles: InputProfile[]
  skippedBindings: number
  skippedProfiles: number
}

export type { ImportFormat, ConfigImportOptions }

export class UnsupportedImportFormatError extends Error {
  constructor(message = 'Unsupported import format') {
    super(message)
    this.name = 'UnsupportedImportFormatError'
  }
}

/**
 * Auto-detect format from filename/content and parse into ImportParseResult.
 * JSON uses the v1 document schema; CFG/INI/XML need `configOptions.gameId`.
 */
export function parseImportFile(
  raw: string,
  fileName: string,
  configOptions?: ConfigImportOptions,
): ImportParseResult {
  const format = detectImportFormat(fileName, raw)
  if (!format) throw new UnsupportedImportFormatError()

  if (format === 'json') {
    return parseImportDocument(raw)
  }

  if (!isConfigFormat(format)) {
    throw new UnsupportedImportFormatError()
  }

  const options: ConfigImportOptions = {
    gameId: configOptions?.gameId ?? 'imported',
    profileName: configOptions?.profileName,
    profileId: configOptions?.profileId,
    fileName: configOptions?.fileName ?? fileName,
  }
  const { profile, skippedBindings } = parseConfigFormat(raw, format, options)
  return {
    document: {
      schemaVersion: 1,
      exportedAt: new Date().toISOString(),
      profiles: [profile],
    },
    profiles: [profile],
    skippedBindings,
    skippedProfiles: 0,
  }
}

/** Parse JSON text into a v1 import document; normalize keys; coerce source to imported. */
export function parseImportDocument(raw: string): ImportParseResult {
  let json: unknown
  try {
    json = JSON.parse(raw) as unknown
  } catch {
    throw new Error('Invalid JSON')
  }

  const parsed = importExportDocumentSchema.parse(json)
  let skippedBindings = 0
  let skippedProfiles = 0
  const profiles: InputProfile[] = []

  for (const profile of parsed.profiles) {
    const bindings: InputProfile['bindings'] = []
    for (const binding of profile.bindings) {
      const key = normalizeKey(binding.key)
      if (!key) {
        skippedBindings += 1
        continue
      }
      const modifiers = normalizeModifiers(binding.modifiers)
      bindings.push({
        key,
        action: binding.action,
        context: binding.context,
        modifiers: modifiers.length > 0 ? modifiers : undefined,
        verification: binding.verification ?? 'custom',
        notes: binding.notes,
      })
    }

    if (bindings.length === 0) {
      skippedProfiles += 1
      continue
    }

    profiles.push({
      id: profile.id,
      gameId: profile.gameId,
      name: profile.name,
      sourceType: 'imported',
      versionLabel: profile.versionLabel,
      verificationStatus: 'custom',
      notes: profile.notes,
      bindings,
    })
  }

  if (profiles.length === 0) {
    throw new Error('No profiles with valid bindings')
  }

  const games: Game[] | undefined = parsed.games?.map((game) => ({
    id: game.id,
    name: game.name,
    kind: game.kind ?? 'game',
    aliases: game.aliases,
    tags: game.tags,
    profileIds: game.profileIds ?? [],
  }))

  return {
    document: {
      schemaVersion: 1,
      exportedAt: parsed.exportedAt,
      games,
      profiles,
      notes: parsed.notes,
    },
    profiles,
    skippedBindings,
    skippedProfiles,
  }
}

export function serializeProfilesDocument(
  profiles: InputProfile[],
  options: {
    games?: Game[]
    notes?: string
    exportedAt?: string
  } = {},
): ImportExportDocument {
  return {
    schemaVersion: 1,
    exportedAt: options.exportedAt ?? new Date().toISOString(),
    games: options.games,
    profiles,
    notes: options.notes,
  }
}

export function buildSafeKeysDocument(
  summary: ConflictSummary,
  exportedAt: string = new Date().toISOString(),
): SafeKeysDocument {
  const keys = summary.keys
    .filter((entry) => entry.state === 'free')
    .map((entry) => ({ id: entry.key as KeyboardKey, label: entry.label }))
    .sort((a, b) => a.id.localeCompare(b.id))

  return {
    schemaVersion: 1,
    exportedAt,
    keys,
  }
}

export function downloadJson(filename: string, data: unknown): void {
  const blob = new Blob([`${JSON.stringify(data, null, 2)}\n`], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}

export function readFileAsText(file: File): Promise<string> {
  return file.text()
}
