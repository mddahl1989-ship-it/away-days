import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { getMatches } from '../api/matches'
import { getSeasonReport } from '../api/reports'
import DepartureBoard from '../components/DepartureBoard'
import ScorePlate from '../components/ScorePlate'
import StruckText from '../components/StruckText'
import { ErrorBanner, Loading, PageHeader, SectionTitle, inputClass, pageClass, textLink } from '../components/ui'
import {
  categoryLabels,
  currentSeason,
  formatEuro,
  formatNumber,
  formatShortDate,
  plural,
  recentSeasons,
  seasonLabel,
} from '../lib/format'
import type { Match, SeasonReport } from '../types/api'

function recordSentence(report: SeasonReport): string {
  const games = report.wins + report.draws + report.losses
  const losses = report.losses === 0 ? 'keine Niederlage' : plural(report.losses, 'Niederlage', 'Niederlagen')
  return `${plural(games, 'Spiel', 'Spiele')} live im Stadion: ${plural(report.wins, 'Sieg', 'Siege')}, ${formatNumber(
    report.draws,
  )} Unentschieden, ${losses}.`
}

export default function OverviewPage() {
  const [season, setSeason] = useState(currentSeason())
  const [report, setReport] = useState<SeasonReport | null>(null)
  const [upcoming, setUpcoming] = useState<Match[] | null>(null)
  const [boardError, setBoardError] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Die nächsten vier Spiele für die Anzeigetafel
  useEffect(() => {
    getMatches({ season: currentSeason() })
      .then((matches) => {
        const now = Date.now()
        const next = matches
          .filter((m) => new Date(m.kickOff).getTime() > now)
          .sort((a, b) => a.kickOff.localeCompare(b.kickOff))
          .slice(0, 4)
        setUpcoming(next)
      })
      .catch((e: Error) => setBoardError(e.message))
  }, [])

  useEffect(() => {
    getSeasonReport(season)
      .then((data) => {
        setReport(data)
        setError(null)
      })
      .catch((e: Error) => setError(e.message))
  }, [season])

  const maxCategory = Math.max(1, ...(report?.costsByCategory.map((c) => c.total) ?? []))

  return (
    <>
      <div className="on-black bg-schwarz pt-2 pb-12 md:pb-16">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <DepartureBoard matches={upcoming} error={boardError} />
        </div>
      </div>

      <div className={pageClass}>
        <ErrorBanner message={error} />

        <PageHeader title={`Saison ${seasonLabel(season)}`}>
          <label>
            <span className="sr-only">Saison wählen</span>
            <select className={`${inputClass} w-auto`} value={season} onChange={(e) => setSeason(Number(e.target.value))}>
              {recentSeasons().map((s) => (
                <option key={s} value={s}>
                  Saison {seasonLabel(s)}
                </option>
              ))}
            </select>
          </label>
        </PageHeader>

        {!report && !error && <Loading />}

        {report && (
          <div className="space-y-16">
            <section aria-labelledby="record-title">
              <SectionTitle id="record-title">Bilanz im Stadion</SectionTitle>

              {report.attendedMatches.length === 0 ? (
                <p className="max-w-[60ch] text-xl">
                  In dieser Saison noch kein Spiel im Stadion.{' '}
                  <Link to="/trips/new" className={textLink}>
                    Fahrt eintragen
                  </Link>
                </p>
              ) : (
                <>
                  <p className="max-w-[60ch] text-xl leading-snug md:text-2xl">{recordSentence(report)}</p>

                  <ol className="mt-8 grid grid-cols-[repeat(auto-fill,minmax(6.5rem,1fr))] gap-x-4 gap-y-7" aria-label="Spiele im Stadion, ältestes zuerst">
                    {report.attendedMatches.map((m) => (
                      <li key={m.matchId}>
                        <Link to={`/trips/${m.tripId}`} className="group block rounded-sm">
                          <ScorePlate {...m} size="md" />
                          <span className="mt-2 block leading-tight font-semibold hyphens-auto [overflow-wrap:anywhere] group-hover:underline"><StruckText source={m.opponent} />
                          </span>
                          <span className="text-sm text-black/60">
                            {formatShortDate(m.kickOff)}, {m.isHome ? 'Heim' : 'Auswärts'}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ol>
                  <p className="mt-6 text-sm text-black/60">
                    Ziffern gelb bei einem Sieg, weiß bei einem Unentschieden, rot bei einer Niederlage.
                  </p>
                </>
              )}
            </section>

            <section aria-labelledby="numbers-title">
              <SectionTitle id="numbers-title">Die Saison in Zahlen</SectionTitle>
              <dl className="grid grid-cols-2 border-y-2 border-schwarz md:grid-cols-4">
                {[
                  { label: 'Fahrten', value: formatNumber(report.tripCount) },
                  { label: 'Kilometer', value: formatNumber(report.totalDistanceKm) },
                  { label: 'Ausgaben', value: formatEuro(report.totalCost) },
                  {
                    label: 'Pro Fahrt',
                    value: report.tripCount ? formatEuro(report.totalCost / report.tripCount) : '–',
                  },
                ].map((item, i) => (
                  <div
                    key={item.label}
                    className={`py-5 pr-4 ${i % 2 === 1 ? 'border-l-2 border-schwarz pl-4' : ''} ${
                      i >= 2 ? 'border-t-2 border-schwarz md:border-t-0' : ''
                    } ${i === 2 ? 'md:border-l-2 md:pl-4' : ''}`}
                  >
                    <dt className="font-semibold text-black/70">{item.label}</dt>
                    <dd className="mt-1 font-condensed text-4xl leading-none font-extrabold md:text-6xl">{item.value}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <section aria-labelledby="costs-title">
              <SectionTitle id="costs-title">Wofür das Geld draufging</SectionTitle>
              {report.costsByCategory.length === 0 ? (
                <p className="text-lg">Noch keine Ausgaben in dieser Saison.</p>
              ) : (
                <ul className="max-w-3xl space-y-4">
                  {report.costsByCategory.map((c) => (
                    <li key={c.category} className="grid grid-cols-[1fr_auto] items-baseline gap-x-4 gap-y-1.5">
                      <span className="font-semibold">{categoryLabels[c.category]}</span>
                      <span className="font-condensed text-2xl font-bold tabular-nums">{formatEuro(c.total)}</span>
                      <span className="col-span-2 block h-3.5 bg-black/12">
                        <span className="block h-full bg-schwarz" style={{ width: `${(c.total / maxCategory) * 100}%` }} />
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        )}
      </div>
    </>
  )
}
