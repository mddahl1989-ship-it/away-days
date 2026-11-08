import type { CreateTripInput, Expense, ExpenseInput, TripDetail, TripInput, TripSummary } from '../types/api'
import { apiFetch } from './client'

export function getTrips(season?: number): Promise<TripSummary[]> {
  return apiFetch<TripSummary[]>(`/api/trips${season ? `?season=${season}` : ''}`)
}

export function getTrip(id: string): Promise<TripDetail> {
  return apiFetch<TripDetail>(`/api/trips/${id}`)
}

export function createTrip(input: CreateTripInput): Promise<TripDetail> {
  return apiFetch<TripDetail>('/api/trips', { method: 'POST', body: JSON.stringify(input) })
}

export function updateTrip(id: string, input: TripInput): Promise<TripDetail> {
  return apiFetch<TripDetail>(`/api/trips/${id}`, { method: 'PUT', body: JSON.stringify(input) })
}

export function deleteTrip(id: string): Promise<void> {
  return apiFetch<void>(`/api/trips/${id}`, { method: 'DELETE' })
}

export function addExpense(tripId: string, input: ExpenseInput): Promise<Expense> {
  return apiFetch<Expense>(`/api/trips/${tripId}/expenses`, { method: 'POST', body: JSON.stringify(input) })
}

export function deleteExpense(tripId: string, expenseId: string): Promise<void> {
  return apiFetch<void>(`/api/trips/${tripId}/expenses/${expenseId}`, { method: 'DELETE' })
}
