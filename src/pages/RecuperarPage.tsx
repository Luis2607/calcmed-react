import { useLocation, useNavigate } from 'react-router-dom'
import { CaretLeft, Envelope } from '@phosphor-icons/react'
import MobileFrame from '../components/layout/MobileFrame'
import AuthWebLayout from '../components/layout/AuthWebLayout'
import Button from '../components/ui/Button'
import { useLayout } from '../contexts/LayoutContext'

export default function RecuperarPage() {
  const { layoutMode } = useLayout()
  const navigate = useNavigate()
  const location = useLocation()
  const email = (location.state as any)?.email || 'seu e-mail cadastrado'

  if (layoutMode === 'web') {
    return (
      <AuthWebLayout>
        {/* Header */}
        <div className="mb-6">
          <button type="button" className="auth-web-back mb-3" onClick={() => navigate('/login/senha', { state: { email } })}>
            <i className="ph ph-caret-left" /> Voltar
          </button>
          <h2 className="t-titulo-pagina">Recuperar senha</h2>
          <p className="t-corpo-2 text-fg-2 mt-2">Enviamos um link para redefinir sua senha</p>
        </div>
        {/* Form content */}
        <div className="flex flex-col gap-4">
          <div className="feedback-sent p-6">
            <div className="icon-circle icon-circle-teal" aria-hidden="true"><Envelope size={24} /></div>
            <div className="msg">Enviamos um link de recuperação para<br /><strong>{email}</strong><br />Verifique sua caixa de entrada.</div>
          </div>
          <Button variant="primary" size="md" href="/app" fullWidth>Voltar para o login</Button>
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
          <button type="button" className="back" aria-label="Voltar" onClick={() => navigate('/login/senha', { state: { email } })}><CaretLeft size={20} /></button>
          <div className="title">Recuperar senha</div>
        </div>
        <div className="feedback-sent">
          <div className="icon-circle icon-circle-teal" aria-hidden="true"><Envelope size={24} /></div>
          <div className="msg">Enviamos um link de recuperação para<br /><strong>{email}</strong><br />Verifique sua caixa de entrada.</div>
        </div>
        <Button variant="primary" size="lg" href="/app" fullWidth className="mt-auto">Voltar para o login</Button>
      </div>
    </MobileFrame>
  )
}
