"use client"

import { useEffect, useState } from "react"
import QRCode from "qrcode"

interface QrCodeProps {
  value: string
  size?: number
  className?: string
  /** Called with the generated PNG data URL, useful for download buttons. */
  onReady?: (dataUrl: string) => void
}

export function QrCode({ value, size = 200, className, onReady }: QrCodeProps) {
  const [dataUrl, setDataUrl] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    QRCode.toDataURL(value, {
      width: size * 2, // render at 2x for crisp downloads
      margin: 2,
      errorCorrectionLevel: "M",
      color: { dark: "#141420", light: "#ffffff" },
    })
      .then((url) => {
        if (!active) return
        setDataUrl(url)
        onReady?.(url)
      })
      .catch((err) => console.log("[v0] QR generation failed:", err.message))
    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, size])

  if (!dataUrl) {
    return (
      <div
        className={className}
        style={{ width: size, height: size }}
        aria-hidden="true"
      />
    )
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={dataUrl || "/placeholder.svg"}
      alt={`QR code for ${value}`}
      width={size}
      height={size}
      className={className}
    />
  )
}
