import DSPanel from '../DSPanel'

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
        <DSPanel title="Visualizacao de colunas">
          <div style={{ display: 'grid' }} className="gap-4">
            {breakpoints.map(bp => (
              <div className="ds-bp-card" key={bp.name}>
                <h4>{bp.name} <span className="t-legenda text-fg-3" style={{ fontFamily: "'JetBrains Mono'" }}>({bp.range})</span></h4>
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
        </DSPanel>
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
                <td className="t-legenda" style={{ fontFamily: "'JetBrains Mono'" }}>{t.value}</td>
                <td className="text-fg-3">Documentacional (nao em media queries)</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="ds-subsection">
        <h3>Classes Utilitarias de Layout</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }} className="gap-2">
          {[
            { cls: '.grid-2col', desc: '2 colunas iguais, gap 12px' },
            { cls: '.grid-3col', desc: '3 colunas iguais, gap 12px' },
            { cls: '.container', desc: 'max-width 1440px, centralizado' },
            { cls: '.flex', desc: 'Display flex' },
            { cls: '.flex-col', desc: 'Flex column' },
            { cls: '.justify-between', desc: 'Space between' },
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
