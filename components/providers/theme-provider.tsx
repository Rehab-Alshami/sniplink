"use client"

import {
  createContext,
  useContext,
  useLayoutEffect,
  useState,
  type ReactNode,
} from "react"

export type Theme = "light" | "dark" | "system"

const STORAGE_KEY = "sniplink-theme"

interface ThemeContextValue {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function applyTheme(theme: Theme) {
  const root = document.documentElement
  root.classList.remove("light", "dark")
  if (theme !== "system") root.classList.add(theme)
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Always start from "system" on both the server render and the first
  // client render so hydration never mismatches — the blocking inline
  // script in <head> (see app/layout.tsx) already applied the persisted
  // class before paint. This effect just brings React state in sync with
  // that class and re-applies it if React's dev Strict Mode remount clears
  // it (see Next's "preventing flash before hydration" guide). Because it's
  // a layout effect it runs before the browser paints, so there's no
  // visible flash even for the toggle UI itself.
  const [theme, setThemeState] = useState<Theme>("system")

  useLayoutEffect(() => {
    let stored: string | null = null
    try {
      stored = window.localStorage.getItem(STORAGE_KEY)
    } catch {
      // localStorage unavailable (private browsing / disabled) — fall back
      // to system preference.
    }
    const initial: Theme = stored === "light" || stored === "dark" ? stored : "system"
    setThemeState(initial)
    applyTheme(initial)
  }, [])

  function setTheme(next: Theme) {
    setThemeState(next)
    applyTheme(next)
    try {
      if (next === "system") window.localStorage.removeItem(STORAGE_KEY)
      else window.localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // Theme just won't persist across visits.
    }
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider")
  return ctx
}
