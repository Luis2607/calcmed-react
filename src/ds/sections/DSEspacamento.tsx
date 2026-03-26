import DSPanel from '../DSPanel'

const spacingTokens = [
  { name: 'sp-1', px: '4px' },
  { name: 'sp-2', px: '8px' },
  { name: 'sp-3', px: '12px' },
  { name: 'sp-4', px: '16px' },
  { name: 'sp-5', px: '20px' },
  { name: 'sp-6', px: '24px' },
  { name: 'sp-8', px: '32px' },
  { name: 'sp-10', px: '40px' },
  { name: 'sp-12', px: '48px' },
  { name: 'sp-16', px: '64px' },
  { name: 'sp-20', px: '80px' },
  { name: 'sp-24', px: '96px' },
]

const radiusTokens = [
  { name: 'r-sm', value: '4px' },
  { name: 'r-md', value: '8px' },
  { name: 'r-lg', value: '12px' },
  { name: 'r-xl', value: '16px' },
  { name: 'r-pill', value: '100px' },
]

export default function DSEspacamento() {
  return (
    <div>
      <h2 className="ds-section-title">Espaçamento</h2>
      <p className="ds-section-desc">
        Sistema de espaçamento com base de 4px. Todos os valores são múltiplos de 4, criando
        um ritmo visual consistente em toda a interface. Os 12 tokens cobrem de 4px (micro-espaçamento
        entre ícone e texto) até 96px (separação entre seções). Em telas médicas, espaçamento
        adequado reduz erros de leitura e facilita a identificação rápida de informações críticas.
      </p>

      <div className="ds-subsection">
        <h3>Escala de Espaçamento</h3>
        <p className="t-corpo-2 text-fg-2 mb-4">
          Use sempre os tokens (--sp-1 a --sp-24) em vez de valores fixos em pixels.
          Isso permite ajustes globais de densidade sem alterar cada componente individualmente.
        </p>
        {spacingTokens.map(s => (
          <div className="ds-spacing-bar" key={s.name}>
            <span className="label">--{s.name}</span>
            <span className="px">{s.px}</span>
            <div className="bar" style={{ width: s.px }} />
          </div>
        ))}
      </div>

      <div className="ds-subsection">
        <h3>Border Radius</h3>
        <p className="t-corpo-2 text-fg-2 mb-4">
          5 tokens de arredondamento, de sutil (4px para badges) até pill (100px para botões
          de ação primária). O radius padrão para cards é --r-xl (16px), e para inputs é --r-lg (12px).
        </p>
        <DSPanel title="Tokens de radius">
          <div className="flex gap-6 flex-wrap">
            {radiusTokens.map(r => (
              <div key={r.name} className="text-center">
                <div
                  style={{
                    width: 64,
                    height: 64,
                    background: 'var(--teal-100)',
                    border: '2px solid var(--teal-300)',
                    borderRadius: `var(--${r.name})`,
                  }}
                  className="mb-2"
                />
                <div className="t-legenda text-fg-2 mb-1" style={{ fontFamily: "'JetBrains Mono'" }}>--{r.name}</div>
                <div className="t-legenda text-fg-3" style={{ fontFamily: "'JetBrains Mono'" }}>{r.value}</div>
              </div>
            ))}
          </div>
        </DSPanel>
      </div>

      <div className="ds-subsection">
        <h3>Classes Utilitárias</h3>
        <p className="t-corpo-2 text-fg-2 mb-4">
          Classes de conveniência para aplicar espaçamento rapidamente. Todas consomem os tokens
          CSS, mantendo a consistência do sistema.
        </p>
        <div className="ds-stat-grid">
          {[
            { cls: '.p-1 a .p-8', desc: 'Padding (todos os lados)' },
            { cls: '.px-4, .px-6, .px-8', desc: 'Padding horizontal' },
            { cls: '.py-2 a .py-6', desc: 'Padding vertical' },
            { cls: '.mt-1 a .mt-8', desc: 'Margin top' },
            { cls: '.mb-1 a .mb-6', desc: 'Margin bottom' },
            { cls: '.gap-1 a .gap-8', desc: 'Flex/Grid gap' },
          ].map(u => (
            <div key={u.cls} className="ds-bp-card">
              <div className="ds-token mb-1">{u.cls}</div>
              <div className="t-legenda text-fg-3">{u.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
