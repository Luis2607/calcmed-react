import { useState, useEffect, type ReactNode } from 'react'

const slides = [
  { bg: '/assets/slide-1.png', text: 'Doses calculadas em segundos no PS' },
  { bg: '/assets/slide-2.png', text: 'Funciona 100% offline na UTI' },
  { bg: '/assets/slide-3.png', text: 'Feito por médicos de Urgência e Emergência' },
]

interface Props {
  children: ReactNode
}

export default function AuthWebLayout({ children }: Props) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setCurrent(i => (i + 1) % 3), 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="auth-web-layout">
      {/* Left — Visual */}
      <div className="auth-web-visual">
        <div className="auth-web-carousel" aria-hidden="true">
          {slides.map((s, i) => (
            <div
              key={i}
              className={`auth-web-slide ${i === current ? 'active' : ''}`}
              style={{ backgroundImage: `url(${s.bg})` }}
            />
          ))}
        </div>
        <div className="auth-web-overlay" aria-hidden="true" />
        <div className="auth-web-brand">
          <img src="/assets/Icone.svg" width={72} height={72} alt="CalcMed" />
          <div className="auth-web-brand-text">
            <span className="t-marca">Calc<span className="dot">.</span>Med</span>
            <span className="t-texto-badge brand-sub mt-1">Urgência e Emergência</span>
          </div>
          <div className="auth-web-slide-text" aria-live="polite" aria-atomic="true">
            {slides.map((s, i) => (
              <div key={i} className={i === current ? 'active' : ''} style={{ display: i === current ? 'block' : 'none' }}>
                {s.text}
              </div>
            ))}
          </div>
          <div className="dots mt-4">
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

      {/* Right — Form */}
      <main className="auth-web-form">
        <div className="auth-web-form-inner">
          {children}
        </div>
        <div className="auth-web-form-footer">
          <span className="t-legenda text-fg-3">&copy; {new Date().getFullYear()} CalcMed &middot; Termos de Uso &middot; Privacidade</span>
        </div>
      </main>
    </div>
  )
}
