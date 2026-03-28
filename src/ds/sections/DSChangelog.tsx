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
      'Button component adotado em 12 páginas (zero hardcode)',
      '5 seções novas revisadas com "Quando usar"',
      'CSS: classes .checkbox.disabled, .radio-label.disabled adicionadas',
    ],
  },
  {
    version: 'v5.0',
    date: '26 Mar 2026',
    items: [
      'Unicode bugs corrigidos (500+ palavras)',
      'Dark mode: 21 overrides de contraste',
      'Seção "Marca e Identidade" criada',
      'Busca funcional na sidebar',
    ],
  },
  {
    version: 'v4.0',
    date: '26 Mar 2026',
    items: [
      'Arquitetura Atomic Design (Átomos → Moléculas → Organismos → Templates)',
      'Separação: DSInputs → Campos de Entrada + Controles de Seleção',
      'Separação: DSPatterns → Listas + Overlays + Estados',
      'Separação: DSNavegação → Navegação + Headers',
      '"Quando usar" em todos os 11 componentes',
      'Breadcrumbs, Prev/Next, busca na sidebar',
      'Accordion na sidebar',
    ],
  },
  {
    version: 'v3.0',
    date: '25 Mar 2026',
    items: [
      '20 seções documentadas com dark mode',
      '5 seções novas: Chat, Calendário, Categorias, Menu, Premium',
      '73 inline styles substituídos por classes utilitárias',
      'Textos explicativos em português com contexto médico',
    ],
  },
  {
    version: 'v2.0',
    date: '25 Mar 2026',
    items: [
      'Design System migrado de HTML para React + TypeScript',
      '28 componentes reutilizáveis',
      '18 telas navegáveis como SPA',
      'Deploy via Vercel',
    ],
  },
  {
    version: 'v1.0',
    date: '24 Mar 2026',
    items: [
      'Design System em HTML/CSS puro',
      '1571 linhas CSS, 330+ tokens',
      '152 primitivos, 50 semânticos (Light/Dark)',
      '19 telas HTML estáticas',
    ],
  },
]

export default function DSChangelog() {
  return (
    <div>
      <h2 className="ds-section-title">Changelog</h2>
      <p className="ds-section-desc">
        Histórico de evolução do Design System. Cada versão documenta o que mudou, por quê e qual impacto no produto.
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
