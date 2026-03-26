import { useState } from 'react'
import DSPanel from '../DSPanel'

export default function DSPatterns() {
  const [showModal, setShowModal] = useState(false)
  const [showToast, setShowToast] = useState<string | null>(null)

  return (
    <div>
      <h2 className="ds-section-title">Patterns</h2>
      <p className="ds-section-desc">
        Padroes de interacao reutilizaveis: modais, bottom sheets, toasts, skeleton loading, empty states e feedback.
      </p>

      {/* Modal */}
      <div className="ds-subsection">
        <h3>Modal / Dialog</h3>
        <button className="btn btn-md btn-primary" onClick={() => setShowModal(true)}>
          Abrir Modal Demo
        </button>
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div className="modal-header">Confirmar acao</div>
              <div className="modal-body">
                Deseja realmente excluir este plantao? Esta acao nao pode ser desfeita.
              </div>
              <div className="modal-footer">
                <button className="btn btn-md btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                <button className="btn btn-md btn-danger" onClick={() => setShowModal(false)}>Excluir</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Sheet */}
      <div className="ds-subsection">
        <h3>Bottom Sheet</h3>
        <DSPanel>
          <div style={{ position: 'relative', height: 280, background: 'var(--bg)', borderRadius: 12, overflow: 'hidden' }}>
            <div className="p-4" style={{ opacity: 0.3 }}>
              <div className="t-corpo text-fg mb-2" style={{ fontWeight: 600 }}>Conteudo da tela</div>
              <div className="t-corpo-2 text-fg-2">Informacoes de fundo...</div>
            </div>
            <div className="bottom-sheet" style={{ position: 'absolute' }}>
              <div className="handle" />
              <div className="sheet-header">
                <i className="ph ph-arrow-left back" />
                <div>
                  <div className="title">Selecionar opcao</div>
                  <div className="subtitle">Escolha uma das alternativas</div>
                </div>
              </div>
              <div className="list-item">
                <div className="list-icon"><i className="ph ph-syringe" /></div>
                <div className="list-content">
                  <div className="list-title">Opcao A</div>
                  <div className="list-subtitle">Descricao da opcao</div>
                </div>
                <div className="list-trailing"><i className="ph ph-caret-right" /></div>
              </div>
              <div className="list-item">
                <div className="list-icon"><i className="ph ph-pill" /></div>
                <div className="list-content">
                  <div className="list-title">Opcao B</div>
                  <div className="list-subtitle">Descricao da opcao</div>
                </div>
                <div className="list-trailing"><i className="ph ph-caret-right" /></div>
              </div>
            </div>
          </div>
        </DSPanel>
      </div>

      {/* Toasts */}
      <div className="ds-subsection">
        <h3>Toast / Snackbar</h3>
        <div className="flex flex-wrap mb-4 gap-3">
          <button className="btn btn-sm btn-primary" onClick={() => setShowToast('success')}>Toast Sucesso</button>
          <button className="btn btn-sm btn-danger" onClick={() => setShowToast('error')}>Toast Erro</button>
          <button className="btn btn-sm btn-secondary" onClick={() => setShowToast('info')}>Toast Info</button>
          <button className="btn btn-sm btn-secondary" style={{ borderColor: 'var(--warning)' }} onClick={() => setShowToast('warning')}>Toast Warning</button>
        </div>
        {showToast && (
          <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 500 }}>
            <div className={`toast toast-${showToast}`}>
              <i className={`ph ph-${showToast === 'success' ? 'check-circle' : showToast === 'error' ? 'x-circle' : showToast === 'warning' ? 'warning' : 'info'}`} />
              <span className="toast-msg">
                {showToast === 'success' && 'Calculo salvo com sucesso!'}
                {showToast === 'error' && 'Erro ao salvar. Tente novamente.'}
                {showToast === 'info' && 'Nova versao disponivel.'}
                {showToast === 'warning' && 'Sua assinatura expira em 3 dias.'}
              </span>
              <button className="toast-action" onClick={() => setShowToast(null)}>Fechar</button>
            </div>
          </div>
        )}
        <DSPanel title="Variantes estaticas">
          <div className="flex flex-col gap-3">
            <div className="toast toast-success">
              <i className="ph ph-check-circle" />
              <span className="toast-msg">Salvo com sucesso!</span>
              <button className="toast-action">Desfazer</button>
            </div>
            <div className="toast toast-error">
              <i className="ph ph-x-circle" />
              <span className="toast-msg">Erro ao processar.</span>
              <button className="toast-action">Retry</button>
            </div>
            <div className="toast toast-info">
              <i className="ph ph-info" />
              <span className="toast-msg">Informacao importante.</span>
            </div>
            <div className="toast toast-warning">
              <i className="ph ph-warning" />
              <span className="toast-msg">Atencao necessaria.</span>
            </div>
          </div>
        </DSPanel>
      </div>

      {/* Skeleton Loading */}
      <div className="ds-subsection">
        <h3>Skeleton Loading</h3>
        <DSPanel>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="skeleton skeleton-circle" style={{ width: 40, height: 40 }} />
              <div className="flex-1">
                <div className="skeleton skeleton-text w-80" />
                <div className="skeleton skeleton-text w-60" />
              </div>
            </div>
            <div className="skeleton skeleton-card" />
            <div className="skeleton skeleton-text w-100" />
            <div className="skeleton skeleton-text w-80" />
          </div>
        </DSPanel>
      </div>

      {/* Empty State */}
      <div className="ds-subsection">
        <h3>Empty State</h3>
        <DSPanel>
          <div className="empty-state">
            <i className="ph ph-magnifying-glass empty-icon" />
            <div className="empty-title">Nenhum resultado</div>
            <div className="empty-desc">Nao encontramos calculadoras para sua busca. Tente termos diferentes.</div>
            <button className="btn btn-md btn-primary">Limpar filtros</button>
          </div>
        </DSPanel>
      </div>

      {/* Feedback Sent */}
      <div className="ds-subsection">
        <h3>Feedback Sent</h3>
        <DSPanel>
          <div className="feedback-sent">
            <div className="icon-circle flex items-center justify-center" style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--bg-elevated)' }}>
              <i className="ph ph-paper-plane-tilt" style={{ fontSize: 24, color: 'var(--fg-link)' }} />
            </div>
            <div className="msg">Seu feedback foi enviado com sucesso! Agradecemos a contribuicao.</div>
          </div>
        </DSPanel>
      </div>

      {/* Tooltip */}
      <div className="ds-subsection">
        <h3>Tooltip</h3>
        <DSPanel>
          <div className="flex gap-6 pt-12">
            <button className="btn btn-sm btn-secondary" data-tooltip="Tooltip padrao (top)">Hover aqui</button>
            <button className="btn btn-sm btn-secondary tooltip-bottom" data-tooltip="Tooltip embaixo">Bottom</button>
          </div>
        </DSPanel>
      </div>

      {/* List Item States */}
      <div className="ds-subsection">
        <h3>List Item — Estados</h3>
        <DSPanel>
          <div className="flex flex-col gap-1">
            <div className="list-item">
              <div className="list-icon"><i className="ph ph-file-text" /></div>
              <div className="list-content">
                <div className="list-title">Item padrao</div>
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
                <div className="list-subtitle">Opacidade reduzida, sem interacao</div>
              </div>
              <div className="list-trailing"><i className="ph ph-caret-right" /></div>
            </div>
          </div>
        </DSPanel>
      </div>

      {/* Tooltip Positions */}
      <div className="ds-subsection">
        <h3>Tooltip — Posicoes</h3>
        <DSPanel>
          <div className="flex gap-6 justify-center" style={{ padding: '16px 48px' }}>
            <button className="btn btn-sm btn-secondary tooltip-left" data-tooltip="Tooltip esquerda">Esquerda</button>
            <button className="btn btn-sm btn-secondary" data-tooltip="Tooltip topo (padrao)">Topo</button>
            <button className="btn btn-sm btn-secondary tooltip-bottom" data-tooltip="Tooltip embaixo">Embaixo</button>
            <button className="btn btn-sm btn-secondary tooltip-right" data-tooltip="Tooltip direita">Direita</button>
          </div>
        </DSPanel>
      </div>

      {/* Search Group Header */}
      <div className="ds-subsection">
        <h3>Cabecalho de Grupo de Busca</h3>
        <DSPanel>
          <div className="flex flex-col gap-2">
            <div className="search-group-header">
              <span className="group-accent" style={{ background: 'var(--dom-urg)' }} />
              <span className="group-name">Urgencias</span>
            </div>
            <div className="list-item">
              <div className="list-icon"><i className="ph ph-heartbeat" style={{ color: 'var(--dom-urg)' }} /></div>
              <div className="list-content">
                <div className="list-title">Sequencia Rapida de Intubacao</div>
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
        <h3>Dividers</h3>
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
    </div>
  )
}
