import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CaretLeft, Eye, EyeSlash } from '@phosphor-icons/react'
import MobileFrame from '../components/layout/MobileFrame'
import Button from '../components/ui/Button'
import InputField from '../components/forms/InputField'

export default function SenhaPage() {
  const [show, setShow] = useState(false)
  const [password, setPassword] = useState('')

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
          <Link to="/login/email" className="back" aria-label="Voltar"><CaretLeft size={20} /></Link>
          <div>
            <div className="title">Sua senha</div>
            <div className="subtitle">luis@gmail.com</div>
          </div>
        </div>
        <div className="input-group">
          <label htmlFor="password" className="input-label sr-only">Senha</label>
          <div className="input-password">
            <InputField
              id="password"
              label="Senha"
              type={show ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={setPassword}
              className="sr-only-label"
            />
            <button className="eye-toggle" type="button" onClick={() => setShow(!show)} aria-label="Mostrar ou ocultar senha">
              {show ? <Eye size={20} /> : <EyeSlash size={20} />}
            </button>
          </div>
        </div>
        <Button variant="primary" size="md" href="/onboarding/1" fullWidth>Entrar</Button>
        <div className="text-center">
          <Button variant="text" href="/login/recuperar">Esqueci minha senha</Button>
        </div>
      </div>
    </MobileFrame>
  )
}
