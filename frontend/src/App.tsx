import { Route, Routes } from 'react-router'
import Layout from './components/Layout'
import MatchFormPage from './pages/MatchFormPage'
import MatchesPage from './pages/MatchesPage'
import NotFoundPage from './pages/NotFoundPage'
import OverviewPage from './pages/OverviewPage'
import TripDetailPage from './pages/TripDetailPage'
import TripFormPage from './pages/TripFormPage'
import TripsPage from './pages/TripsPage'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<OverviewPage />} />
        <Route path="matches" element={<MatchesPage />} />
        <Route path="matches/new" element={<MatchFormPage />} />
        <Route path="matches/:id/edit" element={<MatchFormPage />} />
        <Route path="trips" element={<TripsPage />} />
        <Route path="trips/new" element={<TripFormPage />} />
        <Route path="trips/:id" element={<TripDetailPage />} />
        <Route path="trips/:id/edit" element={<TripFormPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
