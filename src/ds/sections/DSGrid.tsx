import DSPanel from '../DSPanel'

const breakpoints = [
  { name: 'Mobile', range: '<600dp', cols: 4, margin: '24px', gutter: '16px' },
  { name: 'Tablet', range: '600-1023dp', cols: 8, margin: '32px', gutter: '24px' },
  { name: 'Desktop', range: '>=1024dp', cols: 12, margin: '48px', gutter: '24px' },
]

const bpTokens = [
  { name: '--bp-sm', value: '320px', uso: 'Menor dispositivo suportado' },
  { name: '--bp-md', value: '390px', uso: 'iPhone 14/15 (refer\u00eancia principal)' },
  { name: '--bp-lg', value: '428px', uso: 'Dispositivos Android maiores' },
  { name: '--bp-tablet', value: '768px', uso: 'Tablets em retrato' },
  { name: '--bp-desktop', value: '1024px', uso: 'Desktop e tablets em paisagem' },
]

export default function DSGrid() {
  return (
    <div>
      <h2 className="ds-section-title">Grid</h2>
      <p className="ds-section-desc">
        Sistema de grid com 3 breakpoints responsivos. No app mobile (390px, refer{"\u00ea"}ncia iPhone 14),
        utilizamos 4 colunas com padding lateral de 20-24px.
      </p>
      <p className="ds-section-desc">
        O grid {"\u00e9"} documentacional: serve como guia de alinhamento para o design, garantindo que elementos
        cl{"\u00ed"}nicos como cards de dose e alertas mantenham propor{"\u00e7\u00f5"}es consistentes em qualquer tamanho de tela.
      </p>

      {/* Quando usar */}
      <div className="ds-subsection">
        <h3>Quando usar</h3>
        <div className="flex gap-8 mb-6">
          <div className="flex-1">
            <div className="t-texto-badge text-success mb-3" style={{ textTransform: 'uppercase', letterSpacing: 1 }}>Use quando</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li className="flex gap-2 items-start mb-2"><i className="ph ph-check-circle" style={{ color: 'var(--success)', flexShrink: 0, marginTop: 2 }} /><span className="t-corpo-2">Organizar listas de cards em 2 colunas no mobile (grid-2col)</span></li>
              <li className="flex gap-2 items-start mb-2"><i className="ph ph-check-circle" style={{ color: 'var(--success)', flexShrink: 0, marginTop: 2 }} /><span className="t-corpo-2">Exibir conte{"\u00fa"}do em 4 colunas no desktop para melhor aproveitamento do espa{"\u00e7"}o</span></li>
              <li className="flex gap-2 items-start mb-2"><i className="ph ph-check-circle" style={{ color: 'var(--success)', flexShrink: 0, marginTop: 2 }} /><span className="t-corpo-2">Alinhar campos de formul{"\u00e1"}rio e resultados de dose ao grid para consist{"\u00ea"}ncia visual</span></li>
            </ul>
          </div>
          <div className="flex-1">
            <div className="t-texto-badge text-danger mb-3" style={{ textTransform: 'uppercase', letterSpacing: 1 }}>N{"\u00e3"}o use quando</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li className="flex gap-2 items-start mb-2"><i className="ph ph-x-circle" style={{ color: 'var(--danger)', flexShrink: 0, marginTop: 2 }} /><span className="t-corpo-2">For{"\u00e7"}ar layout de tablet (8 colunas) em telas mobile. Respeite os breakpoints</span></li>
              <li className="flex gap-2 items-start mb-2"><i className="ph ph-x-circle" style={{ color: 'var(--danger)', flexShrink: 0, marginTop: 2 }} /><span className="t-corpo-2">Usar grid para conte{"\u00fa"}do sequencial (listas de alertas). Use flex-col</span></li>
              <li className="flex gap-2 items-start mb-2"><i className="ph ph-x-circle" style={{ color: 'var(--danger)', flexShrink: 0, marginTop: 2 }} /><span className="t-corpo-2">Ignorar as margens laterais do grid. Elas garantem {"\u00e1"}rea de respira{"\u00e7\u00e3"}o no mobile</span></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="ds-subsection">
        <h3>Breakpoints</h3>
        <p className="t-corpo-2 text-fg-2 mb-4">
          Cada breakpoint define n{"\u00fa"}mero de colunas, margem lateral e gutter (espa{"\u00e7"}o entre colunas).
          A visualiza{"\u00e7\u00e3"}o abaixo mostra a propor{"\u00e7\u00e3"}o de colunas em cada faixa de tamanho.
        </p>
        <DSPanel title="Visualiza\u00e7\u00e3o de colunas">
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
          Tokens documentacionais que registram os valores de refer{"\u00ea"}ncia. N{"\u00e3"}o s{"\u00e3"}o usados
          em media queries CSS, mas servem como fonte {"\u00fa"}nica de verdade para o design.
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
        <h3>Classes Utilit{"\u00e1"}rias de Layout</h3>
        <p className="t-corpo-2 text-fg-2 mb-4">
          Classes prontas para os padr{"\u00f5"}es de layout mais comuns. Combine-as com as classes
          de espa{"\u00e7"}amento (gap-*) para montar layouts rapidamente.
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
