"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { ChevronDown, Link2, Loader2, Sparkles } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { shortenSchema, type ShortenInput } from "@/lib/validations"
import { shortenUrl, type ShortenResult } from "@/lib/actions"
import { LinkResult } from "@/components/link-result"

export function ShortenForm() {
  const [showAlias, setShowAlias] = useState(false)
  const [result, setResult] = useState<
    Extract<ShortenResult, { ok: true }> | null
  >(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ShortenInput>({
    resolver: zodResolver(shortenSchema),
    defaultValues: { url: "", customAlias: "" },
  })

  const mutation = useMutation({
    mutationFn: (values: ShortenInput) => shortenUrl(values),
    onSuccess: (data) => {
      if (data.ok) {
        setResult(data)
        toast.success("Short link ready")
      } else {
        toast.error(data.error)
      }
    },
    onError: () => toast.error("Something went wrong. Please try again."),
  })

  function onSubmit(values: ShortenInput) {
    setResult(null)
    mutation.mutate(values)
  }

  return (
    <div className="flex flex-col gap-6">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5"
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Link2 className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              {...register("url")}
              type="url"
              inputMode="url"
              autoComplete="off"
              placeholder="Paste a long URL, e.g. https://example.com/very/long/path"
              className="h-12 pl-9 text-base"
              aria-invalid={!!errors.url}
            />
          </div>
          <Button
            type="submit"
            size="lg"
            className="h-12 shrink-0"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Sparkles className="size-4" />
            )}
            Shorten
          </Button>
        </div>

        {errors.url && (
          <p className="mt-2 text-sm text-destructive">{errors.url.message}</p>
        )}

        <div className="mt-3">
          <button
            type="button"
            onClick={() => setShowAlias((v) => !v)}
            className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ChevronDown
              className={`size-4 transition-transform ${showAlias ? "rotate-180" : ""}`}
            />
            Custom alias (optional)
          </button>

          {showAlias && (
            <div className="mt-2">
              <Label htmlFor="customAlias" className="sr-only">
                Custom alias
              </Label>
              <div className="flex items-center gap-1 rounded-md border border-input bg-background px-3 focus-within:ring-2 focus-within:ring-ring">
                <span className="shrink-0 font-mono text-sm text-muted-foreground">
                  /
                </span>
                <Input
                  id="customAlias"
                  {...register("customAlias")}
                  placeholder="my-custom-link"
                  className="border-0 px-1 font-mono shadow-none focus-visible:ring-0"
                  aria-invalid={!!errors.customAlias}
                />
              </div>
              {errors.customAlias && (
                <p className="mt-1.5 text-sm text-destructive">
                  {errors.customAlias.message}
                </p>
              )}
            </div>
          )}
        </div>
      </form>

      {result && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          <LinkResult
            shortCode={result.shortCode}
            originalUrl={result.originalUrl}
            persisted={result.persisted}
          />
          <button
            type="button"
            onClick={() => {
              setResult(null)
              reset()
            }}
            className="mx-auto mt-4 block text-sm text-muted-foreground hover:text-foreground"
          >
            Shorten another link
          </button>
        </div>
      )}
    </div>
  )
}
