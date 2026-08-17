import Link from "next/link"
import { LinkIcon, Unlink } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <span className="flex size-16 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
        <Unlink className="size-8" />
      </span>
      <p className="mt-6 font-mono text-sm font-medium uppercase tracking-widest text-primary">
        404 — link not found
      </p>
      <h1 className="mt-3 text-balance text-3xl font-semibold tracking-tight">
        This short link doesn&apos;t exist
      </h1>
      <p className="mt-3 max-w-md text-pretty leading-relaxed text-muted-foreground">
        The link may have been deleted, mistyped, or it was never created. Double-check
        the URL, or create a fresh short link of your own.
      </p>
      <Button
        className="mt-7"
        render={
          <Link href="/">
            <LinkIcon className="size-4" />
            Shorten a new link
          </Link>
        }
      />
    </main>
  )
}
