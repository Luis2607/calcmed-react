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
      <h2 className="ds-section-title">Elevação</h2>
      <p className="ds-section-desc">
        Elevação é o sistema de sombras que cria hierarquia visual entre camadas da interface.
        No contexto médico, ela ajuda o profissional a distinguir rapidamente o conteúdo principal
        (cards de dose, alertas) de elementos secundários. São 6 níveis (0 a 5): nível 0 é flat,
        nível 5 é reservado para modais e overlays críticos. Em dark mode, as sombras têm menor
        intensidade visual e a diferenciação é feita por cor de superfície.
      </p>

      <div className="ds-subsection">
        <h3>Níveis de Sombra</h3>
        <p className="t-corpo-2 text-fg-2 mb-3">
          Cada nível representa uma camada de profundidade. Use níveis mais baixos para conteúdo
          estático e níveis mais altos para elementos que exigem atenção imediata, como alertas
          críticos e modais de confirmação de dose.
        </p>
        <DSPanel>
          <ElevationGrid bg="var(--bg-card)" />
        </DSPanel>
      </div>

      <div className="ds-subsection">
        <h3>Tokens</h3>
        <p className="t-corpo-2 text-fg-2 mb-3">
          Referência completa dos tokens de sombra. Sempre use o token semântico (ex: var(--shadow-2))
          em vez de valores literais, para garantir consistência entre Light e Dark mode.
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
                  {s.level === 0 && 'Flat / sem elevação'}
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
          O z-index controla a ordem de empilhamento dos elementos. Em uma interface de emergência,
          é essencial que toasts de alerta e modais de confirmação fiquem sempre visíveis acima de
          qualquer outro conteúdo. Use os tokens abaixo para evitar conflitos de camada.
        </p>
        <table className="ds-token-table">
          <thead>
            <tr><th>Token</th><th>Valor</th><th>Uso</th></tr>
          </thead>
          <tbody>
            {[
              { token: '--z-base', val: '0', use: 'Conteúdo padrão' },
              { token: '--z-sticky', val: '100', use: 'Headers sticky, FAB' },
              { token: '--z-dropdown', val: '200', use: 'Dropdowns, opções de select' },
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
