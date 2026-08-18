"use client"

import { Moon, Sun, Monitor, type LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme, type Theme } from "@/components/providers/theme-provider"
import { useLocale } from "@/components/providers/locale-provider"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const { t } = useLocale()

  const options: { value: Theme; label: string; icon: LucideIcon }[] = [
    { value: "light", label: t("theme.light"), icon: Sun },
    { value: "dark", label: t("theme.dark"), icon: Moon },
    { value: "system", label: t("theme.system"), icon: Monitor },
  ]

  const ActiveIcon = options.find((option) => option.value === theme)?.icon ?? Monitor

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="size-9"
            aria-label={t("theme.label")}
          >
            <ActiveIcon className="size-4" />
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="w-40">
        {options.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => setTheme(option.value)}
            aria-checked={theme === option.value}
            className={
              theme === option.value ? "bg-accent text-accent-foreground" : undefined
            }
          >
            <option.icon className="size-4" />
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
