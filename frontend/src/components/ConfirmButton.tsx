import { useEffect, useState } from 'react'

interface Props {
  label: string
  confirmLabel: string
  onConfirm: () => void | Promise<void>
  tone?: 'light' | 'dark'
}

// Löschen in zwei Schritten: erster Klick fragt nach, zweiter Klick löscht.
// Ohne zweiten Klick springt der Knopf nach ein paar Sekunden zurück.
export default function ConfirmButton({ label, confirmLabel, onConfirm, tone = 'light' }: Props) {
  const [asking, setAsking] = useState(false)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!asking) return
    const timer = window.setTimeout(() => setAsking(false), 4000)
    return () => window.clearTimeout(timer)
  }, [asking])

  async function handleClick() {
    if (!asking) {
      setAsking(true)
      return
    }
    setBusy(true)
    try {
      await onConfirm()
    } finally {
      setBusy(false)
      setAsking(false)
    }
  }

  const base = 'rounded-sm px-3 py-1.5 text-sm font-semibold transition-colors disabled:opacity-60'
  const idle = tone === 'light' ? 'text-rot hover:bg-rot/10' : 'text-led-rot hover:bg-white/10'
  const active = tone === 'light' ? 'bg-rot text-white' : 'bg-led-rot text-black'

  return (
    <button type="button" onClick={handleClick} disabled={busy} className={`${base} ${asking ? active : idle}`} aria-live="polite">
      {asking ? confirmLabel : label}
    </button>
  )
}
