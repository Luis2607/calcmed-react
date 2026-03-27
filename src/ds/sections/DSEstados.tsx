import DSPanel from '../DSPanel'

export default function DSEstados() {
  return (
    <div>
      <h2 className="ds-section-title">Estados de Conteúdo</h2>
      <p className="ds-section-desc">
        Todo conteúdo tem 4 estados possíveis: carregando (skeleton), vazio (empty state), erro (feedback)
        e sucesso (feedback sent). Documentar estes estados garante que nenhuma tela fique "em branco" —
        o médico sempre sabe o que está acontecendo.
      </p>

      {/* Quando usar */}
      <div className="ds-subsection">
        <h3>Quando usar</h3>
        <DSPanel>
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <i className="ph ph-rectangle" style={{ fontSize: 20, color: 'var(--fg-3)', flexShrink: 0, marginTop: 2 }} />
              <div>
                <div className="t-corpo text-fg" style={{ fontWeight: 600 }}>Skeleton</div>
                <div className="t-corpo-2 text-fg-2">Enquanto dados carregam. NUNCA use spinner — skeleton é mais informativo e menos ansioso.</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <i className="ph ph-magnifying-glass" style={{ fontSize: 20, color: 'var(--fg-3)', flexShrink: 0, marginTop: 2 }} />
              <div>
                <div className="t-corpo text-fg" style={{ fontWeight: 600 }}>Empty State</div>
                <div className="t-corpo-2 text-fg-2">Quando não há dados. Sempre ofereça uma ação (adicionar favorito, fazer busca).</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <i className="ph ph-paper-plane-tilt" style={{ fontSize: 20, color: 'var(--fg-link)', flexShrink: 0, marginTop: 2 }} />
              <div>
                <div className="t-corpo text-fg" style={{ fontWeight: 600 }}>Feedback Enviado</div>
                <div className="t-corpo-2 text-fg-2">Confirmação de ação concluída (email enviado, plantão salvo).</div>
              </div>
            </div>
          </div>
        </DSPanel>
      </div>

      {/* Skeleton Loading */}
      <div className="ds-subsection">
        <h3>Skeleton Loading</h3>
        <p className="ds-subsection-desc">
          Placeholder animado que simula a estrutura do conteúdo enquanto os dados carregam.
          O CalcMed nunca usa spinners — skeletons reduzem a percepção de espera e orientam
          o médico sobre o que vai aparecer na tela.
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
        <p className="ds-subsection-desc">
          Tela exibida quando uma busca não retorna resultados ou uma seção está vazia.
          Sempre inclui ícone, mensagem explicativa e ação sugerida para orientar o próximo passo.
        </p>
        <DSPanel>
          <div className="empty-state">
            <i className="ph ph-magnifying-glass empty-icon" />
            <div className="empty-title">Nenhum resultado</div>
            <div className="empty-desc">Não encontramos calculadoras para sua busca. Tente termos diferentes.</div>
            <button className="btn btn-md btn-primary">Limpar filtros</button>
          </div>
        </DSPanel>
      </div>

      {/* Feedback Sent */}
      <div className="ds-subsection">
        <h3>Feedback Enviado</h3>
        <p className="ds-subsection-desc">
          Confirmação visual após o envio de feedback ou formulário. Ícone + mensagem de agradecimento
          para fechar o ciclo da ação do usuário.
        </p>
        <DSPanel>
          <div className="feedback-sent">
            <div className="flex items-center justify-center rounded-full" style={{ width: 56, height: 56, background: 'var(--bg-elevated)' }}>
              <i className="ph ph-paper-plane-tilt" style={{ fontSize: 24, color: 'var(--fg-link)' }} />
            </div>
            <div className="msg">Seu feedback foi enviado com sucesso! Agradecemos a contribuição.</div>
          </div>
        </DSPanel>
      </div>

      {/* Quando usar / Quando não usar */}
      <div className="ds-subsection">
        <h3>Quando usar / Quando não usar</h3>
        <p className="ds-subsection-desc">
          Diretrizes para garantir que todo conteúdo tenha um estado visual adequado.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="ds-guideline do">
            <div className="ds-guideline-label">Quando usar</div>
            <p>Skeleton sempre que dados levam mais de 300ms para carregar. Empty state quando lista/busca retorna zero resultados. Feedback enviado após formulários e ações assíncronas (salvar plantão, enviar feedback).</p>
          </div>
          <div className="ds-guideline dont">
            <div className="ds-guideline-label">Quando não usar</div>
            <p>Spinner em lugar de skeleton (proibido no CalcMed). Tela em branco sem mensagem enquanto carrega. Empty state sem ação sugerida (sempre ofereça próximo passo). Feedback enviado para ações instantâneas (use toast).</p>
          </div>
        </div>
      </div>
    </div>
  )
}
