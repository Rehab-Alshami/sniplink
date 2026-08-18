"use client"

import { QrCode as QrIcon, MousePointerClick, Zap } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { ShortenForm } from "@/components/shorten-form"
import { useLocale } from "@/components/providers/locale-provider"

export default function HomePage() {
  const { t } = useLocale()

  const features = [
    { icon: Zap, key: "instant" as const },
    { icon: QrIcon, key: "qr" as const },
    { icon: MousePointerClick, key: "analytics" as const },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        <section className="mx-auto max-w-5xl px-4 pb-20 pt-14 sm:px-6 sm:pt-20">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
              <span className="size-1.5 rounded-full bg-primary" />
              {t("home.badge")}
            </span>
            <h1 className="mt-5 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
              {t("home.titlePrefix")}{" "}
              <span className="text-primary">{t("home.titleHighlight")}</span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
              {t("home.subtitle")}
            </p>
          </div>

          <div className="mx-auto mt-10 max-w-2xl">
            <ShortenForm />
          </div>
        </section>

        <section className="border-t border-border/70 bg-card/40">
          <div className="mx-auto grid max-w-5xl gap-6 px-4 py-14 sm:grid-cols-3 sm:px-6">
            {features.map((feature) => (
              <div key={feature.key} className="flex flex-col gap-3">
                <span className="flex size-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <feature.icon className="size-5" />
                </span>
                <h3 className="font-semibold">
                  {t(`home.features.${feature.key}.title`)}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {t(`home.features.${feature.key}.description`)}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-border/70">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-1 px-4 py-6 text-center text-sm text-muted-foreground sm:flex-row sm:justify-between sm:gap-0 sm:px-6 sm:text-start">
          <span>{t("common.appName")}</span>
          <span>{t("home.footerTagline")}</span>
        </div>
      </footer>
    </div>
  )
}
