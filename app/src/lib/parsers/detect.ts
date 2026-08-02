import type { ConfigFormat, ImportFormat } from './types'

function extensionOf(fileName: string): string {
  const base = fileName.split(/[/\\]/).pop() ?? fileName
  const dot = base.lastIndexOf('.')
  if (dot <= 0) return ''
  return base.slice(dot + 1).toLowerCase()
}

/**
 * Route by extension first, then light content sniffing.
 * Returns null when the format cannot be determined.
 */
export function detectImportFormat(
  fileName: string,
  content: string,
): ImportFormat | null {
  const ext = extensionOf(fileName)
  if (ext === 'json') return 'json'
  if (ext === 'cfg') return 'cfg'
  if (ext === 'ini') return 'ini'
  if (ext === 'xml') return 'xml'

  const trimmed = content.trimStart()
  if (!trimmed) return null

  if (trimmed.startsWith('{') || trimmed.startsWith('[')) return 'json'
  if (/<\s*binds\b/i.test(trimmed) || /<\s*bind\b/i.test(trimmed)) return 'xml'
  if (/^\s*bind\s+/im.test(trimmed)) return 'cfg'
  if (/^\s*\[[^\]]+\]/m.test(trimmed) || /^\s*[^=\n]+=\s*\S+/m.test(trimmed)) {
    return 'ini'
  }

  return null
}

export function isConfigFormat(format: ImportFormat): format is ConfigFormat {
  return format === 'cfg' || format === 'ini' || format === 'xml'
}
