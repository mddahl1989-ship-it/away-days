import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { getTrips } from '../api/trips'
import TripTicket from '../components/TripTicket'
import { ErrorBanner, Flash, Loading, PageHeader, inputClass, pageClass, primaryButton } from '../components/ui'
import { currentSeason, formatEuro, formatNumber, plural, recentSeasons, seasonLabel } from '../lib/format'
import type { TripSummary } from '../types/api'

export default function TripsPage() {
  const [season, setSeason] = useState<number | undefined>(currentSeason())
  const [trips, setTrips] = useState<TripSummary[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getTrips(season)
      .then((data) => {
        setTrips(data)
        setError(null)
      })
      .catch((e: Error) => setError(e.message))
  }, [season])

  const totalKm = trips?.reduce((sum, t) => sum + t.distanceKm, 0) ?? 0
  const totalCost = trips?.reduce((sum, t) => sum + t.totalCost, 0) ?? 0

  return (
    <div className={pageClass}>
      <PageHeader title="Fahrtenbuch">
        <label>
          <span className="sr-only">Saison</span>
          <select
            className={`${inputClass} w-auto`}
            value={season ?? ''}
            onChange={(e) => setSeason(e.target.value ? Number(e.target.value) : undefined)}
          >
            <option value="">Alle Saisons</option>
            {recentSeasons().map((s) => (
              <option key={s} value={s}>
                Saison {seasonLabel(s)}
              </option>
            ))}
          </select>
        </label>
        <Link to="/trips/new" className={primaryButton}>
          Fahrt eintragen
        </Link>
      </PageHeader>

      <Flash />
      <ErrorBanner message={error} />
      {!trips && !error && <Loading />}

      {trips && trips.length > 0 && (
        <p className="mb-8 max-w-[60ch] text-xl">
          {plural(trips.length, 'Fahrt', 'Fahrten')}, {formatNumber(totalKm)} km unterwegs, {formatEuro(totalCost)} ausgegeben.
        </p>
      )}

      {trips?.length === 0 && (
        <p className="text-lg">
          Noch keine Fahrt in {season ? `der Saison ${seasonLabel(season)}` : 'diesem Fahrtenbuch'}. Trag die erste ein, sobald
          du im Stadion warst.
        </p>
      )}

      <ol className="space-y-4">
        {trips?.map((trip) => (
          <li key={trip.id}>
            <Link to={`/trips/${trip.id}`} className="block rounded-md" aria-label={`Fahrt am ${trip.kickOff.slice(0, 10)} öffnen`}>
              <TripTicket trip={trip} />
            </Link>
          </li>
        ))}
      </ol>
    </div>
  )
}
