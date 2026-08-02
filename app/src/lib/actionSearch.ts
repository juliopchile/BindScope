import type { Binding, InputProfile, KeyboardKey, Modifier } from '../types'
import { matchesSearch, normalizeSearchText } from '../utils/search'

/** One matching binding ready for jump-to-key UI. */
export interface ActionSearchHit {
  key: KeyboardKey
  action: string
  context?: string
  gameId: string
  gameName: string
  profileId: string
  profileName: string
  modifiers?: Modifier[]
}

function haystackForBinding(binding: Pick<Binding, 'action' | 'context'>): string {
  return [binding.action, binding.context ?? ''].join(' ')
}

function hitKey(hit: ActionSearchHit): string {
  const mods = hit.modifiers?.join('+') ?? ''
  return `${hit.profileId}|${hit.key}|${mods}|${hit.action}|${hit.context ?? ''}`
}

/**
 * Find bindings whose action/context match the query (forgiving token match).
 * Empty query returns []. Locale-agnostic on curated source strings (D10).
 */
export function searchActions(
  profiles: readonly InputProfile[],
  gamesById: Record<string, { name: string }>,
  query: string,
): ActionSearchHit[] {
  const q = normalizeSearchText(query)
  if (!q) return []

  const hits: ActionSearchHit[] = []
  const seen = new Set<string>()

  for (const profile of profiles) {
    const gameName = gamesById[profile.gameId]?.name ?? profile.name
    for (const binding of profile.bindings) {
      if (!matchesSearch(haystackForBinding(binding), q)) continue
      const hit: ActionSearchHit = {
        key: binding.key,
        action: binding.action,
        context: binding.context,
        gameId: profile.gameId,
        gameName,
        profileId: profile.id,
        profileName: profile.name,
        modifiers: binding.modifiers,
      }
      const id = hitKey(hit)
      if (seen.has(id)) continue
      seen.add(id)
      hits.push(hit)
    }
  }

  return hits
}
