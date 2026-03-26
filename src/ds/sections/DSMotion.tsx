import { useState } from 'react'
import DSPanel from '../DSPanel'

const durations = [
  { name: '--dur-fast', value: '100ms', use: 'Hover, focus, micro-interações' },
  { name: '--dur-normal', value: '200ms', use: 'Transições padrão (botões, inputs)' },
  { name: '--dur-slow', value: '300ms', use: 'Modais, animações complexas' },
  { name: '--dur-sheet', value: '400ms', use: 'Bottom sheets, sidebars' },
]

const easings = [
  { name: '--ease-default', value: 'cubic-bezier(0.2, 0, 0, 1)', desc: 'Desaceleração natural. Uso geral para transições de entrada e saída.' },
  { name: '--ease-spring', value: 'cubic-bezier(0.34, 1.56, 0.64, 1)', desc: 'Bounce sutil. Ideal para modais, toasts e feedbacks de confirmação.' },
]

export default function DSMotion() {
  const [moved, setMoved] = useState<Record<string, boolean>>({})

  const toggle = (name: string) => {
    setMoved(prev => ({ ...prev, [name]: !prev[name] }))
  }

  return (
    <div>
      <h2 className="ds-section-title">Animações</h2>
      <p className="ds-section-desc">
        Animações é o sistema de animações e transições do CalcMed. Animações bem calibradas
        dão feedback instantâneo ao profissional de saúde, confirmando que uma ação foi registrada
        (ex: dose calculada, alerta reconhecido). São 4 durações semânticas (fast, normal, slow, sheet)
        e 2 curvas de easing. Todas as animações respeitam a preferência do sistema operacional
        via prefers-reduced-motion, desabilitando-se automaticamente quando necessário.
      </p>

      <div className="ds-subsection">
        <h3>Durações</h3>
        <p className="t-corpo-2 text-fg-2 mb-3">
          Cada duração tem um propósito específico. Use durações curtas (fast) para feedback
          imediato em interações frequentes e durações longas (sheet) para transições de
          painéis e navegação, onde o usuário precisa acompanhar o movimento.
        </p>
        <DSPanel title="Durações de animação">
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
          As curvas de easing definem a aceleração e desaceleração das animações.
          Uma curva bem escolhida torna a interface mais natural e previsível,
          reduzindo a carga cognitiva em situações de estresse clínico.
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
          Opacidade semântica para estados interativos e overlays. Valores padronizados
          garantem consistência visual em toda a aplicação e atendem aos requisitos de
          contraste WCAG para elementos desabilitados e sobreposições.
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
          Acessibilidade de movimento é obrigatória. Usuários com sensibilidade a animações
          (vestibular disorders) podem desativar movimentos no sistema operacional, e o CalcMed
          respeita essa preferência automaticamente.
        </p>
        <div className="ds-guideline do">
          <div className="ds-guideline-label">Implementado</div>
          <p>
            A media query @media(prefers-reduced-motion: reduce) desabilita todas as animações
            e transições automaticamente. O efeito shimmer dos skeletons também é desabilitado.
          </p>
        </div>
      </div>
    </div>
  )
}
