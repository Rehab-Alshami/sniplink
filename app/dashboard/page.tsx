import { redirect } from "next/navigation"
import { Link2, MousePointerClick, CalendarClock } from "lucide-react"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { SiteHeader } from "@/components/site-header"
import { LinksTable, type DashboardLink } from "@/components/dashboard/links-table"

export const dynamic = "force-dynamic"

async function getLinks(userId: string): Promise<DashboardLink[]> {
  try {
    const links = await prisma.link.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: { clicks: { orderBy: { visitedAt: "desc" }, take: 1 } },
    })
    return links.map((link) => ({
      id: link.id,
      originalUrl: link.originalUrl,
      shortCode: link.shortCode,
      clickCount: link.clickCount,
      createdAt: link.createdAt.toISOString(),
      lastVisit: link.clicks[0]?.visitedAt.toISOString() ?? null,
    }))
  } catch (error) {
    console.log("[v0] dashboard query failed:", (error as Error).message)
    return []
  }
}

export default async function DashboardPage() {
  const session = await auth().catch(() => null)
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/dashboard")
  }

  const links = await getLinks(session.user.id)
  const totalClicks = links.reduce((sum, l) => sum + l.clickCount, 0)
  const lastActivity = links
    .map((l) => l.lastVisit)
    .filter(Boolean)
    .sort()
    .at(-1)

  const stats = [
    { icon: Link2, label: "Total links", value: links.length.toLocaleString() },
    {
      icon: MousePointerClick,
      label: "Total clicks",
      value: totalClicks.toLocaleString(),
    },
    {
      icon: CalendarClock,
      label: "Last visit",
      value: lastActivity
        ? new Date(lastActivity).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
          })
        : "—",
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">Your links</h1>
          <p className="text-sm text-muted-foreground">
            {session.user.name
              ? `Welcome back, ${session.user.name}.`
              : "Manage and track all your short links."}
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
    </div>
  )
}
