import { useState, useEffect } from 'react'
import MobileFrame from '../components/layout/MobileFrame'
import Button from '../components/ui/Button'

const slides = [
  { bg: '/assets/slide-1.png', text: 'Doses calculadas em segundos no PS' },
  { bg: '/assets/slide-2.png', text: 'Funciona 100% offline na UTI' },
  { bg: '/assets/slide-3.png', text: 'Feito por médicos de Urgência e Emergência' },
]

export default function EntradaPage() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setCurrent(i => (i + 1) % 3), 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <MobileFrame darkFrame>
      {/* Hero */}
      <div className="hero-dark flex-1">
        <div className="carousel-bg">
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
          <div className="carousel-text mt-4">
            {slides.map((s, i) => (
              <div key={i} className={`slide-text ${i === current ? 'active' : 'hidden'}`}>
                {s.text}
              </div>
            ))}
          </div>
          <div className="dots mt-3">
            {slides.map((_, i) => (
              <div key={i} className={i === current ? 'active' : 'inactive'} onClick={() => setCurrent(i)} />
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
        <div className="divider-ou"><div className="line" /><span className="text">ou</span><div className="line" /></div>
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
