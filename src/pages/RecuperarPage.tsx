import { Link } from 'react-router-dom'
import { CaretLeft, Envelope } from '@phosphor-icons/react'
import MobileFrame from '../components/layout/MobileFrame'
import Button from '../components/ui/Button'

export default function RecuperarPage() {
  return (
    <MobileFrame darkFrame>
      <div className="hero-dark flex-1">
        <div className="carousel-bg">
          <div className="slide-bg active" style={{ backgroundImage: "url('/assets/slide-1.png')" }} />
        </div>
        <div className="hero-brand">
          <img src="/assets/Icone.svg" width={72} height={72} alt="CalcMed" className="brand-icon" />
          <div className="text-center">
            <div className="t-marca">Calc<span className="dot">.</span>Med</div>
            <div className="t-texto-badge brand-sub mt-1">Urgência e Emergência</div>
          </div>
          <div className="carousel-text mt-4">
            <div className="slide-text active">Doses calculadas em segundos no PS</div>
          </div>
          <div className="dots mt-3">
            <div className="inactive" /><div className="inactive" /><div className="active" />
          </div>
        </div>
      </div>

      <div className="bottom-sheet bottom-sheet-lg">
        <div className="sheet-header">
          <Link to="/login/senha" className="back" aria-label="Voltar"><CaretLeft size={20} /></Link>
          <div className="title">Recuperar senha</div>
        </div>
        <div className="feedback-sent p-6">
          <div className="icon-circle icon-circle-teal"><Envelope size={24} /></div>
          <div className="msg">Enviamos um link de recuperação para<br /><strong>luis@gmail.com</strong><br />Verifique sua caixa de entrada.</div>
        </div>
        <Button variant="primary" size="lg" href="/app" fullWidth className="mt-auto">Voltar para o login</Button>
      </div>
    </MobileFrame>
  )
}
