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
        Elevacao e o sistema de sombras que cria hierarquia visual entre camadas da interface.
        No contexto medico, ela ajuda o profissional a distinguir rapidamente o conteudo principal
        (cards de dose, alertas) de elementos secundarios. Sao 6 niveis (0 a 5): nivel 0 e flat,
        nivel 5 e reservado para modais e overlays criticos. Em dark mode, as sombras tem menor
        intensidade visual e a diferenciacao e feita por cor de superficie.
      </p>

      <div className="ds-subsection">
        <h3>Niveis de Sombra</h3>
        <p className="t-corpo-2 text-fg-2 mb-3">
          Cada nivel representa uma camada de profundidade. Use niveis mais baixos para conteudo
          estatico e niveis mais altos para elementos que exigem atencao imediata, como alertas
          criticos e modais de confirmacao de dose.
        </p>
        <DSPanel>
          <ElevationGrid bg="var(--bg-card)" />
        </DSPanel>
      </div>

      <div className="ds-subsection">
        <h3>Tokens</h3>
        <p className="t-corpo-2 text-fg-2 mb-3">
          Referencia completa dos tokens de sombra. Sempre use o token semantico (ex: var(--shadow-2))
          em vez de valores literais, para garantir consistencia entre Light e Dark mode.
        </p>
        <table className="ds-token-table">
          <thead>
            <tr><th>Token</th><th>Valor</th><th>Uso</th></tr>
          </thead>
          <tbody>
            {shadows.map(s => (
              <tr key={s.level}>
                <td><span className="ds-token">{s.token}</span></td>
                <td className="t-valor-mono" style={{ maxWidth: 300, wordBreak: 'break-all' }}>{s.value}</td>
                <td className="t-legenda text-fg-3">
                  {s.level === 0 && 'Flat / sem elevacao'}
                  {s.level === 1 && 'Cards, itens de lista'}
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
        <h3>Escala de Z-Index</h3>
        <p className="t-corpo-2 text-fg-2 mb-3">
          O z-index controla a ordem de empilhamento dos elementos. Em uma interface de emergencia,
          e essencial que toasts de alerta e modais de confirmacao fiquem sempre visiveis acima de
          qualquer outro conteudo. Use os tokens abaixo para evitar conflitos de camada.
        </p>
        <table className="ds-token-table">
          <thead>
            <tr><th>Token</th><th>Valor</th><th>Uso</th></tr>
          </thead>
          <tbody>
            {[
              { token: '--z-base', val: '0', use: 'Conteudo padrao' },
              { token: '--z-sticky', val: '100', use: 'Headers sticky, FAB' },
              { token: '--z-dropdown', val: '200', use: 'Dropdowns, opcoes de select' },
              { token: '--z-overlay', val: '300', use: 'Overlay/scrim' },
              { token: '--z-modal', val: '400', use: 'Modais, dialogs' },
              { token: '--z-toast', val: '500', use: 'Toasts, snackbars' },
              { token: '--z-tooltip', val: '600', use: 'Tooltips' },
            ].map(z => (
              <tr key={z.token}>
                <td><span className="ds-token">{z.token}</span></td>
                <td className="t-valor-mono">{z.val}</td>
                <td className="t-legenda text-fg-3">{z.use}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
