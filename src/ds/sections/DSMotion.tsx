import { useState } from 'react'
import DSPanel from '../DSPanel'

const durations = [
  { name: '--dur-fast', value: '100ms', use: 'Hover, focus, micro-interacoes' },
  { name: '--dur-normal', value: '200ms', use: 'Transicoes padrao (botoes, inputs)' },
  { name: '--dur-slow', value: '300ms', use: 'Modais, animacoes complexas' },
  { name: '--dur-sheet', value: '400ms', use: 'Bottom sheets, sidebars' },
]

const easings = [
  { name: '--ease-default', value: 'cubic-bezier(0.2, 0, 0, 1)', desc: 'Deceleracao natural. Uso geral.' },
  { name: '--ease-spring', value: 'cubic-bezier(0.34, 1.56, 0.64, 1)', desc: 'Bounce sutil. Modais, toasts.' },
]

export default function DSMotion() {
  const [moved, setMoved] = useState<Record<string, boolean>>({})

  const toggle = (name: string) => {
    setMoved(prev => ({ ...prev, [name]: !prev[name] }))
  }

  return (
    <div>
      <h2 className="ds-section-title">Motion</h2>
      <p className="ds-section-desc">
        4 duracoes semanticas: fast, normal, slow, sheet. 2 curvas de easing.
        Respeita prefers-reduced-motion: todas as animacoes sao desabilitadas automaticamente.
      </p>

      <div className="ds-subsection">
        <h3>Duracoes</h3>
        <DSPanel title="Duracoes de animacao">
          {durations.map(d => (
            <div className="ds-motion-row" key={d.name}>
              <span className="ds-motion-label">{d.name}</span>
              <span className="t-legenda text-fg-3" style={{ fontFamily: "'JetBrains Mono'", minWidth: 60 }}>{d.value}</span>
              <div
                className={`ds-motion-box${moved[d.name] ? ' moved' : ''}`}
                style={{ transitionDuration: `var(${d.name})` }}
              />
              <button className="ds-motion-trigger" onClick={() => toggle(d.name)}>
                {moved[d.name] ? 'Reset' : 'Animar'}
              </button>
              <span className="t-legenda text-fg-3 flex-1">{d.use}</span>
            </div>
          ))}
        </DSPanel>
      </div>

      <div className="ds-subsection">
        <h3>Curvas de Easing</h3>
        <DSPanel title="Curvas de easing">
          {easings.map(e => (
            <div key={e.name} className="mb-4 p-4" style={{ borderRadius: 12, border: '1px solid var(--border)', background: 'var(--bg-surface)' }}>
              <div className="flex gap-4 items-center mb-2">
                <span className="ds-token">{e.name}</span>
                <span className="t-legenda text-fg-3" style={{ fontFamily: "'JetBrains Mono'" }}>{e.value}</span>
              </div>
              <p className="t-legenda text-fg-2">{e.desc}</p>
            </div>
          ))}
        </DSPanel>
      </div>

      <div className="ds-subsection">
        <h3>Opacity Tokens</h3>
        <DSPanel title="Tokens de opacidade">
          <div className="flex gap-4 flex-wrap">
            {[
              { name: '--opacity-disabled', val: '0.38' },
              { name: '--opacity-hover', val: '0.08' },
              { name: '--opacity-pressed', val: '0.12' },
              { name: '--opacity-scrim', val: '0.5' },
              { name: '--opacity-overlay', val: '0.6' },
            ].map(o => (
              <div key={o.name} className="text-center">
                <div className="mb-2" style={{
                  width: 64, height: 64, borderRadius: 8,
                  background: 'var(--btn-primary)',
                  opacity: parseFloat(o.val),
                }} />
                <div className="t-texto-badge text-fg-2" style={{ fontFamily: "'JetBrains Mono'", fontWeight: 500 }}>{o.name}</div>
                <div className="t-texto-badge text-fg-3" style={{ fontFamily: "'JetBrains Mono'", fontWeight: 400, fontSize: 10 }}>{o.val}</div>
              </div>
            ))}
          </div>
        </DSPanel>
      </div>

      <div className="ds-subsection">
        <h3>Reduced Motion</h3>
        <div className="ds-guideline do">
          <div className="ds-guideline-label">Implementado</div>
          <p>
            Media query @media(prefers-reduced-motion:reduce) desabilita todas as animacoes e transicoes
            automaticamente. Skeleton shimmer tambem e desabilitado.
          </p>
        </div>
      </div>
    </div>
  )
}
