const breakpoints = [
  { name: 'Mobile', range: '<600dp', cols: 4, margin: '24px', gutter: '16px' },
  { name: 'Tablet', range: '600-1023dp', cols: 8, margin: '32px', gutter: '24px' },
  { name: 'Desktop', range: '>=1024dp', cols: 12, margin: '48px', gutter: '24px' },
]

const bpTokens = [
  { name: '--bp-sm', value: '320px' },
  { name: '--bp-md', value: '390px' },
  { name: '--bp-lg', value: '428px' },
  { name: '--bp-tablet', value: '768px' },
  { name: '--bp-desktop', value: '1024px' },
]

export default function DSGrid() {
  return (
    <div>
      <h2 className="ds-section-title">Grid</h2>
      <p className="ds-section-desc">
        3 breakpoints. Mobile (&lt;600dp): 4 colunas, margin 24px, gutter 16px.
        O grid e documentacional; no app mobile (390px), utilizamos 4 colunas com padding lateral de 20-24px.
      </p>

      <div className="ds-subsection">
        <h3>Breakpoints</h3>
        <div style={{ display: 'grid', gap: 16 }}>
          {breakpoints.map(bp => (
            <div className="ds-bp-card" key={bp.name}>
              <h4>{bp.name} <span style={{ font: "400 13px 'JetBrains Mono'", color: 'var(--fg-3)' }}>({bp.range})</span></h4>
              <div className="ds-bp-specs">
                <span className="ds-bp-spec">{bp.cols} colunas</span>
                <span className="ds-bp-spec">margin: {bp.margin}</span>
                <span className="ds-bp-spec">gutter: {bp.gutter}</span>
              </div>
              <div className="ds-grid-vis">
                {Array.from({ length: bp.cols }).map((_, i) => (
                  <div className="col-v" key={i} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="ds-subsection">
        <h3>Tokens de Breakpoint</h3>
        <table className="ds-token-table">
          <thead>
            <tr><th>Token</th><th>Valor</th><th>Uso</th></tr>
          </thead>
          <tbody>
            {bpTokens.map(t => (
              <tr key={t.name}>
                <td><span className="ds-token">{t.name}</span></td>
                <td style={{ font: "400 13px 'JetBrains Mono'" }}>{t.value}</td>
                <td style={{ color: 'var(--fg-3)' }}>Documentacional (nao em media queries)</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="ds-subsection">
        <h3>Classes Utilitarias de Layout</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 8 }}>
          {[
            { cls: '.grid-2col', desc: '2 colunas iguais, gap 12px' },
            { cls: '.grid-3col', desc: '3 colunas iguais, gap 12px' },
            { cls: '.container', desc: 'max-width 1440px, centralizado' },
            { cls: '.flex', desc: 'Display flex' },
            { cls: '.flex-col', desc: 'Flex column' },
            { cls: '.justify-between', desc: 'Space between' },
          ].map(u => (
            <div key={u.cls} style={{ padding: 12, borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-surface)' }}>
              <div style={{ font: "500 12px 'JetBrains Mono'", color: 'var(--btn-primary)', marginBottom: 4 }}>{u.cls}</div>
              <div style={{ font: "400 12px 'Inter'", color: 'var(--fg-3)' }}>{u.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
