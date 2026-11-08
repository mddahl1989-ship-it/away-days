// Diese Typen spiegeln die DTOs der API wider.

export type Competition = 'Bundesliga' | 'DfbPokal' | 'ChampionsLeague' | 'Other'
export type TravelMode = 'Car' | 'Train' | 'Plane' | 'Bus' | 'Other'
export type ExpenseCategory = 'Travel' | 'Accommodation' | 'Food' | 'Tickets' | 'Other'

export interface Match {
  id: string
  kickOff: string
  opponent: string
  venue: string
  competition: Competition
  isHome: boolean
  goalsBvB: number | null
  goalsOpponent: number | null
  tripCount: number
}

export interface MatchInput {
  kickOff: string | null
  opponent: string
  venue: string
  competition: Competition
  isHome: boolean
  goalsBvB: number | null
  goalsOpponent: number | null
}

export interface Expense {
  id: string
  category: ExpenseCategory
  description: string
  amount: number
}

export interface ExpenseInput {
  category: ExpenseCategory
  description: string
  amount: number
}

export interface TripSummary {
  id: string
  matchId: string
  opponent: string
  venue: string
  competition: Competition
  kickOff: string
  isHome: boolean
  goalsBvB: number | null
  goalsOpponent: number | null
  travelMode: TravelMode
  distanceKm: number
  friends: number
  expenseCount: number
  totalCost: number
}

export interface TripDetail {
  id: string
  match: Match
  travelMode: TravelMode
  distanceKm: number
  friends: number
  notes: string | null
  createdAt: string
  expenses: Expense[]
  totalCost: number
}

export interface TripInput {
  matchId: string | null
  travelMode: TravelMode
  distanceKm: number
  friends: number
  notes: string | null
}

export interface CreateTripInput extends TripInput {
  expenses: ExpenseInput[]
}

export interface CategoryTotal {
  category: ExpenseCategory
  total: number
}

export interface AttendedMatch {
  matchId: string
  tripId: string
  kickOff: string
  opponent: string
  isHome: boolean
  competition: Competition
  goalsBvB: number | null
  goalsOpponent: number | null
}

export interface SeasonReport {
  season: number
  tripCount: number
  totalDistanceKm: number
  totalCost: number
  wins: number
  draws: number
  losses: number
  costsByCategory: CategoryTotal[]
  attendedMatches: AttendedMatch[]
}
