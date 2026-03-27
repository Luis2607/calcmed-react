import Button from '../components/ui/Button'

export default function LandingPage() {
  return (
    <div className="landing-page">
      <div className="landing-bg-pattern" />
      <div className="landing-card">
        <img src="/assets/Icone.svg" width={80} height={80} alt="CalcMed" className="brand-icon" />
        <h1 className="t-marca mt-4">Calc<span className="dot">.</span>Med</h1>
        <p className="t-texto-badge text-fg-3 mt-1" style={{ letterSpacing: 2, textTransform: 'uppercase' }}>
          Urgencia e Emergencia
        </p>
        <span className="landing-version">v1.0</span>
        <p className="t-corpo-2 text-fg-2 mt-6 text-center" style={{ maxWidth: 360 }}>
          Escolha o que deseja visualizar
        </p>
        <div className="landing-buttons mt-8">
          <Button variant="primary" size="lg" href="/app" fullWidth className="landing-btn">
            <i className="ph ph-device-mobile" /> Prototipo do App
          </Button>
          <Button variant="ghost" size="lg" href="/design-system" fullWidth className="landing-btn">
            <i className="ph ph-palette" /> Design System
          </Button>
        </div>
        <div className="landing-stats mt-6">
          <span>18 telas interativas</span>
          <span className="landing-stats-dot" />
          <span>20 secoes documentadas</span>
        </div>
      </div>
    </div>
  )
}
