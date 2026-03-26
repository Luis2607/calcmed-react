import DSPanel from '../DSPanel'

export default function DSChat() {
  return (
    <div>
      <h2 className="ds-section-title">Chat / IA</h2>
      <p className="ds-section-desc">
        Componentes do assistente clínico com inteligência artificial. O médico faz perguntas rápidas durante
        o plantão e recebe respostas baseadas em evidências com citação de fonte. O chat precisa ser claro,
        legível e jamais atrasar informação clínica. Toda resposta da IA exibe disclaimer obrigatório.
      </p>

      {/* Disclaimer - shown first for prominence */}
      <div className="ds-subsection">
        <h3>Disclaimer Obrigatório</h3>
        <p className="t-corpo-2 text-fg-2 mb-4">
          Aviso legal exibido permanentemente no chat. Existe por exigência regulatória e ética: a IA não
          substitui o julgamento clínico do médico. O disclaimer deve estar sempre visível — nunca pode ser
          ocultado, minimizado ou descartado pelo usuário. Fundo teal para destaque sem parecer alerta de erro.
        </p>
        <DSPanel>
          <div className="disclaimer-card" style={{ margin: 0 }}>
            <i className="ph ph-info" />
            <span>
              As respostas da IA são baseadas em literatura médica, mas não substituem o julgamento clínico.
              Sempre confirme doses e protocolos antes de administrar.
            </span>
          </div>
        </DSPanel>
        <div className="ds-guideline dont mt-4">
          <div className="ds-guideline-label">Não fazer</div>
          <p>
            Permitir que o usuário feche ou minimize o disclaimer. Exibir doses da IA sem citação de fonte.
            Usar linguagem que sugira que a IA substitui decisão médica.
          </p>
        </div>
        <div className="ds-guideline do mt-4">
          <div className="ds-guideline-label">Fazer</div>
          <p>
            Manter o disclaimer visível durante toda a sessão de chat. Exibir fonte bibliográfica em toda
            resposta que contenha doses ou protocolos. Usar tom informativo, nunca prescritivo.
          </p>
        </div>
      </div>

      {/* Mini Conversation */}
      <div className="ds-subsection">
        <h3>Conversa com IA</h3>
        <p className="t-corpo-2 text-fg-2 mb-4">
          Fluxo de conversa entre o médico e o assistente. Balões da IA ficam à esquerda com fundo card;
          balões do médico ficam à direita com fundo primary. Chips de sugestão aparecem após cada resposta
          para agilizar perguntas de acompanhamento.
        </p>
        <DSPanel>
          <div className="chat-area" style={{ minHeight: 0, padding: 0 }}>
            {/* IA message */}
            <div className="chat-bubble ia">
              Olá! Sou o assistente clínico CalcMed. Como posso ajudar no seu plantão?
            </div>

            {/* User message */}
            <div className="chat-bubble user">
              Qual a dose de Midazolam para sedação em IOT?
            </div>

            {/* IA response */}
            <div className="chat-bubble ia">
              <div>Para intubação em sequência rápida, a dose de <strong>Midazolam</strong> é de <strong>0,1 a 0,3 mg/kg IV</strong>.</div>
              <div className="mt-2 t-legenda text-fg-3">Fonte: Goodman &amp; Gilman, 14a ed.</div>
            </div>

            {/* Suggestion chips */}
            <div className="chat-suggestions">
              <span className="chip">Dose máxima?</span>
              <span className="chip">Ajuste renal?</span>
              <span className="chip">Alternativas?</span>
            </div>
          </div>
        </DSPanel>
      </div>

      {/* Input Bar */}
      <div className="ds-subsection">
        <h3>Barra de Input</h3>
        <p className="t-corpo-2 text-fg-2 mb-4">
          Campo de entrada fixo na parte inferior da tela de chat. Placeholder orientativo com exemplos
          de perguntas. Botão de envio circular com ícone de avião.
        </p>
        <DSPanel>
          <div className="chat-input-bar rounded-lg" style={{ borderTop: 'none', border: '1px solid var(--border)' }}>
            <input placeholder="Pergunte sobre doses, protocolos..." readOnly />
            <button className="btn-send">
              <i className="ph ph-paper-plane-tilt" />
            </button>
          </div>
        </DSPanel>
      </div>

      {/* Classes */}
      <div className="ds-subsection">
        <h3>Classes CSS</h3>
        <p className="t-corpo-2 text-fg-2 mb-4">
          Referência de classes para implementação dos componentes de chat.
        </p>
        <table className="ds-token-table">
          <thead>
            <tr><th>Classe</th><th>Descrição</th></tr>
          </thead>
          <tbody>
            {[
              { cls: '.chat-area', desc: 'Container da conversa: flex column, gap 16px, scroll vertical' },
              { cls: '.chat-bubble', desc: 'Balão base: max-width 85%, radius xl, padding 12px 16px' },
              { cls: '.chat-bubble.ia', desc: 'Mensagem da IA: fundo card, borda, alinhado à esquerda' },
              { cls: '.chat-bubble.user', desc: 'Mensagem do médico: fundo primary, cor on-primary, alinhado à direita' },
              { cls: '.chat-suggestions', desc: 'Container de chips de sugestão: flex wrap, gap 8px' },
              { cls: '.chat-input-bar', desc: 'Barra fixa inferior: flex, borda superior, fundo surface' },
              { cls: '.btn-send', desc: 'Botão circular de envio: 44px, fundo primary, ícone branco' },
              { cls: '.disclaimer-card', desc: 'Aviso obrigatório: fundo teal-50, radius lg, ícone info, font 12px' },
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
