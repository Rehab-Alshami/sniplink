import { redirect, notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { RESERVED_CODES } from "@/lib/short-code"

// Redirect route: GET /[shortCode] looks up the original URL, logs the visit,
// and issues an HTTP redirect. Unknown codes fall through to the 404 page.
export default async function RedirectPage({
  params,
}: {
  params: Promise<{ shortCode: string }>
}) {
  const { shortCode } = await params

  if (RESERVED_CODES.has(shortCode.toLowerCase())) {
    notFound()
  }

  let originalUrl: string | null = null

  try {
    const link = await prisma.link.findUnique({ where: { shortCode } })
    if (link) {
      originalUrl = link.originalUrl
      // Log the visit and bump the aggregate counter for analytics.
      await prisma.$transaction([
        prisma.click.create({ data: { linkId: link.id } }),
        prisma.link.update({
          where: { id: link.id },
          data: { clickCount: { increment: 1 } },
        }),
      ])
    }
  } catch (error) {
    // No database available (e.g. v0 preview) — treat as not found.
    console.log("[v0] redirect lookup failed:", (error as Error).message)
  }

  if (!originalUrl) {
    notFound()
  }

  redirect(originalUrl)
}
