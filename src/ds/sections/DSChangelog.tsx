interface ChangelogEntry {
  version: string
  date: string
  items: string[]
}

const changelog: ChangelogEntry[] = [
  {
    version: 'v5.1',
    date: '26 Mar 2026',
    items: [
      'Button component adotado em 12 paginas (zero hardcode)',
      '5 secoes novas revisadas com "Quando usar"',
      'CSS: classes .checkbox.disabled, .radio-label.disabled adicionadas',
    ],
  },
  {
    version: 'v5.0',
    date: '26 Mar 2026',
    items: [
      'Unicode bugs corrigidos (500+ palavras)',
      'Dark mode: 21 overrides de contraste',
      'Secao "Marca e Identidade" criada',
      'Busca funcional na sidebar',
    ],
  },
  {
    version: 'v4.0',
    date: '26 Mar 2026',
    items: [
      'Arquitetura Atomic Design (Atomos \u2192 Moleculas \u2192 Organismos \u2192 Templates)',
      'Separacao: DSInputs \u2192 Campos de Entrada + Controles de Selecao',
      'Separacao: DSPatterns \u2192 Listas + Overlays + Estados',
      'Separacao: DSNavegacao \u2192 Navegacao + Headers',
      '"Quando usar" em todos os 11 componentes',
      'Breadcrumbs, Prev/Next, busca na sidebar',
      'Accordion na sidebar',
    ],
  },
  {
    version: 'v3.0',
    date: '25 Mar 2026',
    items: [
      '20 secoes documentadas com dark mode',
      '5 secoes novas: Chat, Calendario, Categorias, Menu, Premium',
      '73 inline styles substituidos por classes utilitarias',
      'Textos explicativos em portugues com contexto medico',
    ],
  },
  {
    version: 'v2.0',
    date: '25 Mar 2026',
    items: [
      'Design System migrado de HTML para React + TypeScript',
      '28 componentes reutilizaveis',
      '18 telas navegaveis como SPA',
      'Deploy via Vercel',
    ],
  },
  {
    version: 'v1.0',
    date: '24 Mar 2026',
    items: [
      'Design System em HTML/CSS puro',
      '1571 linhas CSS, 330+ tokens',
      '152 primitivos, 50 semanticos (Light/Dark)',
      '19 telas HTML estaticas',
    ],
  },
]

export default function DSChangelog() {
  return (
    <div>
      <h2 className="ds-section-title">Changelog</h2>
      <p className="ds-section-desc">
        Historico de evolucao do Design System. Cada versao documenta o que mudou, por que e qual impacto no produto.
      </p>

      <div className="ds-changelog-timeline">
        {changelog.map((entry) => (
          <div className="ds-changelog-entry" key={entry.version}>
            <div className="ds-changelog-dot" />
            <div className="ds-changelog-card">
              <div className="ds-changelog-header">
                <span className="ds-changelog-version">{entry.version}</span>
                <span className="ds-changelog-date">{entry.date}</span>
              </div>
              <ul>
                {entry.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
