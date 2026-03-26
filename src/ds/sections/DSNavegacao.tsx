import DSPanel from '../DSPanel'

export default function DSNavegacao() {
  return (
    <div>
      <h2 className="ds-section-title">Navegação</h2>
      <p className="ds-section-desc">
        Sistema de navegação do CalcMed. O médico acessa qualquer funcionalidade em no máximo 2 toques
        a partir da Home. A bottom nav com 5 tabs é o hub central, visível em todas as telas clínicas.
      </p>

      {/* Bottom Nav */}
      <div className="ds-subsection">
        <h3>Bottom Nav (Mobile)</h3>
        <p className="t-corpo-2 text-fg-2 mb-4">
          Barra fixa inferior com 5 destinos principais. Altura de 56px com touch targets de 48dp.
          O item ativo recebe cor accent e peso 600 para identificação imediata.
        </p>
        <DSPanel>
          <div className="rounded-lg" style={{ overflow: 'hidden', border: '1px solid var(--border)' }}>
            <div className="bottom-nav" style={{ position: 'relative' }}>
              <div className="nav-item active" style={{ cursor: 'default' }}>
                <i className="ph ph-house" style={{ fontSize: 24, color: 'var(--btn-accent)' }} />
                <span style={{ color: 'var(--btn-accent)', fontWeight: 600 }}>Início</span>
              </div>
              <div className="nav-item" style={{ cursor: 'default' }}>
                <i className="ph ph-magnifying-glass" style={{ fontSize: 24 }} />
                <span>Busca</span>
              </div>
              <div className="nav-item" style={{ cursor: 'default' }}>
                <i className="ph ph-calendar-blank" style={{ fontSize: 24 }} />
                <span>Escala</span>
              </div>
              <div className="nav-item" style={{ cursor: 'default' }}>
                <i className="ph ph-sparkle" style={{ fontSize: 24 }} />
                <span>IA</span>
              </div>
              <div className="nav-item" style={{ cursor: 'default' }}>
                <i className="ph ph-list" style={{ fontSize: 24 }} />
                <span>Menu</span>
              </div>
            </div>
          </div>
        </DSPanel>
      </div>

      {/* Sidebar Desktop */}
      <div className="ds-subsection">
        <h3>Sidebar (Desktop)</h3>
        <p className="t-corpo-2 text-fg-2 mb-4">
          Navegação lateral com 260px expandida e 64px colapsada. Exibe rótulos de seção, badges de novidade
          e divisores para agrupar itens. Ideal para telas maiores onde o médico consulta dados com mais espaço.
        </p>
        <DSPanel>
          <div className="flex gap-6">
            {/* Expanded */}
            <div className="sidebar" style={{ height: 320, width: 220, position: 'relative' }}>
              <div className="sidebar-logo">Calc<span className="dot" style={{ color: 'var(--brand-red)' }}>.</span>Med</div>
              <div className="sidebar-section-label">Principal</div>
              <div className="sidebar-item active">
                <i className="ph ph-house" /> <span>Início</span>
              </div>
              <div className="sidebar-item">
                <i className="ph ph-magnifying-glass" /> <span>Busca</span>
              </div>
              <div className="sidebar-item">
                <i className="ph ph-calendar-blank" /> <span>Escala</span>
              </div>
              <div className="sidebar-divider" />
              <div className="sidebar-item">
                <i className="ph ph-sparkle" /> <span>CalcMed IA</span>
                <span className="sidebar-badge">Novo</span>
              </div>
            </div>
            {/* Collapsed */}
            <div className="sidebar collapsed" style={{ height: 320, position: 'relative' }}>
              <div className="sidebar-logo" />
              <div className="sidebar-item active">
                <i className="ph ph-house" />
              </div>
              <div className="sidebar-item">
                <i className="ph ph-magnifying-glass" />
              </div>
              <div className="sidebar-item">
                <i className="ph ph-calendar-blank" />
              </div>
            </div>
          </div>
        </DSPanel>
      </div>

      {/* Tabs */}
      <div className="ds-subsection">
        <h3>Tabs</h3>
        <p className="t-corpo-2 text-fg-2 mb-4">
          Navegação horizontal por abas dentro de uma seção. A aba ativa recebe cor primary e borda
          inferior de 2px para indicação clara do contexto atual.
        </p>
        <DSPanel>
          <div className="rounded-lg" style={{ overflow: 'hidden', border: '1px solid var(--border)' }}>
            <div className="tabs" style={{ paddingLeft: 0, paddingRight: 0 }}>
              <button className="tab active">Próximos</button>
              <button className="tab">Histórico</button>
              <button className="tab">Estatísticas</button>
            </div>
          </div>
        </DSPanel>
      </div>

      {/* Subheader Bar */}
      <div className="ds-subsection">
        <h3>Subheader Bar</h3>
        <p className="t-corpo-2 text-fg-2 mb-4">
          Barra sticky com chips de filtro abaixo do header. Permite filtrar rapidamente por categoria
          (Todos, Urgências, Diluições) sem sair da tela atual.
        </p>
        <DSPanel>
          <div className="subheader-bar rounded-lg" style={{ position: 'relative', top: 'auto', border: '1px solid var(--border)' }}>
            <div className="chip active">Todos</div>
            <div className="chip">Urgências</div>
            <div className="chip">Diluições</div>
          </div>
        </DSPanel>
      </div>

      {/* Classes */}
      <div className="ds-subsection">
        <h3>Classes CSS</h3>
        <p className="t-corpo-2 text-fg-2 mb-4">
          Referência rápida de todas as classes de navegação disponíveis no design system.
        </p>
        <table className="ds-token-table">
          <thead>
            <tr><th>Classe</th><th>Descrição</th></tr>
          </thead>
          <tbody>
            {[
              { cls: '.bottom-nav', desc: 'Nav inferior: flex, altura 56px, 5 tabs' },
              { cls: '.nav-item', desc: 'Item do nav: ícone + label, gap 2px' },
              { cls: '.nav-item.active', desc: 'Cor accent no ícone e label' },
              { cls: '.sidebar', desc: 'Sidebar desktop: largura 260px, flex column' },
              { cls: '.sidebar.collapsed', desc: 'Recolhida: largura 64px, esconde labels' },
              { cls: '.sidebar-item', desc: 'Item: flex, padding 12px 16px, radius 8px' },
              { cls: '.sidebar-item.active', desc: 'Fundo primary, texto branco' },
              { cls: '.tabs', desc: 'Tab horizontal com borda inferior' },
              { cls: '.tabs .tab.active', desc: 'Cor primary, borda inferior 2px' },
              { cls: '.subheader-bar', desc: 'Barra sticky com chips: flex center, fundo surface' },
            ].map(r => (
              <tr key={r.cls}>
                <td><span className="ds-token">{r.cls}</span></td>
                <td className="text-fg-2">{r.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
