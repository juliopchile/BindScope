import type { InputProfile, SeedProfile } from '../../types'

/** Layer ids that should be on when a game is first selected. */
export function defaultEnabledLayerIds(profile: SeedProfile): string[] {
  return profile.layers.filter((layer) => layer.defaultEnabled).map((layer) => layer.id)
}

/** Flatten enabled layers into an engine-ready `InputProfile`. */
export function toInputProfile(
  profile: SeedProfile,
  enabledLayerIds: Iterable<string>,
): InputProfile {
  const enabled = new Set(enabledLayerIds)
  const bindings = profile.layers
    .filter((layer) => enabled.has(layer.id))
    .flatMap((layer) =>
      layer.bindings.map((binding) => ({
        ...binding,
        context: binding.context ?? layer.label,
      })),
    )

  return {
    id: profile.id,
    gameId: profile.gameId,
    name: profile.name,
    sourceType: profile.sourceType,
    versionLabel: profile.versionLabel,
    verificationStatus: profile.verificationStatus,
    notes: profile.notes,
    bindings,
  }
}
