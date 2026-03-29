import { useState, useMemo } from 'react'
import MobileFrame from '../components/layout/MobileFrame'
import PageHeader from '../components/layout/PageHeader'
import BottomNav from '../components/layout/BottomNav'
import { Minus, Plus, Moon } from '@phosphor-icons/react'

const COLORS = [
  'var(--btn-primary, #00b4d8)',
  'var(--success, #22c55e)',
  'var(--warning, #f59e0b)',
  'var(--danger, #ef4444)',
  'var(--link, #6366f1)',
  'var(--brand-red, #ef4444)',
]

export default function DividirDescansoPage() {
  const [medicos, setMedicos] = useState(3)
  const [duracao, setDuracao] = useState<12 | 24>(24)

  const blocos = useMemo(() => {
    const horasPorMedico = duracao / medicos
    return Array.from({ length: medicos }, (_, i) => ({
      id: i,
      label: `Medico ${i + 1}`,
      inicio: i * horasPorMedico,
      fim: (i + 1) * horasPorMedico,
      horas: horasPorMedico,
      color: COLORS[i % COLORS.length],
    }))
  }, [medicos, duracao])

  return (
    <MobileFrame>
      <PageHeader title="Dividir Descanso" backTo="/menu" />

      <div className="screen-content flex-1 overflow-y-auto p-5">
        {/* Inputs */}
        <div className="descanso-inputs">
          <div className="descanso-field">
            <label className="t-legenda text-fg-3 mb-2 block">Numero de medicos</label>
            <div className="descanso-stepper">
              <button
                className="stepper-btn"
                onClick={() => setMedicos(prev => Math.max(2, prev - 1))}
                disabled={medicos <= 2}
                aria-label="Diminuir medicos"
              >
                <Minus size={18} weight="bold" />
              </button>
              <span className="stepper-value">{medicos}</span>
              <button
                className="stepper-btn"
                onClick={() => setMedicos(prev => Math.min(6, prev + 1))}
                disabled={medicos >= 6}
                aria-label="Aumentar medicos"
              >
                <Plus size={18} weight="bold" />
              </button>
            </div>
          </div>

          <div className="descanso-field">
            <label className="t-legenda text-fg-3 mb-2 block">Duracao do plantao</label>
            <div className="descanso-segmented">
              <button
                className={`segmented-option ${duracao === 12 ? 'active' : ''}`}
                onClick={() => setDuracao(12)}
              >
                12h
              </button>
              <button
                className={`segmented-option ${duracao === 24 ? 'active' : ''}`}
                onClick={() => setDuracao(24)}
              >
                24h
              </button>
            </div>
          </div>
        </div>

        {/* Result */}
        <div className="descanso-result">
          <div className="descanso-result-header">
            <Moon size={20} className="text-fg-3" />
            <span className="t-alerta-titulo">
              {(duracao / medicos).toFixed(1).replace('.0', '')}h de descanso por medico
            </span>
          </div>

          {/* Timeline */}
          <div className="descanso-timeline" role="img" aria-label={`Timeline de descanso: ${medicos} medicos, ${duracao}h`}>
            <div className="descanso-timeline-bar">
              {blocos.map(b => (
                <div
                  key={b.id}
                  className="descanso-block"
                  style={{
                    width: `${(b.horas / duracao) * 100}%`,
                    background: b.color,
                  }}
                  title={`${b.label}: ${b.inicio}h - ${b.fim}h`}
                />
              ))}
            </div>
            <div className="descanso-timeline-labels">
              <span className="t-legenda text-fg-3">0h</span>
              {duracao === 24 && <span className="t-legenda text-fg-3">12h</span>}
              <span className="t-legenda text-fg-3">{duracao}h</span>
            </div>
          </div>

          {/* Legend */}
          <div className="descanso-legend">
            {blocos.map(b => (
              <div key={b.id} className="descanso-legend-item">
                <div className="descanso-legend-dot" style={{ background: b.color }} />
                <span className="t-legenda">{b.label}</span>
                <span className="t-legenda text-fg-3">{b.inicio}h - {b.fim}h</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <BottomNav />
    </MobileFrame>
  )
}
