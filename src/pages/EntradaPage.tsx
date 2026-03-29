import { useState, useEffect } from 'react'
import MobileFrame from '../components/layout/MobileFrame'
import AuthWebLayout from '../components/layout/AuthWebLayout'
import Button from '../components/ui/Button'
import { useLayout } from '../contexts/LayoutContext'

const slides = [
  { bg: '/assets/slide-1.png', text: 'Doses calculadas em segundos no PS' },
  { bg: '/assets/slide-2.png', text: 'Funciona 100% offline na UTI' },
  { bg: '/assets/slide-3.png', text: 'Feito por médicos de Urgência e Emergência' },
]

export default function EntradaPage() {
  const { layoutMode } = useLayout()
  const [current, setCurrent] = useState(0)
  const [showSplash, setShowSplash] = useState(layoutMode === 'mobile')

  // Splash timer — 2s then fade to login
  useEffect(() => {
    if (!showSplash) return
    const timer = setTimeout(() => setShowSplash(false), 2000)
    return () => clearTimeout(timer)
  }, [showSplash])

  useEffect(() => {
    if (layoutMode === 'web') return
    if (showSplash) return // don't start carousel during splash
    const timer = setInterval(() => setCurrent(i => (i + 1) % 3), 5000)
    return () => clearInterval(timer)
  }, [layoutMode, showSplash])

  // Splash screen (mobile only)
  if (showSplash) {
    return (
      <MobileFrame darkFrame>
        <div className="splash-screen">
          <div className="splash-content">
            <img src="/assets/Icone.svg" width={96} height={96} alt="CalcMed" className="splash-icon" />
            <div className="splash-brand">
              <div className="t-marca" style={{ color: 'white', fontSize: 32 }}>Calc<span className="dot">.</span>Med</div>
              <div className="brand-sub mt-2" style={{ color: 'var(--slate-400)' }}>Urgência e Emergência</div>
            </div>
          </div>
        </div>
      </MobileFrame>
    )
  }

  if (layoutMode === 'web') {
    return (
      <AuthWebLayout>
        {/* Header */}
        <div className="mb-6">
          <h2 className="t-titulo-pagina">Bem-vindo ao CalcMed</h2>
          <p className="t-corpo-2 text-fg-2 mt-2">Seu plantão começa aqui</p>
        </div>

        {/* Social login */}
        <div className="flex flex-col gap-3">
          <Button variant="google" size="md" href="/onboarding/1" fullWidth>
            <span className="icon-google" /> Entrar com Google
          </Button>
          <Button variant="apple" size="md" href="/onboarding/1" fullWidth>
            <span className="icon-apple" /> Entrar com Apple
          </Button>
        </div>

        {/* Divider */}
        <div className="divider-ou" role="separator"><div className="line" aria-hidden="true" /><span className="text">ou</span><div className="line" aria-hidden="true" /></div>

        {/* Email — texto simples, consistente com mobile */}
        <div className="text-center">
          <Button variant="text" size="md" href="/login/email">
            Entrar com e-mail
          </Button>
        </div>

        {/* Support */}
        <div className="text-center mt-3">
          <Button variant="discrete">Precisa de ajuda?</Button>
        </div>
      </AuthWebLayout>
    )
  }

  return (
    <MobileFrame darkFrame>
      {/* Hero */}
      <div className="hero-dark flex-1">
        <div className="carousel-bg" aria-hidden="true">
          {slides.map((s, i) => (
            <div
              key={i}
              className={`slide-bg ${i === current ? 'active' : ''}`}
              style={{ backgroundImage: `url(${s.bg})` }}
            />
          ))}
        </div>

        <div className="hero-brand">
          <img src="/assets/Icone.svg" width={72} height={72} alt="CalcMed" className="brand-icon" />
          <div className="text-center">
            <div className="t-marca">Calc<span className="dot">.</span>Med</div>
            <div className="t-texto-badge brand-sub mt-1">Urgência e Emergência</div>
          </div>
          <div className="carousel-text mt-4" aria-live="polite" aria-atomic="true">
            {slides.map((s, i) => (
              <div key={i} className={`slide-text ${i === current ? 'active' : ''}`}>
                {s.text}
              </div>
            ))}
          </div>
          <div className="dots mt-3">
            {slides.map((_, i) => (
              <div
                key={i}
                className={i === current ? 'active' : 'inactive'}
                role="button"
                tabIndex={0}
                aria-label={`Slide ${i + 1} de ${slides.length}`}
                onClick={() => setCurrent(i)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setCurrent(i); } }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Sheet */}
      <div className="bottom-sheet bottom-sheet-compact pb-8">
        <Button variant="google" size="lg" href="/onboarding/1" fullWidth>
          <span className="icon-google" /> Entrar com Google
        </Button>
        <Button variant="apple" size="lg" href="/onboarding/1" fullWidth>
          <span className="icon-apple" /> Entrar com Apple
        </Button>
        <div className="divider-ou" role="separator"><div className="line" aria-hidden="true" /><span className="text">ou</span><div className="line" aria-hidden="true" /></div>
        <div className="text-center">
          <Button variant="text" href="/login/email">Entrar com e-mail</Button>
        </div>
        <div className="text-center">
          <Button variant="discrete">Suporte</Button>
        </div>
      </div>
    </MobileFrame>
  )
}
