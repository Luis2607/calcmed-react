import { useState } from 'react'
import DSPanel from '../DSPanel'

const durations = [
  { name: '--dur-fast', value: '100ms', use: 'Hover, focus, micro-interacoes' },
  { name: '--dur-normal', value: '200ms', use: 'Transicoes padrao (botoes, inputs)' },
  { name: '--dur-slow', value: '300ms', use: 'Modais, animacoes complexas' },
  { name: '--dur-sheet', value: '400ms', use: 'Bottom sheets, sidebars' },
]

const easings = [
  { name: '--ease-default', value: 'cubic-bezier(0.2, 0, 0, 1)', desc: 'Desaceleracao natural. Uso geral para transicoes de entrada e saida.' },
  { name: '--ease-spring', value: 'cubic-bezier(0.34, 1.56, 0.64, 1)', desc: 'Bounce sutil. Ideal para modais, toasts e feedbacks de confirmacao.' },
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
        Motion e o sistema de animacoes e transicoes do CalcMed. Animacoes bem calibradas
        dao feedback instantaneo ao profissional de saude, confirmando que uma acao foi registrada
        (ex: dose calculada, alerta reconhecido). Sao 4 duracoes semanticas (fast, normal, slow, sheet)
        e 2 curvas de easing. Todas as animacoes respeitam a preferencia do sistema operacional
        via prefers-reduced-motion, desabilitando-se automaticamente quando necessario.
      </p>

      <div className="ds-subsection">
        <h3>Duracoes</h3>
        <p className="t-corpo-2 text-fg-2 mb-3">
          Cada duracao tem um proposito especifico. Use duracoes curtas (fast) para feedback
          imediato em interacoes frequentes e duracoes longas (sheet) para transicoes de
          paineis e navegacao, onde o usuario precisa acompanhar o movimento.
        </p>
        <DSPanel title="Duracoes de animacao">
          {durations.map(d => (
            <div className="ds-motion-row" key={d.name}>
              <span className="ds-motion-label">{d.name}</span>
              <span className="t-valor-mono text-fg-3" style={{ minWidth: 60 }}>{d.value}</span>
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
        <p className="t-corpo-2 text-fg-2 mb-3">
          As curvas de easing definem a aceleracao e desaceleracao das animacoes.
          Uma curva bem escolhida torna a interface mais natural e previsivel,
          reduzindo a carga cognitiva em situacoes de estresse clinico.
        </p>
        <DSPanel title="Curvas de easing">
          {easings.map(e => (
            <div key={e.name} className="mb-4 p-4 rounded-lg" style={{ border: '1px solid var(--border)', background: 'var(--bg-surface)' }}>
              <div className="flex gap-4 items-center mb-2">
                <span className="ds-token">{e.name}</span>
                <span className="t-valor-mono text-fg-3">{e.value}</span>
              </div>
              <p className="t-legenda text-fg-2">{e.desc}</p>
            </div>
          ))}
        </DSPanel>
      </div>

      <div className="ds-subsection">
        <h3>Tokens de Opacidade</h3>
        <p className="t-corpo-2 text-fg-2 mb-3">
          Opacidade semantica para estados interativos e overlays. Valores padronizados
          garantem consistencia visual em toda a aplicacao e atendem aos requisitos de
          contraste WCAG para elementos desabilitados e sobreposicoes.
        </p>
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
                <div className="mb-2 rounded" style={{
                  width: 64, height: 64,
                  background: 'var(--btn-primary)',
                  opacity: parseFloat(o.val),
                }} />
                <div className="t-texto-badge text-fg-2">{o.name}</div>
                <div className="t-valor-mono text-fg-3" style={{ fontSize: 10 }}>{o.val}</div>
              </div>
            ))}
          </div>
        </DSPanel>
      </div>

      <div className="ds-subsection">
        <h3>Reduced Motion</h3>
        <p className="t-corpo-2 text-fg-2 mb-3">
          Acessibilidade de movimento e obrigatoria. Usuarios com sensibilidade a animacoes
          (vestibular disorders) podem desativar movimentos no sistema operacional, e o CalcMed
          respeita essa preferencia automaticamente.
        </p>
        <div className="ds-guideline do">
          <div className="ds-guideline-label">Implementado</div>
          <p>
            A media query @media(prefers-reduced-motion: reduce) desabilita todas as animacoes
            e transicoes automaticamente. O efeito shimmer dos skeletons tambem e desabilitado.
          </p>
        </div>
      </div>
    </div>
  )
}
