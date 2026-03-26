import DSPanel from '../DSPanel'

export default function DSPremiumModal() {
  return (
    <div>
      <h2 className="ds-section-title">Premium e Checkout</h2>
      <p className="ds-section-desc">
        Componentes da experi\u00eancia de convers\u00e3o e checkout. O m\u00e9dico que usa a vers\u00e3o gratuita
        eventualmente v\u00ea ofertas de upgrade. Cada elemento foi pensado para converter sem pressionar.
      </p>
      <div className="ds-guideline do mb-4">
        <div className="ds-guideline-label">Regra cr\u00edtica</div>
        <p>
          O bot\u00e3o &ldquo;Agora n\u00e3o&rdquo; \u00e9 obrigat\u00f3rio em todo modal de convers\u00e3o.
          O m\u00e9dico pode estar no meio de uma emerg\u00eancia real quando o modal aparece.
          Bloquear a sa\u00edda ou esconder o dismiss pode custar segundos cr\u00edticos no atendimento.
          O dismiss deve ter touch target de 48dp e ficar vis\u00edvel sem scroll.
        </p>
      </div>

      {/* Modal Premium Content */}
      <div className="ds-subsection">
        <h3>Conte\u00fado do Modal Premium</h3>
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
                <div className="t-corpo-2 text-fg" style={{ fontWeight: 600 }}>Degusta\u00e7\u00f5es restantes</div>
                <div className="t-legenda text-fg-3 mt-1">Voc\u00ea usou 2 de 3 dispon\u00edveis</div>
              </div>
              <div className="t-titulo-pagina" style={{ fontFamily: "'JetBrains Mono'", color: 'var(--warning)' }}>1</div>
            </div>

            {/* Benefits */}
            <div className="modal-benefits py-4">
              <div className="modal-benefit-row">
                <i className="ph ph-check-circle modal-benefit-icon" />
                <div>
                  <div className="t-corpo-2 text-fg" style={{ fontWeight: 500 }}>Calculadoras ilimitadas</div>
                  <div className="t-legenda text-fg-3 mt-1">Acesse todas as 152+ calculadoras sem restri\u00e7\u00e3o</div>
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
                  <div className="t-corpo-2 text-fg" style={{ fontWeight: 500 }}>Sem an\u00fancios</div>
                  <div className="t-legenda text-fg-3 mt-1">Experi\u00eancia limpa e focada no atendimento</div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-col gap-3 px-6 pb-8">
              <button className="btn btn-lg btn-primary w-full">Assinar agora</button>
              <button className="btn btn-lg btn-ghost w-full">Agora n\u00e3o</button>
            </div>
          </div>
        </DSPanel>
      </div>

      {/* Plan Cards */}
      <div className="ds-subsection">
        <h3>Cards de Plano</h3>
        <p className="t-corpo-2 text-fg-2 mb-4">
          O plano anual vem pr\u00e9-selecionado (borda teal + badge &ldquo;Melhor valor&rdquo;) por ser a op\u00e7\u00e3o
          mais vantajosa. O plano mensal aparece sem destaque, permitindo compara\u00e7\u00e3o r\u00e1pida.
        </p>
        <DSPanel>
          <div className="flex gap-3">
            <div className="plan-card selected flex-1">
              <span className="tag-status premium plan-badge">MELHOR VALOR</span>
              <div className="t-subtitulo text-fg mb-1 mt-2">Anual</div>
              <div className="t-preco-destaque">R$ 29,90<span className="t-corpo-2 text-fg-3">/m\u00eas</span></div>
              <div className="t-legenda text-fg-3 mt-1">R$ 358,80/ano</div>
            </div>
            <div className="plan-card flex-1">
              <div className="t-subtitulo text-fg mb-1">Mensal</div>
              <div className="t-preco">R$ 49,90<span className="t-corpo-2 text-fg-3">/m\u00eas</span></div>
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
              <div className="t-legenda mb-2" style={{ fontWeight: 600, opacity: 0.6 }}>2 op\u00e7\u00f5es</div>
              <div className="segmented" style={{ maxWidth: 280 }}>
                <button className="seg-option active">Anual</button>
                <button className="seg-option">Mensal</button>
              </div>
            </div>
            <div>
              <div className="t-legenda mb-2" style={{ fontWeight: 600, opacity: 0.6 }}>3 op\u00e7\u00f5es</div>
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
            <tr><th>Classe</th><th>Descri\u00e7\u00e3o</th></tr>
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
