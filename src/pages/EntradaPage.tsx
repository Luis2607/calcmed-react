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

  useEffect(() => {
    if (layoutMode === 'web') return // skip carousel in web mode
    const timer = setInterval(() => setCurrent(i => (i + 1) % 3), 5000)
    return () => clearInterval(timer)
  }, [layoutMode])

  if (layoutMode === 'web') {
    return (
      <AuthWebLayout>
        {/* Header */}
        <div className="mb-6">
          <h2 className="t-titulo-pagina">Bem-vindo ao CalcMed</h2>
          <p className="t-corpo-2 text-fg-2 mt-2">Acesse sua conta para começar</p>
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

        {/* Email */}
        <Button variant="ghost" size="md" href="/login/email" fullWidth>
          Entrar com e-mail
        </Button>

        {/* Support */}
        <div className="text-center mt-4">
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
