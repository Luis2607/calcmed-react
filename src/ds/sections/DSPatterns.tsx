import { useState } from 'react'
import DSPanel from '../DSPanel'

export default function DSPatterns() {
  const [showModal, setShowModal] = useState(false)
  const [showToast, setShowToast] = useState<string | null>(null)

  return (
    <div>
      <h2 className="ds-section-title">Patterns</h2>
      <p className="ds-section-desc">
        Padroes de interacao reutilizaveis que garantem consistencia em todo o app. Inclui modais de confirmacao,
        bottom sheets para selecao, toasts de feedback, skeleton loading (sem spinners), empty states e tooltips.
        Em contexto medico, cada padrao foi pensado para nao atrasar decisoes clinicas.
      </p>

      {/* Modal */}
      <div className="ds-subsection">
        <h3>Modal / Dialog</h3>
        <p className="t-corpo-2 text-fg-2 mb-4">
          Usado para acoes destrutivas ou confirmacoes criticas (excluir plantao, resetar calculo).
          Sempre oferece opcao de cancelar. O overlay escurece o fundo para focar a atencao do medico.
        </p>
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
        <p className="t-corpo-2 text-fg-2 mb-4">
          Painel deslizante de baixo para cima, usado no mobile para selecao de opcoes ou detalhes
          contextuais. O handle superior indica que pode ser arrastado para fechar.
        </p>
        <DSPanel>
          <div className="rounded-lg" style={{ position: 'relative', height: 280, background: 'var(--bg)', overflow: 'hidden' }}>
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
        <p className="t-corpo-2 text-fg-2 mb-4">
          Notificacoes temporarias para feedback imediato de acoes. Quatro variantes: sucesso (calculo salvo),
          erro (falha ao processar), info (atualizacao disponivel) e warning (assinatura expirando).
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
              <button className="toast-action">Tentar novamente</button>
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
        <p className="t-corpo-2 text-fg-2 mb-4">
          Placeholder animado que simula a estrutura do conteudo enquanto os dados carregam.
          O CalcMed nunca usa spinners — skeletons reduzem a percepcao de espera e orientam
          o medico sobre o que vai aparecer na tela.
        </p>
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
        <p className="t-corpo-2 text-fg-2 mb-4">
          Tela exibida quando uma busca nao retorna resultados ou uma secao esta vazia.
          Sempre inclui icone, mensagem explicativa e acao sugerida para orientar o proximo passo.
        </p>
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
        <h3>Feedback Enviado</h3>
        <p className="t-corpo-2 text-fg-2 mb-4">
          Confirmacao visual apos o envio de feedback ou formulario. Icone + mensagem de agradecimento
          para fechar o ciclo da acao do usuario.
        </p>
        <DSPanel>
          <div className="feedback-sent">
            <div className="flex items-center justify-center rounded-full" style={{ width: 56, height: 56, background: 'var(--bg-elevated)' }}>
              <i className="ph ph-paper-plane-tilt" style={{ fontSize: 24, color: 'var(--fg-link)' }} />
            </div>
            <div className="msg">Seu feedback foi enviado com sucesso! Agradecemos a contribuicao.</div>
          </div>
        </DSPanel>
      </div>

      {/* Tooltip */}
      <div className="ds-subsection">
        <h3>Tooltip</h3>
        <p className="t-corpo-2 text-fg-2 mb-4">
          Dica contextual exibida ao passar o mouse (desktop) sobre um elemento. Util para explicar
          icones ou abreviacoes medicas sem ocupar espaco permanente na interface.
        </p>
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
        <p className="t-corpo-2 text-fg-2 mb-4">
          Os tres estados possiveis de um item de lista: padrao (com hover), selecionado (fundo teal-50
          em light / navy-800 em dark) e desabilitado (opacidade reduzida, sem interacao).
        </p>
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
        <p className="t-corpo-2 text-fg-2 mb-4">
          As quatro posicoes disponiveis para tooltips. Use a posicao que nao sobreponha conteudo
          importante na tela.
        </p>
        <DSPanel>
          <div className="flex gap-6 justify-center p-4">
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
        <p className="t-corpo-2 text-fg-2 mb-4">
          Agrupa resultados de busca por dominio (Urgencias, Calculadoras, Diluicoes). O accent colorido
          a esquerda identifica visualmente a categoria, acelerando a localizacao do resultado desejado.
        </p>
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
        <h3>Divisores</h3>
        <p className="t-corpo-2 text-fg-2 mb-4">
          Separadores visuais para agrupar conteudo. O divisor "ou" e usado em telas de login/cadastro.
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
    </div>
  )
}
