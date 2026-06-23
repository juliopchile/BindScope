import { describe, expect, it } from 'vitest'
import { PROFILES_BY_ID } from '../src/data/games'
import {
  createExportDocument,
  importExportDocumentSchema,
  parseImportExportDocument,
  safeParseImportExportDocument,
} from '../src/lib/importExport'

describe('import/export schema', () => {
  it('validates a valid export document', () => {
    const doc = createExportDocument([PROFILES_BY_ID['skyrim-default']!])
    const parsed = parseImportExportDocument(doc)
    expect(parsed.schemaVersion).toBe(1)
    expect(parsed.profiles).toHaveLength(1)
  })

  it('rejects invalid schema versions', () => {
    const result = safeParseImportExportDocument({
      schemaVersion: 2,
      exportedAt: new Date().toISOString(),
      profiles: [],
    })
    expect(result.success).toBe(false)
  })

  it('normalizes binding keys during import', () => {
    const result = importExportDocumentSchema.safeParse({
      schemaVersion: 1,
      exportedAt: new Date().toISOString(),
      profiles: [
        {
          id: 'test',
          gameId: 'test-game',
          name: 'Test',
          sourceType: 'custom',
          verificationStatus: 'custom',
          bindings: [{ key: 'w', action: 'Forward' }],
        },
      ],
    })

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.profiles[0]?.bindings[0]?.key).toBe('KeyW')
    }
  })
})
