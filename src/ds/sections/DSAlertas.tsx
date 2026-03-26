import AlertCard from '../../components/ui/AlertCard'
import DSPanel from '../DSPanel'

export default function DSAlertas() {
  return (
    <div>
      <h2 className="ds-section-title">Alertas</h2>
      <p className="ds-section-desc">
        5 niveis hierarquicos clinicos. Nivel 1 (info) para contexto geral. Nivel 2 (resultado/dose) e o PROTAGONISTA
        visual — borda 2px verde. Nivel 3 (critico) para alertas de seguranca. Nivel 4 (observacao) para notas ambar.
        Nivel 5 (rodape) para disclaimers discretos.
      </p>

      {/* 5 Levels */}
      <div className="ds-subsection">
        <h3>5 Niveis Clinicos</h3>
        <DSPanel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Level 1: Info */}
            <div>
              <div style={{ font: "600 11px 'Inter'", color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>
                Nivel 1 — Info (Preto/Cinza)
              </div>
              <AlertCard level="info" icon="info" title="Informacao geral">
                Este medicamento esta disponivel em apresentacoes de 10mg e 20mg.
              </AlertCard>
            </div>

            {/* Level 2: Result / Dose */}
            <div>
              <div style={{ font: "600 11px 'Inter'", color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>
                Nivel 2 — Resultado/Dose (Verde — PROTAGONISTA)
              </div>
              <AlertCard level="result" icon="check-circle" title="Dose calculada">
                <div>
                  <span className="t-dose-valor" style={{ color: 'var(--success)' }}>150</span>
                  <span className="t-dose-unidade" style={{ color: 'var(--success)', marginLeft: 8 }}>mg</span>
                </div>
                <div style={{ marginTop: 4, font: "400 13px 'Inter'" }}>
                  Midazolam 0.3 mg/kg para paciente de 50kg
                </div>
              </AlertCard>
            </div>

            {/* Level 3: Critical */}
            <div>
              <div style={{ font: "600 11px 'Inter'", color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>
                Nivel 3 — Critico (Vermelho)
              </div>
              <AlertCard level="critical" icon="warning" title="Dose maxima excedida">
                Valor inserido ultrapassa o limite seguro de 10mg/kg. Revise antes de administrar.
              </AlertCard>
            </div>

            {/* Level 4: Warning / Observation */}
            <div>
              <div style={{ font: "600 11px 'Inter'", color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>
                Nivel 4 — Observacao (Ambar)
              </div>
              <AlertCard level="warning" icon="info" title="Atencao">
                Considere reducao de 50% em pacientes idosos ou com insuficiencia hepatica.
              </AlertCard>
            </div>

            {/* Level 5: Footnote */}
            <div>
              <div style={{ font: "600 11px 'Inter'", color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>
                Nivel 5 — Rodape (Cinza)
              </div>
              <AlertCard level="footnote" icon="info" title="Fonte: Goodman & Gilman, 14a ed. Valores para adultos com funcao renal normal." />
            </div>
          </div>
        </DSPanel>
      </div>

      {/* Simple Alerts (from .alert class) */}
      <div className="ds-subsection">
        <h3>Alertas Simples (classe .alert)</h3>
        <DSPanel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div className="alert info">
              <div className="alert-title">Informacao</div>
              <div className="alert-body">Mensagem informativa padrao.</div>
            </div>
            <div className="alert success">
              <div className="alert-title">Sucesso</div>
              <div className="alert-body">Operacao realizada com sucesso.</div>
            </div>
            <div className="alert critical">
              <div className="alert-title">Critico</div>
              <div className="alert-body">Erro critico detectado.</div>
            </div>
            <div className="alert warning">
              <div className="alert-title">Aviso</div>
              <div className="alert-body">Atencao necessaria.</div>
            </div>
            <div className="alert footnote">
              <div className="alert-body">Nota de rodape com informacoes adicionais.</div>
            </div>
          </div>
        </DSPanel>
      </div>

      {/* Compact */}
      <div className="ds-subsection">
        <h3>Alerta Compacto</h3>
        <DSPanel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
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

      {/* Classes */}
      <div className="ds-subsection">
        <h3>Classes CSS</h3>
        <table className="ds-token-table">
          <thead>
            <tr><th>Classe</th><th>Nivel</th><th>Uso Clinico</th></tr>
          </thead>
          <tbody>
            {[
              { cls: '.alert-card.alert-info', level: '1', use: 'Contexto geral, informacoes' },
              { cls: '.alert-card.alert-result', level: '2', use: 'Dose calculada — protagonista visual' },
              { cls: '.alert-card.alert-critical', level: '3', use: 'Alertas de seguranca, limites excedidos' },
              { cls: '.alert-card.alert-warning', level: '4', use: 'Observacoes, ajustes necessarios' },
              { cls: '.alert-card.alert-footnote', level: '5', use: 'Fontes, disclaimers, notas' },
              { cls: '.alert.compact', level: '-', use: 'Versao inline horizontal' },
            ].map(r => (
              <tr key={r.cls}>
                <td><span className="ds-token">{r.cls}</span></td>
                <td style={{ font: "600 13px 'JetBrains Mono'", color: 'var(--fg-2)' }}>{r.level}</td>
                <td style={{ color: 'var(--fg-2)' }}>{r.use}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
