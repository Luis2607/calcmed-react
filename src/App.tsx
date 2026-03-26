import { Routes, Route, Navigate } from 'react-router-dom'
import EntradaPage from './pages/EntradaPage'
import EmailPage from './pages/EmailPage'
import SenhaPage from './pages/SenhaPage'
import RecuperarPage from './pages/RecuperarPage'
import Onboarding1Page from './pages/Onboarding1Page'
import Onboarding2Page from './pages/Onboarding2Page'
import HomePage from './pages/HomePage'

export default function App() {
  return (
    <div className="mobile-page">
      <Routes>
        <Route path="/" element={<EntradaPage />} />
        <Route path="/login/email" element={<EmailPage />} />
        <Route path="/login/senha" element={<SenhaPage />} />
        <Route path="/login/recuperar" element={<RecuperarPage />} />
        <Route path="/onboarding/1" element={<Onboarding1Page />} />
        <Route path="/onboarding/2" element={<Onboarding2Page />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}
