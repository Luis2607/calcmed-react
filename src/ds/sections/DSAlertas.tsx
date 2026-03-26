import AlertCard from '../../components/ui/AlertCard'
import DSPanel from '../DSPanel'

export default function DSAlertas() {
  return (
    <div>
      <h2 className="ds-section-title">Alertas</h2>
      <p className="ds-section-desc">
        Alertas são o sistema de comunicação de segurança clínica do CalcMed. Em medicina de
        emergência, a hierarquia visual dos alertas pode ser a diferença entre administrar uma dose
        segura ou exceder um limite crítico. O sistema possui 5 níveis hierárquicos, cada um com cor,
        peso visual e contexto de uso específicos. O Nível 2 (resultado/dose) é o PROTAGONISTA visual
        da interface — é a informação que o médico procura em cada cálculo.
      </p>

      {/* 5 Levels */}
      <div className="ds-subsection">
        <h3>5 Níveis Clínicos</h3>
        <p className="ds-subsection-desc">
          A hierarquia de 5 níveis foi desenhada com base no protocolo de triagem médica:
          informação contextual (preto/cinza), resultado principal (verde), alerta crítico (vermelho),
          observação clínica (âmbar) e rodapé/disclaimer (cinza discreto). Cada nível tem um papel
          comunicacional único e insubstituível.
        </p>
        <DSPanel>
          <div className="flex flex-col gap-4">
            {/* Level 1: Info */}
            <div>
              <div className="t-texto-badge text-fg-3 mb-2">
                NÍVEL 1 — INFO (PRETO/CINZA)
              </div>
              <AlertCard level="info" icon="info" title="Informação geral">
                Este medicamento está disponível em apresentações de 10mg e 20mg.
              </AlertCard>
            </div>

            {/* Level 2: Result / Dose */}
            <div>
              <div className="t-texto-badge text-fg-3 mb-2">
                NÍVEL 2 — RESULTADO/DOSE (VERDE — PROTAGONISTA)
              </div>
              <AlertCard level="result" icon="check-circle" title="Dose calculada">
                <div>
                  <span className="t-dose-valor" style={{ color: 'var(--success)' }}>150</span>
                  <span className="t-dose-unidade" style={{ color: 'var(--success)', marginLeft: 8 }}>mg</span>
                </div>
                <div className="mt-1 t-legenda">
                  Midazolam 0.3 mg/kg para paciente de 50kg
                </div>
              </AlertCard>
            </div>

            {/* Level 3: Critical */}
            <div>
              <div className="t-texto-badge text-fg-3 mb-2">
                NÍVEL 3 — CRÍTICO (VERMELHO)
              </div>
              <AlertCard level="critical" icon="warning" title="Dose máxima excedida">
                Valor inserido ultrapassa o limite seguro de 10mg/kg. Revise antes de administrar.
              </AlertCard>
            </div>

            {/* Level 4: Warning / Observation */}
            <div>
              <div className="t-texto-badge text-fg-3 mb-2">
                NÍVEL 4 — OBSERVAÇÃO (ÂMBAR)
              </div>
              <AlertCard level="warning" icon="info" title="Atenção">
                Considere redução de 50% em pacientes idosos ou com insuficiência hepática.
              </AlertCard>
            </div>

            {/* Level 5: Footnote */}
            <div>
              <div className="t-texto-badge text-fg-3 mb-2">
                NÍVEL 5 — RODAPÉ (CINZA)
              </div>
              <AlertCard level="footnote" icon="info" title="Fonte: Goodman & Gilman, 14a ed. Valores para adultos com função renal normal." />
            </div>
          </div>
        </DSPanel>
      </div>

      {/* Simple Alerts (from .alert class) */}
      <div className="ds-subsection">
        <h3>Alertas Simples (classe .alert)</h3>
        <p className="ds-subsection-desc">
          Versão simplificada dos alertas para mensagens de sistema (não clínicas): confirmações
          de operação, erros de rede, avisos de manutenção. Usam as mesmas cores semânticas
          dos alertas clínicos mas com layout mais compacto e sem ícone obrigatório.
        </p>
        <DSPanel>
          <div className="flex flex-col gap-3">
            <div className="alert info">
              <div className="alert-title">Informação</div>
              <div className="alert-body">Mensagem informativa padrão.</div>
            </div>
            <div className="alert success">
              <div className="alert-title">Sucesso</div>
              <div className="alert-body">Operação realizada com sucesso.</div>
            </div>
            <div className="alert critical">
              <div className="alert-title">Crítico</div>
              <div className="alert-body">Erro crítico detectado.</div>
            </div>
            <div className="alert warning">
              <div className="alert-title">Aviso</div>
              <div className="alert-body">Atenção necessária.</div>
            </div>
            <div className="alert footnote">
              <div className="alert-body">Nota de rodapé com informações adicionais.</div>
            </div>
          </div>
        </DSPanel>
      </div>

      {/* Compact */}
      <div className="ds-subsection">
        <h3>Alerta Compacto</h3>
        <p className="ds-subsection-desc">
          Versão inline horizontal para feedbacks rápidos dentro de formulários ou após ações
          (ex: "Salvo com sucesso", "Erro ao salvar"). Podem incluir botão de fechar (X).
          Usados como toasts ou notificações efêmeras na interface.
        </p>
        <DSPanel>
          <div className="flex flex-col gap-2">
            <div className="alert success compact">
              <i className="ph ph-check-circle" style={{ fontSize: 18 }} />
              <div className="alert-title">Salvo com sucesso</div>
            </div>
            <div className="alert critical compact">
              <i className="ph ph-warning" style={{ fontSize: 18 }} />
              <div className="alert-title">Erro ao salvar</div>
              <button className="alert-close"><i className="ph ph-x" /></button>
            </div>
          </div>
        </DSPanel>
      </div>

      {/* Boas Práticas */}
      <div className="ds-subsection">
        <h3>Boas Práticas</h3>
        <p className="ds-subsection-desc">Diretrizes para uso correto dos componentes em contexto clínico.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <div className="t-texto-badge text-success mb-3" style={{ textTransform: 'uppercase', letterSpacing: 1 }}>Faça</div>
            {[
              'Resultado/dose (nível 2) é SEMPRE o protagonista visual',
              'Crítico (nível 3) só para dose máxima ultrapassada',
              'Rodapé (nível 5) sempre no final, referência bibliográfica',
            ].map(d => (
              <div key={d} className="flex gap-2 items-start mb-2">
                <i className="ph ph-check-circle" style={{ color: 'var(--success)', flexShrink: 0, marginTop: 2 }} />
                <span className="t-corpo-2">{d}</span>
              </div>
            ))}
          </div>
          <div>
            <div className="t-texto-badge text-danger mb-3" style={{ textTransform: 'uppercase', letterSpacing: 1 }}>Não faça</div>
            {[
              'Nunca usar verde para alertas que não sejam resultado',
              'Nunca diminuir fonte de dose abaixo de 20px',
              'Nunca omitir referência bibliográfica (nível 5)',
            ].map(d => (
              <div key={d} className="flex gap-2 items-start mb-2">
                <i className="ph ph-x-circle" style={{ color: 'var(--danger)', flexShrink: 0, marginTop: 2 }} />
                <span className="t-corpo-2">{d}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Classes */}
      <div className="ds-subsection">
        <h3>Classes CSS</h3>
        <p className="ds-subsection-desc">
          Referência de todas as classes de alerta. Os alertas clínicos (AlertCard) usam o prefixo
          <code>.alert-card</code> enquanto os alertas simples usam <code>.alert</code>.
        </p>
        <table className="ds-token-table">
          <thead>
            <tr><th>Classe</th><th>Nível</th><th>Uso Clínico</th></tr>
          </thead>
          <tbody>
            {[
              { cls: '.alert-card.alert-info', level: '1', use: 'Contexto geral, informações sobre o medicamento' },
              { cls: '.alert-card.alert-result', level: '2', use: 'Dose calculada — protagonista visual da tela' },
              { cls: '.alert-card.alert-critical', level: '3', use: 'Alertas de segurança, limites excedidos' },
              { cls: '.alert-card.alert-warning', level: '4', use: 'Observações clínicas, ajustes necessários' },
              { cls: '.alert-card.alert-footnote', level: '5', use: 'Fontes bibliográficas, disclaimers, notas' },
              { cls: '.alert.compact', level: '—', use: 'Versão inline horizontal para feedback de sistema' },
            ].map(r => (
              <tr key={r.cls}>
                <td><span className="ds-token">{r.cls}</span></td>
                <td className="t-legenda text-fg-2" style={{ fontWeight: 600, fontFamily: "'JetBrains Mono'" }}>{r.level}</td>
                <td className="text-fg-2">{r.use}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
