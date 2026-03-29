import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CaretLeft } from '@phosphor-icons/react'
import MobileFrame from '../components/layout/MobileFrame'
import AuthWebLayout from '../components/layout/AuthWebLayout'
import Button from '../components/ui/Button'
import InputField from '../components/forms/InputField'
import { useLayout } from '../contexts/LayoutContext'

const especialidades = [
  'Emergência',
  'Clínica Médica',
  'Cirurgia',
  'UTI',
  'Pediatria',
  'Outro',
]

export default function PerfilInicialPage() {
  const { layoutMode } = useLayout()
  const navigate = useNavigate()
  const [crm, setCrm] = useState('')
  const [especialidade, setEspecialidade] = useState('')

  const handleContinuar = () => {
    navigate('/onboarding/1')
  }

  const crmInput = (
    <InputField
      id={layoutMode === 'web' ? 'crm' : 'crm-mobile'}
      label="CRM (opcional)"
      type="text"
      placeholder="CRM/UF 000000"
      value={crm}
      onChange={setCrm}
    />
  )

  const selectInput = (
    <div className="input-group">
      <label htmlFor={layoutMode === 'web' ? 'especialidade' : 'especialidade-mobile'} className="input-label">Especialidade (opcional)</label>
      <select
        className="input-field"
        id={layoutMode === 'web' ? 'especialidade' : 'especialidade-mobile'}
        value={especialidade}
        onChange={e => setEspecialidade(e.target.value)}
      >
        <option value="">Selecione uma especialidade</option>
        {especialidades.map(esp => (
          <option key={esp} value={esp}>{esp}</option>
        ))}
      </select>
    </div>
  )

  if (layoutMode === 'web') {
    return (
      <AuthWebLayout>
        <div className="mb-6">
          <h2 className="t-titulo-pagina">Complete seu perfil</h2>
          <p className="t-corpo-2 text-fg-2 mt-2">Informações opcionais para personalizar sua experiência</p>
        </div>

        <div className="flex flex-col gap-4">
          {crmInput}
          {selectInput}
          <div className="t-legenda text-fg-3 text-center">Etapa opcional</div>
          <Button variant="primary" size="md" fullWidth onClick={handleContinuar}>
            Continuar
          </Button>
          <div className="text-center">
            <Button variant="text" href="/onboarding/1">Pular</Button>
          </div>
        </div>
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

      <div className="bottom-sheet bottom-sheet-lg pb-8">
        <div className="sheet-header">
          <button type="button" className="back" aria-label="Voltar" onClick={() => navigate(-1)}><CaretLeft size={20} /></button>
          <div className="title">Complete seu perfil</div>
        </div>
        <p className="t-corpo-2 text-fg-2 mb-3">Informações opcionais para personalizar sua experiência</p>
        {crmInput}
        {selectInput}
        <div className="t-legenda text-fg-3 text-center mb-2">Etapa opcional</div>
        <Button variant="primary" size="lg" fullWidth onClick={handleContinuar}>
          Continuar
        </Button>
        <div className="text-center">
          <Button variant="text" href="/onboarding/1">Pular</Button>
        </div>
      </div>
    </MobileFrame>
  )
}
