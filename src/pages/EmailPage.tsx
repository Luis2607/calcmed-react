import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CaretLeft } from '@phosphor-icons/react'
import MobileFrame from '../components/layout/MobileFrame'

export default function EmailPage() {
  const [email, setEmail] = useState('')
  const valid = email.includes('@') && email.includes('.')

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
          <Link to="/" className="back" aria-label="Voltar"><CaretLeft size={20} /></Link>
          <div className="title">Entrar</div>
        </div>
        <div className="input-group">
          <label htmlFor="email" className="input-label">Seu e-mail</label>
          <input
            className="input-field"
            id="email"
            type="email"
            placeholder="medico@hospital.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>
        <Link
          to="/login/senha"
          className={`btn btn-md btn-primary w-full text-center ${!valid ? 'disabled' : ''}`}
          style={!valid ? { pointerEvents: 'none' } : undefined}
        >
          Continuar
        </Link>
      </div>
    </MobileFrame>
  )
}
