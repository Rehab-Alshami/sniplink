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

export interface DashboardLink {
  id: string
  originalUrl: string
  shortCode: string
  clickCount: number
  createdAt: string
  lastVisit: string | null
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export function LinksTable({ links }: { links: DashboardLink[] }) {
  const router = useRouter()
  const [origin, setOrigin] = useState("")
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
      toast.success("Short link copied")
    } catch {
      toast.error("Couldn't copy link")
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
        toast.success("Link deleted")
        setDeleteTarget(null)
        router.refresh()
      } else {
        toast.error(res.error ?? "Could not delete link")
      }
    },
    onError: () => toast.error("Could not delete link"),
  })

  if (links.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center">
        <span className="flex size-12 items-center justify-center rounded-xl bg-accent text-accent-foreground">
          <Link2 className="size-6" />
        </span>
        <h3 className="mt-4 font-semibold">No links yet</h3>
        <p className="mt-1 max-w-xs text-pretty text-sm text-muted-foreground">
          Shorten your first URL from the homepage and it will show up here.
        </p>
        <Button className="mt-5" render={<a href="/">Create a short link</a>} />
      </div>
    )
  }

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Short link</TableHead>
              <TableHead className="hidden md:table-cell">Destination</TableHead>
              <TableHead className="hidden sm:table-cell">Created</TableHead>
              <TableHead className="text-right">Clicks</TableHead>
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
                  <p className="mt-0.5 truncate text-xs text-muted-foreground md:hidden">
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
                <TableCell className="text-right">
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
                          <span className="sr-only">Link actions</span>
                        </Button>
                      }
                    />
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onSelect={() => copy(link.shortCode)}>
                        <Copy className="size-4" />
                        Copy link
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={() => {
                          setQrDataUrl(null)
                          setQrLink(link)
                        }}
                      >
                        <QrIcon className="size-4" />
                        Show QR code
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        variant="destructive"
                        onSelect={() => setDeleteTarget(link)}
                      >
                        <Trash2 className="size-4" />
                        Delete
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
            <DialogTitle>QR code</DialogTitle>
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
                Download PNG
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
            <DialogTitle>Delete this link?</DialogTitle>
            <DialogDescription>
              <span className="font-mono">/{deleteTarget?.shortCode}</span> will stop
              working immediately and its click history will be removed. This can&apos;t
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={removeMutation.isPending}
              onClick={() => deleteTarget && removeMutation.mutate(deleteTarget.id)}
            >
              {removeMutation.isPending && (
                <Loader2 className="size-4 animate-spin" />
              )}
              Delete link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
