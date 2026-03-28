import DSPanel from '../DSPanel'

export default function DSPremiumModal() {
  return (
    <div>
      <h2 className="ds-section-title">Premium e Checkout</h2>
      <p className="ds-section-desc">
        Componentes da experiência de conversão e checkout. O médico que usa a versão gratuita
        eventualmente vê ofertas de upgrade. Cada elemento foi pensado para converter sem pressionar.
      </p>

      {/* Quando usar */}
      <div className="ds-subsection">
        <h3>Quando usar</h3>
        <div className="flex gap-8 mb-6">
          <div className="flex-1">
            <div className="t-texto-badge text-success mb-3" style={{ textTransform: 'uppercase', letterSpacing: 1 }}>Use quando</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li className="flex gap-2 items-start mb-2"><i className="ph ph-check-circle" style={{ color: 'var(--success)', flexShrink: 0, marginTop: 2 }} /><span className="t-corpo-2">O período de teste expirar ou uma funcionalidade estiver bloqueada</span></li>
              <li className="flex gap-2 items-start mb-2"><i className="ph ph-check-circle" style={{ color: 'var(--success)', flexShrink: 0, marginTop: 2 }} /><span className="t-corpo-2">O usuário tentar acessar conteúdo premium pela primeira vez</span></li>
              <li className="flex gap-2 items-start mb-2"><i className="ph ph-check-circle" style={{ color: 'var(--success)', flexShrink: 0, marginTop: 2 }} /><span className="t-corpo-2">SEMPRE incluir o botão "Agora não" visível sem scroll e com touch target de 48dp</span></li>
            </ul>
          </div>
          <div className="flex-1">
            <div className="t-texto-badge text-danger mb-3" style={{ textTransform: 'uppercase', letterSpacing: 1 }}>Não use quando</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li className="flex gap-2 items-start mb-2"><i className="ph ph-x-circle" style={{ color: 'var(--danger)', flexShrink: 0, marginTop: 2 }} /><span className="t-corpo-2">O médico estiver no meio de um cálculo de dose ativo. Nunca interromper</span></li>
              <li className="flex gap-2 items-start mb-2"><i className="ph ph-x-circle" style={{ color: 'var(--danger)', flexShrink: 0, marginTop: 2 }} /><span className="t-corpo-2">Esconder ou dificultar o dismiss ("Agora não"). Pode custar segundos críticos</span></li>
              <li className="flex gap-2 items-start mb-2"><i className="ph ph-x-circle" style={{ color: 'var(--danger)', flexShrink: 0, marginTop: 2 }} /><span className="t-corpo-2">Exibir modal premium repetidamente na mesma sessão. Respeite a frequência</span></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="ds-guideline do mb-4">
        <div className="ds-guideline-label">Regra crítica</div>
        <p>
          O botão "Agora não" é obrigatório em todo modal de conversão.
          O médico pode estar no meio de uma emergência real quando o modal aparece.
        </p>
        <p>
          Bloquear a saída ou esconder o dismiss pode custar segundos críticos no atendimento.
          O dismiss deve ter touch target de 48dp e ficar visível sem scroll.
        </p>
      </div>

      {/* Modal Premium Content */}
      <div className="ds-subsection">
        <h3>Conteúdo do Modal Premium</h3>
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
                <div className="t-corpo-2 text-fg" style={{ fontWeight: 600 }}>Testes restantes</div>
                <div className="t-legenda text-fg-3 mt-1">Você usou 2 de 3 disponíveis</div>
              </div>
              <div className="t-titulo-pagina" style={{ fontFamily: "'JetBrains Mono'", color: 'var(--warning)' }}>1</div>
            </div>

            {/* Benefits */}
            <div className="modal-benefits py-4">
              <div className="modal-benefit-row">
                <i className="ph ph-check-circle modal-benefit-icon" />
                <div>
                  <div className="t-corpo-2 text-fg" style={{ fontWeight: 500 }}>Calculadoras ilimitadas</div>
                  <div className="t-legenda text-fg-3 mt-1">Acesse todas as 152+ calculadoras sem restrição</div>
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
                  <div className="t-corpo-2 text-fg" style={{ fontWeight: 500 }}>Sem anúncios</div>
                  <div className="t-legenda text-fg-3 mt-1">Experiência limpa e focada no atendimento</div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-col gap-3 px-6 pb-8">
              <button className="btn btn-lg btn-primary w-full">Assinar agora</button>
              <button className="btn btn-lg btn-ghost w-full">Agora não</button>
            </div>
          </div>
        </DSPanel>
      </div>

      {/* Plan Cards */}
      <div className="ds-subsection">
        <h3>Cards de Plano</h3>
        <p className="t-corpo-2 text-fg-2 mb-4">
          O plano anual vem pré-selecionado (borda teal + badge "Melhor valor") por ser a opção
          mais vantajosa. O plano mensal aparece sem destaque, permitindo comparação rápida.
        </p>
        <DSPanel>
          <div className="flex gap-3">
            <div className="plan-card selected flex-1">
              <span className="tag-status premium plan-badge">MELHOR VALOR</span>
              <div className="t-subtitulo text-fg mb-1 mt-2">Anual</div>
              <div className="t-preco-destaque">R$ 29,90<span className="t-corpo-2 text-fg-3">/mês</span></div>
              <div className="t-legenda text-fg-3 mt-1">R$ 358,80/ano</div>
            </div>
            <div className="plan-card flex-1">
              <div className="t-subtitulo text-fg mb-1">Mensal</div>
              <div className="t-preco">R$ 49,90<span className="t-corpo-2 text-fg-3">/mês</span></div>
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
              <div className="t-legenda mb-2" style={{ fontWeight: 600, opacity: 0.6 }}>2 opções</div>
              <div className="segmented" style={{ maxWidth: 280 }}>
                <button className="seg-option active">Anual</button>
                <button className="seg-option">Mensal</button>
              </div>
            </div>
            <div>
              <div className="t-legenda mb-2" style={{ fontWeight: 600, opacity: 0.6 }}>3 opções</div>
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
            <tr><th>Classe</th><th>Descrição</th></tr>
          </thead>
          <tbody>
            {[
              { cls: '.modal-premium-sheet', desc: 'Container do modal: border-radius top xl, fundo card, shadow-5' },
              { cls: '.modal-usage-box', desc: 'Box de uso restante: flex com borda e border-radius lg' },
              { cls: '.modal-benefits', desc: 'Lista de benefícios: flex column com gap 16px' },
              { cls: '.modal-benefit-row', desc: 'Linha de benefício: flex com gap 12px, ícone + texto' },
              { cls: '.modal-benefit-icon', desc: 'Ícone verde 20px (check-circle) indicando inclusão' },
              { cls: '.plan-card', desc: 'Card de plano: padding, border-radius xl, borda, cursor pointer' },
              { cls: '.plan-card.selected', desc: 'Plano selecionado: borda 2px teal (--border-focus)' },
              { cls: '.segmented', desc: 'Container segmentado: flex, border-radius lg, borda, fundo surface' },
              { cls: '.seg-option', desc: 'Opção do segmentado: flex 1, padding, font 500 14px' },
              { cls: '.seg-option.active', desc: 'Opção ativa: fundo primary, cor on-surface, font 600' },
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
