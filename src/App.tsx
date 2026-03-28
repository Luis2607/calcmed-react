import { lazy, Suspense, useEffect, useRef, useCallback } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useTheme } from './contexts/ThemeContext'
import { useLayout } from './contexts/LayoutContext'

import LandingPage from './pages/LandingPage'
import EntradaPage from './pages/EntradaPage'
import EmailPage from './pages/EmailPage'
import SenhaPage from './pages/SenhaPage'
import RecuperarPage from './pages/RecuperarPage'
import Onboarding1Page from './pages/Onboarding1Page'
import Onboarding2Page from './pages/Onboarding2Page'
import HomePage from './pages/HomePage'
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

/* ----------------------------------------------------------------
   Navigation progress bar (NProgress-style)
   ---------------------------------------------------------------- */
function NavigationProgress() {
  const location = useLocation()
  const barRef = useRef<HTMLDivElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const prevPath = useRef(location.pathname)

  useEffect(() => {
    if (location.pathname === prevPath.current) return
    prevPath.current = location.pathname

    const wrap = wrapRef.current
    const bar = barRef.current
    if (!wrap || !bar) return

    // Start
    wrap.classList.add('active')
    bar.style.transition = 'none'
    bar.style.width = '0%'

    // Force reflow
    void bar.offsetWidth

    // Animate to 80%
    bar.style.transition = 'width 300ms cubic-bezier(0.2,0,0,1)'
    bar.style.width = '80%'

    // Complete after a tick
    const t1 = setTimeout(() => {
      bar.style.transition = 'width 150ms cubic-bezier(0.2,0,0,1)'
      bar.style.width = '100%'
    }, 200)

    // Hide
    const t2 = setTimeout(() => {
      wrap.classList.remove('active')
      bar.style.width = '0%'
    }, 400)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [location.pathname])

  return (
    <div ref={wrapRef} className="nav-progress" aria-hidden="true">
      <div ref={barRef} className="nav-progress-bar" />
    </div>
  )
}

/* ----------------------------------------------------------------
   Scroll restoration
   ---------------------------------------------------------------- */
function ScrollRestoration() {
  const location = useLocation()
  const scrollPositions = useRef<Record<string, number>>({})
  const prevKey = useRef<string>('')

  const saveScroll = useCallback(() => {
    if (prevKey.current) {
      scrollPositions.current[prevKey.current] = window.scrollY
    }
  }, [])

  useEffect(() => {
    // Save previous position
    saveScroll()
    prevKey.current = location.key

    // Restore or scroll to top
    const saved = scrollPositions.current[location.key]
    if (saved !== undefined) {
      window.scrollTo(0, saved)
    } else {
      window.scrollTo(0, 0)
    }
  }, [location.key, saveScroll])

  // Save on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (prevKey.current) {
        scrollPositions.current[prevKey.current] = window.scrollY
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return null
}

/* ----------------------------------------------------------------
   Page transition wrapper — fades in on route change
   ---------------------------------------------------------------- */
function AnimatedRoutes({ children }: { children: React.ReactNode }) {
  const location = useLocation()

  return (
    <div key={location.key} className="page-transition-wrapper">
      {children}
    </div>
  )
}


function PageWrapper({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme()
  const { layoutMode } = useLayout()

  if (layoutMode === 'web') {
    return <>{children}</>
  }

  return <div className={`mobile-page ${resolvedTheme}`}>{children}</div>
}

export default function App() {
  return (
    <>
      <NavigationProgress />
      <ScrollRestoration />
      <AnimatedRoutes>
        <Routes>
          {/* Design System Documentation */}
          <Route
            path="/design-system"
            element={
              <Suspense fallback={<div className="ds-loading-fallback">Carregando Design System...</div>}>
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
          <Route path="/app" element={<PageWrapper><EntradaPage /></PageWrapper>} />
          <Route path="/login/email" element={<PageWrapper><EmailPage /></PageWrapper>} />
          <Route path="/login/senha" element={<PageWrapper><SenhaPage /></PageWrapper>} />
          <Route path="/login/recuperar" element={<PageWrapper><RecuperarPage /></PageWrapper>} />
          <Route path="/onboarding/1" element={<PageWrapper><Onboarding1Page /></PageWrapper>} />
          <Route path="/onboarding/2" element={<PageWrapper><Onboarding2Page /></PageWrapper>} />
          <Route path="/home" element={<PageWrapper><HomePage /></PageWrapper>} />
          <Route path="/home/trial" element={<PageWrapper><HomePage /></PageWrapper>} />
          <Route path="/busca" element={<PageWrapper><BuscaPage /></PageWrapper>} />
          <Route path="/premium" element={<PageWrapper><PremiumModalPage /></PageWrapper>} />
          <Route path="/planos" element={<PageWrapper><PlanosPage /></PageWrapper>} />
          <Route path="/notificacoes" element={<PageWrapper><NotificacoesPage /></PageWrapper>} />
          <Route path="/menu" element={<PageWrapper><MenuPage /></PageWrapper>} />
          <Route path="/ia" element={<PageWrapper><IAChatPage /></PageWrapper>} />
          <Route path="/escala" element={<PageWrapper><EscalaCalendarioPage /></PageWrapper>} />
          <Route path="/escala/novo" element={<PageWrapper><EscalaNovoPlantaoPage /></PageWrapper>} />
          <Route path="/calculadora/crcl" element={<PageWrapper><CalculadoraInputsPage /></PageWrapper>} />
          <Route path="/calculadora/crcl/resultado" element={<PageWrapper><CalculadoraResultadoPage /></PageWrapper>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AnimatedRoutes>
    </>
  )
}
