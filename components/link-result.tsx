"use client"

import { useEffect, useState } from "react"
import { Check, Copy, Download, ExternalLink } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { QrCode } from "@/components/qr-code"
import { useLocale } from "@/components/providers/locale-provider"
import { copyText } from "@/lib/clipboard"

interface LinkResultProps {
  shortCode: string
  originalUrl: string
  persisted: boolean
}

export function LinkResult({ shortCode, originalUrl, persisted }: LinkResultProps) {
  const { t } = useLocale()
  const [origin, setOrigin] = useState("")
  const [copied, setCopied] = useState(false)
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null)

  useEffect(() => {
    setOrigin(window.location.origin)
  }, [])

  const shortUrl = origin ? `${origin}/${shortCode}` : `/${shortCode}`

  async function copy() {
    const ok = await copyText(shortUrl)
    if (ok) {
      setCopied(true)
      toast.success(t("linkResult.copySuccess"))
      setTimeout(() => setCopied(false), 2000)
    } else {
      toast.error(t("linkResult.copyError"))
    }
  }

  function download() {
    if (!qrDataUrl) return
    const a = document.createElement("a")
    a.href = qrDataUrl
    a.download = `qr-${shortCode}.png`
    a.click()
    toast.success(t("linkResult.downloadSuccess"))
  }

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <div className="flex shrink-0 items-center justify-center rounded-lg border border-border bg-white p-2">
          <QrCode value={shortUrl} size={132} onReady={setQrDataUrl} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {t("linkResult.label")}
          </p>
          <a
            href={shortUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 font-mono text-lg font-semibold text-primary hover:underline"
          >
            <span className="truncate">
              {origin ? shortUrl.replace(/^https?:\/\//, "") : `/${shortCode}`}
            </span>
            <ExternalLink className="size-4 shrink-0" />
          </a>
          <p className="mt-1 truncate text-sm text-muted-foreground" title={originalUrl}>
            {originalUrl}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <Button onClick={copy} size="sm">
              {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
              {copied ? t("linkResult.copied") : t("linkResult.copy")}
            </Button>
            <Button onClick={download} size="sm" variant="outline" disabled={!qrDataUrl}>
              <Download className="size-4" />
              {t("linkResult.downloadQr")}
            </Button>
          </div>
        </div>
      </div>

      {!persisted && (
        <p className="mt-4 rounded-lg bg-accent/60 px-3 py-2 text-xs text-accent-foreground">
          {t("linkResult.previewNotice")}
        </p>
      )}
    </div>
  )
}
