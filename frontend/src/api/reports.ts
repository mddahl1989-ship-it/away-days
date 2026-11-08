import type { SeasonReport } from '../types/api'
import { apiFetch } from './client'

export function getSeasonReport(season: number): Promise<SeasonReport> {
  return apiFetch<SeasonReport>(`/api/reports/season?season=${season}`)
}
