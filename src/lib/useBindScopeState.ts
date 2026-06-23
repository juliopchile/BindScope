import { useMemo, useState } from 'react'
import type { AvailabilityFilter, InputProfile, KeyboardKey, LayoutId } from '../types'
import { GAMES, GAMES_BY_ID, PROFILES_BY_ID } from '../data/games'
import { RESERVED_KEY_RULES } from '../data/reservedKeys'
import { KEYBOARD_LAYOUTS, DEFAULT_LAYOUT_ID } from '../data/keyboardLayouts'
import { computeAvailability } from '../domain/availability'
import { DEFAULT_FILTERS } from '../utils/keyStateStyles'

export interface AppState {
  search: string
  selectedProfileIds: string[]
  layoutId: LayoutId
  filters: AvailabilityFilter
  selectedKey: KeyboardKey | null
  customProfiles: InputProfile[]
}

export function useBindScopeState() {
  const [search, setSearch] = useState('')
  const [selectedProfileIds, setSelectedProfileIds] = useState<string[]>([])
  const [layoutId, setLayoutId] = useState<LayoutId>(DEFAULT_LAYOUT_ID as LayoutId)
  const [filters, setFilters] = useState<AvailabilityFilter>(DEFAULT_FILTERS)
  const [selectedKey, setSelectedKey] = useState<KeyboardKey | null>(null)
  const [customProfiles, setCustomProfiles] = useState<InputProfile[]>([])

  const profilesById = useMemo(() => {
    const map = { ...PROFILES_BY_ID }
    for (const profile of customProfiles) map[profile.id] = profile
    return map
  }, [customProfiles])

  const selectedProfiles = useMemo(
    () =>
      selectedProfileIds
        .map((id) => profilesById[id])
        .filter((profile): profile is InputProfile => Boolean(profile)),
    [profilesById, selectedProfileIds],
  )

  const layout = KEYBOARD_LAYOUTS[layoutId] ?? KEYBOARD_LAYOUTS[DEFAULT_LAYOUT_ID]!

  const summary = useMemo(
    () =>
      computeAvailability({
        profiles: selectedProfiles,
        layout,
        reservedRules: RESERVED_KEY_RULES,
        gamesById: GAMES_BY_ID,
      }),
    [layout, selectedProfiles],
  )

  const toggleProfile = (profileId: string) => {
    setSelectedProfileIds((current) =>
      current.includes(profileId)
        ? current.filter((id) => id !== profileId)
        : [...current, profileId],
    )
  }

  const addGameProfiles = (gameId: string) => {
    const game = GAMES_BY_ID[gameId]
    if (!game) return
    setSelectedProfileIds((current) => {
      const next = new Set(current)
      for (const profileId of game.profileIds) next.add(profileId)
      return [...next]
    })
  }

  const removeGame = (gameId: string) => {
    const game = GAMES_BY_ID[gameId]
    if (!game) return
    setSelectedProfileIds((current) => current.filter((id) => !game.profileIds.includes(id)))
  }

  const reset = () => {
    setSearch('')
    setSelectedProfileIds([])
    setLayoutId(DEFAULT_LAYOUT_ID as LayoutId)
    setFilters(DEFAULT_FILTERS)
    setSelectedKey(null)
  }

  return {
    games: GAMES,
    search,
    setSearch,
    selectedProfileIds,
    selectedProfiles,
    toggleProfile,
    addGameProfiles,
    removeGame,
    layoutId,
    setLayoutId,
    layout,
    filters,
    setFilters,
    selectedKey,
    setSelectedKey,
    summary,
    reset,
    customProfiles,
    setCustomProfiles,
    profilesById,
  }
}

export type BindScopeState = ReturnType<typeof useBindScopeState>
