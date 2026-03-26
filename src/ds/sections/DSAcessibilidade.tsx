import DSPanel from '../DSPanel'

export default function DSAcessibilidade() {
  return (
    <div>
      <h2 className="ds-section-title">Acessibilidade</h2>
      <p className="ds-section-desc">
        O CalcMed e usado em contextos de emergencia medica. Acessibilidade nao e opcional —
        e requisito clinico. WCAG AAA (7:1) para texto clinico. Touch targets de 48dp, ampliados para 52dp
        em contextos de emergencia.
      </p>

      {/* Touch Targets */}
      <div className="ds-subsection">
        <h3>Touch Targets</h3>
        <DSPanel>
          <div style={{ display: 'flex', gap: 32, alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: 48, height: 48, borderRadius: 12,
                border: '2px dashed var(--btn-primary)', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                font: "500 12px 'JetBrains Mono'", color: 'var(--btn-primary)',
              }}>48dp</div>
              <div style={{ font: "500 11px 'Inter'", color: 'var(--fg-3)', marginTop: 4 }}>Padrao</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: 52, height: 52, borderRadius: 12,
                border: '2px dashed var(--danger)', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                font: "500 12px 'JetBrains Mono'", color: 'var(--danger)',
              }}>52dp</div>
              <div style={{ font: "500 11px 'Inter'", color: 'var(--fg-3)', marginTop: 4 }}>Emergencia</div>
            </div>
            <div style={{ flex: 1, minWidth: 200 }}>
              <p style={{ font: "400 14px/20px 'Inter'", color: 'var(--fg-2)' }}>
                Todos os botoes e alvos interativos possuem area minima de 48x48dp.
                Em telas de emergencia (doses criticas, alertas), o target aumenta para 52x52dp.
              </p>
            </div>
          </div>
        </DSPanel>
      </div>

      {/* Contrast Ratios */}
      <div className="ds-subsection">
        <h3>Contraste</h3>
        <DSPanel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ padding: 16, borderRadius: 8, background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ font: "600 14px 'Inter'", color: 'var(--fg)' }}>Texto primario (--fg)</span>
                <span style={{ font: "500 13px 'JetBrains Mono'", color: 'var(--success)' }}>AAA 7:1+</span>
              </div>
              <div style={{ font: "400 12px 'Inter'", color: 'var(--fg-3)', marginTop: 4 }}>
                Texto clinico principal. Sempre AAA sobre bg e bg-card.
              </div>
            </div>
            <div style={{ padding: 16, borderRadius: 8, background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ font: "600 14px 'Inter'", color: 'var(--fg-2)' }}>Texto secundario (--fg-2)</span>
                <span style={{ font: "500 13px 'JetBrains Mono'", color: 'var(--success)' }}>AA 4.5:1+</span>
              </div>
              <div style={{ font: "400 12px 'Inter'", color: 'var(--fg-3)', marginTop: 4 }}>
                Descricoes, subtitulos. Minimo AA.
              </div>
            </div>
            <div style={{ padding: 16, borderRadius: 8, background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ font: "600 14px 'Inter'", color: 'var(--fg-3)' }}>Texto terciario (--fg-3)</span>
                <span style={{ font: "500 13px 'JetBrains Mono'", color: 'var(--warning)' }}>AA Large</span>
              </div>
              <div style={{ font: "400 12px 'Inter'", color: 'var(--fg-3)', marginTop: 4 }}>
                Placeholders, legendas. Somente textos grandes ou decorativos.
              </div>
            </div>
            <div style={{ padding: 16, borderRadius: 8, background: 'var(--success-bg)', border: '1px solid var(--success-border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="t-dose-valor" style={{ color: 'var(--success)', fontSize: 24 }}>150 mg</span>
                <span style={{ font: "500 13px 'JetBrains Mono'", color: 'var(--success)' }}>AAA 7:1+</span>
              </div>
              <div style={{ font: "400 12px 'Inter'", color: 'var(--fg-3)', marginTop: 4 }}>
                Doses calculadas. NUNCA abaixo de 20px. Contraste AAA obrigatorio.
              </div>
            </div>
          </div>
        </DSPanel>
      </div>

      {/* Focus Ring */}
      <div className="ds-subsection">
        <h3>Focus Ring</h3>
        <DSPanel>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <button
              className="btn btn-md btn-primary"
              style={{ outline: '2px solid var(--border-focus)', outlineOffset: 2 }}
            >
              Botao com focus
            </button>
            <input
              className="input-field"
              style={{ width: 200, outline: '2px solid var(--border-focus)', outlineOffset: 2 }}
              defaultValue="Input com focus"
            />
          </div>
          <div style={{ marginTop: 12, font: "400 13px 'Inter'", color: 'var(--fg-2)' }}>
            Focus ring: 2px solid var(--border-focus), offset 2px. Aplicado via :focus-visible em todos os interativos.
          </div>
        </DSPanel>
      </div>

      {/* ARIA */}
      <div className="ds-subsection">
        <h3>Atributos ARIA</h3>
        <table className="ds-token-table">
          <thead>
            <tr><th>Atributo</th><th>Uso</th></tr>
          </thead>
          <tbody>
            {[
              { attr: 'aria-label', use: 'Botoes icon-only, acoes sem texto visivel' },
              { attr: 'aria-live="polite"', use: 'Toasts, alertas dinamicos' },
              { attr: 'aria-live="assertive"', use: 'Alertas criticos (nivel 3)' },
              { attr: 'role="alert"', use: 'Mensagens de erro em inputs' },
              { attr: 'aria-expanded', use: 'Categorias colapsiveis, dropdowns' },
              { attr: 'aria-selected', use: 'Cards de selecao, chips ativos' },
              { attr: 'aria-disabled', use: 'Elementos desabilitados' },
              { attr: 'aria-current="page"', use: 'Item ativo na navegacao' },
            ].map(r => (
              <tr key={r.attr}>
                <td><span className="ds-token">{r.attr}</span></td>
                <td style={{ color: 'var(--fg-2)' }}>{r.use}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Screen Reader */}
      <div className="ds-subsection">
        <h3>Screen Reader</h3>
        <div className="ds-guideline do">
          <div className="ds-guideline-label">Fazer</div>
          <p>
            Usar classe .sr-only para texto acessivel oculto visualmente.
            Anunciar doses via aria-live. Descrever icones com aria-label.
          </p>
        </div>
        <div className="ds-guideline do">
          <div className="ds-guideline-label">Classe .sr-only</div>
          <p>
            position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0,0,0,0).
            Conteudo fica invisivel mas acessivel ao leitor de tela.
          </p>
        </div>
        <div className="ds-guideline dont">
          <div className="ds-guideline-label">Nao Fazer</div>
          <p>
            Usar display:none ou visibility:hidden para esconder conteudo que deve ser lido.
            Remover focus ring via outline:none sem alternativa. Usar apenas cor para transmitir estado.
          </p>
        </div>
      </div>

      {/* Reduced Motion */}
      <div className="ds-subsection">
        <h3>Movimento Reduzido</h3>
        <div className="ds-guideline do">
          <div className="ds-guideline-label">Implementado</div>
          <p>
            @media(prefers-reduced-motion: reduce) desabilita todas as animacoes.
            Skeleton shimmer, toast-in, modal-scale-in, btn-spin — todos respeitam a preferencia.
          </p>
        </div>
      </div>

      {/* Emergency Context */}
      <div className="ds-subsection">
        <h3>Contexto de Emergencia</h3>
        <div style={{ padding: 20, borderRadius: 12, border: '2px solid var(--danger)', background: 'var(--danger-bg)' }}>
          <div style={{ font: "700 16px 'Inter'", color: 'var(--danger)', marginBottom: 8 }}>
            Regras para telas de emergencia
          </div>
          <ul style={{ font: "400 14px/24px 'Inter'", color: 'var(--fg-2)', paddingLeft: 20 }}>
            <li>Touch target minimo 52dp (nao 48dp)</li>
            <li>Doses sempre em JetBrains Mono, minimo 20px</li>
            <li>Emergencia acessivel em maximo 2 toques</li>
            <li>Contraste WCAG AAA (7:1) para todo texto clinico</li>
            <li>Alertas criticos com aria-live="assertive"</li>
            <li>Nenhum elemento decorativo em telas de dose</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
