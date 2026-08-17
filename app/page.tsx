import { QrCode as QrIcon, MousePointerClick, Zap } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { ShortenForm } from "@/components/shorten-form"

const features = [
  {
    icon: Zap,
    title: "Instant short links",
    description:
      "Paste any long URL and get a clean, shareable link in a single click.",
  },
  {
    icon: QrIcon,
    title: "Auto QR codes",
    description:
      "Every link comes with a downloadable QR code — perfect for print and ads.",
  },
  {
    icon: MousePointerClick,
    title: "Click analytics",
    description:
      "Sign in to track visits over time and manage all your links in one place.",
  },
]

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        <section className="mx-auto max-w-5xl px-4 pb-20 pt-14 sm:px-6 sm:pt-20">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
              <span className="size-1.5 rounded-full bg-primary" />
              Short links + QR codes, instantly
            </span>
            <h1 className="mt-5 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
              Make long links short and{" "}
              <span className="text-primary">scannable</span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
              Shorten any URL, generate a QR code, and share it anywhere — on a
              business card, a poster, or a post. No account required to start.
            </p>
          </div>

          <div className="mx-auto mt-10 max-w-2xl">
            <ShortenForm />
          </div>
        </section>

        <section className="border-t border-border/70 bg-card/40">
          <div className="mx-auto grid max-w-5xl gap-6 px-4 py-14 sm:grid-cols-3 sm:px-6">
            {features.map((feature) => (
              <div key={feature.title} className="flex flex-col gap-3">
                <span className="flex size-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <feature.icon className="size-5" />
                </span>
                <h3 className="font-semibold">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-border/70">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-6 text-sm text-muted-foreground sm:px-6">
          <span>Sniplink</span>
          <span>Built with Next.js, Prisma & NextAuth</span>
        </div>
      </footer>
    </div>
  )
}
