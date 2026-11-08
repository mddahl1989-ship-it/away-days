import { outcome, outcomeLabels, scoreLabel } from '../lib/format'

interface Props {
  isHome: boolean
  opponent: string
  goalsBvB: number | null
  goalsOpponent: number | null
  size?: 'sm' | 'md' | 'lg'
}

const sizes = {
  sm: 'min-w-[4rem] px-2.5 py-1 text-xl',
  md: 'min-w-[4.75rem] px-3 py-1.5 text-[1.6rem] leading-tight',
  lg: 'min-w-[6.5rem] px-4 py-2 text-[2.6rem] leading-none',
}

// Kleine Anzeigetafel für das Ergebnis. Die Farbe der Ziffern zeigt den Ausgang aus BVB-Sicht:
// gelb = Sieg, weiß = Unentschieden, rot = Niederlage.
export default function ScorePlate({ size = 'md', ...match }: Props) {
  const score = scoreLabel(match)
  const result = outcome(match)

  if (!score || !result) {
    return (
      <span className={`led-panel inline-flex items-center justify-center rounded-md ${sizes[size]}`} aria-label="Noch kein Ergebnis">
        <span className="led-dim" aria-hidden="true">–:–</span>
      </span>
    )
  }

  const color = {
    win: '',
    draw: '!text-white [text-shadow:0_0_10px_rgb(255_255_255/0.35)]',
    loss: '!text-led-rot [text-shadow:0_0_10px_rgb(255_91_79/0.45)]',
  }[result]

  return (
    <span
      className={`led-panel inline-flex items-center justify-center rounded-md ${sizes[size]}`}
      aria-label={`${outcomeLabels[result]}, ${score}`}
    >
      <span className={`led ${color}`} aria-hidden="true">
        {score}
      </span>
    </span>
  )
}
