import { useId, useRef, useState } from 'react'
import { messages } from '../ui/messages'

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
      setStatus(messages.importError)
    } finally {
      setBusy(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const buttonClass =
    'rounded-md border px-3 py-1.5 text-sm hover:opacity-90 focus-visible:outline focus-visible:outline-2 disabled:cursor-not-allowed disabled:opacity-50'
  const buttonStyle = { borderColor: 'var(--border)', background: 'var(--bg)', color: 'var(--fg)' }

  return (
    <section className="space-y-2" aria-labelledby={`${inputId}-heading`}>
      <h3
        id={`${inputId}-heading`}
        className="text-xs font-semibold tracking-wide uppercase"
        style={{ color: 'var(--fg-muted)' }}
      >
        {messages.profilesHeading}
      </h3>
      <div className="flex flex-wrap gap-2">
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept="application/json,.json"
          className="sr-only"
          aria-label={messages.importAriaLabel}
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
          {messages.importProfiles}
        </button>
        <button
          type="button"
          className={buttonClass}
          style={buttonStyle}
          disabled={!canExport}
          onClick={onExportProfiles}
        >
          {messages.exportProfiles}
        </button>
        <button
          type="button"
          className={buttonClass}
          style={buttonStyle}
          disabled={!canExport}
          onClick={onExportSafeKeys}
        >
          {messages.exportSafeKeys}
        </button>
      </div>
      {status ? (
        <p className="text-xs" style={{ color: 'var(--fg-muted)' }} role="status">
          {status}
        </p>
      ) : null}
    </section>
  )
}
