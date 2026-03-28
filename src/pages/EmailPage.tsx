import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CaretLeft } from '@phosphor-icons/react'
import MobileFrame from '../components/layout/MobileFrame'
import AuthWebLayout from '../components/layout/AuthWebLayout'
import Button from '../components/ui/Button'
import InputField from '../components/forms/InputField'
import { useLayout } from '../contexts/LayoutContext'

export default function EmailPage() {
  const { layoutMode } = useLayout()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [touched, setTouched] = useState(false)
  const valid = email.includes('@') && email.includes('.')
  const showError = touched && email.length > 0 && !valid

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (valid) {
      navigate('/login/senha', { state: { email } })
    }
  }

  const emailInput = (
    <InputField
      id={layoutMode === 'web' ? 'email' : 'email-mobile'}
      label="Seu e-mail"
      type="email"
      placeholder="médico@hospital.com"
      value={email}
      onChange={(val) => { setEmail(val); if (!touched) setTouched(true); }}
      error={showError ? 'Insira um e-mail válido' : undefined}
      autoFocus
    />
  )

  if (layoutMode === 'web') {
    return (
      <AuthWebLayout>
        {/* Header */}
        <div className="mb-6">
          <Link to="/app" className="auth-web-back mb-3">
            <i className="ph ph-caret-left" /> Voltar
          </Link>
          <h2 className="t-titulo-pagina">Entrar com e-mail</h2>
          <p className="t-corpo-2 text-fg-2 mt-2">Digite o e-mail cadastrado na sua conta</p>
        </div>

        {/* Form */}
        <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
          {emailInput}
          <Button variant="primary" size="md" type="submit" fullWidth disabled={!valid}>
            Continuar
          </Button>
        </form>
      </AuthWebLayout>
    )
  }

  return (
    <MobileFrame darkFrame>
      <div className="hero-dark flex-1">
        <div className="carousel-bg" aria-hidden="true">
          <div className="slide-bg active" style={{ backgroundImage: "url('/assets/slide-3.png')" }} />
        </div>
        <div className="hero-brand">
          <img src="/assets/Icone.svg" width={72} height={72} alt="CalcMed" className="brand-icon" />
          <div className="text-center">
            <div className="t-marca">Calc<span className="dot">.</span>Med</div>
            <div className="t-texto-badge brand-sub mt-1">Urgência e Emergência</div>
          </div>
          <div className="carousel-text mt-4" aria-hidden="true">
            <div className="slide-text active">Feito por médicos de Urgência e Emergência</div>
          </div>
          <div className="dots mt-3" aria-hidden="true">
            <div className="inactive" /><div className="inactive" /><div className="active" />
          </div>
        </div>
      </div>

      <form className="bottom-sheet pb-8" onSubmit={handleSubmit} noValidate>
        <div className="sheet-header">
          <Link to="/app" className="back" aria-label="Voltar"><CaretLeft size={20} /></Link>
          <div className="title">Entrar</div>
        </div>
        {emailInput}
        <Button variant="primary" size="lg" type="submit" fullWidth disabled={!valid}>
          Continuar
        </Button>
      </form>
    </MobileFrame>
  )
}
