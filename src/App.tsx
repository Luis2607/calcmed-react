import { Routes, Route, Navigate } from 'react-router-dom'
import EntradaPage from './pages/EntradaPage'
import EmailPage from './pages/EmailPage'
import SenhaPage from './pages/SenhaPage'
import RecuperarPage from './pages/RecuperarPage'
import Onboarding1Page from './pages/Onboarding1Page'
import Onboarding2Page from './pages/Onboarding2Page'
import HomePage from './pages/HomePage'
import HomeDegustacaoPage from './pages/HomeDegustacaoPage'
import BuscaPage from './pages/BuscaPage'
import PremiumModalPage from './pages/PremiumModalPage'
import PlanosPage from './pages/PlanosPage'
import NotificacoesPage from './pages/NotificacoesPage'
import MenuPage from './pages/MenuPage'
import IAChatPage from './pages/IAChatPage'
import EscalaCalendarioPage from './pages/EscalaCalendarioPage'
import EscalaNovoPlantaoPage from './pages/EscalaNovoPlantaoPage'
import CalculadoraInputsPage from './pages/CalculadoraInputsPage'
import CalculadoraResultadoPage from './pages/CalculadoraResultadoPage'

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
        <Route path="/home/trial" element={<HomeDegustacaoPage />} />
        <Route path="/busca" element={<BuscaPage />} />
        <Route path="/premium" element={<PremiumModalPage />} />
        <Route path="/planos" element={<PlanosPage />} />
        <Route path="/notificacoes" element={<NotificacoesPage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/ia" element={<IAChatPage />} />
        <Route path="/escala" element={<EscalaCalendarioPage />} />
        <Route path="/escala/novo" element={<EscalaNovoPlantaoPage />} />
        <Route path="/calculadora/crcl" element={<CalculadoraInputsPage />} />
        <Route path="/calculadora/crcl/resultado" element={<CalculadoraResultadoPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}
