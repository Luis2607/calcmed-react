import { useNavigate } from 'react-router-dom'
import { useLayout } from '../contexts/LayoutContext'
import Button from '../components/ui/Button'

export default function LandingPage() {
  const navigate = useNavigate()
  const { setLayoutMode } = useLayout()

  const goMobile = () => {
    setLayoutMode('mobile')
    navigate('/app')
  }

  const goWeb = () => {
    setLayoutMode('web')
    navigate('/app')
  }

  return (
    <div className="landing-page">
      <div className="landing-bg-pattern" />
      <div className="landing-card">
        <img src="/assets/Icone.svg" width={80} height={80} alt="CalcMed" className="brand-icon" />
        <h1 className="t-marca mt-4">Calc<span className="dot">.</span>Med</h1>
        <p className="t-texto-badge text-fg-3 mt-1 brand-sub">
          Urgência e Emergência
        </p>
        <span className="landing-version">v1.0</span>
        <p className="t-corpo-2 text-fg-2 mt-6 text-center max-w-360">
          Escolha como deseja visualizar o protótipo
        </p>
        <div className="landing-buttons mt-6">
          <Button variant="primary" size="lg" onClick={goMobile} fullWidth className="landing-btn">
            <i className="ph ph-device-mobile" /> App Mobile
          </Button>
          <Button variant="ghost" size="lg" onClick={goWeb} fullWidth className="landing-btn">
            <i className="ph ph-desktop" /> App Web
          </Button>
          <Button variant="text" size="lg" href="/design-system" fullWidth className="landing-btn">
            <i className="ph ph-palette" /> Design System
          </Button>
        </div>
        <div className="landing-stats mt-6">
          <span>18 telas interativas</span>
          <span className="landing-stats-dot" />
          <span>28 seções documentadas</span>
        </div>
      </div>
    </div>
  )
}
