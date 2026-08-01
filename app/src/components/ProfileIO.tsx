import { useId, useRef, useState } from 'react'
import { useI18n } from '../i18n/useI18n'

interface ProfileIOProps {
  onImportFile: (file: File) => Promise<string>
  onExportProfiles: () => void
  onExportSafeKeys: () => void
  canExport: boolean
}

export function ProfileIO({
  onImportFile,
  onExportProfiles,
  onExportSafeKeys,
  canExport,
}: ProfileIOProps) {
  const { t } = useI18n()
  const inputId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const [status, setStatus] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function handleFileChange(fileList: FileList | null) {
    const file = fileList?.[0]
    if (!file) return
    setBusy(true)
    setStatus(null)
    try {
      const message = await onImportFile(file)
      setStatus(message)
    } catch {
      setStatus(t('importError'))
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
      <div className="flex flex-wrap gap-2">
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept="application/json,.json"
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
