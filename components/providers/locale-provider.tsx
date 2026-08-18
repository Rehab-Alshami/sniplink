"use client"

import {
  createContext,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { en } from "@/lib/i18n/en"
import { ar } from "@/lib/i18n/ar"
import { defaultLocale, type Locale } from "@/lib/i18n/types"
import type { Dictionary } from "@/lib/i18n/types"

const STORAGE_KEY = "sniplink-locale"

const dictionaries: Record<Locale, Dictionary> = { en, ar }

type TranslateFn = (key: string, vars?: Record<string, string | number>) => string

interface LocaleContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: TranslateFn
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

function resolve(dict: Dictionary, key: string): string {
  const value = key
    .split(".")
    .reduce<unknown>((acc, part) => (acc as Record<string, unknown> | undefined)?.[part], dict)
  return typeof value === "string" ? value : key
}

function applyLocale(locale: Locale) {
  const root = document.documentElement
  root.lang = locale
  root.dir = locale === "ar" ? "rtl" : "ltr"
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  // Same "mount gate" pattern as ThemeProvider: always render with the
  // default locale on the server and the first client render, then sync to
  // the persisted choice in a layout effect (before paint) so there's no
  // hydration mismatch and no visible flash for the chrome (header, toggle
  // labels). Server-rendered page copy briefly shows the default locale
  // before switching for a returning Arabic user — a deliberate trade-off
  // to avoid request-time cookie reads, which would opt every route into
  // dynamic rendering.
  const [locale, setLocaleState] = useState<Locale>(defaultLocale)

  useLayoutEffect(() => {
    let stored: string | null = null
    try {
      stored = window.localStorage.getItem(STORAGE_KEY)
    } catch {
      // localStorage unavailable — fall back to the default locale.
    }
    const initial: Locale = stored === "ar" ? "ar" : defaultLocale
    setLocaleState(initial)
    applyLocale(initial)
  }, [])

  function setLocale(next: Locale) {
    setLocaleState(next)
    applyLocale(next)
    try {
      window.localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // Language just won't persist across visits.
    }
  }

  const t = useMemo<TranslateFn>(() => {
    const dict = dictionaries[locale]
    return (key, vars) => {
      let text = resolve(dict, key)
      if (vars) {
        for (const [name, value] of Object.entries(vars)) {
          text = text.replace(`{${name}}`, String(value))
        }
      }
      return text
    }
  }, [locale])

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider")
  return ctx
}
