import type { ConfigBindingsResult, RawConfigBinding } from './types'

/**
 * Minimal BindScope XML bind list (regex-parsed — no DOM / browser APIs).
 *
 * Schema (documented in docs/samples/README.md):
 *   <binds>
 *     <bind key="W" action="Forward" />
 *     <bind key="E" action="Use" modifiers="ctrl" />
 *     <bind key="R">Reload</bind>
 *   </binds>
 *
 * `modifiers` is a comma- or space-separated list. Unknown attributes ignored.
 */
/** Self-closing: `<bind … />` (slash immediately before `>`). */
const SELF_CLOSING_RE = /<bind\b([^>]*?)\/>/gi
/** Paired: `<bind …>…</bind>` — attribute blob must not end with `/`. */
const PAIRED_RE = /<bind\b([^>]*[^/\s])\s*>([\s\S]*?)<\/\s*bind\s*>/gi

const ATTR_RE = /([a-zA-Z_:][\w:.-]*)\s*=\s*(?:"([^"]*)"|'([^']*)')/g

function parseAttributes(attrBlob: string): Record<string, string> {
  const attrs: Record<string, string> = {}
  ATTR_RE.lastIndex = 0
  let match: RegExpExecArray | null
  while ((match = ATTR_RE.exec(attrBlob)) !== null) {
    const name = match[1]!.toLowerCase()
    attrs[name] = match[2] ?? match[3] ?? ''
  }
  return attrs
}

function parseModifiers(raw: string | undefined): string[] | undefined {
  if (!raw?.trim()) return undefined
  const parts = raw
    .split(/[,\s]+/)
    .map((p) => p.trim())
    .filter(Boolean)
  return parts.length > 0 ? parts : undefined
}

function pushBind(
  bindings: RawConfigBinding[],
  skipped: { count: number },
  attrBlob: string,
  textAction: string,
): void {
  const attrs = parseAttributes(attrBlob)
  const key = (attrs.key ?? attrs.k ?? '').trim()
  const action = (attrs.action ?? attrs.command ?? textAction).trim()
  const modifiers = parseModifiers(attrs.modifiers ?? attrs.mods)
  const context = attrs.context?.trim() || undefined

  if (!key || !action) {
    skipped.count += 1
    return
  }

  bindings.push({ key, action, modifiers, context })
}

export function parseBindXml(raw: string): ConfigBindingsResult {
  const bindings: RawConfigBinding[] = []
  const skipped = { count: 0 }
  let found = false

  type Hit = { index: number; attrs: string; text: string }
  const hits: Hit[] = []

  PAIRED_RE.lastIndex = 0
  let match: RegExpExecArray | null
  while ((match = PAIRED_RE.exec(raw)) !== null) {
    found = true
    hits.push({ index: match.index, attrs: match[1] ?? '', text: (match[2] ?? '').trim() })
  }

  SELF_CLOSING_RE.lastIndex = 0
  while ((match = SELF_CLOSING_RE.exec(raw)) !== null) {
    found = true
    hits.push({ index: match.index, attrs: match[1] ?? '', text: '' })
  }

  hits.sort((a, b) => a.index - b.index)
  for (const hit of hits) {
    pushBind(bindings, skipped, hit.attrs, hit.text)
  }

  if (!found) {
    const looksLikeXml = /<\w[\s\S]*>/.test(raw)
    if (looksLikeXml) skipped.count += 1
  }

  return { bindings, skippedLines: skipped.count }
}
