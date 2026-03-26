import DSPanel from '../DSPanel'

export default function DSAcessibilidade() {
  return (
    <div>
      <h2 className="ds-section-title">Acessibilidade</h2>
      <p className="ds-section-desc">
        O CalcMed e usado em contextos de emergencia medica, muitas vezes sob pressao e com iluminacao
        adversa. Acessibilidade nao e opcional — e requisito clinico. Todo texto clinico segue WCAG AAA (7:1).
        Touch targets sao de 48dp (padrao) e 52dp em telas de emergencia. Estas diretrizes sao obrigatorias
        em todas as telas e componentes do app.
      </p>

      {/* Touch Targets */}
      <div className="ds-subsection">
        <h3>Touch Targets</h3>
        <p className="t-corpo-2 text-fg-2 mb-4">
          Areas minimas de toque para garantir precisao mesmo com maos tremulas, luvas ou telas molhadas.
          Em emergencia, o target ampliado de 52dp reduz erros de toque em momentos criticos.
        </p>
        <DSPanel>
          <div className="flex items-center flex-wrap gap-8">
            <div className="text-center">
              <div className="flex items-center justify-center rounded-lg" style={{
                width: 48, height: 48,
                border: '2px dashed var(--btn-primary)',
                font: "500 12px 'JetBrains Mono'", color: 'var(--btn-primary)',
              }}>48dp</div>
              <div className="t-texto-badge text-fg-3 mt-1" style={{ fontWeight: 500 }}>Padrao</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center rounded-lg" style={{
                width: 52, height: 52,
                border: '2px dashed var(--danger)',
                font: "500 12px 'JetBrains Mono'", color: 'var(--danger)',
              }}>52dp</div>
              <div className="t-texto-badge text-fg-3 mt-1" style={{ fontWeight: 500 }}>Emergencia</div>
            </div>
            <div className="flex-1" style={{ minWidth: 200 }}>
              <p className="t-corpo-2 text-fg-2">
                Todos os botoes e alvos interativos possuem area minima de 48x48dp.
                Em telas de emergencia (doses criticas, alertas), o target aumenta para 52x52dp
                para evitar erros de toque sob pressao.
              </p>
            </div>
          </div>
        </DSPanel>
      </div>

      {/* Contrast Ratios */}
      <div className="ds-subsection">
        <h3>Contraste</h3>
        <p className="t-corpo-2 text-fg-2 mb-4">
          Niveis de contraste por tipo de conteudo. Doses calculadas exigem AAA (7:1) obrigatorio
          porque um erro de leitura pode ter consequencias clinicas graves.
        </p>
        <DSPanel>
          <div className="flex flex-col gap-4">
            <div className="p-4 rounded" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <div className="flex justify-between items-center">
                <span className="t-corpo-2 text-fg" style={{ fontWeight: 600 }}>Texto primario (--fg)</span>
                <span className="t-legenda" style={{ fontWeight: 500, fontFamily: "'JetBrains Mono'", color: 'var(--success)' }}>AAA 7:1+</span>
              </div>
              <div className="t-legenda text-fg-3 mt-1">
                Texto clinico principal: nomes de drogas, titulos, valores. Sempre AAA sobre bg e bg-card.
              </div>
            </div>
            <div className="p-4 rounded" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <div className="flex justify-between items-center">
                <span className="t-corpo-2 text-fg-2" style={{ fontWeight: 600 }}>Texto secundario (--fg-2)</span>
                <span className="t-legenda" style={{ fontWeight: 500, fontFamily: "'JetBrains Mono'", color: 'var(--success)' }}>AA 4.5:1+</span>
              </div>
              <div className="t-legenda text-fg-3 mt-1">
                Descricoes, subtitulos, informacoes complementares. Minimo AA.
              </div>
            </div>
            <div className="p-4 rounded" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <div className="flex justify-between items-center">
                <span className="t-corpo-2 text-fg-3" style={{ fontWeight: 600 }}>Texto terciario (--fg-3)</span>
                <span className="t-legenda" style={{ fontWeight: 500, fontFamily: "'JetBrains Mono'", color: 'var(--warning)' }}>AA Large</span>
              </div>
              <div className="t-legenda text-fg-3 mt-1">
                Placeholders, legendas, timestamps. Permitido somente em textos grandes ou decorativos.
              </div>
            </div>
            <div className="p-4 rounded" style={{ background: 'var(--success-bg)', border: '1px solid var(--success-border)' }}>
              <div className="flex justify-between items-center">
                <span className="t-dose-valor" style={{ color: 'var(--success)', fontSize: 24 }}>150 mg</span>
                <span className="t-legenda" style={{ fontWeight: 500, fontFamily: "'JetBrains Mono'", color: 'var(--success)' }}>AAA 7:1+</span>
              </div>
              <div className="t-legenda text-fg-3 mt-1">
                Doses calculadas. NUNCA abaixo de 20px. Contraste AAA obrigatorio — erro de leitura pode ser fatal.
              </div>
            </div>
          </div>
        </DSPanel>
      </div>

      {/* Focus Ring */}
      <div className="ds-subsection">
        <h3>Focus Ring</h3>
        <p className="t-corpo-2 text-fg-2 mb-4">
          Indicador visual de foco para navegacao por teclado. Aplicado automaticamente via :focus-visible
          em todos os elementos interativos. Essencial para medicos que usam teclado ou tecnologias assistivas.
        </p>
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
            Focus ring: 2px solid var(--border-focus), offset 2px. Cor teal para visibilidade em ambos os modos.
          </div>
        </DSPanel>
      </div>

      {/* ARIA */}
      <div className="ds-subsection">
        <h3>Atributos ARIA</h3>
        <p className="t-corpo-2 text-fg-2 mb-4">
          Checklist de atributos ARIA obrigatorios por tipo de componente. Cada atributo deve ser implementado
          conforme descrito — nao e sugestao, e requisito.
        </p>
        <table className="ds-token-table">
          <thead>
            <tr><th>Atributo</th><th>Onde usar</th></tr>
          </thead>
          <tbody>
            {[
              { attr: 'aria-label', use: 'Obrigatorio em botoes icon-only e acoes sem texto visivel' },
              { attr: 'aria-live="polite"', use: 'Toasts de sucesso/info e alertas nao criticos' },
              { attr: 'aria-live="assertive"', use: 'Alertas criticos (nivel 3) e erros de dose' },
              { attr: 'role="alert"', use: 'Mensagens de erro em inputs e validacao de range' },
              { attr: 'aria-expanded', use: 'Categorias colapsiveis, dropdowns, bottom sheets' },
              { attr: 'aria-selected', use: 'Cards de selecao, chips ativos, tabs' },
              { attr: 'aria-disabled', use: 'Elementos desabilitados (complementar ao atributo disabled)' },
              { attr: 'aria-current="page"', use: 'Item ativo na bottom nav e sidebar' },
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
        <h3>Leitor de Tela</h3>
        <p className="t-corpo-2 text-fg-2 mb-4">
          Diretrizes praticas para garantir que leitores de tela consigam transmitir informacoes clinicas
          com precisao. Doses devem ser anunciadas com unidade e via de administracao.
        </p>
        <div className="ds-guideline do">
          <div className="ds-guideline-label">Fazer</div>
          <p>
            Usar classe .sr-only para texto acessivel oculto visualmente.
            Anunciar doses via aria-live incluindo valor, unidade e via (ex: "150 miligramas, intravenoso").
            Descrever icones com aria-label descritivo.
          </p>
        </div>
        <div className="ds-guideline do">
          <div className="ds-guideline-label">Classe .sr-only</div>
          <p>
            position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0,0,0,0).
            Conteudo fica invisivel mas acessivel ao leitor de tela. Usar para rotulos de secao,
            descricoes de icones e contexto adicional de doses.
          </p>
        </div>
        <div className="ds-guideline dont">
          <div className="ds-guideline-label">Nao fazer</div>
          <p>
            Usar display:none ou visibility:hidden para esconder conteudo que deve ser lido.
            Remover focus ring via outline:none sem alternativa visual.
            Usar apenas cor para transmitir estado (sempre adicionar icone ou texto).
            Usar placeholder como substituto de label em campos de formulario.
          </p>
        </div>
      </div>

      {/* Reduced Motion */}
      <div className="ds-subsection">
        <h3>Movimento Reduzido</h3>
        <p className="t-corpo-2 text-fg-2 mb-4">
          Respeito a preferencia do sistema operacional para reduzir animacoes. Importante para
          usuarios com vestibulares sensiveis ou epilepsia fotossensivel.
        </p>
        <div className="ds-guideline do">
          <div className="ds-guideline-label">Implementado</div>
          <p>
            @media(prefers-reduced-motion: reduce) desabilita todas as animacoes automaticamente.
            Skeleton shimmer, toast-in, modal-scale-in, btn-spin — todos respeitam a preferencia.
            Nenhuma animacao e essencial para compreensao do conteudo.
          </p>
        </div>
      </div>

      {/* Emergency Context */}
      <div className="ds-subsection">
        <h3>Contexto de Emergencia</h3>
        <p className="t-corpo-2 text-fg-2 mb-4">
          Regras adicionais e inegociaveis para telas onde o medico calcula doses ou consulta protocolos
          de emergencia. Estas regras existem porque erros nestas telas podem ser fatais.
        </p>
        <div className="p-5 rounded-lg" style={{ border: '2px solid var(--danger)', background: 'var(--danger-bg)' }}>
          <div className="t-alerta-titulo mb-2" style={{ color: 'var(--danger)' }}>
            Regras para telas de emergencia
          </div>
          <ul className="t-corpo-2 text-fg-2" style={{ paddingLeft: 20, lineHeight: '24px' }}>
            <li>Touch target minimo 52dp (nao 48dp)</li>
            <li>Doses sempre em JetBrains Mono, minimo 20px, contraste AAA</li>
            <li>Emergencia acessivel em maximo 2 toques a partir de qualquer tela</li>
            <li>Contraste WCAG AAA (7:1) para todo texto clinico sem excecao</li>
            <li>Alertas criticos com aria-live="assertive" e role="alert"</li>
            <li>Nenhum elemento decorativo em telas de dose — foco total na informacao</li>
            <li>Validacao de range clinico em todo input numerico antes de exibir resultado</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
