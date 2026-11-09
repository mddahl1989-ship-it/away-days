import type { Competition, ExpenseCategory, TravelMode } from '../types/api'

export const competitionLabels: Record<Competition, string> = {
  Bundesliga: 'Bundesliga',
  DfbPokal: 'DFB-Pokal',
  ChampionsLeague: 'Champions League',
  Other: 'Sonstiges',
}

export const travelModeLabels: Record<TravelMode, string> = {
  Car: 'Auto',
  Train: 'Zug',
  Bus: 'Bus',
  Plane: 'Flugzeug',
  Other: 'Sonstiges',
}

export const categoryLabels: Record<ExpenseCategory, string> = {
  Tickets: 'Tickets',
  Travel: 'Anreise',
  Accommodation: 'Übernachtung',
  Food: 'Verpflegung',
  Other: 'Sonstiges',
}

const weekdays = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa']
const pad = (n: number) => String(n).padStart(2, '0')

// "Sa 07.11."
export function formatDay(iso: string): string {
  const d = new Date(iso)
  return `${weekdays[d.getDay()]} ${pad(d.getDate())}.${pad(d.getMonth() + 1)}.`
}

// "07.11."
export function formatShortDate(iso: string): string {
  const d = new Date(iso)
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.`
}

export function formatWeekday(iso: string): string {
  return weekdays[new Date(iso).getDay()]
}

// "15:30"
export function formatTime(iso: string): string {
  const d = new Date(iso)
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`
}

// "Samstag, 7. November 2026, 15:30 Uhr"
export function formatDateLong(iso: string): string {
  const d = new Date(iso)
  const date = d.toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  return `${date}, ${formatTime(iso)} Uhr`
}

// "November 2026"
export function formatMonth(iso: string): string {
  return new Date(iso).toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })
}

export function formatEuro(amount: number): string {
  return amount.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })
}

export function formatNumber(value: number): string {
  return value.toLocaleString('de-DE')
}

// Deutsche Eingabe "18,50" -> 18.5
export function parseAmount(value: string): number {
  return Number(value.replace(/\./g, '').replace(',', '.'))
}

// Saison 2026 = 2026/27. Ab Juli beginnt die neue Saison.
export function currentSeason(): number {
  const now = new Date()
  return now.getMonth() >= 6 ? now.getFullYear() : now.getFullYear() - 1
}

export function seasonLabel(season: number): string {
  return `${season}/${String(season + 1).slice(2)}`
}

// Die erste Saison im Fahrtenbuch: 2022/23, seit dem 2:2 gegen Bayern im Oktober 2022.
export const FIRST_SEASON = 2022

// Alle Saisons vom aktuellen Jahr zurück bis zur ersten, neueste zuerst
export function recentSeasons(): number[] {
  return Array.from({ length: currentSeason() - FIRST_SEASON + 1 }, (_, i) => currentSeason() - i)
}

// Saison eines Spiels: Anstoß ab Juli zählt zur neuen Saison
export function seasonOf(iso: string): number {
  const d = new Date(iso)
  return d.getMonth() >= 6 ? d.getFullYear() : d.getFullYear() - 1
}

// „Schalke“ wird überall durchgestrichen. In <option> geht kein Markup,
// dort hilft das Unicode-Zeichen U+0336 (Durchstreichung) hinter jedem Buchstaben.
export const STRUCK_WORD = 'Schalke'

export function strikePlain(text: string): string {
  return text.replaceAll(STRUCK_WORD, [...STRUCK_WORD].map((c) => `${c}\u0336`).join(''))
}

// ISO-Datum aus der API -> Wert für <input type="datetime-local"> in lokaler Zeit
export function toDateTimeLocal(iso: string): string {
  const d = new Date(iso)
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

interface Fixture {
  isHome: boolean
  opponent: string
  goalsBvB: number | null
  goalsOpponent: number | null
}

// Paarung in Fußball-Schreibweise: Heimteam zuerst
export function fixtureLabel(f: Fixture): string {
  return f.isHome ? `BVB – ${f.opponent}` : `${f.opponent} – BVB`
}

// Ergebnis ebenfalls Heimteam zuerst, z. B. "2:3" bei einem Auswärtssieg
export function scoreLabel(f: Fixture): string | null {
  if (f.goalsBvB === null || f.goalsOpponent === null) return null
  return f.isHome ? `${f.goalsBvB}:${f.goalsOpponent}` : `${f.goalsOpponent}:${f.goalsBvB}`
}

export type Outcome = 'win' | 'draw' | 'loss'

export function outcome(f: Fixture): Outcome | null {
  if (f.goalsBvB === null || f.goalsOpponent === null) return null
  if (f.goalsBvB > f.goalsOpponent) return 'win'
  if (f.goalsBvB === f.goalsOpponent) return 'draw'
  return 'loss'
}

export const outcomeLabels: Record<Outcome, string> = {
  win: 'Sieg',
  draw: 'Unentschieden',
  loss: 'Niederlage',
}

export function plural(count: number, singular: string, pluralForm: string): string {
  return `${formatNumber(count)} ${count === 1 ? singular : pluralForm}`
}
