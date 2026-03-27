import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useTheme } from './contexts/ThemeContext'
import LandingPage from './pages/LandingPage'
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

const DSLayout = lazy(() => import('./ds/DSLayout'))
const DSOverview = lazy(() => import('./ds/DSOverview'))
const DSBrand = lazy(() => import('./ds/sections/DSBrand'))
const DSCores = lazy(() => import('./ds/sections/DSCores'))
const DSTipografia = lazy(() => import('./ds/sections/DSTipografia'))
const DSEspacamento = lazy(() => import('./ds/sections/DSEspacamento'))
const DSGrid = lazy(() => import('./ds/sections/DSGrid'))
const DSElevacao = lazy(() => import('./ds/sections/DSElevacao'))
const DSMotion = lazy(() => import('./ds/sections/DSMotion'))
const DSIcones = lazy(() => import('./ds/sections/DSIcones'))
const DSBotoes = lazy(() => import('./ds/sections/DSBotoes'))
const DSInputs = lazy(() => import('./ds/sections/DSInputs'))
const DSTags = lazy(() => import('./ds/sections/DSTags'))
const DSCards = lazy(() => import('./ds/sections/DSCards'))
const DSAlertas = lazy(() => import('./ds/sections/DSAlertas'))
const DSNavegacao = lazy(() => import('./ds/sections/DSNavegacao'))
const DSPatterns = lazy(() => import('./ds/sections/DSPatterns'))
const DSOverlays = lazy(() => import('./ds/sections/DSOverlays'))
const DSEstados = lazy(() => import('./ds/sections/DSEstados'))
const DSHeaders = lazy(() => import('./ds/sections/DSHeaders'))
const DSAcessibilidade = lazy(() => import('./ds/sections/DSAcessibilidade'))
const DSChat = lazy(() => import('./ds/sections/DSChat'))
const DSCalendario = lazy(() => import('./ds/sections/DSCalendario'))
const DSCategorias = lazy(() => import('./ds/sections/DSCategorias'))
const DSMenuPerfil = lazy(() => import('./ds/sections/DSMenu'))
const DSSelecao = lazy(() => import('./ds/sections/DSSelecao'))
const DSPremiumCheckout = lazy(() => import('./ds/sections/DSPremiumModal'))
const DSWriting = lazy(() => import('./ds/sections/DSWriting'))
const DSClinico = lazy(() => import('./ds/sections/DSClinico'))
const DSChangelog = lazy(() => import('./ds/sections/DSChangelog'))

