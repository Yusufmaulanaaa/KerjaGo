import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import FindJobsPage from './pages/FindJobsPage'
import JobAlertsPage from './pages/JobAlertsPage'
import FindCandidatesPage from './pages/FindCandidatesPage'
import CareerNotesPage from './pages/CareerNotesPage'
import CareerNoteDetailPage from './pages/CareerNoteDetailPage'
import ProfilePage from './pages/ProfilePage'
import SPKRekomendasiPage from './pages/SPKRekomendasiPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/find-jobs" element={<FindJobsPage />} />
      <Route path="/job-alerts" element={<JobAlertsPage />} />
      <Route path="/find-candidates" element={<FindCandidatesPage />} />
      <Route path="/career-notes" element={<CareerNotesPage />} />
      <Route path="/career-notes/:slug" element={<CareerNoteDetailPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/spk-rekomendasi" element={<SPKRekomendasiPage />} />
    </Routes>
  )
}

export default App
