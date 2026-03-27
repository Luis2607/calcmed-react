import { useState } from 'react'
import DSPanel from '../DSPanel'

export default function DSOverlays() {
  const [showModal, setShowModal] = useState(false)
  const [showToast, setShowToast] = useState<string | null>(null)

  return (
    <div>
      <h2 className="ds-section-title">Overlays e Diálogos</h2>
      <p className="ds-section-desc">
        Camadas que aparecem sobre o conteúdo principal. Cada overlay tem regras específicas de quando usar,
        como dispensar e qual z-index ocupa. Em emergência médica, o botão "Agora não" é obrigatório em
        qualquer overlay — o médico pode estar salvando uma vida.
      </p>

      {/* Quando usar cada um */}
      <div className="ds-subsection">
        <h3>Quando usar cada um</h3>
        <p className="ds-subsection-desc">
          Escolha o overlay adequado ao nível de interrupção necessário. Modal bloqueia tudo, Bottom Sheet permite contexto parcial, Toast não bloqueia nada.
        </p>
        <DSPanel>
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <i className="ph ph-warning-diamond" style={{ fontSize: 20, color: 'var(--danger)', flexShrink: 0, marginTop: 2 }} />
              <div>
                <div className="t-corpo text-fg" style={{ fontWeight: 600 }}>Modal</div>
                <div className="t-corpo-2 text-fg-2">Confirmações destrutivas, alertas que exigem decisão. Bloqueia interação com a tela abaixo.</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <i className="ph ph-arrows-down-up" style={{ fontSize: 20, color: 'var(--primary)', flexShrink: 0, marginTop: 2 }} />
              <div>
                <div className="t-corpo text-fg" style={{ fontWeight: 600 }}>Bottom Sheet</div>
                <div className="t-corpo-2 text-fg-2">Seleções contextuais, opções adicionais. Permite ver a tela abaixo parcialmente.</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <i className="ph ph-chat-circle-text" style={{ fontSize: 20, color: 'var(--success)', flexShrink: 0, marginTop: 2 }} />
              <div>
                <div className="t-corpo text-fg" style={{ fontWeight: 600 }}>Toast</div>
                <div className="t-corpo-2 text-fg-2">Feedback temporário (3-5s). Sucesso, erro, info. NÃO bloqueia interação.</div>
              </div>
            </div>
          </div>
        </DSPanel>
      </div>

      {/* Modal */}
      <div className="ds-subsection">
        <h3>Modal / Dialog</h3>
        <p className="ds-subsection-desc">
          Usado para ações destrutivas ou confirmações críticas (excluir plantão, resetar cálculo).
          Sempre oferece opção de cancelar. O overlay escurece o fundo para focar a atenção do médico.
        </p>
        <button className="btn btn-md btn-primary" onClick={() => setShowModal(true)}>
          Abrir Modal Demo
        </button>
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div className="modal-header">Confirmar ação</div>
              <div className="modal-body">
                Deseja realmente excluir este plantão? Esta ação não pode ser desfeita.
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
        <p className="ds-subsection-desc">
          Painel deslizante de baixo para cima, usado no mobile para seleção de opções ou detalhes
          contextuais. O handle superior indica que pode ser arrastado para fechar.
        </p>
        <DSPanel>
          <div className="rounded-lg" style={{ position: 'relative', height: 280, background: 'var(--bg)', overflow: 'hidden' }}>
            <div className="p-4" style={{ opacity: 0.3 }}>
              <div className="t-corpo text-fg mb-2" style={{ fontWeight: 600 }}>Conteúdo da tela</div>
              <div className="t-corpo-2 text-fg-2">Informações de fundo...</div>
            </div>
            <div className="bottom-sheet" style={{ position: 'absolute' }}>
              <div className="handle" />
              <div className="sheet-header">
                <i className="ph ph-arrow-left back" />
                <div>
                  <div className="title">Selecionar opção</div>
                  <div className="subtitle">Escolha uma das alternativas</div>
                </div>
              </div>
              <div className="list-item">
                <div className="list-icon"><i className="ph ph-syringe" /></div>
                <div className="list-content">
                  <div className="list-title">Opção A</div>
                  <div className="list-subtitle">Descrição da opção</div>
                </div>
                <div className="list-trailing"><i className="ph ph-caret-right" /></div>
              </div>
              <div className="list-item">
                <div className="list-icon"><i className="ph ph-pill" /></div>
                <div className="list-content">
                  <div className="list-title">Opção B</div>
                  <div className="list-subtitle">Descrição da opção</div>
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
        <p className="ds-subsection-desc">
          Notificações temporárias para feedback imediato de ações. Quatro variantes: sucesso (cálculo salvo),
          erro (falha ao processar), info (atualização disponível) e warning (assinatura expirando).
          Toasts usam aria-live para leitores de tela.
        </p>
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
                {showToast === 'success' && 'Cálculo salvo com sucesso!'}
                {showToast === 'error' && 'Erro ao salvar. Tente novamente.'}
                {showToast === 'info' && 'Nova versão disponível.'}
                {showToast === 'warning' && 'Sua assinatura expira em 3 dias.'}
              </span>
              <button className="toast-action" onClick={() => setShowToast(null)}>Fechar</button>
            </div>
          </div>
        )}
        <DSPanel title="Variantes estáticas">
          <div className="flex flex-col gap-3">
            <div className="toast toast-success">
              <i className="ph ph-check-circle" />
              <span className="toast-msg">Salvo com sucesso!</span>
              <button className="toast-action">Desfazer</button>
            </div>
            <div className="toast toast-error">
              <i className="ph ph-x-circle" />
              <span className="toast-msg">Erro ao processar.</span>
              <button className="toast-action">Tentar novamente</button>
            </div>
            <div className="toast toast-info">
              <i className="ph ph-info" />
              <span className="toast-msg">Informação importante.</span>
            </div>
            <div className="toast toast-warning">
              <i className="ph ph-warning" />
              <span className="toast-msg">Atenção necessária.</span>
            </div>
          </div>
        </DSPanel>
      </div>

      {/* Quando usar / Quando não usar */}
      <div className="ds-subsection">
        <h3>Quando usar / Quando não usar</h3>
        <p className="ds-subsection-desc">
          Diretrizes para escolher o overlay correto em cada situação clínica.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="ds-guideline do">
            <div className="ds-guideline-label">Quando usar</div>
            <p>Modal para confirmações destrutivas (excluir, resetar). Bottom Sheet para seleções contextuais (escolher droga, filtrar). Toast para feedback não-bloqueante (salvo, erro, info).</p>
          </div>
          <div className="ds-guideline dont">
            <div className="ds-guideline-label">Quando não usar</div>
            <p>Modal para informações que não exigem decisão (use Toast). Bottom Sheet quando há apenas 2 opções (use Toggle). Toast para erros críticos que exigem ação (use Modal). Qualquer overlay sem botão de dispensar durante emergência.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
