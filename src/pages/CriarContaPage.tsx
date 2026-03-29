import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CaretLeft, Eye, EyeSlash } from '@phosphor-icons/react'
import MobileFrame from '../components/layout/MobileFrame'
import AuthWebLayout from '../components/layout/AuthWebLayout'
import Button from '../components/ui/Button'
import InputField from '../components/forms/InputField'
import { useLayout } from '../contexts/LayoutContext'

function PasswordInput({ id, label, placeholder, show, password, onToggle, onChange, autoComplete }: {
  id: string
  label: string
  placeholder: string
  show: boolean
  password: string
  onToggle: () => void
  onChange: (val: string) => void
  autoComplete?: string
}) {
  return (
    <div className="input-group">
      <label htmlFor={id} className="input-label">{label}</label>
      <div className="input-password">
        <input
          className="input-field"
          id={id}
          type={show ? 'text' : 'password'}
          placeholder={placeholder}
          value={password}
          onChange={e => onChange(e.target.value)}
          autoComplete={autoComplete}
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

export default function CriarContaPage() {
  const { layoutMode } = useLayout()
  const navigate = useNavigate()
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [showSenha, setShowSenha] = useState(false)
  const [showConfirmar, setShowConfirmar] = useState(false)

  const allFilled = nome.trim().length > 0 && email.includes('@') && email.includes('.') && senha.length >= 8 && confirmar.length > 0 && senha === confirmar

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (allFilled) {
      navigate('/registro/verificar', { state: { email } })
    }
  }

  const nomeInput = (
    <InputField
      id={layoutMode === 'web' ? 'nome' : 'nome-mobile'}
      label="Nome completo"
      type="text"
      placeholder="Dr. Rafael Santos"
      value={nome}
      onChange={setNome}
      autoFocus
    />
  )

  const emailInput = (
    <InputField
      id={layoutMode === 'web' ? 'email-registro' : 'email-registro-mobile'}
      label="E-mail"
      type="email"
      placeholder="médico@hospital.com"
      value={email}
      onChange={setEmail}
    />
  )

  if (layoutMode === 'web') {
    return (
      <AuthWebLayout>
        <div className="mb-6">
          <Link to="/login/email" className="auth-web-back mb-3">
            <i className="ph ph-caret-left" /> Voltar
          </Link>
          <h2 className="t-titulo-pagina">Criar conta</h2>
          <p className="t-corpo-2 text-fg-2 mt-2">Preencha seus dados para começar</p>
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
          {nomeInput}
          {emailInput}
          <PasswordInput
            id="senha"
            label="Senha"
            placeholder="Mínimo 8 caracteres"
            show={showSenha}
            password={senha}
            onToggle={() => setShowSenha(!showSenha)}
            onChange={setSenha}
            autoComplete="new-password"
          />
          <PasswordInput
            id="confirmar"
            label="Confirmar senha"
            placeholder="Repita a senha"
            show={showConfirmar}
            password={confirmar}
            onToggle={() => setShowConfirmar(!showConfirmar)}
            onChange={setConfirmar}
            autoComplete="new-password"
          />
          <Button variant="primary" size="md" type="submit" fullWidth disabled={!allFilled}>
            Criar conta
          </Button>
          <div className="text-center">
            <Button variant="text" href="/app">Já tem conta? Entrar</Button>
          </div>
        </form>
      </AuthWebLayout>
    )
  }

  return (
    <MobileFrame darkFrame>
      <div className="hero-dark flex-1">
        <div className="carousel-bg" aria-hidden="true">
          <div className="slide-bg active" style={{ backgroundImage: "url('/assets/slide-2.png')" }} />
        </div>
        <div className="hero-brand">
          <img src="/assets/Icone.svg" width={72} height={72} alt="CalcMed" className="brand-icon" />
          <div className="text-center">
            <div className="t-marca">Calc<span className="dot">.</span>Med</div>
            <div className="t-texto-badge brand-sub mt-1">Urgência e Emergência</div>
          </div>
          <div className="carousel-text mt-4" aria-hidden="true">
            <div className="slide-text active">Funciona 100% offline na UTI</div>
          </div>
          <div className="dots mt-3" aria-hidden="true">
            <div className="inactive" /><div className="active" /><div className="inactive" />
          </div>
        </div>
      </div>

      <form className="bottom-sheet bottom-sheet-lg pb-8" onSubmit={handleSubmit} noValidate>
        <div className="sheet-header">
          <Link to="/login/email" className="back" aria-label="Voltar"><CaretLeft size={20} /></Link>
          <div className="title">Criar conta</div>
        </div>
        {nomeInput}
        {emailInput}
        <PasswordInput
          id="senha-mobile"
          label="Senha"
          placeholder="Mínimo 8 caracteres"
          show={showSenha}
          password={senha}
          onToggle={() => setShowSenha(!showSenha)}
          onChange={setSenha}
          autoComplete="new-password"
        />
        <PasswordInput
          id="confirmar-mobile"
          label="Confirmar senha"
          placeholder="Repita a senha"
          show={showConfirmar}
          password={confirmar}
          onToggle={() => setShowConfirmar(!showConfirmar)}
          onChange={setConfirmar}
          autoComplete="new-password"
        />
        <Button variant="primary" size="lg" type="submit" fullWidth disabled={!allFilled}>
          Criar conta
        </Button>
        <div className="text-center">
          <Button variant="text" href="/app">Já tem conta? Entrar</Button>
        </div>
      </form>
    </MobileFrame>
  )
}
