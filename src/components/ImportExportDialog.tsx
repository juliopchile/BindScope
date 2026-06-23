import { useState } from 'react'
import type { InputProfile } from '../types'
import {
  createExportDocument,
  parseImportExportDocument,
  safeParseImportExportDocument,
} from '../lib/importExport'

interface ImportExportDialogProps {
  open: boolean
  onClose: () => void
  selectedProfiles: InputProfile[]
  onImport: (profiles: InputProfile[]) => void
}

export function ImportExportDialog({
  open,
  onClose,
  selectedProfiles,
  onImport,
}: ImportExportDialogProps) {
  const [importText, setImportText] = useState('')
  const [error, setError] = useState<string | null>(null)

  if (!open) return null

  const handleExport = () => {
    const doc = createExportDocument(selectedProfiles, undefined, 'BindScope export')
    const blob = new Blob([JSON.stringify(doc, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `bindscope-export-${new Date().toISOString().slice(0, 10)}.json`
    anchor.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = () => {
    setError(null)
    try {
      const parsed = JSON.parse(importText) as unknown
      const result = safeParseImportExportDocument(parsed)
      if (!result.success) {
        setError(result.error.issues.map((issue) => issue.message).join('; '))
        return
      }
      parseImportExportDocument(result.data)
      onImport(result.data.profiles)
      setImportText('')
      onClose()
    } catch {
      setError('Invalid JSON document')
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Import and export profiles"
    >
      <div className="panel w-full max-w-2xl p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Import / Export</h2>
          <button type="button" className="btn" onClick={onClose}>
            Close
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <button type="button" className="btn btn-primary" onClick={handleExport}>
              Export selected profiles
            </button>
            <p className="mt-2 text-xs text-muted">
              Exports a versioned JSON document validated by Zod ({selectedProfiles.length}{' '}
              profiles).
            </p>
          </div>

          <div>
            <label htmlFor="import-json" className="mb-2 block text-sm font-medium">
              Import JSON
            </label>
            <textarea
              id="import-json"
              className="input min-h-40 font-mono text-xs"
              value={importText}
              onChange={(event) => setImportText(event.target.value)}
              placeholder='{"schemaVersion":1,"exportedAt":"...","profiles":[...]}'
            />
            {error ? <p className="mt-2 text-sm text-red-400">{error}</p> : null}
            <button type="button" className="btn mt-3" onClick={handleImport}>
              Import profiles
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
