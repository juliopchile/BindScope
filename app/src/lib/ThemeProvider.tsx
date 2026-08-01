import { useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  DEFAULT_THEME,
  readStoredTheme,
  writeStoredTheme,
  type ThemePreference,
} from './preferences'
import { applyTheme } from './theme'
import { ThemeContext } from './ThemeContext'

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemePreference>(() => {
    if (typeof window === 'undefined') return DEFAULT_THEME
    return readStoredTheme()
  })

  useEffect(() => {
    applyTheme(theme)
    writeStoredTheme(theme)
  }, [theme])

  const value = useMemo(
    () => ({
      theme,
      setTheme: setThemeState,
    }),
    [theme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
