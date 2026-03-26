import DSPanel from '../DSPanel'

export default function DSChat() {
  return (
    <div>
      <h2 className="ds-section-title">Chat / IA</h2>
      <p className="ds-section-desc">
        Componentes do assistente clinico com inteligencia artificial. O medico faz perguntas rapidas durante o plantao
        e recebe respostas baseadas em evidencias. O chat precisa ser claro, legivel e nao pode atrasar informacao clinica.
      </p>

      {/* Mini Conversation */}
      <div className="ds-subsection">
        <h3>Conversa com IA</h3>
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
              <div className="mt-2 t-legenda text-fg-3">Fonte: Goodman & Gilman, 14a ed.</div>
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
        <DSPanel>
          <div className="chat-input-bar" style={{ borderTop: 'none', borderRadius: 12, border: '1px solid var(--border)' }}>
            <input placeholder="Pergunte sobre doses, protocolos..." readOnly />
            <button className="btn-send">
              <i className="ph ph-paper-plane-tilt" />
            </button>
          </div>
        </DSPanel>
      </div>

      {/* Disclaimer */}
      <div className="ds-subsection">
        <h3>Disclaimer</h3>
        <DSPanel>
          <div className="disclaimer-card" style={{ margin: 0 }}>
            <i className="ph ph-info" />
            <span>
              As respostas da IA sao baseadas em literatura medica, mas nao substituem o julgamento clinico.
              Sempre confirme doses e protocolos antes de administrar.
            </span>
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
              { cls: '.chat-area', desc: 'Container da conversa: flex column, gap 16px, scroll' },
              { cls: '.chat-bubble', desc: 'Balao base: max-w 85%, radius xl, padding 12/16' },
              { cls: '.chat-bubble.ia', desc: 'Mensagem da IA: fundo card, borda, alinhado a esquerda' },
              { cls: '.chat-bubble.user', desc: 'Mensagem do medico: fundo primary, cor on, alinhado a direita' },
              { cls: '.chat-suggestions', desc: 'Container de chips de sugestao: flex wrap, gap 8px' },
              { cls: '.chat-input-bar', desc: 'Barra fixa inferior: flex, borda top, fundo surface' },
              { cls: '.btn-send', desc: 'Botao circular 44px: fundo primary, icone branco' },
              { cls: '.disclaimer-card', desc: 'Aviso teal com icone: fundo teal-50, radius lg, font 12px' },
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
