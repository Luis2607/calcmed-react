import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CaretLeft } from '@phosphor-icons/react'
import MobileFrame from '../components/layout/MobileFrame'
import Button from '../components/ui/Button'
import InputField from '../components/forms/InputField'

export default function EmailPage() {
  const [email, setEmail] = useState('')
  const [touched, setTouched] = useState(false)
  const valid = email.includes('@') && email.includes('.')
  const showError = touched && email.length > 0 && !valid

  return (
    <MobileFrame darkFrame>
      <div className="hero-dark flex-1">
        <div className="carousel-bg">
          <div className="slide-bg active" style={{ backgroundImage: "url('/assets/slide-3.png')" }} />
        </div>
        <div className="hero-brand">
          <img src="/assets/Icone.svg" width={72} height={72} alt="CalcMed" className="brand-icon" />
          <div className="text-center">
            <div className="t-marca">Calc<span className="dot">.</span>Med</div>
            <div className="t-texto-badge brand-sub mt-1">Urgência e Emergência</div>
          </div>
          <div className="carousel-text mt-4">
            <div className="slide-text active">Feito por médicos de Urgência e Emergência</div>
          </div>
          <div className="dots mt-3">
            <div className="inactive" /><div className="active" /><div className="inactive" />
          </div>
        </div>
      </div>

      <div className="bottom-sheet">
        <div className="sheet-header">
          <Link to="/app" className="back" aria-label="Voltar"><CaretLeft size={20} /></Link>
          <div className="title">Entrar</div>
        </div>
        <InputField
          id="email"
          label="Seu e-mail"
          type="email"
          placeholder="medico@hospital.com"
          value={email}
          onChange={(val) => { setEmail(val); if (!touched) setTouched(true); }}
          error={showError ? 'Insira um e-mail válido' : undefined}
        />
        {valid ? (
          <Button variant="primary" size="md" href="/login/senha" fullWidth>
            Continuar
          </Button>
        ) : (
          <Button variant="primary" size="md" fullWidth disabled>
            Continuar
          </Button>
        )}
      </div>
    </MobileFrame>
  )
}
