import { z } from 'zod'
import type { ImportExportDocument } from '../types'
import { normalizeKey, normalizeModifiers } from '../utils/keyNormalization'

const modifierSchema = z.enum(['shift', 'ctrl', 'alt', 'meta'])

const bindingSchema = z.object({
  key: z.string().transform((value, ctx) => {
    const normalized = normalizeKey(value)
    if (!normalized) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: `Unknown key: ${value}` })
      return z.NEVER
    }
    return normalized
  }),
  action: z.string().min(1),
  context: z.string().optional(),
  modifiers: z
    .array(z.string())
    .optional()
    .transform((mods) => normalizeModifiers(mods)),
  source: z
    .object({
      label: z.string().optional(),
      url: z.string().url().optional(),
      author: z.string().optional(),
    })
    .optional(),
  confidence: z.enum(['high', 'medium', 'low']).optional(),
  verification: z.enum(['verified', 'unverified', 'community', 'custom']).optional(),
  notes: z.string().optional(),
})

const profileSchema = z.object({
  id: z.string().min(1),
  gameId: z.string().min(1),
  name: z.string().min(1),
  sourceType: z.enum(['official', 'community', 'custom', 'imported']),
  versionLabel: z.string().optional(),
  bindings: z.array(bindingSchema),
  verificationStatus: z.enum(['verified', 'unverified', 'community', 'custom']),
  notes: z.string().optional(),
})

const gameSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  aliases: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  versions: z
    .array(
      z.object({
        id: z.string(),
        label: z.string(),
        patch: z.string().optional(),
      }),
    )
    .optional(),
  profileIds: z.array(z.string()),
})

export const importExportDocumentSchema = z.object({
  schemaVersion: z.literal(1),
  exportedAt: z.string().datetime(),
  games: z.array(gameSchema).optional(),
  profiles: z.array(profileSchema).min(1),
  notes: z.string().optional(),
})

export type ParsedImportExportDocument = z.infer<typeof importExportDocumentSchema>

export function parseImportExportDocument(data: unknown): ImportExportDocument {
  return importExportDocumentSchema.parse(data) as ImportExportDocument
}

export function safeParseImportExportDocument(data: unknown) {
  return importExportDocumentSchema.safeParse(data)
}

export function createExportDocument(
  profiles: ImportExportDocument['profiles'],
  games?: ImportExportDocument['games'],
  notes?: string,
): ImportExportDocument {
  return {
    schemaVersion: 1,
    exportedAt: new Date().toISOString(),
    profiles,
    games,
    notes,
  }
}

// Re-export modifier schema for tests
export { modifierSchema, bindingSchema, profileSchema }
