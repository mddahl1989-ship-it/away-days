import { useState } from 'react'
import { Link } from 'react-router'
import { competitionLabels, fixtureLabel, formatDay, formatTime } from '../lib/format'
import type { Match } from '../types/api'
import FlapText from './FlapText'

// Die Anzeigetafel auf der Übersicht: die nächsten Spiele wie auf einer Abfahrtstafel.
export default function DepartureBoard({ matches, error }: { matches: Match[] | null; error: string | null }) {
  const [today] = useState(() => formatDay(new Date().toISOString()))

  return (
    <section className="led-panel overflow-hidden" aria-labelledby="board-title">
      <div className="flex flex-wrap items-baseline justify-between gap-2 px-5 pt-5 pb-3 md:px-7">
        <h2 id="board-title" className="led text-xl md:text-2xl">
          Nächste Spiele
        </h2>
        <p className="text-sm text-white/55">Stand {today}</p>
      </div>

      <div className="hidden grid-cols-[8.5rem_5rem_1fr_11rem] gap-4 border-t border-white/10 px-7 py-2 text-sm text-white/45 md:grid">
        <span>Datum</span>
        <span>Anstoß</span>
        <span>Paarung</span>
        <span>Wettbewerb</span>
      </div>

      {error && <p className="border-t border-white/10 px-7 py-6 text-white/80">{error}</p>}

      {!error && matches === null && <p className="led-dim border-t border-white/10 px-7 py-6 text-xl">Lädt …</p>}

      {matches?.length === 0 && (
        <p className="border-t border-white/10 px-5 py-6 text-white/80 md:px-7">
          Kein Spiel angesetzt.{' '}
          <Link to="/matches/new" className="font-semibold text-gelb underline underline-offset-4">
            Nächstes Spiel eintragen
          </Link>
        </p>
      )}

      {matches && matches.length > 0 && (
        <ol>
          {matches.map((match, row) => {
            const delay = 150 + row * 140
            return (
              <li
                key={match.id}
                className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 border-t border-white/10 px-5 py-4 md:grid-cols-[8.5rem_5rem_1fr_11rem] md:items-center md:gap-4 md:px-7"
              >
                <span className="led text-lg md:text-[1.4rem]">
                  <FlapText text={formatDay(match.kickOff)} delay={delay} />
                </span>
                <span className="led text-lg md:text-[1.4rem]">
                  <FlapText text={formatTime(match.kickOff)} delay={delay + 60} />
                </span>
                <span className="led col-span-2 text-xl md:col-span-1 md:text-[1.4rem]">
                  <FlapText text={fixtureLabel(match)} delay={delay + 120} />
                </span>
                <span className="led-dim col-span-2 text-base md:col-span-1 md:text-lg">
                  {competitionLabels[match.competition]}
                </span>
              </li>
            )
          })}
        </ol>
      )}
    </section>
  )
}
