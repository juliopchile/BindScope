import { useEffect, useRef, useState } from 'react'
import QRCode from 'qrcode'

type AddressQrProps = {
  value: string
  label: string
  size?: number
}

/** Renders a high-contrast QR for a receive address / payment URI. */
export function AddressQr({ value, label, size = 160 }: AddressQrProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !value) return
    let cancelled = false
    void QRCode.toCanvas(canvas, value, {
      width: size,
      margin: 1,
      color: { dark: '#111111', light: '#ffffff' },
      errorCorrectionLevel: 'M',
    }).catch(() => {
      if (!cancelled) setFailed(true)
    })
    return () => {
      cancelled = true
    }
  }, [value, size])

  if (!value) return null

  if (failed) {
    return (
      <p className="text-xs" style={{ color: 'var(--fg-muted)' }} role="status">
        —
      </p>
    )
  }

  return (
    <canvas
      ref={canvasRef}
      className="support-modal__qr mx-auto rounded-md border"
      style={{ borderColor: 'var(--border)', width: size, height: size }}
      width={size}
      height={size}
      aria-label={label}
      role="img"
    />
  )
}
