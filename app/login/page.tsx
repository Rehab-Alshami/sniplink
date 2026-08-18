"use client"

import { Suspense, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { signIn } from "next-auth/react"
import { ArrowLeft, Link2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLocale } from "@/components/providers/locale-provider"

function GoogleMark() {
  return (
    <svg className="size-4" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.65l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.11a6.6 6.6 0 0 1 0-4.22V7.05H2.18a11 11 0 0 0 0 9.9l3.66-2.84Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.46 14.97.5 12 .5A11 11 0 0 0 2.18 7.05l3.66 2.84C6.71 6.68 9.14 4.75 12 4.75Z"
      />
    </svg>
  )
}

function LoginCard() {
  const { t } = useLocale()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard"
  const [loading, setLoading] = useState(false)

  return (
    <div className="w-full max-w-sm">
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <div className="flex flex-col items-center text-center">
          <span className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Link2 className="size-5" />
          </span>
          <h1 className="mt-4 text-2xl font-semibold tracking-tight">
            {t("login.heading")}
          </h1>
          <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground">
            {t("login.subtitle")}
          </p>
        </div>

        <Button
          className="mt-6 w-full"
          variant="outline"
          size="lg"
          disabled={loading}
          onClick={() => {
            setLoading(true)
            signIn("google", { callbackUrl })
          }}
        >
          {loading ? <Loader2 className="size-4 animate-spin" /> : <GoogleMark />}
          {t("login.continueWithGoogle")}
        </Button>

        <p className="mt-6 text-center text-xs leading-relaxed text-muted-foreground">
          {t("login.terms")}
        </p>
      </div>

      <Link
        href="/"
        className="mx-auto mt-6 flex w-fit items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4 rtl:rotate-180" />
        {t("login.backToHome")}
      </Link>
    </div>
  )
}

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <Suspense fallback={null}>
        <LoginCard />
      </Suspense>
    </main>
  )
}
