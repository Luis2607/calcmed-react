import AlertCard from '../../components/ui/AlertCard'
import DSPanel from '../DSPanel'

export default function DSAlertas() {
  return (
    <div>
      <h2 className="ds-section-title">Alertas</h2>
      <p className="ds-section-desc">
        Alertas s{"\u00e3"}o o sistema de comunica{"\u00e7\u00e3"}o de seguran{"\u00e7"}a cl{"\u00ed"}nica do CalcMed. Em medicina de
        emerg{"\u00ea"}ncia, a hierarquia visual dos alertas pode ser a diferen{"\u00e7"}a entre administrar uma dose
        segura ou exceder um limite cr{"\u00ed"}tico.
      </p>
      <p className="ds-section-desc">
        O sistema possui 5 n{"\u00ed"}veis hier{"\u00e1"}rquicos, cada um com cor,
        peso visual e contexto de uso espec{"\u00ed"}ficos. O N{"\u00ed"}vel 2 (resultado/dose) {"\u00e9"} o PROTAGONISTA visual
        da interface — {"\u00e9"} a informa{"\u00e7\u00e3"}o que o m{"\u00e9"}dico procura em cada c{"\u00e1"}lculo.
      </p>

      {/* Quando usar */}
      <div className="ds-subsection">
        <h3>Quando usar</h3>
        <div className="flex gap-8 mb-6">
          <div className="flex-1">
            <div className="t-texto-badge text-success mb-3" style={{ textTransform: 'uppercase', letterSpacing: 1 }}>Use quando</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li className="flex gap-2 items-start mb-2"><i className="ph ph-check-circle" style={{ color: 'var(--success)', flexShrink: 0, marginTop: 2 }} /><span className="t-corpo-2">Exibir dose ou valor calculado. Use SEMPRE n{"\u00ed"}vel 2 (result) como protagonista visual</span></li>
              <li className="flex gap-2 items-start mb-2"><i className="ph ph-check-circle" style={{ color: 'var(--success)', flexShrink: 0, marginTop: 2 }} /><span className="t-corpo-2">Dose m{"\u00e1"}xima foi excedida. Use n{"\u00ed"}vel 3 (critical) SOMENTE neste caso</span></li>
              <li className="flex gap-2 items-start mb-2"><i className="ph ph-check-circle" style={{ color: 'var(--success)', flexShrink: 0, marginTop: 2 }} /><span className="t-corpo-2">Incluir observa{"\u00e7\u00f5"}es cl{"\u00ed"}nicas ou ajustes necess{"\u00e1"}rios. Use n{"\u00ed"}vel 4 (warning/{"\u00e2"}mbar)</span></li>
            </ul>
          </div>
          <div className="flex-1">
            <div className="t-texto-badge text-danger mb-3" style={{ textTransform: 'uppercase', letterSpacing: 1 }}>N{"\u00e3"}o use quando</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li className="flex gap-2 items-start mb-2"><i className="ph ph-x-circle" style={{ color: 'var(--danger)', flexShrink: 0, marginTop: 2 }} /><span className="t-corpo-2">Usar n{"\u00ed"}vel 3 (vermelho) para avisos gen{"\u00e9"}ricos. Avisos s{"\u00e3"}o n{"\u00ed"}vel 4 ({"\u00e2"}mbar)</span></li>
              <li className="flex gap-2 items-start mb-2"><i className="ph ph-x-circle" style={{ color: 'var(--danger)', flexShrink: 0, marginTop: 2 }} /><span className="t-corpo-2">Exibir resultado de dose sem n{"\u00ed"}vel 2. O verde {"\u00e9"} obrigat{"\u00f3"}rio para doses calculadas</span></li>
              <li className="flex gap-2 items-start mb-2"><i className="ph ph-x-circle" style={{ color: 'var(--danger)', flexShrink: 0, marginTop: 2 }} /><span className="t-corpo-2">Omitir refer{"\u00ea"}ncia bibliogr{"\u00e1"}fica (n{"\u00ed"}vel 5). Todo c{"\u00e1"}lculo precisa de fonte cient{"\u00ed"}fica</span></li>
            </ul>
          </div>
        </div>
      </div>

      {/* 5 Levels */}
      <div className="ds-subsection">
        <h3>5 N{"\u00ed"}veis Cl{"\u00ed"}nicos</h3>
        <p className="ds-subsection-desc">
          A hierarquia de 5 n{"\u00ed"}veis foi desenhada com base no protocolo de triagem m{"\u00e9"}dica:
          informa{"\u00e7\u00e3"}o contextual (preto/cinza), resultado principal (verde), alerta cr{"\u00ed"}tico (vermelho),
          observa{"\u00e7\u00e3"}o cl{"\u00ed"}nica ({"\u00e2"}mbar) e rodap{"\u00e9"}/disclaimer (cinza discreto).
        </p>
        <p className="ds-subsection-desc">
          Cada n{"\u00ed"}vel tem um papel comunicacional {"\u00fa"}nico e insubstitu{"\u00ed"}vel.
        </p>
        <DSPanel>
          <div className="flex flex-col gap-4">
            {/* Level 1: Info */}
            <div>
              <div className="t-texto-badge text-fg-3 mb-2">
                N{"\u00cd"}VEL 1 — INFO (PRETO/CINZA)
              </div>
              <AlertCard level="info" icon="info" title="Informa\u00e7\u00e3o geral">
                Este medicamento est{"\u00e1"} dispon{"\u00ed"}vel em apresenta{"\u00e7\u00f5"}es de 10mg e 20mg.
              </AlertCard>
            </div>

            {/* Level 2: Result / Dose */}
            <div>
              <div className="t-texto-badge text-fg-3 mb-2">
                N{"\u00cd"}VEL 2 — RESULTADO/DOSE (VERDE — PROTAGONISTA)
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
                N{"\u00cd"}VEL 3 — CR{"\u00cd"}TICO (VERMELHO)
              </div>
              <AlertCard level="critical" icon="warning" title="Dose m\u00e1xima excedida">
                Valor inserido ultrapassa o limite seguro de 10mg/kg. Revise antes de administrar.
              </AlertCard>
            </div>

            {/* Level 4: Warning / Observation */}
            <div>
              <div className="t-texto-badge text-fg-3 mb-2">
                N{"\u00cd"}VEL 4 — OBSERVA{"\u00c7\u00c3"}O ({"\u00c2"}MBAR)
              </div>
              <AlertCard level="warning" icon="info" title="Aten\u00e7\u00e3o">
                Considere redu{"\u00e7\u00e3"}o de 50% em pacientes idosos ou com insufici{"\u00ea"}ncia hep{"\u00e1"}tica.
              </AlertCard>
            </div>

            {/* Level 5: Footnote */}
            <div>
              <div className="t-texto-badge text-fg-3 mb-2">
                N{"\u00cd"}VEL 5 — RODAP{"\u00c9"} (CINZA)
              </div>
              <AlertCard level="footnote" icon="info" title="Fonte: Goodman & Gilman, 14a ed. Valores para adultos com fun\u00e7\u00e3o renal normal." />
            </div>
          </div>
        </DSPanel>
      </div>

      {/* Simple Alerts (from .alert class) */}
      <div className="ds-subsection">
        <h3>Alertas Simples (classe .alert)</h3>
        <p className="ds-subsection-desc">
          Vers{"\u00e3"}o simplificada dos alertas para mensagens de sistema (n{"\u00e3"}o cl{"\u00ed"}nicas): confirma{"\u00e7\u00f5"}es
          de opera{"\u00e7\u00e3"}o, erros de rede, avisos de manuten{"\u00e7\u00e3"}o.
          Usam as mesmas cores sem{"\u00e2"}nticas dos alertas cl{"\u00ed"}nicos mas com layout mais compacto e sem {"\u00ed"}cone obrigat{"\u00f3"}rio.
        </p>
        <DSPanel>
          <div className="flex flex-col gap-3">
            <div className="alert info">
              <div className="alert-title">Informa{"\u00e7\u00e3"}o</div>
              <div className="alert-body">Mensagem informativa padr{"\u00e3"}o.</div>
            </div>
            <div className="alert success">
              <div className="alert-title">Sucesso</div>
              <div className="alert-body">Opera{"\u00e7\u00e3"}o realizada com sucesso.</div>
            </div>
            <div className="alert critical">
              <div className="alert-title">Cr{"\u00ed"}tico</div>
              <div className="alert-body">Erro cr{"\u00ed"}tico detectado.</div>
            </div>
            <div className="alert warning">
              <div className="alert-title">Aviso</div>
              <div className="alert-body">Aten{"\u00e7\u00e3"}o necess{"\u00e1"}ria.</div>
            </div>
            <div className="alert footnote">
              <div className="alert-body">Nota de rodap{"\u00e9"} com informa{"\u00e7\u00f5"}es adicionais.</div>
            </div>
          </div>
        </DSPanel>
      </div>

      {/* Compact */}
      <div className="ds-subsection">
        <h3>Alerta Compacto</h3>
        <p className="ds-subsection-desc">
          Vers{"\u00e3"}o inline horizontal para feedbacks r{"\u00e1"}pidos dentro de formul{"\u00e1"}rios ou ap{"\u00f3"}s a{"\u00e7\u00f5"}es
          (ex: {"\u201c"}Salvo com sucesso{"\u201d"}, {"\u201c"}Erro ao salvar{"\u201d"}).
          Podem incluir bot{"\u00e3"}o de fechar (X). Usados como toasts ou notifica{"\u00e7\u00f5"}es ef{"\u00ea"}meras na interface.
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

      {/* Boas Pr\u00e1ticas */}
      <div className="ds-subsection">
        <h3>Boas Pr{"\u00e1"}ticas</h3>
        <p className="ds-subsection-desc">A cor errada em um alerta pode levar a uma dose perigosa. Estas regras s{"\u00e3"}o inegoci{"\u00e1"}veis.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <div className="t-texto-badge text-success mb-3" style={{ textTransform: 'uppercase', letterSpacing: 1 }}>Fa{"\u00e7"}a</div>
            {[
              'Resultado/dose (n\u00edvel 2) \u00e9 SEMPRE o protagonista visual',
              'Cr\u00edtico (n\u00edvel 3) s\u00f3 para dose m\u00e1xima ultrapassada',
              'Rodap\u00e9 (n\u00edvel 5) sempre no final, refer\u00eancia bibliogr\u00e1fica',
            ].map(d => (
              <div key={d} className="flex gap-2 items-start mb-2">
                <i className="ph ph-check-circle" style={{ color: 'var(--success)', flexShrink: 0, marginTop: 2 }} />
                <span className="t-corpo-2">{d}</span>
              </div>
            ))}
          </div>
          <div>
            <div className="t-texto-badge text-danger mb-3" style={{ textTransform: 'uppercase', letterSpacing: 1 }}>N{"\u00e3"}o fa{"\u00e7"}a</div>
            {[
              'Nunca usar verde para alertas que n\u00e3o sejam resultado',
              'Nunca diminuir fonte de dose abaixo de 20px',
              'Nunca omitir refer\u00eancia bibliogr\u00e1fica (n\u00edvel 5)',
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
          Refer{"\u00ea"}ncia de todas as classes de alerta. Os alertas cl{"\u00ed"}nicos (AlertCard) usam o prefixo
          <code>.alert-card</code> enquanto os alertas simples usam <code>.alert</code>.
        </p>
        <table className="ds-token-table">
          <thead>
            <tr><th>Classe</th><th>N{"\u00ed"}vel</th><th>Uso Cl{"\u00ed"}nico</th></tr>
          </thead>
          <tbody>
            {[
              { cls: '.alert-card.alert-info', level: '1', use: 'Contexto geral, informa\u00e7\u00f5es sobre o medicamento' },
              { cls: '.alert-card.alert-result', level: '2', use: 'Dose calculada \u2014 protagonista visual da tela' },
              { cls: '.alert-card.alert-critical', level: '3', use: 'Alertas de seguran\u00e7a, limites excedidos' },
              { cls: '.alert-card.alert-warning', level: '4', use: 'Observa\u00e7\u00f5es cl\u00ednicas, ajustes necess\u00e1rios' },
              { cls: '.alert-card.alert-footnote', level: '5', use: 'Fontes bibliogr\u00e1ficas, disclaimers, notas' },
              { cls: '.alert.compact', level: '\u2014', use: 'Vers\u00e3o inline horizontal para feedback de sistema' },
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
