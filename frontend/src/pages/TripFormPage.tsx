import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router'
import { ApiError } from '../api/client'
import { createTrip, getTrip, updateTrip } from '../api/trips'
import MatchSelect from '../components/MatchSelect'
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
import { categoryLabels, formatEuro, parseAmount, travelModeLabels } from '../lib/format'
import type { ExpenseCategory, TravelMode, TripInput } from '../types/api'

interface ExpenseRow {
  key: number
  category: ExpenseCategory
  description: string
  amount: string
}

let nextKey = 1
const newRow = (category: ExpenseCategory): ExpenseRow => ({ key: nextKey++, category, description: '', amount: '' })

// Beispiel im leeren Feld, passend zur gewählten Kategorie
const examples: Record<ExpenseCategory, string> = {
  Tickets: 'z. B. Stehplatz Gästeblock',
  Travel: 'z. B. Sprit oder Zugticket',
  Food: 'z. B. Wurst und Bier',
  Accommodation: 'z. B. Hostel, eine Nacht',
  Other: 'z. B. Schal',
}

// /trips/new legt eine Fahrt mit Ausgaben an, /trips/:id/edit ändert nur die Fahrtdaten.
export default function TripFormPage() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [matchId, setMatchId] = useState(searchParams.get('match') ?? '')
  const [travelMode, setTravelMode] = useState<TravelMode>('Car')
  const [distanceKm, setDistanceKm] = useState('')
  const [friends, setFriends] = useState('0')
  const [notes, setNotes] = useState('')
  const [expenses, setExpenses] = useState<ExpenseRow[]>(() => [newRow('Tickets'), newRow('Travel')])

  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})

  useEffect(() => {
    if (!id) return
    getTrip(id)
      .then((trip) => {
        setMatchId(trip.match.id)
        setTravelMode(trip.travelMode)
        setDistanceKm(String(trip.distanceKm))
        setFriends(String(trip.friends))
        setNotes(trip.notes ?? '')
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false))
  }, [id])

  function updateExpense(key: number, changes: Partial<ExpenseRow>) {
    setExpenses((rows) => rows.map((row) => (row.key === key ? { ...row, ...changes } : row)))
  }

  const sum = expenses.reduce((total, row) => total + (parseAmount(row.amount) || 0), 0)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setSaving(true)
    setError(null)
    setFieldErrors({})

    const input: TripInput = {
      matchId: matchId || null,
      travelMode,
      distanceKm: Number(distanceKm) || 0,
      friends: Number(friends) || 0,
      notes: notes.trim() || null,
    }

    try {
      if (id) {
        await updateTrip(id, input)
        navigate(`/trips/${id}`, { state: { flash: 'Änderungen gespeichert.' } })
      } else {
        const trip = await createTrip({
          ...input,
          // Leere Zeilen werden nicht mitgeschickt
          expenses: expenses
            .filter((row) => row.description.trim() !== '' || row.amount.trim() !== '')
            .map((row) => ({
              category: row.category,
              description: row.description,
              amount: parseAmount(row.amount) || 0,
            })),
        })
        navigate(`/trips/${trip.id}`, { state: { flash: 'Fahrt eingetragen.' } })
      }
    } catch (e) {
      if (e instanceof ApiError) {
        setError(e.message)
        setFieldErrors(e.fieldErrors)
      } else {
        setError('Die Fahrt konnte nicht gespeichert werden.')
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

  // Index der mitgeschickten Zeilen, damit Fehler wie "expenses[1].amount" an der richtigen Zeile landen
  const sentIndex = new Map<number, number>()
  expenses
    .filter((row) => row.description.trim() !== '' || row.amount.trim() !== '')
    .forEach((row, i) => sentIndex.set(row.key, i))

  return (
    <div className={pageClass}>
      <PageHeader title={isEdit ? 'Fahrt bearbeiten' : 'Fahrt eintragen'} />
      <ErrorBanner message={error} />

      <form onSubmit={handleSubmit} className="max-w-3xl space-y-7" noValidate>
        <Field label="Spiel" error={fieldErrors.matchId}>
          <MatchSelect value={matchId} onChange={setMatchId} />
        </Field>

        <div className="grid gap-6 md:grid-cols-3">
          <Field label="Anreise" error={fieldErrors.travelMode}>
            <select className={inputClass} value={travelMode} onChange={(e) => setTravelMode(e.target.value as TravelMode)}>
              {Object.entries(travelModeLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Kilometer" hint="Hin und zurück" error={fieldErrors.distanceKm}>
            <input
              type="number"
              inputMode="numeric"
              min={0}
              className={inputClass}
              value={distanceKm}
              onChange={(e) => setDistanceKm(e.target.value)}
            />
          </Field>
          <Field label="Mitfahrer" error={fieldErrors.friends}>
            <input
              type="number"
              inputMode="numeric"
              min={0}
              className={inputClass}
              value={friends}
              onChange={(e) => setFriends(e.target.value)}
            />
          </Field>
        </div>

        <Field label="Notizen" error={fieldErrors.notes}>
          <textarea
            className={inputClass}
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Was von der Fahrt hängen bleiben soll"
          />
        </Field>

        {!isEdit && (
          <fieldset className="border-t-2 border-schwarz pt-6">
            <legend className="sr-only">Ausgaben</legend>
            <div className="mb-4 flex items-baseline justify-between gap-4">
              <h2 className="font-condensed text-3xl font-bold">Ausgaben</h2>
              <p className="font-condensed text-2xl font-bold tabular-nums">{formatEuro(sum)}</p>
            </div>

            <ul className="space-y-3">
              {expenses.map((row) => {
                const index = sentIndex.get(row.key)
                const errors = (field: string) =>
                  index === undefined ? undefined : fieldErrors[`expenses[${index}].${field}`]
                return (
                  <li key={row.key} className="grid items-start gap-2 md:grid-cols-[12rem_1fr_8rem_auto]">
                    <label>
                      <span className="sr-only">Kategorie</span>
                      <select
                        className={inputClass}
                        value={row.category}
                        onChange={(e) => updateExpense(row.key, { category: e.target.value as ExpenseCategory })}
                      >
                        {Object.entries(categoryLabels).map(([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label>
                      <span className="sr-only">Beschreibung</span>
                      <input
                        className={inputClass}
                        placeholder={examples[row.category]}
                        value={row.description}
                        onChange={(e) => updateExpense(row.key, { description: e.target.value })}
                      />
                      <FieldErrors errors={errors('description')} />
                    </label>
                    <label>
                      <span className="sr-only">Betrag in Euro</span>
                      <input
                        className={`${inputClass} text-right tabular-nums`}
                        placeholder="0,00 €"
                        inputMode="decimal"
                        value={row.amount}
                        onChange={(e) => updateExpense(row.key, { amount: e.target.value })}
                      />
                      <FieldErrors errors={errors('amount')} />
                    </label>
                    <button
                      type="button"
                      className="rounded-sm px-3 py-2.5 font-semibold text-rot hover:bg-rot/10"
                      onClick={() => setExpenses((rows) => rows.filter((r) => r.key !== row.key))}
                      aria-label="Zeile entfernen"
                    >
                      Entfernen
                    </button>
                  </li>
                )
              })}
            </ul>

            <button
              type="button"
              className={`${secondaryButton} mt-4`}
              onClick={() => setExpenses((rows) => [...rows, newRow('Food')])}
            >
              Weitere Ausgabe
            </button>
          </fieldset>
        )}

        <div className="flex flex-wrap gap-3 border-t-2 border-schwarz pt-6">
          <button type="submit" className={primaryButton} disabled={saving}>
            {saving ? 'Wird gespeichert …' : isEdit ? 'Änderungen speichern' : 'Fahrt eintragen'}
          </button>
          <Link to={id ? `/trips/${id}` : '/trips'} className={secondaryButton}>
            Abbrechen
          </Link>
        </div>
      </form>
    </div>
  )
}
