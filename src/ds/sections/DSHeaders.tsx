import DSPanel from '../DSPanel'

export default function DSHeaders() {
  return (
    <div>
      <h2 className="ds-section-title">Headers</h2>
      <p className="ds-section-desc">
        Cada tela começa com um header que identifica onde o médico está e oferece ações contextuais.
        O header é a primeira coisa que o olho busca — deve comunicar localização instantaneamente.
      </p>

      {/* Page Header */}
      <div className="ds-subsection">
        <h3>Page Header</h3>
        <p className="ds-subsection-desc">
          Cabeçalho principal com gradiente navy da marca. Usado na página inicial do design system
          para apresentar métricas e identidade visual. Aparece apenas em telas de alto nível (Home, Overview).
        </p>
        <div className="mb-6 rounded-lg" style={{ overflow: 'hidden' }}>
          <div className="page-header rounded-lg">
            <h1 style={{ fontSize: 32 }}>Calc<span className="dot">.</span>Med</h1>
            <p>Urgência e Emergência</p>
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
        <p className="ds-subsection-desc">
          Header de páginas internas com botão de voltar e título da seção. Essencial para orientar
          o médico sobre onde ele está dentro da hierarquia de calculadoras e protocolos.
          Usado em todas as telas que não são a Home.
        </p>
        <DSPanel>
          <div className="flex flex-col gap-3">
            <div className="nav-header">
              <i className="ph ph-arrow-left back" />
              <span className="title">Clearance de Creatinina</span>
            </div>
            <div className="nav-header">
              <i className="ph ph-arrow-left back" />
              <span className="title">Seq. Rápida Intubação</span>
            </div>
          </div>
        </DSPanel>
      </div>

      {/* Home Header */}
      <div className="ds-subsection">
        <h3>Home Header</h3>
        <p className="ds-subsection-desc">
          Cabeçalho sticky da tela inicial com avatar, saudação personalizada e ícone de notificações.
          O ponto vermelho indica notificações não lidas. Usado exclusivamente na Home para criar
          uma experiência personalizada ao abrir o app.
        </p>
        <DSPanel>
          <div className="home-header" style={{ position: 'relative', borderRadius: 12, border: '1px solid var(--border)' }}>
            <div className="avatar avatar-md avatar-teal">LB</div>
            <div className="flex-1">
              <div className="t-corpo text-fg" style={{ fontWeight: 600 }}>Olá, Dr. Luis</div>
              <div className="t-legenda text-fg-3">Plantonista</div>
            </div>
            <div className="notif-wrap">
              <i className="ph ph-bell text-fg-3" style={{ fontSize: 24 }} />
              <span className="notif-dot" />
            </div>
          </div>
        </DSPanel>
      </div>

      {/* Dots / Progress */}
      <div className="ds-subsection">
        <h3>Indicadores de Progresso</h3>
        <p className="ds-subsection-desc">
          Dots para indicar página atual em carrosséis ou onboarding. Texto de progresso para
          fluxos com etapas definidas (ex: checkout em 2 passos). Aparecem dentro do header
          de telas sequenciais.
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

      {/* FAB */}
      <div className="ds-subsection">
        <h3>FAB (Botão Flutuante)</h3>
        <p className="ds-subsection-desc">
          Botão de ação flutuante (Floating Action Button) para a ação principal da tela.
          Círculo de 56px com sombra nível 3. Usado na escala para adicionar novos plantões.
          Posicionado no canto inferior direito, acima da bottom nav.
        </p>
        <DSPanel>
          <div className="flex items-center gap-4">
            <button className="fab" style={{ position: 'relative' }}>
              <i className="ph ph-plus" style={{ fontSize: 24 }} />
            </button>
            <span className="t-corpo-2 text-fg-2">
              Botão flutuante para ações principais (ex: novo plantão)
            </span>
          </div>
        </DSPanel>
      </div>

      {/* Segmented Control */}
      <div className="ds-subsection">
        <h3>Controle Segmentado</h3>
        <p className="ds-subsection-desc">
          Alternância entre 2 ou 3 opções mutuamente exclusivas. Usado no checkout (Anual/Mensal)
          e na escala (Próximos/Histórico/Estatísticas). A opção ativa recebe fundo primary.
          Aparece tipicamente logo abaixo do header como filtro de conteúdo.
        </p>
        <DSPanel>
          <div className="flex flex-col gap-4">
            <div className="segmented" style={{ maxWidth: 280 }}>
              <button className="seg-option active">Anual</button>
              <button className="seg-option">Mensal</button>
            </div>
            <div className="segmented" style={{ maxWidth: 360 }}>
              <button className="seg-option">Próximos</button>
              <button className="seg-option active">Histórico</button>
              <button className="seg-option">Estatísticas</button>
            </div>
          </div>
        </DSPanel>
      </div>

      {/* Quando usar / Quando não usar */}
      <div className="ds-subsection">
        <h3>Quando usar / Quando não usar</h3>
        <p className="ds-subsection-desc">
          Diretrizes para escolher o header correto em cada contexto de navegação.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="ds-guideline do">
            <div className="ds-guideline-label">Quando usar</div>
            <p>Page Header apenas na overview/landing do DS. Nav Header em todas as telas internas com botão voltar. Home Header exclusivamente na tela inicial com saudação personalizada. FAB para a ação principal da tela (máximo 1 por tela). Controle Segmentado para filtrar conteúdo com 2-3 opções.</p>
          </div>
          <div className="ds-guideline dont">
            <div className="ds-guideline-label">Quando não usar</div>
            <p>Page Header em telas internas (muito pesado visualmente). Nav Header sem botão voltar (o médico precisa saber como sair). FAB para ações secundárias ou quando já existe CTA no conteúdo. Controle Segmentado com 4+ opções (use tabs). Dots de progresso fora de fluxos sequenciais.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
