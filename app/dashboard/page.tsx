import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { SiteHeader } from "@/components/site-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import type { DashboardLink } from "@/components/dashboard/links-table"

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

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <DashboardShell links={links} userName={session.user.name} />
    </div>
  )
}
