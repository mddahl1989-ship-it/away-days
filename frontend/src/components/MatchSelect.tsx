import { useEffect, useState } from 'react'
import { getMatches } from '../api/matches'
import { fixtureLabel, formatDay } from '../lib/format'
import type { Match } from '../types/api'
import { inputClass } from './ui'

// Auswahl eines Spiels: anstehende Spiele zuerst, darunter die gespielten (neueste oben).
export default function MatchSelect({ value, onChange }: { value: string; onChange: (id: string) => void }) {
  const [matches, setMatches] = useState<Match[]>([])
  const [now] = useState(() => Date.now())

  useEffect(() => {
    getMatches()
      .then(setMatches)
      .catch(() => setMatches([]))
  }, [])

  const upcoming = matches
    .filter((m) => new Date(m.kickOff).getTime() > now)
    .sort((a, b) => a.kickOff.localeCompare(b.kickOff))
  const played = matches.filter((m) => new Date(m.kickOff).getTime() <= now)

  const option = (m: Match) => (
    <option key={m.id} value={m.id}>
      {formatDay(m.kickOff)} {fixtureLabel(m)}
    </option>
  )

  return (
    <select className={inputClass} value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="">Spiel auswählen</option>
      {played.length > 0 && <optgroup label="Gespielt">{played.map(option)}</optgroup>}
      {upcoming.length > 0 && <optgroup label="Anstehend">{upcoming.map(option)}</optgroup>}
    </select>
  )
}
