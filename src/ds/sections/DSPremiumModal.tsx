import DSPanel from '../DSPanel'

export default function DSPremiumModal() {
  return (
    <div>
      <h2 className="ds-section-title">Premium e Checkout</h2>
      <p className="ds-section-desc">
        Componentes da experiencia de conversao e checkout. O medico que usa a versao gratuita eventualmente ve
        ofertas de upgrade. Cada elemento foi pensado para converter sem pressionar — o botao "Agora nao" e
        obrigatorio porque o medico pode estar no meio de uma emergencia.
      </p>

      {/* Modal Premium Content */}
      <div className="ds-subsection">
        <h3>Conteudo do Modal Premium</h3>
        <DSPanel>
          <div className="modal-premium-sheet" style={{ borderRadius: 16, position: 'relative', maxHeight: 'none', boxShadow: 'none', border: '1px solid var(--border)' }}>
            {/* Handle */}
            <div className="flex justify-center" style={{ padding: '12px 0 4px' }}>
              <div style={{ width: 40, height: 4, borderRadius: 2, background: 'var(--fg-3)', opacity: 0.3 }} />
            </div>

            {/* Title */}
            <div className="text-center px-5 py-4" style={{ paddingBottom: 8 }}>
              <div className="t-titulo-secao text-fg mb-1">Desbloqueie tudo</div>
              <div className="t-corpo-2 text-fg-2">Acesse todas as calculadoras e funcionalidades premium</div>
            </div>

            {/* Usage box */}
            <div className="modal-usage-box">
              <div className="flex-1">
                <div className="t-corpo-2 text-fg" style={{ fontWeight: 600 }}>Degustacoes restantes</div>
                <div className="t-legenda text-fg-3 mt-1">Voce usou 2 de 3 disponveis</div>
              </div>
              <div className="t-titulo-pagina" style={{ fontFamily: "'JetBrains Mono'", color: 'var(--warning)' }}>1</div>
            </div>

            {/* Benefits */}
            <div className="modal-benefits py-4">
              <div className="modal-benefit-row">
                <i className="ph ph-check-circle modal-benefit-icon" />
                <div>
                  <div className="t-corpo-2 text-fg" style={{ fontWeight: 500 }}>Calculadoras ilimitadas</div>
                  <div className="t-legenda text-fg-3 mt-1">Acesse todas as 152+ calculadoras sem restricao</div>
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
                  <div className="t-corpo-2 text-fg" style={{ fontWeight: 500 }}>Sem anuncios</div>
                  <div className="t-legenda text-fg-3 mt-1">Experiencia limpa e focada no atendimento</div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-col gap-3 px-5 pb-5">
              <button className="btn btn-lg btn-primary w-full">Assinar agora</button>
              <button className="btn btn-lg btn-ghost w-full">Agora nao</button>
            </div>
          </div>
        </DSPanel>
      </div>

      {/* Plan Cards */}
      <div className="ds-subsection">
        <h3>Cards de Plano</h3>
        <DSPanel>
          <div className="flex gap-3">
            <div className="plan-card selected flex-1">
              <span className="tag-status premium plan-badge">MELHOR VALOR</span>
              <div className="t-subtitulo text-fg mb-1 mt-2">Anual</div>
              <div className="t-preco-destaque">R$ 29,90<span className="t-corpo-2 text-fg-3">/mes</span></div>
              <div className="t-legenda text-fg-3 mt-1">R$ 358,80/ano</div>
            </div>
            <div className="plan-card flex-1">
              <div className="t-subtitulo text-fg mb-1">Mensal</div>
              <div className="t-preco">R$ 49,90<span className="t-corpo-2 text-fg-3">/mes</span></div>
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
              <div className="t-legenda mb-2" style={{ fontWeight: 600, opacity: 0.6 }}>2 opcoes</div>
              <div className="segmented" style={{ maxWidth: 280 }}>
                <button className="seg-option active">Anual</button>
                <button className="seg-option">Mensal</button>
              </div>
            </div>
            <div>
              <div className="t-legenda mb-2" style={{ fontWeight: 600, opacity: 0.6 }}>3 opcoes</div>
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
            <tr><th>Classe</th><th>Descricao</th></tr>
          </thead>
          <tbody>
            {[
              { cls: '.modal-premium-sheet', desc: 'Container do modal: radius top xl, fundo card, shadow-5' },
              { cls: '.modal-usage-box', desc: 'Box de uso restante: flex, borda, radius lg' },
              { cls: '.modal-benefits', desc: 'Lista de beneficios: flex column, gap 16px' },
              { cls: '.modal-benefit-row', desc: 'Linha: flex, gap 12px, icone + texto' },
              { cls: '.modal-benefit-icon', desc: 'Icone verde 20px, check-circle' },
              { cls: '.plan-card', desc: 'Card de plano: padding, radius xl, borda, cursor pointer' },
              { cls: '.plan-card.selected', desc: 'Borda 2px teal (border-focus)' },
              { cls: '.segmented', desc: 'Container segmentado: flex, radius lg, borda, fundo surface' },
              { cls: '.seg-option', desc: 'Opcao: flex 1, padding, font 500 14px' },
              { cls: '.seg-option.active', desc: 'Ativa: fundo primary, cor on, font 600' },
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
