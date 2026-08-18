"use client"

import { Link2, MousePointerClick, CalendarClock } from "lucide-react"
import { LinksTable, type DashboardLink } from "@/components/dashboard/links-table"
import { useLocale } from "@/components/providers/locale-provider"

interface DashboardShellProps {
  links: DashboardLink[]
  userName: string | null | undefined
}

export function DashboardShell({ links, userName }: DashboardShellProps) {
  const { t, locale } = useLocale()

  const totalClicks = links.reduce((sum, l) => sum + l.clickCount, 0)
  const lastActivity = links
    .map((l) => l.lastVisit)
    .filter(Boolean)
    .sort()
    .at(-1)

  const stats = [
    {
      icon: Link2,
      label: t("dashboard.statsTotalLinks"),
      value: links.length.toLocaleString(locale),
    },
    {
      icon: MousePointerClick,
      label: t("dashboard.statsTotalClicks"),
      value: totalClicks.toLocaleString(locale),
    },
    {
      icon: CalendarClock,
      label: t("dashboard.statsLastVisit"),
      value: lastActivity
        ? new Date(lastActivity).toLocaleDateString(locale === "ar" ? "ar" : undefined, {
            month: "short",
            day: "numeric",
          })
        : "—",
    },
  ]

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          {t("dashboard.heading")}
        </h1>
        <p className="text-sm text-muted-foreground">
          {userName
            ? t("dashboard.welcomeBack", { name: userName })
            : t("dashboard.manageSubtitle")}
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex items-center gap-4 rounded-xl border border-border bg-card p-4"
          >
            <span className="flex size-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
              <stat.icon className="size-5" />
            </span>
            <div>
              <p className="text-2xl font-semibold tabular-nums">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <LinksTable links={links} />
      </div>
    </main>
  )
}
