import DSPanel from '../DSPanel'

export default function DSNavegacao() {
  return (
    <div>
      <h2 className="ds-section-title">Navegacao</h2>
      <p className="ds-section-desc">
        Sistema de navegacao do CalcMed com bottom nav de 5 tabs (Inicio, Busca, Escala, IA, Menu) no mobile
        e sidebar colapsavel no desktop. Projetado para que o medico alcance qualquer funcionalidade critica
        em no maximo 2 toques, mesmo durante uma emergencia.
      </p>

      {/* Bottom Nav */}
      <div className="ds-subsection">
        <h3>Bottom Nav (Mobile)</h3>
        <p className="t-corpo-2 text-fg-2 mb-4">
          Barra fixa inferior com 5 destinos principais. Altura de 56px com touch targets de 48dp.
          O item ativo recebe cor accent e peso 600 para identificacao imediata.
        </p>
        <DSPanel>
          <div className="rounded-lg" style={{ overflow: 'hidden', border: '1px solid var(--border)' }}>
            <div className="bottom-nav" style={{ position: 'relative' }}>
              <div className="nav-item active" style={{ cursor: 'default' }}>
                <i className="ph ph-house" style={{ fontSize: 24, color: 'var(--btn-accent)' }} />
                <span style={{ color: 'var(--btn-accent)', fontWeight: 600 }}>Inicio</span>
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
          Navegacao lateral com 260px expandida e 64px colapsada. Exibe rotulos de secao, badges de novidade
          e divisores para agrupar itens. Ideal para telas maiores onde o medico consulta dados com mais espaco.
        </p>
        <DSPanel>
          <div className="flex gap-6">
            {/* Expanded */}
            <div className="sidebar" style={{ height: 320, width: 220, position: 'relative' }}>
              <div className="sidebar-logo">Calc<span className="dot" style={{ color: 'var(--brand-red)' }}>.</span>Med</div>
              <div className="sidebar-section-label">Principal</div>
              <div className="sidebar-item active">
                <i className="ph ph-house" /> <span>Inicio</span>
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

      {/* Page Header */}
      <div className="ds-subsection">
        <h3>Page Header</h3>
        <p className="t-corpo-2 text-fg-2 mb-4">
          Cabecalho principal com gradiente navy da marca. Usado na pagina inicial do design system
          para apresentar metricas e identidade visual.
        </p>
        <div className="mb-6 rounded-lg" style={{ overflow: 'hidden' }}>
          <div className="page-header rounded-lg">
            <h1 style={{ fontSize: 32 }}>Calc<span className="dot">.</span>Med</h1>
            <p>Urgencia e Emergencia</p>
            <div className="stats">
              <div><div className="stat-num">152</div><div className="stat-label">Tokens</div></div>
              <div><div className="stat-num">28</div><div className="stat-label">Componentes</div></div>
            </div>
          </div>
        </div>
      </div>

      {/* Nav Header */}
      <div className="ds-subsection">
        <h3>Nav Header (Interno)</h3>
        <p className="t-corpo-2 text-fg-2 mb-4">
          Header de paginas internas com botao de voltar e titulo da secao. Essencial para orientar
          o medico sobre onde ele esta dentro da hierarquia de calculadoras e protocolos.
        </p>
        <DSPanel>
          <div className="flex flex-col gap-3">
            <div className="nav-header">
              <i className="ph ph-arrow-left back" />
              <span className="title">Clearance de Creatinina</span>
            </div>
            <div className="nav-header">
              <i className="ph ph-arrow-left back" />
              <span className="title">Seq. Rapida Intubacao</span>
            </div>
          </div>
        </DSPanel>
      </div>

      {/* Home Header */}
      <div className="ds-subsection">
        <h3>Home Header</h3>
        <p className="t-corpo-2 text-fg-2 mb-4">
          Cabecalho sticky da tela inicial com avatar, saudacao personalizada e icone de notificacoes.
          O ponto vermelho indica notificacoes nao lidas.
        </p>
        <DSPanel>
          <div className="home-header" style={{ position: 'relative', borderRadius: 12, border: '1px solid var(--border)' }}>
            <div className="avatar avatar-md avatar-teal">LB</div>
            <div className="flex-1">
              <div className="t-corpo text-fg" style={{ fontWeight: 600 }}>Ola, Dr. Luis</div>
              <div className="t-legenda text-fg-3">Plantonista</div>
            </div>
            <div className="notif-wrap">
              <i className="ph ph-bell text-fg-3" style={{ fontSize: 24 }} />
              <span className="notif-dot" />
            </div>
          </div>
        </DSPanel>
      </div>

      {/* Tabs */}
      <div className="ds-subsection">
        <h3>Tabs</h3>
        <p className="t-corpo-2 text-fg-2 mb-4">
          Navegacao horizontal por abas dentro de uma secao. A aba ativa recebe cor primary e borda
          inferior de 2px para indicacao clara do contexto atual.
        </p>
        <DSPanel>
          <div className="rounded-lg" style={{ overflow: 'hidden', border: '1px solid var(--border)' }}>
            <div className="tabs" style={{ paddingLeft: 0, paddingRight: 0 }}>
              <button className="tab active">Proximos</button>
              <button className="tab">Historico</button>
              <button className="tab">Estatisticas</button>
            </div>
          </div>
        </DSPanel>
      </div>

      {/* FAB */}
      <div className="ds-subsection">
        <h3>FAB (Botao Flutuante)</h3>
        <p className="t-corpo-2 text-fg-2 mb-4">
          Botao de acao flutuante (Floating Action Button) para a acao principal da tela.
          Circulo de 56px com sombra nivel 3. Usado na escala para adicionar novos plantoes.
        </p>
        <DSPanel>
          <div className="flex items-center gap-4">
            <button className="fab" style={{ position: 'relative' }}>
              <i className="ph ph-plus" style={{ fontSize: 24 }} />
            </button>
            <span className="t-corpo-2 text-fg-2">
              Botao flutuante para acoes principais (ex: novo plantao)
            </span>
          </div>
        </DSPanel>
      </div>

      {/* Segmented Control */}
      <div className="ds-subsection">
        <h3>Controle Segmentado</h3>
        <p className="t-corpo-2 text-fg-2 mb-4">
          Alternancia entre 2 ou 3 opcoes mutuamente exclusivas. Usado no checkout (Anual/Mensal)
          e na escala (Proximos/Historico/Estatisticas). A opcao ativa recebe fundo primary.
        </p>
        <DSPanel>
          <div className="flex flex-col gap-4">
            <div className="segmented" style={{ maxWidth: 280 }}>
              <button className="seg-option active">Anual</button>
              <button className="seg-option">Mensal</button>
            </div>
            <div className="segmented" style={{ maxWidth: 360 }}>
              <button className="seg-option">Proximos</button>
              <button className="seg-option active">Historico</button>
              <button className="seg-option">Estatisticas</button>
            </div>
          </div>
        </DSPanel>
      </div>

      {/* Dots / Progress */}
      <div className="ds-subsection">
        <h3>Indicadores de Progresso</h3>
        <p className="t-corpo-2 text-fg-2 mb-4">
          Dots para indicar pagina atual em carrosseis ou onboarding. Texto de progresso para
          fluxos com etapas definidas (ex: checkout em 2 passos).
        </p>
        <DSPanel>
          <div className="flex flex-col gap-4">
            <div>
              <div className="t-legenda mb-2 text-fg-3" style={{ fontWeight: 600 }}>Dots (em fundo escuro)</div>
              <div className="p-4 rounded-lg" style={{ background: 'var(--brand-navy)', display: 'inline-flex' }}>
                <div className="dots">
                  <span className="active" />
                  <span className="inactive" />
                  <span className="inactive" />
                </div>
              </div>
            </div>
            <div>
              <div className="t-legenda mb-2 text-fg-3" style={{ fontWeight: 600 }}>Texto de progresso</div>
              <div className="progress">Passo 1 de 2</div>
            </div>
          </div>
        </DSPanel>
      </div>

      {/* Subheader Bar */}
      <div className="ds-subsection">
        <h3>Subheader Bar</h3>
        <p className="t-corpo-2 text-fg-2 mb-4">
          Barra sticky com chips de filtro abaixo do header. Permite filtrar rapidamente por categoria
          (Todos, Urgencias, Diluicoes) sem sair da tela atual.
        </p>
        <DSPanel>
          <div className="subheader-bar rounded-lg" style={{ position: 'relative', top: 'auto', border: '1px solid var(--border)' }}>
            <div className="chip active">Todos</div>
            <div className="chip">Urgencias</div>
            <div className="chip">Diluicoes</div>
          </div>
        </DSPanel>
      </div>

      {/* Classes */}
      <div className="ds-subsection">
        <h3>Classes CSS</h3>
        <p className="t-corpo-2 text-fg-2 mb-4">
          Referencia rapida de todas as classes de navegacao disponiveis no design system.
        </p>
        <table className="ds-token-table">
          <thead>
            <tr><th>Classe</th><th>Descricao</th></tr>
          </thead>
          <tbody>
            {[
              { cls: '.bottom-nav', desc: 'Nav inferior: flex, altura 56px, 5 tabs' },
              { cls: '.nav-item', desc: 'Item do nav: icone + label, gap 2px' },
              { cls: '.nav-item.active', desc: 'Cor accent no icone e label' },
              { cls: '.sidebar', desc: 'Sidebar desktop: largura 260px, flex column' },
              { cls: '.sidebar.collapsed', desc: 'Recolhida: largura 64px, esconde labels' },
              { cls: '.sidebar-item', desc: 'Item: flex, padding 12px 16px, radius 8px' },
              { cls: '.sidebar-item.active', desc: 'Fundo primary, texto branco' },
              { cls: '.page-header', desc: 'Header com gradiente navy da marca' },
              { cls: '.nav-header', desc: 'Header interno com botao voltar + titulo' },
              { cls: '.home-header', desc: 'Header da home: avatar + saudacao + notificacoes' },
              { cls: '.tabs', desc: 'Tab horizontal com borda inferior' },
              { cls: '.tabs .tab.active', desc: 'Cor primary, borda inferior 2px' },
              { cls: '.fab', desc: 'Botao flutuante: 56px circulo, fundo primary, shadow-3' },
              { cls: '.segmented', desc: 'Controle segmentado: flex, radius lg, borda, fundo surface' },
              { cls: '.seg-option', desc: 'Opcao: flex 1, padding, font 500 14px' },
              { cls: '.seg-option.active', desc: 'Opcao ativa: fundo primary, cor on' },
              { cls: '.dots', desc: 'Indicador de pagina: flex, gap 8px' },
              { cls: '.progress', desc: 'Texto de progresso: font 400 14px, cor fg-3' },
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
