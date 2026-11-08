import type { Competition, Match, MatchInput } from '../types/api'
import { apiFetch } from './client'

export interface MatchFilter {
  q?: string
  competition?: Competition | ''
  season?: number
  isHome?: boolean | null
}

export function getMatches(filter: MatchFilter = {}): Promise<Match[]> {
  const params = new URLSearchParams()
  if (filter.q) params.set('q', filter.q)
  if (filter.competition) params.set('competition', filter.competition)
  if (filter.season) params.set('season', String(filter.season))
  if (filter.isHome !== undefined && filter.isHome !== null) params.set('isHome', String(filter.isHome))

  const query = params.toString()
  return apiFetch<Match[]>(`/api/matches${query ? `?${query}` : ''}`)
}

export function getMatch(id: string): Promise<Match> {
  return apiFetch<Match>(`/api/matches/${id}`)
}

export function createMatch(input: MatchInput): Promise<Match> {
  return apiFetch<Match>('/api/matches', { method: 'POST', body: JSON.stringify(input) })
}

export function updateMatch(id: string, input: MatchInput): Promise<Match> {
  return apiFetch<Match>(`/api/matches/${id}`, { method: 'PUT', body: JSON.stringify(input) })
}

export function deleteMatch(id: string): Promise<void> {
  return apiFetch<void>(`/api/matches/${id}`, { method: 'DELETE' })
}
