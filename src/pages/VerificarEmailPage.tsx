import { useState, useEffect, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { CaretLeft, EnvelopeSimple } from '@phosphor-icons/react'
import MobileFrame from '../components/layout/MobileFrame'
import AuthWebLayout from '../components/layout/AuthWebLayout'
import Button from '../components/ui/Button'
import { useLayout } from '../contexts/LayoutContext'

export default function VerificarEmailPage() {
  const { layoutMode } = useLayout()
  const navigate = useNavigate()
  const location = useLocation()
  const email = (location.state as any)?.email || 'seu e-mail'
  const [cooldown, setCooldown] = useState(0)

  useEffect(() => {
    if (cooldown <= 0) return
    const timer = setTimeout(() => setCooldown(c => c - 1), 1000)
    return () => clearTimeout(timer)
  }, [cooldown])

  const handleResend = useCallback(() => {
    setCooldown(60)
  }, [])

  const content = (
    <>
      <div className="feedback-sent p-6">
        <div className="icon-circle icon-circle-teal" aria-hidden="true"><EnvelopeSimple size={24} /></div>
        <div className="msg">
          Enviamos um link de verificação para<br /><strong>{email}</strong><br />Clique no link para ativar sua conta.
        </div>
        <div className="t-legenda text-fg-3 mt-2">Não encontrou? Verifique a pasta de spam.</div>
      </div>
    </>
  )

  if (layoutMode === 'web') {
    return (
      <AuthWebLayout>
        <div className="mb-6">
          <h2 className="t-titulo-pagina">Verifique seu e-mail</h2>
          <p className="t-corpo-2 text-fg-2 mt-2">Um passo a mais para começar</p>
        </div>

        <div className="flex flex-col gap-4">
          {content}
          <Button variant="primary" size="md" href={`mailto:${email}`} fullWidth>
            Abrir e-mail
          </Button>
          <div className="text-center">
            <Button variant="text" size="md" onClick={handleResend} disabled={cooldown > 0}>
              {cooldown > 0 ? `Reenviar e-mail (${cooldown}s)` : 'Reenviar e-mail'}
            </Button>
          </div>
          <div className="text-center">
            <Button variant="text" href="/app">Voltar para o login</Button>
          </div>
        </div>
      </AuthWebLayout>
    )
  }

  return (
    <MobileFrame darkFrame>
      <div className="hero-dark flex-1">
        <div className="carousel-bg" aria-hidden="true">
          <div className="slide-bg active" style={{ backgroundImage: "url('/assets/slide-1.png')" }} />
        </div>
        <div className="hero-brand">
          <img src="/assets/Icone.svg" width={72} height={72} alt="CalcMed" className="brand-icon" />
          <div className="text-center">
            <div className="t-marca">Calc<span className="dot">.</span>Med</div>
            <div className="t-texto-badge brand-sub mt-1">Urgência e Emergência</div>
          </div>
          <div className="carousel-text mt-4" aria-hidden="true">
            <div className="slide-text active">Doses calculadas em segundos no PS</div>
          </div>
          <div className="dots mt-3" aria-hidden="true">
            <div className="active" /><div className="inactive" /><div className="inactive" />
          </div>
        </div>
      </div>

      <div className="bottom-sheet bottom-sheet-lg pb-8">
        <div className="sheet-header">
          <button type="button" className="back" aria-label="Voltar" onClick={() => navigate(-1)}><CaretLeft size={20} /></button>
          <div className="title">Verifique seu e-mail</div>
        </div>
        {content}
        <Button variant="primary" size="lg" href={`mailto:${email}`} fullWidth className="mt-auto">
          Abrir e-mail
        </Button>
        <div className="text-center">
          <Button variant="text" onClick={handleResend} disabled={cooldown > 0}>
            {cooldown > 0 ? `Reenviar e-mail (${cooldown}s)` : 'Reenviar e-mail'}
          </Button>
        </div>
        <div className="text-center">
          <Button variant="text" href="/app">Voltar para o login</Button>
        </div>
      </div>
    </MobileFrame>
  )
}
