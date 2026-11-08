import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { ApiError } from '../api/client'
import { createMatch, getMatch, updateMatch } from '../api/matches'
import Segmented from '../components/Segmented'
import {
  ErrorBanner,
  Field,
  FieldErrors,
  Loading,
  PageHeader,
  inputClass,
  pageClass,
  primaryButton,
  secondaryButton,
} from '../components/ui'
import { competitionLabels, toDateTimeLocal } from '../lib/format'
import type { Competition, MatchInput } from '../types/api'

const HOME_GROUND = 'Westfalenstadion'

type Place = 'home' | 'away'

interface FormState {
  kickOff: string
  opponent: string
  venue: string
  competition: Competition
  place: Place
  goalsBvB: string
  goalsOpponent: string
}

const emptyForm: FormState = {
  kickOff: '',
  opponent: '',
  venue: HOME_GROUND,
  competition: 'Bundesliga',
  place: 'home',
  goalsBvB: '',
  goalsOpponent: '',
}

// Ein Formular für beides: /matches/new (anlegen) und /matches/:id/edit (bearbeiten)
export default function MatchFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [form, setForm] = useState<FormState>(emptyForm)
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})

  useEffect(() => {
    if (!id) return
    getMatch(id)
      .then((m) =>
        setForm({
          kickOff: toDateTimeLocal(m.kickOff),
          opponent: m.opponent,
          venue: m.venue,
          competition: m.competition,
          place: m.isHome ? 'home' : 'away',
          goalsBvB: m.goalsBvB?.toString() ?? '',
          goalsOpponent: m.goalsOpponent?.toString() ?? '',
        }),
      )
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false))
  }, [id])

  function changePlace(place: Place) {
    // Bei Heimspielen das Stadion vorschlagen, bei Auswärtsspielen das Feld frei machen
    setForm((prev) => ({
      ...prev,
      place,
      venue: place === 'home' && prev.venue === '' ? HOME_GROUND : place === 'away' && prev.venue === HOME_GROUND ? '' : prev.venue,
    }))
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setSaving(true)
    setError(null)
    setFieldErrors({})

    const input: MatchInput = {
      // datetime-local hat keine Zeitzone: als lokale Zeit lesen und als ISO-Zeitpunkt schicken
      kickOff: form.kickOff ? new Date(form.kickOff).toISOString() : null,
      opponent: form.opponent.trim(),
      venue: form.venue.trim(),
      competition: form.competition,
      isHome: form.place === 'home',
      goalsBvB: form.goalsBvB === '' ? null : Number(form.goalsBvB),
      goalsOpponent: form.goalsOpponent === '' ? null : Number(form.goalsOpponent),
    }

    try {
      if (id) {
        await updateMatch(id, input)
        navigate('/matches', { state: { flash: 'Änderungen gespeichert.' } })
      } else {
        await createMatch(input)
        navigate('/matches', { state: { flash: 'Spiel angelegt.' } })
      }
    } catch (e) {
      if (e instanceof ApiError) {
        setError(e.message)
        setFieldErrors(e.fieldErrors)
      } else {
        setError('Das Spiel konnte nicht gespeichert werden.')
      }
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className={pageClass}>
        <Loading />
      </div>
    )
  }

  return (
    <div className={pageClass}>
      <PageHeader title={isEdit ? 'Spiel bearbeiten' : 'Spiel anlegen'} />
      <ErrorBanner message={error} />

      <form onSubmit={handleSubmit} className="max-w-3xl space-y-7" noValidate>
        <div className="grid gap-6 md:grid-cols-2">
          <Field label="Anstoß" error={fieldErrors.kickOff}>
            <input
              type="datetime-local"
              className={inputClass}
              value={form.kickOff}
              onChange={(e) => setForm({ ...form, kickOff: e.target.value })}
            />
          </Field>

          <Field label="Wettbewerb" error={fieldErrors.competition}>
            <select
              className={inputClass}
              value={form.competition}
              onChange={(e) => setForm({ ...form, competition: e.target.value as Competition })}
            >
              {Object.entries(competitionLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <div>
          <span className="mb-1.5 block font-semibold">Spielort</span>
          <Segmented
            name="place"
            legend="Spielort"
            value={form.place}
            onChange={changePlace}
            options={[
              { value: 'home', label: 'Heimspiel' },
              { value: 'away', label: 'Auswärtsspiel' },
            ]}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Field label="Gegner" error={fieldErrors.opponent}>
            <input
              className={inputClass}
              value={form.opponent}
              onChange={(e) => setForm({ ...form, opponent: e.target.value })}
              placeholder="z. B. FC Schalke 04"
            />
          </Field>

          <Field label="Stadion" error={fieldErrors.venue}>
            <input
              className={inputClass}
              value={form.venue}
              onChange={(e) => setForm({ ...form, venue: e.target.value })}
              placeholder="z. B. Veltins-Arena"
            />
          </Field>
        </div>

        <fieldset>
          <legend className="mb-1.5 font-semibold">Ergebnis</legend>
          <div className="flex items-center gap-3">
            <label className="w-24">
              <span className="mb-1 block text-sm text-black/65">BVB</span>
              <input
                type="number"
                inputMode="numeric"
                min={0}
                max={20}
                className={`${inputClass} text-center font-condensed text-2xl font-bold`}
                value={form.goalsBvB}
                onChange={(e) => setForm({ ...form, goalsBvB: e.target.value })}
              />
            </label>
            <span className="mt-6 font-condensed text-3xl font-bold" aria-hidden="true">
              :
            </span>
            <label className="w-24">
              <span className="mb-1 block text-sm text-black/65">Gegner</span>
              <input
                type="number"
                inputMode="numeric"
                min={0}
                max={20}
                className={`${inputClass} text-center font-condensed text-2xl font-bold`}
                value={form.goalsOpponent}
                onChange={(e) => setForm({ ...form, goalsOpponent: e.target.value })}
              />
            </label>
          </div>
          <span className="mt-1.5 block text-sm text-black/60">Leer lassen, solange das Spiel nicht gespielt ist.</span>
          <FieldErrors errors={fieldErrors.goalsBvB} />
          <FieldErrors errors={fieldErrors.goalsOpponent} />
        </fieldset>

        <div className="flex flex-wrap gap-3 border-t-2 border-schwarz pt-6">
          <button type="submit" className={primaryButton} disabled={saving}>
            {saving ? 'Wird gespeichert …' : isEdit ? 'Änderungen speichern' : 'Spiel anlegen'}
          </button>
          <Link to="/matches" className={secondaryButton}>
            Abbrechen
          </Link>
        </div>
      </form>
    </div>
  )
}
