"use client"

import { Languages } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLocale } from "@/components/providers/locale-provider"

// A simple two-way switch (rather than a dropdown) since there are only two
// languages — the button label names the language it switches *to*.
export function LanguageToggle() {
  const { locale, setLocale, t } = useLocale()
  const next = locale === "en" ? "ar" : "en"

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setLocale(next)}
      aria-label={t("language.label")}
      className="gap-1.5"
    >
      <Languages className="size-4" />
      <span className="hidden sm:inline">{locale === "en" ? "العربية" : "English"}</span>
    </Button>
  )
}