export default function App() {
  const { resolvedTheme } = useTheme()

  return (
    <Routes>
      {/* Design System Documentation */}
      <Route
        path="/design-system"
        element={
          <Suspense fallback={<div style={{ padding: 40, textAlign: 'center', color: '#64748b' }}>Carregando Design System...</div>}>
            <DSLayout />
          </Suspense>
        }
      >
        <Route index element={<Suspense fallback={null}><DSOverview /></Suspense>} />
        <Route path="brand" element={<Suspense fallback={null}><DSBrand /></Suspense>} />
        <Route path="cores" element={<Suspense fallback={null}><DSCores /></Suspense>} />
        <Route path="tipografia" element={<Suspense fallback={null}><DSTipografia /></Suspense>} />
        <Route path="espacamento" element={<Suspense fallback={null}><DSEspacamento /></Suspense>} />
        <Route path="grid" element={<Suspense fallback={null}><DSGrid /></Suspense>} />
        <Route path="elevacao" element={<Suspense fallback={null}><DSElevacao /></Suspense>} />
        <Route path="motion" element={<Suspense fallback={null}><DSMotion /></Suspense>} />
        <Route path="icones" element={<Suspense fallback={null}><DSIcones /></Suspense>} />
        <Route path="botoes" element={<Suspense fallback={null}><DSBotoes /></Suspense>} />
        <Route path="inputs" element={<Suspense fallback={null}><DSInputs /></Suspense>} />
        <Route path="selecao" element={<Suspense fallback={null}><DSSelecao /></Suspense>} />
        <Route path="tags" element={<Suspense fallback={null}><DSTags /></Suspense>} />
        <Route path="cards" element={<Suspense fallback={null}><DSCards /></Suspense>} />
        <Route path="alertas" element={<Suspense fallback={null}><DSAlertas /></Suspense>} />
        <Route path="navegacao" element={<Suspense fallback={null}><DSNavegacao /></Suspense>} />
        <Route path="patterns" element={<Suspense fallback={null}><DSPatterns /></Suspense>} />
        <Route path="overlays" element={<Suspense fallback={null}><DSOverlays /></Suspense>} />
        <Route path="estados" element={<Suspense fallback={null}><DSEstados /></Suspense>} />
        <Route path="headers" element={<Suspense fallback={null}><DSHeaders /></Suspense>} />
        <Route path="acessibilidade" element={<Suspense fallback={null}><DSAcessibilidade /></Suspense>} />
        <Route path="chat" element={<Suspense fallback={null}><DSChat /></Suspense>} />
        <Route path="calendario" element={<Suspense fallback={null}><DSCalendario /></Suspense>} />
        <Route path="categorias" element={<Suspense fallback={null}><DSCategorias /></Suspense>} />
        <Route path="menu-perfil" element={<Suspense fallback={null}><DSMenuPerfil /></Suspense>} />
        <Route path="premium" element={<Suspense fallback={null}><DSPremiumCheckout /></Suspense>} />
        <Route path="clinico" element={<Suspense fallback={null}><DSClinico /></Suspense>} />
        <Route path="writing" element={<Suspense fallback={null}><DSWriting /></Suspense>} />
        <Route path="changelog" element={<Suspense fallback={null}><DSChangelog /></Suspense>} />
      </Route>

      {/* Landing */}
      <Route path="/" element={<LandingPage />} />

      {/* App Pages */}
      <Route path="/app" element={<div className={`mobile-page ${resolvedTheme}`}><EntradaPage /></div>} />
      <Route path="/login/email" element={<div className={`mobile-page ${resolvedTheme}`}><EmailPage /></div>} />
      <Route path="/login/senha" element={<div className={`mobile-page ${resolvedTheme}`}><SenhaPage /></div>} />
      <Route path="/login/recuperar" element={<div className={`mobile-page ${resolvedTheme}`}><RecuperarPage /></div>} />
      <Route path="/onboarding/1" element={<div className={`mobile-page ${resolvedTheme}`}><Onboarding1Page /></div>} />
      <Route path="/onboarding/2" element={<div className={`mobile-page ${resolvedTheme}`}><Onboarding2Page /></div>} />
      <Route path="/home" element={<div className={`mobile-page ${resolvedTheme}`}><HomePage /></div>} />
      <Route path="/home/trial" element={<div className={`mobile-page ${resolvedTheme}`}><HomeDegustacaoPage /></div>} />
      <Route path="/busca" element={<div className={`mobile-page ${resolvedTheme}`}><BuscaPage /></div>} />
      <Route path="/premium" element={<div className={`mobile-page ${resolvedTheme}`}><PremiumModalPage /></div>} />
      <Route path="/planos" element={<div className={`mobile-page ${resolvedTheme}`}><PlanosPage /></div>} />
      <Route path="/notificacoes" element={<div className={`mobile-page ${resolvedTheme}`}><NotificacoesPage /></div>} />
      <Route path="/menu" element={<div className={`mobile-page ${resolvedTheme}`}><MenuPage /></div>} />
      <Route path="/ia" element={<div className={`mobile-page ${resolvedTheme}`}><IAChatPage /></div>} />
      <Route path="/escala" element={<div className={`mobile-page ${resolvedTheme}`}><EscalaCalendarioPage /></div>} />
      <Route path="/escala/novo" element={<div className={`mobile-page ${resolvedTheme}`}><EscalaNovoPlantaoPage /></div>} />
      <Route path="/calculadora/crcl" element={<div className={`mobile-page ${resolvedTheme}`}><CalculadoraInputsPage /></div>} />
      <Route path="/calculadora/crcl/resultado" element={<div className={`mobile-page ${resolvedTheme}`}><CalculadoraResultadoPage /></div>} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}
