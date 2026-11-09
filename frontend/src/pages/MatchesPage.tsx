import { Fragment, useEffect, useState } from 'react'
import { Link } from 'react-router'
import { ApiError } from '../api/client'
import { deleteMatch, getMatches } from '../api/matches'
import { getTrips } from '../api/trips'
import ConfirmButton from '../components/ConfirmButton'
import ScorePlate from '../components/ScorePlate'
import Segmented from '../components/Segmented'
import StruckText from '../components/StruckText'
import { ErrorBanner, Flash, Loading, PageHeader, inputClass, pageClass, primaryButton, textLink } from '../components/ui'
import {
  competitionLabels,
  currentSeason,
  fixtureLabel,
  formatDay,
  formatMonth,
  formatTime,
  plural,
  recentSeasons,
  seasonLabel,
} from '../lib/format'
import type { Competition, Match } from '../types/api'

type Venue = 'all' | 'home' | 'away'

const venueOptions: { value: Venue; label: string }[] = [
  { value: 'all', label: 'Alle' },
  { value: 'home', label: 'Heim' },
  { value: 'away', label: 'Auswärts' },
]

export default function MatchesPage() {
  const [q, setQ] = useState('')
  const [competition, setCompetition] = useState<Competition | ''>('')
  const [season, setSeason] = useState<number | undefined>(currentSeason())
  const [venue, setVenue] = useState<Venue>('all')
  const [onlyAttended, setOnlyAttended] = useState(false)

  const [matches, setMatches] = useState<Match[] | null>(null)
  const [tripByMatch, setTripByMatch] = useState<Record<string, string>>({})
  const [error, setError] = useState<string | null>(null)
  const [now] = useState(() => Date.now())

  useEffect(() => {
    const isHome = venue === 'all' ? null : venue === 'home'
    getMatches({ q, competition, season, isHome })
      .then((data) => {
        setMatches(data)
        setError(null)
      })
      .catch((e: Error) => setError(e.message))
  }, [q, competition, season, venue])

  // Zu welchem Spiel gibt es eine Fahrt? Damit verlinkt "Dabei" direkt auf die Fahrt.
  useEffect(() => {
    getTrips(season)
      .then((trips) => setTripByMatch(Object.fromEntries(trips.map((t) => [t.matchId, t.id]))))
      .catch(() => setTripByMatch({}))
  }, [season])

  async function handleDelete(match: Match) {
    try {
      await deleteMatch(match.id)
      setMatches((prev) => prev?.filter((m) => m.id !== match.id) ?? null)
      setError(null)
    } catch (e) {
      // 409: Zu dem Spiel gibt es noch Fahrten.
      setError(e instanceof ApiError ? e.message : 'Das Spiel konnte nicht gelöscht werden.')
    }
  }

  // Spielplan chronologisch, nach Monaten gruppiert
  const visible = (matches ?? [])
    .filter((m) => !onlyAttended || m.tripCount > 0)
    .sort((a, b) => a.kickOff.localeCompare(b.kickOff))

  const months: { label: string; matches: Match[] }[] = []
  for (const match of visible) {
    const label = formatMonth(match.kickOff)
    const last = months[months.length - 1]
    if (last?.label === label) last.matches.push(match)
    else months.push({ label, matches: [match] })
  }

  const firstUpcomingId = visible.find((m) => new Date(m.kickOff).getTime() > now)?.id
  const hasPlayed = visible.some((m) => new Date(m.kickOff).getTime() <= now)

  return (
    <div className={pageClass}>
      <PageHeader title="Spielplan">
        <Link to="/matches/new" className={primaryButton}>
          Spiel anlegen
        </Link>
      </PageHeader>

      <Flash />
      <ErrorBanner message={error} />

      <div className="mb-4 grid gap-3 md:grid-cols-[1fr_13rem_12rem]">
        <label>
          <span className="sr-only">Gegner suchen</span>
          <input
            type="search"
            className={inputClass}
            placeholder="Gegner suchen"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </label>
        <label>
          <span className="sr-only">Wettbewerb</span>
          <select
            className={inputClass}
            value={competition}
            onChange={(e) => setCompetition(e.target.value as Competition | '')}
          >
            <option value="">Alle Wettbewerbe</option>
            {Object.entries(competitionLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="sr-only">Saison</span>
          <select
            className={inputClass}
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
      </div>

      <div className="mb-10 flex flex-wrap items-center gap-x-6 gap-y-3">
        <Segmented name="venue" legend="Heim oder auswärts" options={venueOptions} value={venue} onChange={setVenue} />
        <label className="flex cursor-pointer items-center gap-2 font-semibold">
          <input
            type="checkbox"
            className="h-5 w-5 accent-black"
            checked={onlyAttended}
            onChange={(e) => setOnlyAttended(e.target.checked)}
          />
          Nur Spiele, bei denen ich war
        </label>
        {matches && <span className="text-black/60 md:ml-auto">{plural(visible.length, 'Spiel', 'Spiele')}</span>}
      </div>

      {!matches && !error && <Loading />}
      {matches && visible.length === 0 && (
        <p className="text-lg">Keine Spiele für diese Filter. Ändere die Suche oder leg ein Spiel an.</p>
      )}

      <div className="space-y-12">
        {months.map((month) => (
          <section key={month.label} aria-label={month.label}>
            <h2 className="mb-2 font-condensed text-3xl font-bold">{month.label}</h2>
            <ol>
              {month.matches.map((match) => (
                <Fragment key={match.id}>
                  {match.id === firstUpcomingId && hasPlayed && (
                    <li className="flex items-center gap-3 py-3" aria-label="Ab hier anstehende Spiele">
                      <span className="rounded-sm bg-schwarz px-2.5 py-1 text-sm font-semibold text-gelb">
                        Heute, {formatDay(new Date().toISOString())}
                      </span>
                      <span className="h-0.5 flex-1 bg-schwarz" />
                    </li>
                  )}
                  <MatchRow match={match} tripId={tripByMatch[match.id]} onDelete={() => handleDelete(match)} />
                </Fragment>
              ))}
            </ol>
          </section>
        ))}
      </div>
    </div>
  )
}

function MatchRow({ match, tripId, onDelete }: { match: Match; tripId?: string; onDelete: () => Promise<void> }) {
  return (
    <li className="grid grid-cols-[5.75rem_1fr] items-center gap-x-5 gap-y-3 border-t-2 border-black/15 py-4 md:grid-cols-[7rem_1fr_auto_auto]">
      <div>
        <p className="font-condensed text-2xl leading-none font-bold">{formatDay(match.kickOff)}</p>
        <p className="mt-1 text-sm text-black/60">{formatTime(match.kickOff)} Uhr</p>
      </div>

      <div className="min-w-0">
        <p className="text-xl leading-tight font-semibold"><StruckText source={fixtureLabel(match)} />
        </p>
        <p className="text-black/65">
          {match.venue}, {competitionLabels[match.competition]}
        </p>
      </div>

      <div className="col-start-2 md:col-start-auto">
        <ScorePlate {...match} size="sm" />
      </div>

      <div className="col-span-2 flex flex-wrap items-center gap-x-4 gap-y-2 md:col-span-1 md:w-[19rem] md:flex-nowrap md:justify-end">
        {tripId ? (
          <Link
            to={`/trips/${tripId}`}
            className="rounded-sm bg-schwarz px-2.5 py-1 text-sm font-semibold text-gelb hover:bg-neutral-800"
          >
            Dabei gewesen
          </Link>
        ) : (
          <Link to={`/trips/new?match=${match.id}`} className={`${textLink} text-sm`}>
            Fahrt eintragen
          </Link>
        )}
        <Link to={`/matches/${match.id}/edit`} className={`${textLink} text-sm`}>
          Bearbeiten
        </Link>
        <ConfirmButton label="Löschen" confirmLabel="Wirklich löschen?" onConfirm={onDelete} />
      </div>
    </li>
  )
}





