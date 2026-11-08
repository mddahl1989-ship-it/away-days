import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { ApiError } from '../api/client'
import { addExpense, deleteExpense, deleteTrip, getTrip } from '../api/trips'
import ConfirmButton from '../components/ConfirmButton'
import TripTicket from '../components/TripTicket'
import { ErrorBanner, FieldErrors, Flash, Loading, inputClass, pageClass, primaryButton, secondaryButton, textLink } from '../components/ui'
import { categoryLabels, formatDateLong, formatEuro, parseAmount } from '../lib/format'
import type { ExpenseCategory, TripDetail } from '../types/api'

export default function TripDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [trip, setTrip] = useState<TripDetail | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Neue Ausgabe
  const [category, setCategory] = useState<ExpenseCategory>('Food')
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})

  const load = useCallback(() => {
    if (!id) return
    getTrip(id)
      .then(setTrip)
      .catch((e: Error) => setError(e.message))
  }, [id])

  useEffect(load, [load])

  async function handleAddExpense(event: FormEvent) {
    event.preventDefault()
    if (!id) return
    setFieldErrors({})
    try {
      await addExpense(id, { category, description, amount: parseAmount(amount) || 0 })
      setDescription('')
      setAmount('')
      load()
    } catch (e) {
      if (e instanceof ApiError) setFieldErrors(e.fieldErrors)
      else setError('Die Ausgabe konnte nicht gespeichert werden.')
    }
  }

  async function handleDeleteExpense(expenseId: string) {
    if (!id) return
    await deleteExpense(id, expenseId)
    load()
  }

  async function handleDeleteTrip() {
    if (!id) return
    await deleteTrip(id)
    navigate('/trips', { state: { flash: 'Fahrt gelöscht.' } })
  }

  if (error) {
    return (
      <div className={pageClass}>
        <ErrorBanner message={error} />
        <Link to="/trips" className={textLink}>
          Zum Fahrtenbuch
        </Link>
      </div>
    )
  }

  if (!trip) {
    return (
      <div className={pageClass}>
        <Loading />
      </div>
    )
  }

  const ticket = { ...trip.match, ...trip, expenseCount: trip.expenses.length }

  return (
    <div className={pageClass}>
      <Link to="/trips" className={`${textLink} mb-6 inline-block`}>
        Zum Fahrtenbuch
      </Link>

      <Flash />

      <TripTicket trip={ticket} large />
      <p className="mt-3 text-black/65">Anstoß {formatDateLong(trip.match.kickOff)}</p>

      <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_20rem]">
        <section aria-labelledby="expenses-title">
          <h2 id="expenses-title" className="mb-4 font-condensed text-3xl font-bold md:text-4xl">
            Ausgaben
          </h2>

          {trip.expenses.length === 0 ? (
            <p className="mb-6 text-lg">Noch keine Ausgaben eingetragen.</p>
          ) : (
            <table className="mb-8 w-full text-left">
              <caption className="sr-only">Ausgaben dieser Fahrt</caption>
              <thead className="sr-only">
                <tr>
                  <th scope="col" className="hidden sm:table-cell">Kategorie</th>
                  <th scope="col">Beschreibung</th>
                  <th scope="col">Betrag</th>
                  <th scope="col">Aktion</th>
                </tr>
              </thead>
              <tbody>
                {trip.expenses.map((e) => (
                  <tr key={e.id} className="border-t-2 border-black/15">
                    <td className="hidden w-40 py-3 pr-4 align-top text-black/65 sm:table-cell">{categoryLabels[e.category]}</td>
                    <td className="py-3 pr-4 align-top font-medium">
                      <span className="block text-sm font-normal text-black/60 sm:hidden">{categoryLabels[e.category]}</span>
                      {e.description}
                    </td>
                    <td className="py-3 pr-2 text-right align-top font-semibold tabular-nums">{formatEuro(e.amount)}</td>
                    <td className="w-24 py-2 text-right align-top sm:w-32">
                      <ConfirmButton label="Entfernen" confirmLabel="Sicher?" onConfirm={() => handleDeleteExpense(e.id)} />
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-[3px] border-schwarz">
                  <th scope="row" className="hidden sm:table-cell" />
                  <th scope="row" className="py-3 text-left font-condensed text-2xl font-bold">
                    Summe
                  </th>
                  <td className="py-3 pr-2 text-right font-condensed text-2xl font-bold tabular-nums">
                    {formatEuro(trip.totalCost)}
                  </td>
                  <td />
                </tr>
              </tfoot>
            </table>
          )}

          <form onSubmit={handleAddExpense} className="grid items-start gap-2 md:grid-cols-[11rem_1fr_7.5rem_auto]" noValidate>
            <label>
              <span className="sr-only">Kategorie</span>
              <select className={inputClass} value={category} onChange={(e) => setCategory(e.target.value as ExpenseCategory)}>
                {Object.entries(categoryLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span className="sr-only">Beschreibung</span>
              <input className={inputClass} placeholder="Wofür?" value={description} onChange={(e) => setDescription(e.target.value)} />
              <FieldErrors errors={fieldErrors.description} />
            </label>
            <label>
              <span className="sr-only">Betrag in Euro</span>
              <input
                className={`${inputClass} text-right tabular-nums`}
                placeholder="0,00 €"
                inputMode="decimal"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <FieldErrors errors={fieldErrors.amount} />
            </label>
            <button type="submit" className={primaryButton}>
              Hinzufügen
            </button>
          </form>
        </section>

        <aside className="space-y-8">
          <section aria-labelledby="notes-title">
            <h2 id="notes-title" className="mb-3 font-condensed text-3xl font-bold">
              Notizen
            </h2>
            {trip.notes ? (
              <p className="max-w-[45ch] text-lg leading-relaxed">{trip.notes}</p>
            ) : (
              <p className="text-black/60">Keine Notizen.</p>
            )}
          </section>

          <div className="flex flex-wrap items-center gap-3 border-t-2 border-schwarz pt-6">
            <Link to={`/trips/${trip.id}/edit`} className={secondaryButton}>
              Fahrt bearbeiten
            </Link>
            <ConfirmButton label="Fahrt löschen" confirmLabel="Fahrt wirklich löschen?" onConfirm={handleDeleteTrip} />
          </div>
        </aside>
      </div>
    </div>
  )
}
