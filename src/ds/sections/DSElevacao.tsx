import DSPanel from '../DSPanel'

const shadows = [
  { level: 0, token: '--shadow-0', value: 'none' },
  { level: 1, token: '--shadow-1', value: '0 1px 2px rgba(0,0,0,0.06)' },
  { level: 2, token: '--shadow-2', value: '0 2px 4px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)' },
  { level: 3, token: '--shadow-3', value: '0 4px 8px rgba(0,0,0,0.10), 0 2px 4px rgba(0,0,0,0.06)' },
  { level: 4, token: '--shadow-4', value: '0 8px 16px rgba(0,0,0,0.12), 0 4px 8px rgba(0,0,0,0.08)' },
  { level: 5, token: '--shadow-5', value: '0 12px 24px rgba(0,0,0,0.16), 0 6px 12px rgba(0,0,0,0.10)' },
]

function ElevationGrid({ bg }: { bg: string }) {
  return (
    <div className="ds-elevation-demo">
      {shadows.map(s => (
        <div
          className="ds-elevation-card"
          key={s.level}
          style={{ boxShadow: `var(${s.token})`, background: bg }}
        >
          <div>{s.level}</div>
        </div>
      ))}
    </div>
  )
}

export default function DSElevacao() {
  return (
    <div>
      <h2 className="ds-section-title">Elevacao</h2>
      <p className="ds-section-desc">
        6 niveis de sombra (0-5). Nivel 0 e flat, nivel 5 para modais e overlays.
        Em dark mode, sombras tem menor intensidade visual; a diferenciacao e feita por cor de superficie.
      </p>

      <div className="ds-subsection">
        <h3>Niveis de Sombra</h3>
        <DSPanel>
          <ElevationGrid bg="var(--bg-card)" />
        </DSPanel>
      </div>

      <div className="ds-subsection">
        <h3>Tokens</h3>
        <table className="ds-token-table">
          <thead>
            <tr><th>Token</th><th>Valor</th><th>Uso</th></tr>
          </thead>
          <tbody>
            {shadows.map(s => (
              <tr key={s.level}>
                <td><span className="ds-token">{s.token}</span></td>
                <td style={{ font: "400 12px 'JetBrains Mono'", maxWidth: 300, wordBreak: 'break-all' }}>{s.value}</td>
                <td style={{ color: 'var(--fg-3)', font: "400 13px 'Inter'" }}>
                  {s.level === 0 && 'Flat / sem elevacao'}
                  {s.level === 1 && 'Cards, items de lista'}
                  {s.level === 2 && 'Cards elevados, search bar'}
                  {s.level === 3 && 'Dropdowns, tooltips'}
                  {s.level === 4 && 'Mobile frame, FAB'}
                  {s.level === 5 && 'Modais, dialogs'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="ds-subsection">
        <h3>Z-Index Scale</h3>
        <table className="ds-token-table">
          <thead>
            <tr><th>Token</th><th>Valor</th><th>Uso</th></tr>
          </thead>
          <tbody>
            {[
              { token: '--z-base', val: '0', use: 'Conteudo padrao' },
              { token: '--z-sticky', val: '100', use: 'Headers sticky, FAB' },
              { token: '--z-dropdown', val: '200', use: 'Dropdowns, select options' },
              { token: '--z-overlay', val: '300', use: 'Overlay/scrim' },
              { token: '--z-modal', val: '400', use: 'Modais, dialogs' },
              { token: '--z-toast', val: '500', use: 'Toasts, snackbars' },
              { token: '--z-tooltip', val: '600', use: 'Tooltips' },
            ].map(z => (
              <tr key={z.token}>
                <td><span className="ds-token">{z.token}</span></td>
                <td style={{ font: "400 13px 'JetBrains Mono'" }}>{z.val}</td>
                <td style={{ color: 'var(--fg-3)' }}>{z.use}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
