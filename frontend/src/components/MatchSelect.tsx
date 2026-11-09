import { useEffect, useState } from 'react'
import { getMatches } from '../api/matches'
import { fixtureLabel, formatDay, seasonLabel, seasonOf, strikePlain } from '../lib/format'
import type { Match } from '../types/api'
import { inputClass } from './ui'

// Auswahl eines Spiels: anstehende Spiele zuerst, darunter die gespielten,
// nach Saison gruppiert und innerhalb der Saison die neuesten oben.
// So lassen sich auch Fahrten zu Spielen aus früheren Saisons eintragen.
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
  const played = matches
    .filter((m) => new Date(m.kickOff).getTime() <= now)
    .sort((a, b) => b.kickOff.localeCompare(a.kickOff))

  const seasons = [...new Set(played.map((m) => seasonOf(m.kickOff)))]

  const option = (m: Match) => (
    <option key={m.id} value={m.id}>
      {formatDay(m.kickOff)} {strikePlain(fixtureLabel(m))}
    </option>
  )

  return (
    <select className={inputClass} value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="">Spiel auswählen</option>
      {upcoming.length > 0 && <optgroup label="Anstehend">{upcoming.map(option)}</optgroup>}
      {seasons.map((season) => (
        <optgroup key={season} label={`Gespielt, Saison ${seasonLabel(season)}`}>
          {played.filter((m) => seasonOf(m.kickOff) === season).map(option)}
        </optgroup>
      ))}
    </select>
  )
}
