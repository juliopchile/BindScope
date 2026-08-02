import { useId, useRef, useState } from 'react'
import { useI18n } from '../i18n/useI18n'
import type { Game } from '../types'

/** Sentinel: derive gameId from the chosen filename (slug / catalog alias). */
export const IMPORT_TARGET_FROM_FILENAME = '__filename__'

interface ProfileIOProps {
  onImportFile: (file: File, targetGameId: string) => Promise<string>
  onExportProfiles: () => void
  onExportSafeKeys: () => void
  canExport: boolean
  /** Selected games first, then the rest of the catalog — used for CFG/INI/XML target. */
  targetGames: Game[]
  selectedIds: string[]
}

export function ProfileIO({
  onImportFile,
  onExportProfiles,
  onExportSafeKeys,
  canExport,
  targetGames,
  selectedIds,
}: ProfileIOProps) {
  const { t } = useI18n()
  const inputId = useId()
  const targetId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const [status, setStatus] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [targetGameId, setTargetGameId] = useState(
    () => selectedIds[0] ?? IMPORT_TARGET_FROM_FILENAME,
  )

  const selectedSet = new Set(selectedIds)
  const selectedGames = targetGames.filter((g) => selectedSet.has(g.id))
  const otherGames = targetGames.filter((g) => !selectedSet.has(g.id))

  async function handleFileChange(fileList: FileList | null) {
    const file = fileList?.[0]
    if (!file) return
    setBusy(true)
    setStatus(null)
    try {
      const message = await onImportFile(file, targetGameId)
      setStatus(message)
    } catch (error) {
      setStatus(error instanceof Error && error.message ? error.message : t('importError'))
    } finally {
      setBusy(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const buttonClass =
    'min-h-10 rounded-md border px-3 py-2 text-sm hover:opacity-90 focus-visible:outline focus-visible:outline-2 disabled:cursor-not-allowed disabled:opacity-50'
  const buttonStyle = { borderColor: 'var(--border)', background: 'var(--bg)', color: 'var(--fg)' }

  return (
    <section className="space-y-2" aria-labelledby={`${inputId}-heading`}>
      <h3
        id={`${inputId}-heading`}
        className="text-xs font-semibold tracking-wide uppercase"
        style={{ color: 'var(--fg-muted)' }}
      >
        {t('profilesHeading')}
      </h3>
      <p className="text-xs" style={{ color: 'var(--fg-muted)' }}>
        {t('importFormatHint')}
      </p>
      <div className="flex flex-col gap-1">
        <label htmlFor={targetId} className="text-xs" style={{ color: 'var(--fg-muted)' }}>
          {t('importTargetLabel')}
        </label>
        <select
          id={targetId}
          className="min-h-10 rounded-md border px-2 py-1.5 text-sm"
          style={{ borderColor: 'var(--border)', background: 'var(--bg)', color: 'var(--fg)' }}
          value={targetGameId}
          disabled={busy}
          onChange={(event) => setTargetGameId(event.target.value)}
        >
          <option value={IMPORT_TARGET_FROM_FILENAME}>{t('importTargetFilename')}</option>
          {selectedGames.length > 0 ? (
            <optgroup label={t('importTargetSelectedGroup')}>
              {selectedGames.map((game) => (
                <option key={game.id} value={game.id}>
                  {game.name}
                </option>
              ))}
            </optgroup>
          ) : null}
          {otherGames.length > 0 ? (
            <optgroup label={t('importTargetCatalogGroup')}>
              {otherGames.map((game) => (
                <option key={game.id} value={game.id}>
                  {game.name}
                </option>
              ))}
            </optgroup>
          ) : null}
        </select>
      </div>
      <div className="flex flex-wrap gap-2">
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept=".json,.cfg,.ini,.xml,application/json,text/plain,text/xml,application/xml"
          className="sr-only"
          aria-label={t('importAriaLabel')}
          disabled={busy}
          onChange={(event) => void handleFileChange(event.target.files)}
        />
        <button
          type="button"
          className={buttonClass}
          style={buttonStyle}
          disabled={busy}
          onClick={() => inputRef.current?.click()}
        >
          {t('importProfiles')}
        </button>
        <button
          type="button"
          className={buttonClass}
          style={buttonStyle}
          disabled={!canExport}
          onClick={onExportProfiles}
        >
          {t('exportProfiles')}
        </button>
        <button
          type="button"
          className={buttonClass}
          style={buttonStyle}
          disabled={!canExport}
          onClick={onExportSafeKeys}
        >
          {t('exportSafeKeys')}
        </button>
      </div>
      {status ? (
        <p className="text-xs" style={{ color: 'var(--fg-muted)' }} role="status" aria-live="polite">
          {status}
        </p>
      ) : null}
    </section>
  )
}
