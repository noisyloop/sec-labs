import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Sidebar from './components/Sidebar.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Domain from './pages/Domain.jsx'
import Exercise from './pages/Exercise.jsx'
import Exam from './pages/Exam.jsx'
import Settings from './pages/Settings.jsx'

// Scroll to top whenever the route changes.
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <div className="min-h-screen bg-base">
      <ScrollToTop />
      <Sidebar />
      <main className="md:pl-64">
        <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-10">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/domain/:id" element={<Domain />} />
            <Route path="/exercise/:domainId/:exerciseId" element={<Exercise />} />
            <Route path="/exam" element={<Exam />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  )
}
