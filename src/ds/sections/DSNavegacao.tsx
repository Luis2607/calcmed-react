import DSPanel from '../DSPanel'

export default function DSNavegacao() {
  return (
    <div>
      <h2 className="ds-section-title">Navegacao</h2>
      <p className="ds-section-desc">
        Bottom nav com 5 tabs (Inicio, Busca, Escala, IA, Menu). Sidebar desktop com 260px colapsavel para 64px.
        Page header com gradiente navy. Home header sticky.
      </p>

      {/* Bottom Nav */}
      <div className="ds-subsection">
        <h3>Bottom Nav (Mobile)</h3>
        <DSPanel>
          <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border)' }}>
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
        <div className="mb-6" style={{ borderRadius: 12, overflow: 'hidden' }}>
          <div className="page-header" style={{ borderRadius: 12 }}>
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
        <DSPanel>
          <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border)' }}>
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
        <DSPanel>
          <div className="flex flex-col gap-4">
            <div>
              <div className="t-legenda mb-2" style={{ fontWeight: 600, opacity: 0.6 }}>Dots (em fundo escuro)</div>
              <div className="p-4" style={{ background: 'var(--brand-navy)', borderRadius: 12, display: 'inline-flex' }}>
                <div className="dots">
                  <span className="active" />
                  <span className="inactive" />
                  <span className="inactive" />
                </div>
              </div>
            </div>
            <div>
              <div className="t-legenda mb-2" style={{ fontWeight: 600, opacity: 0.6 }}>Texto de progresso</div>
              <div className="progress">Passo 1 de 2</div>
            </div>
          </div>
        </DSPanel>
      </div>

      {/* Subheader Bar */}
      <div className="ds-subsection">
        <h3>Subheader Bar</h3>
        <DSPanel>
          <div className="subheader-bar" style={{ position: 'relative', top: 'auto', borderRadius: 12, border: '1px solid var(--border)' }}>
            <div className="chip active">Todos</div>
            <div className="chip">Urgencias</div>
            <div className="chip">Diluicoes</div>
          </div>
        </DSPanel>
      </div>

      {/* Classes */}
      <div className="ds-subsection">
        <h3>Classes CSS</h3>
        <table className="ds-token-table">
          <thead>
            <tr><th>Classe</th><th>Descricao</th></tr>
          </thead>
          <tbody>
            {[
              { cls: '.bottom-nav', desc: 'Nav inferior: flex, h56, 5 tabs' },
              { cls: '.nav-item', desc: 'Item do nav: icone + label, gap 2px' },
              { cls: '.nav-item.active', desc: 'Cor accent no icone e label' },
              { cls: '.sidebar', desc: 'Sidebar desktop: w260, flex column' },
              { cls: '.sidebar.collapsed', desc: 'Recolhida: w64, esconde labels' },
              { cls: '.sidebar-item', desc: 'Item: flex, p12 16, radius 8' },
              { cls: '.sidebar-item.active', desc: 'Fundo primary, texto branco' },
              { cls: '.page-header', desc: 'Header gradiente navy' },
              { cls: '.nav-header', desc: 'Header interno com back + titulo' },
              { cls: '.home-header', desc: 'Header da home: avatar + saudacao + notif' },
              { cls: '.tabs', desc: 'Tab horizontal com borda inferior' },
              { cls: '.tabs .tab.active', desc: 'Cor primary, borda inferior 2px' },
              { cls: '.fab', desc: 'Botao flutuante: 56px circulo, fundo primary, shadow-3' },
              { cls: '.segmented', desc: 'Controle segmentado: flex, radius lg, borda, fundo surface' },
              { cls: '.seg-option', desc: 'Opcao: flex 1, padding, font 500 14px' },
              { cls: '.seg-option.active', desc: 'Ativa: fundo primary, cor on' },
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
