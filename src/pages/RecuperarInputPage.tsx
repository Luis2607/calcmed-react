import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CaretLeft } from '@phosphor-icons/react'
import MobileFrame from '../components/layout/MobileFrame'
import AuthWebLayout from '../components/layout/AuthWebLayout'
import Button from '../components/ui/Button'
import InputField from '../components/forms/InputField'
import { useLayout } from '../contexts/LayoutContext'

export default function RecuperarInputPage() {
  const { layoutMode } = useLayout()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [touched, setTouched] = useState(false)
  const valid = email.includes('@') && email.includes('.')
  const showError = touched && email.length > 0 && !valid

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (valid) {
      navigate('/login/recuperar', { state: { email } })
    }
  }

  const emailInput = (
    <InputField
      id={layoutMode === 'web' ? 'recuperar-email' : 'recuperar-email-mobile'}
      label="E-mail"
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
        <div className="mb-6">
          <Link to="/login/senha" className="auth-web-back mb-3">
            <i className="ph ph-caret-left" /> Voltar
          </Link>
          <h2 className="t-titulo-pagina">Recuperar senha</h2>
          <p className="t-corpo-2 text-fg-2 mt-2">Informe o e-mail cadastrado na sua conta</p>
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
          {emailInput}
          <Button variant="primary" size="md" type="submit" fullWidth disabled={!valid}>
            Enviar link
          </Button>
          <div className="text-center">
            <Button variant="text" href="/login/senha">Voltar para o login</Button>
          </div>
        </form>
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

      <form className="bottom-sheet pb-8" onSubmit={handleSubmit} noValidate>
        <div className="sheet-header">
          <Link to="/login/senha" className="back" aria-label="Voltar"><CaretLeft size={20} /></Link>
          <div className="title">Recuperar senha</div>
        </div>
        <p className="t-corpo-2 text-fg-2 mb-3">Informe o e-mail cadastrado na sua conta</p>
        {emailInput}
        <Button variant="primary" size="lg" type="submit" fullWidth disabled={!valid}>
          Enviar link
        </Button>
      </form>
    </MobileFrame>
  )
}
