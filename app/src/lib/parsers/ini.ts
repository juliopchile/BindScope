import type { ConfigBindingsResult, RawConfigBinding } from './types'

/**
 * Simple INI-style bind list.
 *
 * Sections (`[Movement]`) are recorded as binding `context`. Lines are
 * `key=action` or `Ctrl+W=action` (modifiers before the final key, joined by `+`).
 * Comments: `;` or `#` at line start, or trailing `; …` / `# …`.
 */
const SECTION_RE = /^\s*\[([^\]]+)\]\s*$/
const PAIR_RE = /^\s*([^=]+?)\s*=\s*(.+?)\s*$/
const COMMENT_RE = /^\s*(?:#|;)/

function stripInlineComment(value: string): string {
  let inQuotes = false
  for (let i = 0; i < value.length; i++) {
    const ch = value[i]
    if (ch === '"') {
      inQuotes = !inQuotes
      continue
    }
    if (!inQuotes && (ch === ';' || ch === '#')) {
      return value.slice(0, i).trim()
    }
  }
  return value.trim()
}

function parseKeySide(rawKey: string): { key: string; modifiers?: string[] } {
  const parts = rawKey
    .split('+')
    .map((p) => p.trim())
    .filter(Boolean)
  if (parts.length === 0) return { key: '' }
  if (parts.length === 1) return { key: parts[0]! }
  const key = parts[parts.length - 1]!
  const modifiers = parts.slice(0, -1)
  return { key, modifiers }
}

export function parseSimpleIni(raw: string): ConfigBindingsResult {
  const bindings: RawConfigBinding[] = []
  let skippedLines = 0
  let section: string | undefined

  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || COMMENT_RE.test(trimmed)) continue

    const sectionMatch = SECTION_RE.exec(trimmed)
    if (sectionMatch) {
      section = sectionMatch[1]!.trim() || undefined
      continue
    }

    const pairMatch = PAIR_RE.exec(trimmed)
    if (!pairMatch) {
      skippedLines += 1
      continue
    }

    const left = stripInlineComment(pairMatch[1]!)
    const right = stripInlineComment(pairMatch[2]!)
    if (!left || !right) {
      skippedLines += 1
      continue
    }

    const { key, modifiers } = parseKeySide(left)
    if (!key) {
      skippedLines += 1
      continue
    }

    bindings.push({
      key,
      action: right.replace(/^"|"$/g, ''),
      modifiers,
      context: section,
    })
  }

  return { bindings, skippedLines }
}
