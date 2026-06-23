import type { Game, InputProfile } from '../types'

/** Future: persist and load profiles from a remote or local database. */
export interface ProfileDatabaseAdapter {
  listGames(): Promise<Game[]>
  listProfiles(gameId?: string): Promise<InputProfile[]>
  saveProfile(profile: InputProfile): Promise<void>
  deleteProfile(profileId: string): Promise<void>
}

export class NotImplementedDatabaseAdapter implements ProfileDatabaseAdapter {
  listGames(): Promise<Game[]> {
    return Promise.reject(new Error('Database adapter not implemented'))
  }

  listProfiles(): Promise<InputProfile[]> {
    return Promise.reject(new Error('Database adapter not implemented'))
  }

  saveProfile(): Promise<void> {
    return Promise.reject(new Error('Database adapter not implemented'))
  }

  deleteProfile(): Promise<void> {
    return Promise.reject(new Error('Database adapter not implemented'))
  }
}
