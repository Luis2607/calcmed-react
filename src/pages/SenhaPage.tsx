import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { CaretLeft, Eye, EyeSlash } from '@phosphor-icons/react'
import MobileFrame from '../components/layout/MobileFrame'
import AuthWebLayout from '../components/layout/AuthWebLayout'
import Button from '../components/ui/Button'
import { useLayout } from '../contexts/LayoutContext'

function PasswordInput({ id, show, password, onToggle, onChange }: {
  id: string
  show: boolean
  password: string
  onToggle: () => void
  onChange: (val: string) => void
}) {
  return (
    <div className="input-group">
      <label htmlFor={id} className="input-label">Senha</label>
      <div className="input-password">
        <input
          className="input-field"
          id={id}
          type={show ? 'text' : 'password'}
          placeholder="••••••••"
          value={password}
          onChange={e => onChange(e.target.value)}
          autoComplete="current-password"
        />
        <button
          className="eye-toggle"
          type="button"
          onClick={onToggle}
          aria-label={show ? 'Ocultar senha' : 'Mostrar senha'}
        >
          {show ? <Eye size={20} /> : <EyeSlash size={20} />}
        </button>
      </div>
    </div>
  )
}

export default function SenhaPage() {
  const { layoutMode } = useLayout()
  const navigate = useNavigate()
  const location = useLocation()
  const email = (location.state as any)?.email || 'seu-email@exemplo.com'
  const [show, setShow] = useState(false)
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length > 0) {
      navigate('/onboarding/1')
    }
  }

  if (layoutMode === 'web') {
    return (
      <AuthWebLayout>
        {/* Header */}
        <div className="mb-6">
          <Link to="/login/email" className="auth-web-back mb-3">
            <i className="ph ph-caret-left" /> Voltar
          </Link>
          <h2 className="t-titulo-pagina">Sua senha</h2>
          <p className="t-corpo-2 text-fg-3 mt-2">{email}</p>
        </div>

        {/* Form */}
        <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
          <PasswordInput
            id="password"
            show={show}
            password={password}
            onToggle={() => setShow(!show)}
            onChange={setPassword}
          />
          <Button variant="primary" size="md" type="submit" fullWidth disabled={password.length === 0}>Entrar</Button>
          <div className="text-center">
            <Button variant="text" onClick={() => navigate('/login/recuperar', { state: { email } })}>Esqueci minha senha</Button>
          </div>
        </form>
      </AuthWebLayout>
    )
  }

  return (
    <MobileFrame darkFrame>
      <div className="hero-dark flex-1">
        <div className="carousel-bg" aria-hidden="true">
          <div className="slide-bg active" style={{ backgroundImage: "url('/assets/slide-3.png')" }} aria-hidden="true" />
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
          <Link to="/login/email" className="back" aria-label="Voltar"><CaretLeft size={20} /></Link>
          <div>
            <div className="title">Sua senha</div>
            <div className="subtitle">{email}</div>
          </div>
        </div>
        <PasswordInput
          id="password-mobile"
          show={show}
          password={password}
          onToggle={() => setShow(!show)}
          onChange={setPassword}
        />
        <Button variant="primary" size="lg" type="submit" fullWidth disabled={password.length === 0}>Entrar</Button>
        <div className="text-center">
          <Button variant="text" onClick={() => navigate('/login/recuperar', { state: { email } })}>Esqueci minha senha</Button>
        </div>
      </form>
    </MobileFrame>
  )
}
