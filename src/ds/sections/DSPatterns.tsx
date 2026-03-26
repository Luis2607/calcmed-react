import DSPanel from '../DSPanel'

export default function DSPatterns() {
  return (
    <div>
      <h2 className="ds-section-title">Listas e Utilitários</h2>
      <p className="ds-section-desc">
        Componentes utilitários usados como blocos de construção em telas complexas. O list-item é o padrão
        mais reutilizado do app — aparece em menus, resultados de busca, bottom sheets e notificações.
      </p>

      {/* List Item States */}
      <div className="ds-subsection">
        <h3>List Item — Estados</h3>
        <p className="t-corpo-2 text-fg-2 mb-4">
          Os três estados possíveis de um item de lista: padrão (com hover), selecionado (fundo teal-50
          em light / navy-800 em dark) e desabilitado (opacidade reduzida, sem interação).
        </p>
        <DSPanel>
          <div className="flex flex-col gap-1">
            <div className="list-item">
              <div className="list-icon"><i className="ph ph-file-text" /></div>
              <div className="list-content">
                <div className="list-title">Item padrão</div>
                <div className="list-subtitle">Estado default com hover</div>
              </div>
              <div className="list-trailing"><i className="ph ph-caret-right" /></div>
            </div>
            <div className="list-item selected">
              <div className="list-icon"><i className="ph ph-check" /></div>
              <div className="list-content">
                <div className="list-title">Item selecionado</div>
                <div className="list-subtitle">Fundo teal-50 (light) / navy-800 (dark)</div>
              </div>
              <div className="list-trailing"><i className="ph ph-caret-right" /></div>
            </div>
            <div className="list-item disabled">
              <div className="list-icon"><i className="ph ph-prohibit" /></div>
              <div className="list-content">
                <div className="list-title">Item desabilitado</div>
                <div className="list-subtitle">Opacidade reduzida, sem interação</div>
              </div>
              <div className="list-trailing"><i className="ph ph-caret-right" /></div>
            </div>
          </div>
        </DSPanel>
      </div>

      {/* Search Group Header */}
      <div className="ds-subsection">
        <h3>Cabeçalho de Grupo de Busca</h3>
        <p className="t-corpo-2 text-fg-2 mb-4">
          Agrupa resultados de busca por domínio (Urgências, Calculadoras, Diluições). O accent colorido
          à esquerda identifica visualmente a categoria, acelerando a localização do resultado desejado.
        </p>
        <DSPanel>
          <div className="flex flex-col gap-2">
            <div className="search-group-header">
              <span className="group-accent" style={{ background: 'var(--dom-urg)' }} />
              <span className="group-name">Urgências</span>
            </div>
            <div className="list-item">
              <div className="list-icon"><i className="ph ph-heartbeat" style={{ color: 'var(--dom-urg)' }} /></div>
              <div className="list-content">
                <div className="list-title">Sequência Rápida de Intubação</div>
              </div>
            </div>
            <div className="search-group-header">
              <span className="group-accent" style={{ background: 'var(--dom-calc)' }} />
              <span className="group-name">Calculadoras</span>
            </div>
            <div className="list-item">
              <div className="list-icon"><i className="ph ph-calculator" style={{ color: 'var(--dom-calc)' }} /></div>
              <div className="list-content">
                <div className="list-title">Clearance de Creatinina</div>
              </div>
            </div>
          </div>
        </DSPanel>
      </div>

      {/* Divider */}
      <div className="ds-subsection">
        <h3>Divisores</h3>
        <p className="t-corpo-2 text-fg-2 mb-4">
          Separadores visuais para agrupar conteúdo. O divisor "ou" é usado em telas de login/cadastro.
          O divisor simples separa itens de lista.
        </p>
        <DSPanel>
          <div className="flex flex-col gap-4">
            <div className="divider-ou">
              <div className="line" />
              <div className="text">ou</div>
              <div className="line" />
            </div>
            <div className="list-divider" style={{ marginLeft: 0 }} />
          </div>
        </DSPanel>
      </div>

      {/* Tooltip */}
      <div className="ds-subsection">
        <h3>Tooltip</h3>
        <p className="t-corpo-2 text-fg-2 mb-4">
          Dica contextual exibida ao passar o mouse (desktop) sobre um elemento. Útil para explicar
          ícones ou abreviações médicas sem ocupar espaço permanente na interface.
        </p>
        <DSPanel>
          <div className="flex gap-6 pt-12">
            <button className="btn btn-sm btn-secondary" data-tooltip="Tooltip padrão (top)">Hover aqui</button>
            <button className="btn btn-sm btn-secondary tooltip-bottom" data-tooltip="Tooltip embaixo">Bottom</button>
          </div>
        </DSPanel>
      </div>

      {/* Tooltip Positions */}
      <div className="ds-subsection">
        <h3>Tooltip — Posições</h3>
        <p className="t-corpo-2 text-fg-2 mb-4">
          As quatro posições disponíveis para tooltips. Use a posição que não sobreponha conteúdo
          importante na tela.
        </p>
        <DSPanel>
          <div className="flex gap-6 justify-center p-4">
            <button className="btn btn-sm btn-secondary tooltip-left" data-tooltip="Tooltip esquerda">Esquerda</button>
            <button className="btn btn-sm btn-secondary" data-tooltip="Tooltip topo (padrão)">Topo</button>
            <button className="btn btn-sm btn-secondary tooltip-bottom" data-tooltip="Tooltip embaixo">Embaixo</button>
            <button className="btn btn-sm btn-secondary tooltip-right" data-tooltip="Tooltip direita">Direita</button>
          </div>
        </DSPanel>
      </div>
    </div>
  )
}
