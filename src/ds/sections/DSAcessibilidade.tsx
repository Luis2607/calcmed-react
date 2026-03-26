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
          <div className="flex items-center flex-wrap gap-8">
            <div className="text-center">
              <div className="flex items-center justify-center" style={{
                width: 48, height: 48, borderRadius: 12,
                border: '2px dashed var(--btn-primary)',
                font: "500 12px 'JetBrains Mono'", color: 'var(--btn-primary)',
              }}>48dp</div>
              <div className="t-texto-badge text-fg-3 mt-1" style={{ fontWeight: 500 }}>Padrao</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center" style={{
                width: 52, height: 52, borderRadius: 12,
                border: '2px dashed var(--danger)',
                font: "500 12px 'JetBrains Mono'", color: 'var(--danger)',
              }}>52dp</div>
              <div className="t-texto-badge text-fg-3 mt-1" style={{ fontWeight: 500 }}>Emergencia</div>
            </div>
            <div className="flex-1" style={{ minWidth: 200 }}>
              <p className="t-corpo-2 text-fg-2">
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
          <div className="flex flex-col gap-4">
            <div className="p-4" style={{ borderRadius: 8, background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <div className="flex justify-between items-center">
                <span className="t-corpo-2 text-fg" style={{ fontWeight: 600 }}>Texto primario (--fg)</span>
                <span className="t-legenda" style={{ fontWeight: 500, fontFamily: "'JetBrains Mono'", color: 'var(--success)' }}>AAA 7:1+</span>
              </div>
              <div className="t-legenda text-fg-3 mt-1">
                Texto clinico principal. Sempre AAA sobre bg e bg-card.
              </div>
            </div>
            <div className="p-4" style={{ borderRadius: 8, background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <div className="flex justify-between items-center">
                <span className="t-corpo-2 text-fg-2" style={{ fontWeight: 600 }}>Texto secundario (--fg-2)</span>
                <span className="t-legenda" style={{ fontWeight: 500, fontFamily: "'JetBrains Mono'", color: 'var(--success)' }}>AA 4.5:1+</span>
              </div>
              <div className="t-legenda text-fg-3 mt-1">
                Descricoes, subtitulos. Minimo AA.
              </div>
            </div>
            <div className="p-4" style={{ borderRadius: 8, background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <div className="flex justify-between items-center">
                <span className="t-corpo-2 text-fg-3" style={{ fontWeight: 600 }}>Texto terciario (--fg-3)</span>
                <span className="t-legenda" style={{ fontWeight: 500, fontFamily: "'JetBrains Mono'", color: 'var(--warning)' }}>AA Large</span>
              </div>
              <div className="t-legenda text-fg-3 mt-1">
                Placeholders, legendas. Somente textos grandes ou decorativos.
              </div>
            </div>
            <div className="p-4" style={{ borderRadius: 8, background: 'var(--success-bg)', border: '1px solid var(--success-border)' }}>
              <div className="flex justify-between items-center">
                <span className="t-dose-valor" style={{ color: 'var(--success)', fontSize: 24 }}>150 mg</span>
                <span className="t-legenda" style={{ fontWeight: 500, fontFamily: "'JetBrains Mono'", color: 'var(--success)' }}>AAA 7:1+</span>
              </div>
              <div className="t-legenda text-fg-3 mt-1">
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
          <div className="flex gap-4 flex-wrap">
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
          <div className="mt-3 t-legenda text-fg-2">
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
                <td className="text-fg-2">{r.use}</td>
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
        <div className="p-5" style={{ borderRadius: 12, border: '2px solid var(--danger)', background: 'var(--danger-bg)' }}>
          <div className="t-alerta-titulo mb-2" style={{ color: 'var(--danger)' }}>
            Regras para telas de emergencia
          </div>
          <ul className="t-corpo-2 text-fg-2" style={{ paddingLeft: 20, lineHeight: '24px' }}>
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
