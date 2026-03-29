import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CaretLeft, Eye, EyeSlash } from '@phosphor-icons/react'
import MobileFrame from '../components/layout/MobileFrame'
import AuthWebLayout from '../components/layout/AuthWebLayout'
import Button from '../components/ui/Button'
import { useLayout } from '../contexts/LayoutContext'

function PasswordInput({ id, label, placeholder, show, password, onToggle, onChange }: {
  id: string
  label: string
  placeholder: string
  show: boolean
  password: string
  onToggle: () => void
  onChange: (val: string) => void
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
          autoComplete="new-password"
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

function getStrength(password: string): 'weak' | 'medium' | 'strong' {
  let score = 0
  if (password.length >= 8) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++
  if (password.length >= 12) score++
  if (score <= 1) return 'weak'
  if (score <= 3) return 'medium'
  return 'strong'
}

const strengthLabels: Record<string, string> = {
  weak: 'Fraca',
  medium: 'Média',
  strong: 'Forte',
}

export default function NovaSenhaPage() {
  const { layoutMode } = useLayout()
  const navigate = useNavigate()
  const [senha, setSenha] = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [showSenha, setShowSenha] = useState(false)
  const [showConfirmar, setShowConfirmar] = useState(false)

  const strength = getStrength(senha)
  const valid = senha.length >= 8 && senha === confirmar

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (valid) {
      navigate('/login/senha-alterada')
    }
  }

  const strengthBar = senha.length > 0 ? (
    <div>
      <div className="password-strength">
        <div className={`password-strength-bar ${strength}`} />
      </div>
      <div className={`password-strength-label text-fg-3`}>{strengthLabels[strength]}</div>
    </div>
  ) : null

  if (layoutMode === 'web') {
    return (
      <AuthWebLayout>
        <div className="mb-6">
          <Link to="/app" className="auth-web-back mb-3">
            <i className="ph ph-caret-left" /> Voltar
          </Link>
          <h2 className="t-titulo-pagina">Nova senha</h2>
          <p className="t-corpo-2 text-fg-2 mt-2">Crie uma senha segura para sua conta</p>
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
          <div>
            <PasswordInput
              id="nova-senha"
              label="Nova senha"
              placeholder="Mínimo 8 caracteres"
              show={showSenha}
              password={senha}
              onToggle={() => setShowSenha(!showSenha)}
              onChange={setSenha}
            />
            {strengthBar}
          </div>
          <PasswordInput
            id="confirmar-nova"
            label="Confirmar nova senha"
            placeholder="Repita a nova senha"
            show={showConfirmar}
            password={confirmar}
            onToggle={() => setShowConfirmar(!showConfirmar)}
            onChange={setConfirmar}
          />
          <Button variant="primary" size="md" type="submit" fullWidth disabled={!valid}>
            Redefinir senha
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

      <form className="bottom-sheet bottom-sheet-lg pb-8" onSubmit={handleSubmit} noValidate>
        <div className="sheet-header">
          <Link to="/app" className="back" aria-label="Voltar"><CaretLeft size={20} /></Link>
          <div className="title">Nova senha</div>
        </div>
        <p className="t-corpo-2 text-fg-2 mb-3">Crie uma senha segura para sua conta</p>
        <div>
          <PasswordInput
            id="nova-senha-mobile"
            label="Nova senha"
            placeholder="Mínimo 8 caracteres"
            show={showSenha}
            password={senha}
            onToggle={() => setShowSenha(!showSenha)}
            onChange={setSenha}
          />
          {strengthBar}
        </div>
        <PasswordInput
          id="confirmar-nova-mobile"
          label="Confirmar nova senha"
          placeholder="Repita a nova senha"
          show={showConfirmar}
          password={confirmar}
          onToggle={() => setShowConfirmar(!showConfirmar)}
          onChange={setConfirmar}
        />
        <Button variant="primary" size="lg" type="submit" fullWidth disabled={!valid}>
          Redefinir senha
        </Button>
      </form>
    </MobileFrame>
  )
}
