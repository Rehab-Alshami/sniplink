"use client"

import Link from "next/link"
import { LinkIcon, Unlink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLocale } from "@/components/providers/locale-provider"

export default function NotFound() {
  const { t } = useLocale()

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <span className="flex size-16 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
        <Unlink className="size-8" />
      </span>
      <p className="mt-6 font-mono text-sm font-medium uppercase tracking-widest text-primary">
        {t("notFound.eyebrow")}
      </p>
      <h1 className="mt-3 text-balance text-3xl font-semibold tracking-tight">
        {t("notFound.heading")}
      </h1>
      <p className="mt-3 max-w-md text-pretty leading-relaxed text-muted-foreground">
        {t("notFound.description")}
      </p>
      <Button
        className="mt-7"
        render={
          <Link href="/">
            <LinkIcon className="size-4" />
            {t("notFound.cta")}
          </Link>
        }
      />
    </main>
  )
}
