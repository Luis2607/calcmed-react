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
      <h2 className="ds-section-title">Espacamento</h2>
      <p className="ds-section-desc">
        Base 4px. Todos os valores sao multiplos de 4. 12 tokens de espacamento cobrindo de 4px a 96px.
      </p>

      <div className="ds-subsection">
        <h3>Escala de Espacamento</h3>
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
                <div className="t-legenda text-fg-2" style={{ fontWeight: 500, fontFamily: "'JetBrains Mono'" }}>--{r.name}</div>
                <div className="t-texto-badge text-fg-3" style={{ fontFamily: "'JetBrains Mono'", fontWeight: 400 }}>{r.value}</div>
              </div>
            ))}
          </div>
        </DSPanel>
      </div>

      <div className="ds-subsection">
        <h3>Classes Utilitarias</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }} className="gap-2">
          {[
            { cls: '.p-1 a .p-8', desc: 'Padding' },
            { cls: '.px-4, .px-6, .px-8', desc: 'Padding horizontal' },
            { cls: '.py-2 a .py-6', desc: 'Padding vertical' },
            { cls: '.mt-1 a .mt-8', desc: 'Margin top' },
            { cls: '.mb-1 a .mb-6', desc: 'Margin bottom' },
            { cls: '.gap-1 a .gap-8', desc: 'Flex/Grid gap' },
          ].map(u => (
            <div key={u.cls} style={{ borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-surface)' }} className="p-3">
              <div className="t-legenda mb-1" style={{ fontWeight: 500, fontFamily: "'JetBrains Mono'", color: 'var(--btn-primary)' }}>{u.cls}</div>
              <div className="t-legenda text-fg-3">{u.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
