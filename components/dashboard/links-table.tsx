"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useMutation } from "@tanstack/react-query"
import {
  Copy,
  Download,
  ExternalLink,
  Link2,
  Loader2,
  MoreHorizontal,
  QrCode as QrIcon,
  Trash2,
} from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { QrCode } from "@/components/qr-code"
import { deleteLink } from "@/lib/actions"
import { useLocale } from "@/components/providers/locale-provider"

export interface DashboardLink {
  id: string
  originalUrl: string
  shortCode: string
  clickCount: number
  createdAt: string
  lastVisit: string | null
}

export function LinksTable({ links }: { links: DashboardLink[] }) {
  const { t, locale } = useLocale()
  const router = useRouter()
  const [origin, setOrigin] = useState("")

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString(locale === "ar" ? "ar" : undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }
  const [qrLink, setQrLink] = useState<DashboardLink | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<DashboardLink | null>(null)
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null)

  useEffect(() => {
    setOrigin(window.location.origin)
  }, [])

  const shortUrlFor = (code: string) => `${origin || ""}/${code}`

  async function copy(code: string) {
    try {
      await navigator.clipboard.writeText(shortUrlFor(code))
      toast.success(t("dashboard.toastCopySuccess"))
    } catch {
      toast.error(t("dashboard.toastCopyError"))
    }
  }

  function downloadQr(code: string) {
    if (!qrDataUrl) return
    const a = document.createElement("a")
    a.href = qrDataUrl
    a.download = `qr-${code}.png`
    a.click()
  }

  const removeMutation = useMutation({
    mutationFn: (id: string) => deleteLink(id),
    onSuccess: (res) => {
      if (res.ok) {
        toast.success(t("dashboard.toastDeleted"))
        setDeleteTarget(null)
        router.refresh()
      } else {
        toast.error(t(`errors.${res.error ?? "failed"}`))
      }
    },
    onError: () => toast.error(t("errors.failed")),
  })

  if (links.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center">
        <span className="flex size-12 items-center justify-center rounded-xl bg-accent text-accent-foreground">
          <Link2 className="size-6" />
        </span>
        <h3 className="mt-4 font-semibold">{t("dashboard.emptyTitle")}</h3>
        <p className="mt-1 max-w-xs text-pretty text-sm text-muted-foreground">
          {t("dashboard.emptyDescription")}
        </p>
        <Button className="mt-5" render={<a href="/">{t("dashboard.createLink")}</a>} />
      </div>
    )
  }

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>{t("dashboard.tableShortLink")}</TableHead>
              <TableHead className="hidden md:table-cell">
                {t("dashboard.tableDestination")}
              </TableHead>
              <TableHead className="hidden sm:table-cell">
                {t("dashboard.tableCreated")}
              </TableHead>
              <TableHead className="text-end">{t("dashboard.tableClicks")}</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {links.map((link) => (
              <TableRow key={link.id}>
                <TableCell>
                  <a
                    href={shortUrlFor(link.shortCode)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 font-mono font-medium text-primary hover:underline"
                  >
                    /{link.shortCode}
                    <ExternalLink className="size-3.5" />
                  </a>
                  {/* Table auto-layout doesn't shrink nowrap content the way
                      flexbox does — without an explicit max-width this would
                      force the whole table wider instead of truncating. */}
                  <p className="mt-0.5 max-w-[60vw] truncate text-xs text-muted-foreground sm:max-w-[40vw] md:hidden">
                    {link.originalUrl}
                  </p>
                </TableCell>
                <TableCell className="hidden max-w-xs md:table-cell">
                  <span
                    className="block truncate text-sm text-muted-foreground"
                    title={link.originalUrl}
                  >
                    {link.originalUrl}
                  </span>
                </TableCell>
                <TableCell className="hidden text-sm text-muted-foreground sm:table-cell">
                  {formatDate(link.createdAt)}
                </TableCell>
                <TableCell className="text-end">
                  <Badge variant="secondary" className="tabular-nums">
                    {link.clickCount}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button variant="ghost" size="icon" className="size-8">
                          <MoreHorizontal className="size-4" />
                          <span className="sr-only">{t("dashboard.linkActions")}</span>
                        </Button>
                      }
                    />
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => copy(link.shortCode)}>
                        <Copy className="size-4" />
                        {t("dashboard.copyLink")}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setQrDataUrl(null)
                          setQrLink(link)
                        }}
                      >
                        <QrIcon className="size-4" />
                        {t("dashboard.showQr")}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => setDeleteTarget(link)}
                      >
                        <Trash2 className="size-4" />
                        {t("dashboard.delete")}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* QR dialog */}
      <Dialog open={!!qrLink} onOpenChange={(open) => !open && setQrLink(null)}>
        <DialogContent className="sm:max-w-xs">
          <DialogHeader>
            <DialogTitle>{t("dashboard.qrDialogTitle")}</DialogTitle>
            <DialogDescription className="font-mono text-xs">
              /{qrLink?.shortCode}
            </DialogDescription>
          </DialogHeader>
          {qrLink && (
            <div className="flex flex-col items-center gap-4">
              <div className="rounded-lg border border-border bg-white p-3">
                <QrCode
                  value={shortUrlFor(qrLink.shortCode)}
                  size={180}
                  onReady={setQrDataUrl}
                />
              </div>
              <Button
                className="w-full"
                disabled={!qrDataUrl}
                onClick={() => downloadQr(qrLink.shortCode)}
              >
                <Download className="size-4" />
                {t("dashboard.downloadPng")}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <Dialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("dashboard.deleteDialogTitle")}</DialogTitle>
            <DialogDescription>
              {t("dashboard.deleteDialogDescription", {
                code: `/${deleteTarget?.shortCode ?? ""}`,
              })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              {t("dashboard.cancel")}
            </Button>
            <Button
              variant="destructive"
              disabled={removeMutation.isPending}
              onClick={() => deleteTarget && removeMutation.mutate(deleteTarget.id)}
            >
              {removeMutation.isPending && (
                <Loader2 className="size-4 animate-spin" />
              )}
              {t("dashboard.deleteLink")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
