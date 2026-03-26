import DSPanel from '../DSPanel'

export default function DSAcessibilidade() {
  return (
    <div>
      <h2 className="ds-section-title">Acessibilidade</h2>
      <p className="ds-section-desc">
        O CalcMed é usado em contextos de emergência médica, muitas vezes sob pressão e com iluminação
        adversa. Acessibilidade não é opcional — é requisito clínico. Todo texto clínico segue WCAG AAA (7:1).
        Touch targets são de 48dp (padrão) e 52dp em telas de emergência. Estas diretrizes são obrigatórias
        em todas as telas e componentes do app.
      </p>

      {/* Touch Targets */}
      <div className="ds-subsection">
        <h3>Touch Targets</h3>
        <p className="t-corpo-2 text-fg-2 mb-4">
          Áreas mínimas de toque para garantir precisão mesmo com mãos trêmulas, luvas ou telas molhadas.
          Em emergência, o target ampliado de 52dp reduz erros de toque em momentos críticos.
        </p>
        <DSPanel>
          <div className="flex items-center flex-wrap gap-8">
            <div className="text-center">
              <div className="flex items-center justify-center rounded-lg" style={{
                width: 48, height: 48,
                border: '2px dashed var(--btn-primary)',
                font: "500 12px 'JetBrains Mono'", color: 'var(--btn-primary)',
              }}>48dp</div>
              <div className="t-texto-badge text-fg-3 mt-1" style={{ fontWeight: 500 }}>Padrão</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center rounded-lg" style={{
                width: 52, height: 52,
                border: '2px dashed var(--danger)',
                font: "500 12px 'JetBrains Mono'", color: 'var(--danger)',
              }}>52dp</div>
              <div className="t-texto-badge text-fg-3 mt-1" style={{ fontWeight: 500 }}>Emergência</div>
            </div>
            <div className="flex-1" style={{ minWidth: 200 }}>
              <p className="t-corpo-2 text-fg-2">
                Todos os botões e alvos interativos possuem área mínima de 48x48dp.
                Em telas de emergência (doses críticas, alertas), o target aumenta para 52x52dp
                para evitar erros de toque sob pressão.
              </p>
            </div>
          </div>
        </DSPanel>
      </div>

      {/* Contrast Ratios */}
      <div className="ds-subsection">
        <h3>Contraste</h3>
        <p className="t-corpo-2 text-fg-2 mb-4">
          Níveis de contraste por tipo de conteúdo. Doses calculadas exigem AAA (7:1) obrigatório
          porque um erro de leitura pode ter consequências clínicas graves.
        </p>
        <DSPanel>
          <div className="flex flex-col gap-4">
            <div className="p-4 rounded" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <div className="flex justify-between items-center">
                <span className="t-corpo-2 text-fg" style={{ fontWeight: 600 }}>Texto primário (--fg)</span>
                <span className="t-legenda" style={{ fontWeight: 500, fontFamily: "'JetBrains Mono'", color: 'var(--success)' }}>AAA 7:1+</span>
              </div>
              <div className="t-legenda text-fg-3 mt-1">
                Texto clínico principal: nomes de drogas, títulos, valores. Sempre AAA sobre bg e bg-card.
              </div>
            </div>
            <div className="p-4 rounded" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <div className="flex justify-between items-center">
                <span className="t-corpo-2 text-fg-2" style={{ fontWeight: 600 }}>Texto secundário (--fg-2)</span>
                <span className="t-legenda" style={{ fontWeight: 500, fontFamily: "'JetBrains Mono'", color: 'var(--success)' }}>AA 4.5:1+</span>
              </div>
              <div className="t-legenda text-fg-3 mt-1">
                Descrições, subtítulos, informações complementares. Mínimo AA.
              </div>
            </div>
            <div className="p-4 rounded" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <div className="flex justify-between items-center">
                <span className="t-corpo-2 text-fg-3" style={{ fontWeight: 600 }}>Texto terciário (--fg-3)</span>
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
                Doses calculadas. NUNCA abaixo de 20px. Contraste AAA obrigatório — erro de leitura pode ser fatal.
              </div>
            </div>
          </div>
        </DSPanel>
      </div>

      {/* Focus Ring */}
      <div className="ds-subsection">
        <h3>Focus Ring</h3>
        <p className="t-corpo-2 text-fg-2 mb-4">
          Indicador visual de foco para navegação por teclado. Aplicado automaticamente via :focus-visible
          em todos os elementos interativos. Essencial para médicos que usam teclado ou tecnologias assistivas.
        </p>
        <DSPanel>
          <div className="flex gap-4 flex-wrap">
            <button
              className="btn btn-md btn-primary"
              style={{ outline: '2px solid var(--border-focus)', outlineOffset: 2 }}
            >
              Botão com focus
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
          Checklist de atributos ARIA obrigatórios por tipo de componente. Cada atributo deve ser implementado
          conforme descrito — não é sugestão, é requisito.
        </p>
        <table className="ds-token-table">
          <thead>
            <tr><th>Atributo</th><th>Onde usar</th></tr>
          </thead>
          <tbody>
            {[
              { attr: 'aria-label', use: 'Obrigatório em botões icon-only e ações sem texto visível' },
              { attr: 'aria-live="polite"', use: 'Toasts de sucesso/info e alertas não críticos' },
              { attr: 'aria-live="assertive"', use: 'Alertas críticos (nível 3) e erros de dose' },
              { attr: 'role="alert"', use: 'Mensagens de erro em inputs e validação de range' },
              { attr: 'aria-expanded', use: 'Categorias colapsáveis, dropdowns, bottom sheets' },
              { attr: 'aria-selected', use: 'Cards de seleção, chips ativos, tabs' },
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
          Diretrizes práticas para garantir que leitores de tela consigam transmitir informações clínicas
          com precisão. Doses devem ser anunciadas com unidade e via de administração.
        </p>
        <div className="ds-guideline do">
          <div className="ds-guideline-label">Fazer</div>
          <p>
            Usar classe .sr-only para texto acessível oculto visualmente.
            Anunciar doses via aria-live incluindo valor, unidade e via (ex: "150 miligramas, intravenoso").
            Descrever ícones com aria-label descritivo.
          </p>
        </div>
        <div className="ds-guideline do">
          <div className="ds-guideline-label">Classe .sr-only</div>
          <p>
            position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0,0,0,0).
            Conteúdo fica invisível mas acessível ao leitor de tela. Usar para rótulos de seção,
            descrições de ícones e contexto adicional de doses.
          </p>
        </div>
        <div className="ds-guideline dont">
          <div className="ds-guideline-label">Não fazer</div>
          <p>
            Usar display:none ou visibility:hidden para esconder conteúdo que deve ser lido.
            Remover focus ring via outline:none sem alternativa visual.
            Usar apenas cor para transmitir estado (sempre adicionar ícone ou texto).
            Usar placeholder como substituto de label em campos de formulário.
          </p>
        </div>
      </div>

      {/* Reduced Motion */}
      <div className="ds-subsection">
        <h3>Movimento Reduzido</h3>
        <p className="t-corpo-2 text-fg-2 mb-4">
          Respeito à preferência do sistema operacional para reduzir animações. Importante para
          usuários com vestibulares sensíveis ou epilepsia fotossensível.
        </p>
        <div className="ds-guideline do">
          <div className="ds-guideline-label">Implementado</div>
          <p>
            @media(prefers-reduced-motion: reduce) desabilita todas as animações automaticamente.
            Skeleton shimmer, toast-in, modal-scale-in, btn-spin — todos respeitam a preferência.
            Nenhuma animação é essencial para compreensão do conteúdo.
          </p>
        </div>
      </div>

      {/* Emergency Context */}
      <div className="ds-subsection">
        <h3>Contexto de Emergência</h3>
        <p className="t-corpo-2 text-fg-2 mb-4">
          Regras adicionais e inegociáveis para telas onde o médico calcula doses ou consulta protocolos
          de emergência. Estas regras existem porque erros nestas telas podem ser fatais.
        </p>
        <div className="p-5 rounded-lg" style={{ border: '2px solid var(--danger)', background: 'var(--danger-bg)' }}>
          <div className="t-alerta-titulo mb-2" style={{ color: 'var(--danger)' }}>
            Regras para telas de emergência
          </div>
          <ul className="t-corpo-2 text-fg-2" style={{ paddingLeft: 20, lineHeight: '24px' }}>
            <li>Touch target mínimo 52dp (não 48dp)</li>
            <li>Doses sempre em JetBrains Mono, mínimo 20px, contraste AAA</li>
            <li>Emergência acessível em máximo 2 toques a partir de qualquer tela</li>
            <li>Contraste WCAG AAA (7:1) para todo texto clínico sem exceção</li>
            <li>Alertas críticos com aria-live="assertive" e role="alert"</li>
            <li>Nenhum elemento decorativo em telas de dose — foco total na informação</li>
            <li>Validação de range clínico em todo input numérico antes de exibir resultado</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
