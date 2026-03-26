import DSPanel from '../DSPanel'

const breakpoints = [
  { name: 'Mobile', range: '<600dp', cols: 4, margin: '24px', gutter: '16px' },
  { name: 'Tablet', range: '600-1023dp', cols: 8, margin: '32px', gutter: '24px' },
  { name: 'Desktop', range: '>=1024dp', cols: 12, margin: '48px', gutter: '24px' },
]

const bpTokens = [
  { name: '--bp-sm', value: '320px', uso: 'Menor dispositivo suportado' },
  { name: '--bp-md', value: '390px', uso: 'iPhone 14/15 (referência principal)' },
  { name: '--bp-lg', value: '428px', uso: 'Dispositivos Android maiores' },
  { name: '--bp-tablet', value: '768px', uso: 'Tablets em retrato' },
  { name: '--bp-desktop', value: '1024px', uso: 'Desktop e tablets em paisagem' },
]

export default function DSGrid() {
  return (
    <div>
      <h2 className="ds-section-title">Grid</h2>
      <p className="ds-section-desc">
        Sistema de grid com 3 breakpoints responsivos. No app mobile (390px, referência iPhone 14),
        utilizamos 4 colunas com padding lateral de 20-24px. O grid é documentacional: serve como
        guia de alinhamento para o design, garantindo que elementos clínicos como cards de dose
        e alertas mantenham proporções consistentes em qualquer tamanho de tela.
      </p>

      <div className="ds-subsection">
        <h3>Breakpoints</h3>
        <p className="t-corpo-2 text-fg-2 mb-4">
          Cada breakpoint define número de colunas, margem lateral e gutter (espaço entre colunas).
          A visualização abaixo mostra a proporção de colunas em cada faixa de tamanho.
        </p>
        <DSPanel title="Visualização de colunas">
          <div className="flex flex-col gap-4">
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
        <p className="t-corpo-2 text-fg-2 mb-4">
          Tokens documentacionais que registram os valores de referência. Não são usados
          em media queries CSS, mas servem como fonte única de verdade para o design.
        </p>
        <table className="ds-token-table">
          <thead>
            <tr><th>Token</th><th>Valor</th><th>Uso</th></tr>
          </thead>
          <tbody>
            {bpTokens.map(t => (
              <tr key={t.name}>
                <td><span className="ds-token">{t.name}</span></td>
                <td className="t-legenda" style={{ fontFamily: "'JetBrains Mono'" }}>{t.value}</td>
                <td className="text-fg-3">{t.uso}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="ds-subsection">
        <h3>Classes Utilitárias de Layout</h3>
        <p className="t-corpo-2 text-fg-2 mb-4">
          Classes prontas para os padrões de layout mais comuns. Combine-as com as classes
          de espaçamento (gap-*) para montar layouts rapidamente.
        </p>
        <div className="ds-stat-grid">
          {[
            { cls: '.grid-2col', desc: '2 colunas iguais, gap 12px' },
            { cls: '.grid-3col', desc: '3 colunas iguais, gap 12px' },
            { cls: '.container', desc: 'max-width 1440px, centralizado' },
            { cls: '.flex', desc: 'Display flex' },
            { cls: '.flex-col', desc: 'Flex column' },
            { cls: '.justify-between', desc: 'Space between' },
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
