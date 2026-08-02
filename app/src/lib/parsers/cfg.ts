import type { ConfigBindingsResult, RawConfigBinding } from './types'

/**
 * Source-engine style CFG: `bind "KEY" "command"` (CS2 / CS:GO autoexec, etc.).
 *
 * Supported forms (quotes optional on either side):
 *   bind "w" "+forward"
 *   bind MOUSE1 +attack
 *
 * Lines starting with `//`, `#`, or `;` are comments. `unbind` and other commands
 * are ignored. Unknown key tokens are counted as skipped after normalization
 * (handled by the profile lift step).
 */
const BIND_RE =
  /^\s*bind\s+(?:"([^"]+)"|(\S+))\s+(?:"([^"]*)"|(\S+))\s*(?:\/\/.*|#.*|;.*)?$/i

const COMMENT_RE = /^\s*(?:\/\/|#|;)/

export function parseSourceCfg(raw: string): ConfigBindingsResult {
  const bindings: RawConfigBinding[] = []
  let skippedLines = 0

  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || COMMENT_RE.test(trimmed)) continue

    const match = BIND_RE.exec(trimmed)
    if (!match) {
      // Non-bind commands (unbind, alias, echo, …) are ignored without counting.
      if (/^\s*bind\b/i.test(trimmed)) skippedLines += 1
      continue
    }

    const key = (match[1] ?? match[2] ?? '').trim()
    const action = (match[3] ?? match[4] ?? '').trim()
    if (!key || !action) {
      skippedLines += 1
      continue
    }

    bindings.push({ key, action })
  }

  return { bindings, skippedLines }
}
