import DSPanel from '../DSPanel'

export default function DSChat() {
  return (
    <div>
      <h2 className="ds-section-title">Chat / IA</h2>
      <p className="ds-section-desc">
        Componentes do assistente clinico com inteligencia artificial. O medico faz perguntas rapidas durante
        o plantao e recebe respostas baseadas em evidencias com citacao de fonte. O chat precisa ser claro,
        legivel e jamais atrasar informacao clinica. Toda resposta da IA exibe disclaimer obrigatorio.
      </p>

      {/* Disclaimer - shown first for prominence */}
      <div className="ds-subsection">
        <h3>Disclaimer Obrigatorio</h3>
        <p className="t-corpo-2 text-fg-2 mb-4">
          Aviso legal exibido permanentemente no chat. Existe por exigencia regulatoria e etica: a IA nao
          substitui o julgamento clinico do medico. O disclaimer deve estar sempre visivel — nunca pode ser
          ocultado, minimizado ou descartado pelo usuario. Fundo teal para destaque sem parecer alerta de erro.
        </p>
        <DSPanel>
          <div className="disclaimer-card" style={{ margin: 0 }}>
            <i className="ph ph-info" />
            <span>
              As respostas da IA sao baseadas em literatura medica, mas nao substituem o julgamento clinico.
              Sempre confirme doses e protocolos antes de administrar.
            </span>
          </div>
        </DSPanel>
        <div className="ds-guideline dont mt-4">
          <div className="ds-guideline-label">Nao fazer</div>
          <p>
            Permitir que o usuario feche ou minimize o disclaimer. Exibir doses da IA sem citacao de fonte.
            Usar linguagem que sugira que a IA substitui decisao medica.
          </p>
        </div>
        <div className="ds-guideline do mt-4">
          <div className="ds-guideline-label">Fazer</div>
          <p>
            Manter o disclaimer visivel durante toda a sessao de chat. Exibir fonte bibliografica em toda
            resposta que contenha doses ou protocolos. Usar tom informativo, nunca prescritivo.
          </p>
        </div>
      </div>

      {/* Mini Conversation */}
      <div className="ds-subsection">
        <h3>Conversa com IA</h3>
        <p className="t-corpo-2 text-fg-2 mb-4">
          Fluxo de conversa entre o medico e o assistente. Baloes da IA ficam a esquerda com fundo card;
          baloes do medico ficam a direita com fundo primary. Chips de sugestao aparecem apos cada resposta
          para agilizar perguntas de acompanhamento.
        </p>
        <DSPanel>
          <div className="chat-area" style={{ minHeight: 0, padding: 0 }}>
            {/* IA message */}
            <div className="chat-bubble ia">
              Ola! Sou o assistente clinico CalcMed. Como posso ajudar no seu plantao?
            </div>

            {/* User message */}
            <div className="chat-bubble user">
              Qual a dose de Midazolam para sedacao em IOT?
            </div>

            {/* IA response */}
            <div className="chat-bubble ia">
              <div>Para intubacao em sequencia rapida, a dose de <strong>Midazolam</strong> e de <strong>0,1 a 0,3 mg/kg IV</strong>.</div>
              <div className="mt-2 t-legenda text-fg-3">Fonte: Goodman &amp; Gilman, 14a ed.</div>
            </div>

            {/* Suggestion chips */}
            <div className="chat-suggestions">
              <span className="chip">Dose maxima?</span>
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
          de perguntas. Botao de envio circular com icone de aviao.
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
          Referencia de classes para implementacao dos componentes de chat.
        </p>
        <table className="ds-token-table">
          <thead>
            <tr><th>Classe</th><th>Descricao</th></tr>
          </thead>
          <tbody>
            {[
              { cls: '.chat-area', desc: 'Container da conversa: flex column, gap 16px, scroll vertical' },
              { cls: '.chat-bubble', desc: 'Balao base: max-width 85%, radius xl, padding 12px 16px' },
              { cls: '.chat-bubble.ia', desc: 'Mensagem da IA: fundo card, borda, alinhado a esquerda' },
              { cls: '.chat-bubble.user', desc: 'Mensagem do medico: fundo primary, cor on-primary, alinhado a direita' },
              { cls: '.chat-suggestions', desc: 'Container de chips de sugestao: flex wrap, gap 8px' },
              { cls: '.chat-input-bar', desc: 'Barra fixa inferior: flex, borda superior, fundo surface' },
              { cls: '.btn-send', desc: 'Botao circular de envio: 44px, fundo primary, icone branco' },
              { cls: '.disclaimer-card', desc: 'Aviso obrigatorio: fundo teal-50, radius lg, icone info, font 12px' },
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
