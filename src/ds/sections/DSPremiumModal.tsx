import DSPanel from '../DSPanel'

export default function DSPremiumModal() {
  return (
    <div>
      <h2 className="ds-section-title">Premium e Checkout</h2>
      <p className="ds-section-desc">
        Componentes da experi{"\u00ea"}ncia de convers{"\u00e3"}o e checkout. O m{"\u00e9"}dico que usa a vers{"\u00e3"}o gratuita
        eventualmente v{"\u00ea"} ofertas de upgrade. Cada elemento foi pensado para converter sem pressionar.
      </p>

      {/* Quando usar */}
      <div className="ds-subsection">
        <h3>Quando usar</h3>
        <div className="flex gap-8 mb-6">
          <div className="flex-1">
            <div className="t-texto-badge text-success mb-3" style={{ textTransform: 'uppercase', letterSpacing: 1 }}>Use quando</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li className="flex gap-2 items-start mb-2"><i className="ph ph-check-circle" style={{ color: 'var(--success)', flexShrink: 0, marginTop: 2 }} /><span className="t-corpo-2">O per{"\u00ed"}odo de degusta{"\u00e7\u00e3"}o expirar ou uma funcionalidade estiver bloqueada</span></li>
              <li className="flex gap-2 items-start mb-2"><i className="ph ph-check-circle" style={{ color: 'var(--success)', flexShrink: 0, marginTop: 2 }} /><span className="t-corpo-2">O usu{"\u00e1"}rio tentar acessar conte{"\u00fa"}do premium pela primeira vez</span></li>
              <li className="flex gap-2 items-start mb-2"><i className="ph ph-check-circle" style={{ color: 'var(--success)', flexShrink: 0, marginTop: 2 }} /><span className="t-corpo-2">SEMPRE incluir o bot{"\u00e3"}o {"\u201c"}Agora n{"\u00e3"}o{"\u201d"} vis{"\u00ed"}vel sem scroll e com touch target de 48dp</span></li>
            </ul>
          </div>
          <div className="flex-1">
            <div className="t-texto-badge text-danger mb-3" style={{ textTransform: 'uppercase', letterSpacing: 1 }}>N{"\u00e3"}o use quando</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li className="flex gap-2 items-start mb-2"><i className="ph ph-x-circle" style={{ color: 'var(--danger)', flexShrink: 0, marginTop: 2 }} /><span className="t-corpo-2">O m{"\u00e9"}dico estiver no meio de um c{"\u00e1"}lculo de dose ativo. Nunca interromper</span></li>
              <li className="flex gap-2 items-start mb-2"><i className="ph ph-x-circle" style={{ color: 'var(--danger)', flexShrink: 0, marginTop: 2 }} /><span className="t-corpo-2">Esconder ou dificultar o dismiss ({"\u201c"}Agora n{"\u00e3"}o{"\u201d"}). Pode custar segundos cr{"\u00ed"}ticos</span></li>
              <li className="flex gap-2 items-start mb-2"><i className="ph ph-x-circle" style={{ color: 'var(--danger)', flexShrink: 0, marginTop: 2 }} /><span className="t-corpo-2">Exibir modal premium repetidamente na mesma sess{"\u00e3"}o. Respeite a frequ{"\u00ea"}ncia</span></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="ds-guideline do mb-4">
        <div className="ds-guideline-label">Regra cr{"\u00ed"}tica</div>
        <p>
          O bot{"\u00e3"}o {"\u201c"}Agora n{"\u00e3"}o{"\u201d"} {"\u00e9"} obrigat{"\u00f3"}rio em todo modal de convers{"\u00e3"}o.
          O m{"\u00e9"}dico pode estar no meio de uma emerg{"\u00ea"}ncia real quando o modal aparece.
        </p>
        <p>
          Bloquear a sa{"\u00ed"}da ou esconder o dismiss pode custar segundos cr{"\u00ed"}ticos no atendimento.
          O dismiss deve ter touch target de 48dp e ficar vis{"\u00ed"}vel sem scroll.
        </p>
      </div>

      {/* Modal Premium Content */}
      <div className="ds-subsection">
        <h3>Conte{"\u00fa"}do do Modal Premium</h3>
        <DSPanel>
          <div className="modal-premium-sheet" style={{ borderRadius: 16, position: 'relative', maxHeight: 'none', boxShadow: 'none', border: '1px solid var(--border)' }}>
            {/* Handle */}
            <div className="flex justify-center" style={{ padding: '12px 0 4px' }}>
              <div style={{ width: 40, height: 4, borderRadius: 2, background: 'var(--fg-3)', opacity: 0.3 }} />
            </div>

            {/* Title */}
            <div className="text-center px-6 py-4" style={{ paddingBottom: 8 }}>
              <div className="t-titulo-secao text-fg mb-1">Desbloqueie tudo</div>
              <div className="t-corpo-2 text-fg-2">Acesse todas as calculadoras e funcionalidades premium</div>
            </div>

            {/* Usage box */}
            <div className="modal-usage-box">
              <div className="flex-1">
                <div className="t-corpo-2 text-fg" style={{ fontWeight: 600 }}>Degusta{"\u00e7\u00f5"}es restantes</div>
                <div className="t-legenda text-fg-3 mt-1">Voc{"\u00ea"} usou 2 de 3 dispon{"\u00ed"}veis</div>
              </div>
              <div className="t-titulo-pagina" style={{ fontFamily: "'JetBrains Mono'", color: 'var(--warning)' }}>1</div>
            </div>

            {/* Benefits */}
            <div className="modal-benefits py-4">
              <div className="modal-benefit-row">
                <i className="ph ph-check-circle modal-benefit-icon" />
                <div>
                  <div className="t-corpo-2 text-fg" style={{ fontWeight: 500 }}>Calculadoras ilimitadas</div>
                  <div className="t-legenda text-fg-3 mt-1">Acesse todas as 152+ calculadoras sem restri{"\u00e7\u00e3"}o</div>
                </div>
              </div>
              <div className="modal-benefit-row">
                <i className="ph ph-check-circle modal-benefit-icon" />
                <div>
                  <div className="t-corpo-2 text-fg" style={{ fontWeight: 500 }}>CalcMed IA</div>
                  <div className="t-legenda text-fg-3 mt-1">Pergunte sobre doses e protocolos ao assistente IA</div>
                </div>
              </div>
              <div className="modal-benefit-row">
                <i className="ph ph-check-circle modal-benefit-icon" />
                <div>
                  <div className="t-corpo-2 text-fg" style={{ fontWeight: 500 }}>Sem an{"\u00fa"}ncios</div>
                  <div className="t-legenda text-fg-3 mt-1">Experi{"\u00ea"}ncia limpa e focada no atendimento</div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-col gap-3 px-6 pb-8">
              <button className="btn btn-lg btn-primary w-full">Assinar agora</button>
              <button className="btn btn-lg btn-ghost w-full">Agora n{"\u00e3"}o</button>
            </div>
          </div>
        </DSPanel>
      </div>

      {/* Plan Cards */}
      <div className="ds-subsection">
        <h3>Cards de Plano</h3>
        <p className="t-corpo-2 text-fg-2 mb-4">
          O plano anual vem pr{"\u00e9"}-selecionado (borda teal + badge {"\u201c"}Melhor valor{"\u201d"}) por ser a op{"\u00e7\u00e3"}o
          mais vantajosa. O plano mensal aparece sem destaque, permitindo compara{"\u00e7\u00e3"}o r{"\u00e1"}pida.
        </p>
        <DSPanel>
          <div className="flex gap-3">
            <div className="plan-card selected flex-1">
              <span className="tag-status premium plan-badge">MELHOR VALOR</span>
              <div className="t-subtitulo text-fg mb-1 mt-2">Anual</div>
              <div className="t-preco-destaque">R$ 29,90<span className="t-corpo-2 text-fg-3">/m{"\u00ea"}s</span></div>
              <div className="t-legenda text-fg-3 mt-1">R$ 358,80/ano</div>
            </div>
            <div className="plan-card flex-1">
              <div className="t-subtitulo text-fg mb-1">Mensal</div>
              <div className="t-preco">R$ 49,90<span className="t-corpo-2 text-fg-3">/m{"\u00ea"}s</span></div>
              <div className="t-legenda text-fg-3 mt-1">Cancele quando quiser</div>
            </div>
          </div>
        </DSPanel>
      </div>

      {/* Segmented Control */}
      <div className="ds-subsection">
        <h3>Controle Segmentado</h3>
        <DSPanel>
          <div className="flex flex-col gap-4">
            <div>
              <div className="t-legenda mb-2" style={{ fontWeight: 600, opacity: 0.6 }}>2 op{"\u00e7\u00f5"}es</div>
              <div className="segmented" style={{ maxWidth: 280 }}>
                <button className="seg-option active">Anual</button>
                <button className="seg-option">Mensal</button>
              </div>
            </div>
            <div>
              <div className="t-legenda mb-2" style={{ fontWeight: 600, opacity: 0.6 }}>3 op{"\u00e7\u00f5"}es</div>
              <div className="segmented" style={{ maxWidth: 360 }}>
                <button className="seg-option">Semanal</button>
                <button className="seg-option active">Mensal</button>
                <button className="seg-option">Anual</button>
              </div>
            </div>
          </div>
        </DSPanel>
      </div>

      {/* Classes */}
      <div className="ds-subsection">
        <h3>Classes CSS</h3>
        <table className="ds-token-table">
          <thead>
            <tr><th>Classe</th><th>Descri{"\u00e7\u00e3"}o</th></tr>
          </thead>
          <tbody>
            {[
              { cls: '.modal-premium-sheet', desc: 'Container do modal: border-radius top xl, fundo card, shadow-5' },
              { cls: '.modal-usage-box', desc: 'Box de uso restante: flex com borda e border-radius lg' },
              { cls: '.modal-benefits', desc: 'Lista de benef\u00edcios: flex column com gap 16px' },
              { cls: '.modal-benefit-row', desc: 'Linha de benef\u00edcio: flex com gap 12px, \u00edcone + texto' },
              { cls: '.modal-benefit-icon', desc: '\u00cdcone verde 20px (check-circle) indicando inclus\u00e3o' },
              { cls: '.plan-card', desc: 'Card de plano: padding, border-radius xl, borda, cursor pointer' },
              { cls: '.plan-card.selected', desc: 'Plano selecionado: borda 2px teal (--border-focus)' },
              { cls: '.segmented', desc: 'Container segmentado: flex, border-radius lg, borda, fundo surface' },
              { cls: '.seg-option', desc: 'Op\u00e7\u00e3o do segmentado: flex 1, padding, font 500 14px' },
              { cls: '.seg-option.active', desc: 'Op\u00e7\u00e3o ativa: fundo primary, cor on-surface, font 600' },
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
