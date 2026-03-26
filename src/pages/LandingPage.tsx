import { Link } from 'react-router-dom'

export default function LandingPage() {
  return (
    <div className="landing-page">
      <div className="landing-card">
        <img src="/assets/Icone.svg" width={80} height={80} alt="CalcMed" className="brand-icon" />
        <h1 className="t-marca mt-4">Calc<span className="dot">.</span>Med</h1>
        <p className="t-texto-badge text-fg-3 mt-1" style={{ letterSpacing: 2, textTransform: 'uppercase' }}>
          Urgência e Emergência
        </p>
        <p className="t-corpo-2 text-fg-2 mt-6 text-center" style={{ maxWidth: 360 }}>
          Escolha o que deseja visualizar
        </p>
        <div className="landing-buttons mt-8">
          <Link to="/app" className="btn btn-lg btn-primary w-full text-center">
            <i className="ph ph-device-mobile" /> Protótipo do App
          </Link>
          <Link to="/design-system" className="btn btn-lg btn-ghost w-full text-center">
            <i className="ph ph-palette" /> Design System
          </Link>
        </div>
      </div>
    </div>
  )
}
