import type { Competition, TravelMode } from '../types/api'
import { competitionLabels, fixtureLabel, formatEuro, formatNumber, formatShortDate, formatWeekday, plural, travelModeLabels } from '../lib/format'
import ScorePlate from './ScorePlate'
import StruckText from './StruckText'

export interface TicketData {
  kickOff: string
  opponent: string
  venue: string
  competition: Competition
  isHome: boolean
  goalsBvB: number | null
  goalsOpponent: number | null
  travelMode: TravelMode
  distanceKm: number
  friends: number
  totalCost: number
  expenseCount: number
}

function companions(friends: number): string {
  return friends === 0 ? 'allein' : `${friends} Mitfahrer`
}

// Eine Fahrt als Eintrittskarte: links der Abriss mit dem Datum, rechts Spiel, Anreise und Kosten.
export default function TripTicket({ trip, large = false }: { trip: TicketData; large?: boolean }) {
  const year = new Date(trip.kickOff).getFullYear()

  return (
    <article className={`ticket flex ${large ? 'ticket--large min-h-[11rem]' : 'min-h-[7.5rem]'}`}>
      <div className="ticket-stub flex shrink-0 flex-col justify-center px-2.5 py-4 text-gelb sm:px-3 md:px-4">
        <span className="text-sm text-gelb/70">{formatWeekday(trip.kickOff)}</span>
        <span className={`font-condensed leading-none font-bold ${large ? 'text-[1.7rem] sm:text-[2.1rem] md:text-5xl' : 'text-[1.6rem] sm:text-[1.85rem]'}`}>
          {formatShortDate(trip.kickOff)}
        </span>
        <span className="text-sm text-gelb/70">{year}</span>
      </div>

      <div className="grid min-w-0 flex-1 grid-cols-[auto_1fr] items-center gap-x-4 gap-y-3 py-4 pr-4 pl-4 sm:gap-x-6 md:grid-cols-[1fr_auto_auto] md:pr-5 md:pl-6">
        <div className="col-span-2 min-w-0 md:col-span-1">
          <p className={`font-condensed leading-[1.05] font-bold break-words text-white ${large ? 'text-3xl md:text-5xl' : 'text-[1.6rem]'}`}>
            <StruckText source={fixtureLabel(trip)} />
          </p>
          <p className="mt-1 text-white/65">
            {trip.venue}, {competitionLabels[trip.competition]}
          </p>
          <p className="mt-2 text-white/90">
            {travelModeLabels[trip.travelMode]}, {formatNumber(trip.distanceKm)} km, {companions(trip.friends)}
          </p>
        </div>

        {/* Die Ergebnis-Tafel wächst mit der Bildschirmbreite */}
        <span className="sm:hidden">
          <ScorePlate {...trip} size="sm" />
        </span>
        <span className={`hidden sm:inline ${large ? 'md:hidden' : ''}`}>
          <ScorePlate {...trip} size="md" />
        </span>
        {large && (
          <span className="hidden md:inline">
            <ScorePlate {...trip} size="lg" />
          </span>
        )}

        <div className="text-right">
          <p className={`font-condensed leading-none font-bold text-gelb ${large ? 'text-[1.75rem] sm:text-[2.1rem] md:text-5xl' : 'text-[1.75rem] sm:text-[2rem]'}`}>
            {formatEuro(trip.totalCost)}
          </p>
          <p className="mt-1 text-sm text-white/60">{plural(trip.expenseCount, 'Ausgabe', 'Ausgaben')}</p>
        </div>
      </div>
    </article>
  )
}
