"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { shortenSchema } from "@/lib/validations"
import { generateShortCode, RESERVED_CODES } from "@/lib/short-code"

// Server Actions run without a client locale, so errors are returned as
// codes (not messages) — callers translate them via useLocale()'s
// `errors.*` dictionary keys instead of hardcoding English here.
export type ShortenErrorCode = "invalid_input" | "reserved_alias" | "alias_taken"

export type ShortenResult =
  | {
      ok: true
      shortCode: string
      originalUrl: string
      // false when the DB was unreachable (e.g. the v0 preview has no local
      // Postgres). The link is generated but not persisted yet.
      persisted: boolean
    }
  | { ok: false; error: ShortenErrorCode }

export async function shortenUrl(formData: {
  url: string
  customAlias?: string
}): Promise<ShortenResult> {
  const parsed = shortenSchema.safeParse(formData)
  if (!parsed.success) {
    return { ok: false, error: "invalid_input" }
  }

  const { url, customAlias } = parsed.data
  const session = await auth().catch(() => null)
  const userId = session?.user?.id ?? null

  // Resolve the short code: custom alias if provided, otherwise a random code.
  let shortCode = customAlias?.trim() || generateShortCode()

  if (customAlias && RESERVED_CODES.has(customAlias.toLowerCase())) {
    return { ok: false, error: "reserved_alias" }
  }

  try {
    if (customAlias) {
      const existing = await prisma.link.findUnique({ where: { shortCode } })
      if (existing) {
        return { ok: false, error: "alias_taken" }
      }
    } else {
      // Retry a few times in the unlikely event of a random collision.
      for (let attempt = 0; attempt < 5; attempt++) {
        const existing = await prisma.link.findUnique({ where: { shortCode } })
        if (!existing) break
        shortCode = generateShortCode()
      }
    }

    await prisma.link.create({
      data: { originalUrl: url, shortCode, userId },
    })

    if (userId) revalidatePath("/dashboard")

    return { ok: true, shortCode, originalUrl: url, persisted: true }
  } catch (error) {
    // In the v0 preview there is no local Postgres, so persistence fails.
    // Still return the generated link so the result UI + QR code can be shown.
    console.log("[v0] shortenUrl persistence failed:", (error as Error).message)
    return { ok: true, shortCode, originalUrl: url, persisted: false }
  }
}

export type DeleteErrorCode = "unauthenticated" | "not_found" | "failed"

export async function deleteLink(
  id: string,
): Promise<{ ok: boolean; error?: DeleteErrorCode }> {
  const session = await auth().catch(() => null)
  if (!session?.user?.id) {
    return { ok: false, error: "unauthenticated" }
  }

  try {
    // Scope the delete to the current user so one user can't delete another's.
    const result = await prisma.link.deleteMany({
      where: { id, userId: session.user.id },
    })
    if (result.count === 0) {
      return { ok: false, error: "not_found" }
    }
    revalidatePath("/dashboard")
    return { ok: true }
  } catch (error) {
    console.log("[v0] deleteLink failed:", (error as Error).message)
    return { ok: false, error: "failed" }
  }
}
