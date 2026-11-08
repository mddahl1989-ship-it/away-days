import { useEffect, useState } from 'react'

const GLYPHS = 'ABCDEFGHJKLMNPRSTUVWXYZ0123456789'

function scramble(text: string, settled: number): string {
  return text
    .split('')
    .map((char, i) => (i < settled || char === ' ' ? char : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
    .join('')
}

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// Text wie auf einer Fallblatt-Anzeige: die Zeichen blättern kurz durch und bleiben dann stehen.
// Läuft nur einmal beim Laden. Screenreader bekommen sofort den fertigen Text.
export default function FlapText({ text, delay = 0 }: { text: string; delay?: number }) {
  const [reduced] = useState(prefersReducedMotion)
  const [frame, setFrame] = useState(() => (reduced ? text : scramble(text, 0)))

  useEffect(() => {
    if (reduced) return

    let raf = 0
    const start = performance.now() + delay
    const msPerChar = 32

    const tick = (now: number) => {
      const settled = Math.max(0, Math.floor((now - start) / msPerChar))
      setFrame(scramble(text, settled))
      if (settled < text.length) {
        raf = requestAnimationFrame(tick)
      }
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [text, delay, reduced])

  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{frame}</span>
    </>
  )
}
