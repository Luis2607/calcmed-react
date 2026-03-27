import AlertCard from '../../components/ui/AlertCard'
import DSPanel from '../DSPanel'

/* ── Subsection 1: DrugCard Mockup ── */
function DrugCardMockup() {
  return (
    <div style={{ maxWidth: 360 }}>
      <div
        className="bg-surface"
        style={{
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-xl, 16px)',
          padding: 16,
        }}
      >
        {/* Drug header */}
        <div className="flex items-center gap-3 mb-3">
          <i className="ph ph-pill" style={{ fontSize: 24, color: 'var(--dom-urg)' }} />
          <div>
            <div className="t-titulo-card" style={{ fontWeight: 700 }}>Noradrenalina</div>
            <div className="t-legenda text-fg-3">Vasopressor | IV contínuo</div>
          </div>
        </div>

        {/* Alert levels stacked */}
        <div className="flex flex-col gap-3">
          <AlertCard level="info" icon="info" title="Diluição">
            4mg em 250mL SF 0,9%
          </AlertCard>

          <AlertCard level="result" icon="check-circle" title="Dose calculada">
            <div>
              <span className="t-dose-valor" style={{ color: 'var(--success)' }}>0,15</span>
              <span className="t-dose-unidade" style={{ color: 'var(--success)', marginLeft: 8 }}>mcg/kg/min</span>
            </div>
            <div className="mt-1 t-legenda">
              Paciente 70kg | Vazão: 9,4 mL/h
            </div>
          </AlertCard>

          <AlertCard level="warning" icon="warning" title="Ajuste clínico">
            Ajustar conforme PAM alvo &ge;65mmHg
          </AlertCard>

          <AlertCard level="footnote" icon="book-open" title="Ref: ACLS 2025 | Surviving Sepsis 2021" />
        </div>
      </div>
    </div>
  )
}

/* ── Subsection 2: ResultDisplay Mockup ── */
function ResultDisplayMockup() {
  return (
    <div style={{ maxWidth: 360 }}>
      <div
        style={{
          background: 'var(--success-bg)',
          border: '1px solid var(--success-border)',
          borderRadius: 'var(--radius-xl, 16px)',
          padding: 24,
          textAlign: 'center',
        }}
      >
        <div className="mb-2">
          <span className="t-dose-valor" style={{ color: 'var(--success)', fontSize: 48, lineHeight: '56px' }}>72,5</span>
          <span className="t-dose-unidade" style={{ color: 'var(--success)', marginLeft: 8 }}>mL/min</span>
        </div>
        <div
          style={{
            display: 'inline-block',
            background: 'var(--success)',
            color: '#fff',
            padding: '4px 12px',
            borderRadius: 'var(--radius-pill, 999px)',
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          Estágio 2 — Redução leve
        </div>
        <div className="t-legenda text-fg-3 mt-3">
          Clearance de Creatinina (Cockcroft-Gault) | Paciente 68kg, 45 anos
        </div>
      </div>
    </div>
  )
}

/* ── Subsection 3: ScoreCard Mockup ── */
function ScoreCardMockup() {
  return (
    <div style={{ maxWidth: 360 }}>
      <div
        className="bg-surface"
        style={{
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-xl, 16px)',
          padding: 20,
        }}
      >
        {/* Score total */}
        <div className="text-center mb-4">
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 72,
              height: 72,
              borderRadius: '50%',
              border: '3px solid var(--btn-primary)',
              background: 'var(--bg-elevated)',
            }}
          >
            <span className="t-dose-valor" style={{ color: 'var(--btn-primary)', fontSize: 32 }}>11</span>
          </div>
          <div className="t-titulo-card mt-2" style={{ fontWeight: 700 }}>Glasgow Coma Scale</div>
          <div className="t-legenda text-fg-3">Moderado (9-12)</div>
        </div>

        {/* Abertura Ocular */}
        <div className="mb-4">
          <div className="t-rotulo-campo text-fg-2 mb-2" style={{ fontWeight: 600 }}>
            Abertura Ocular
            <span className="t-dose-unidade" style={{ marginLeft: 8, color: 'var(--btn-primary)' }}>3</span>
          </div>
          <div className="radio-group">
            <div className="radio-row">
              <div className="radio off" />
              <span className="radio-label">4 — Espontânea</span>
            </div>
            <div className="radio-row">
              <div className="radio on" />
              <span className="radio-label">3 — Ao estímulo verbal</span>
            </div>
            <div className="radio-row">
              <div className="radio off" />
              <span className="radio-label">2 — À dor</span>
            </div>
            <div className="radio-row">
              <div className="radio off" />
              <span className="radio-label">1 — Ausente</span>
            </div>
          </div>
        </div>

        {/* Resposta Verbal */}
        <div className="mb-4">
          <div className="t-rotulo-campo text-fg-2 mb-2" style={{ fontWeight: 600 }}>
            Resposta Verbal
            <span className="t-dose-unidade" style={{ marginLeft: 8, color: 'var(--btn-primary)' }}>3</span>
          </div>
          <div className="radio-group">
            <div className="radio-row">
              <div className="radio off" />
              <span className="radio-label">5 — Orientada</span>
            </div>
            <div className="radio-row">
              <div className="radio off" />
              <span className="radio-label">4 — Confusa</span>
            </div>
            <div className="radio-row">
              <div className="radio on" />
              <span className="radio-label">3 — Palavras inapropriadas</span>
            </div>
            <div className="radio-row">
              <div className="radio off" />
              <span className="radio-label">2 — Sons incompreensíveis</span>
            </div>
            <div className="radio-row">
              <div className="radio off" />
              <span className="radio-label">1 — Ausente</span>
            </div>
          </div>
        </div>

        {/* Resposta Motora */}
        <div>
          <div className="t-rotulo-campo text-fg-2 mb-2" style={{ fontWeight: 600 }}>
            Resposta Motora
            <span className="t-dose-unidade" style={{ marginLeft: 8, color: 'var(--btn-primary)' }}>5</span>
          </div>
          <div className="radio-group">
            <div className="radio-row">
              <div className="radio off" />
              <span className="radio-label">6 — Obedece comandos</span>
            </div>
            <div className="radio-row">
              <div className="radio on" />
              <span className="radio-label">5 — Localiza dor</span>
            </div>
            <div className="radio-row">
              <div className="radio off" />
              <span className="radio-label">4 — Retirada inespecífica</span>
            </div>
            <div className="radio-row">
              <div className="radio off" />
              <span className="radio-label">3 — Flexão anormal</span>
            </div>
            <div className="radio-row">
              <div className="radio off" />
              <span className="radio-label">2 — Extensão</span>
            </div>
            <div className="radio-row">
              <div className="radio off" />
              <span className="radio-label">1 — Ausente</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Subsection 4: ProtocolStepper Mockup ── */
function ProtocolStepperMockup() {
  const steps = [
    {
      number: 1,
      title: 'Hidratação Inicial',
      status: 'done' as const,
      content: null,
    },
    {
      number: 2,
      title: 'Insulinoterapia',
      status: 'active' as const,
      content: (
        <div className="flex flex-col gap-2">
          <AlertCard level="result" icon="check-circle" title="Dose calculada">
            <div>
              <span className="t-dose-valor" style={{ color: 'var(--success)', fontSize: 24 }}>7</span>
              <span className="t-dose-unidade" style={{ color: 'var(--success)', marginLeft: 4 }}>UI/h</span>
            </div>
            <div className="t-legenda mt-1">Insulina Regular IV contínua | 0,1 UI/kg/h</div>
          </AlertCard>
          <AlertCard level="warning" icon="warning" title="Monitorar">
            Glicemia capilar a cada 1h. Reduzir infusão se glicemia &lt;250mg/dL.
          </AlertCard>
        </div>
      ),
    },
    {
      number: 3,
      title: 'Reposição de Potássio',
      status: 'pending' as const,
      content: null,
    },
    {
      number: 4,
      title: 'Correção de Bicarbonato',
      status: 'pending' as const,
      content: null,
    },
  ]

  return (
    <div style={{ maxWidth: 400 }}>
      <div
        className="bg-surface"
        style={{
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-xl, 16px)',
          padding: 20,
        }}
      >
        <div className="t-titulo-card mb-4" style={{ fontWeight: 700 }}>
          Protocolo: Cetoacidose Diabética
        </div>

        <div style={{ position: 'relative', paddingLeft: 32 }}>
          {/* Vertical line */}
          <div
            style={{
              position: 'absolute',
              left: 11,
              top: 12,
              bottom: 12,
              width: 2,
              background: 'var(--border)',
            }}
          />

          {steps.map((step, i) => (
            <div key={step.number} style={{ position: 'relative', marginBottom: i < steps.length - 1 ? 20 : 0 }}>
              {/* Step indicator */}
              <div
                style={{
                  position: 'absolute',
                  left: -32,
                  top: 0,
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12,
                  fontWeight: 700,
                  zIndex: 1,
                  ...(step.status === 'done'
                    ? { background: 'var(--success)', color: '#fff' }
                    : step.status === 'active'
                      ? { background: 'var(--btn-primary)', color: '#fff' }
                      : { background: 'var(--bg-elevated)', color: 'var(--fg-3)', border: '1px solid var(--border)' }),
                }}
              >
                {step.status === 'done' ? (
                  <i className="ph ph-check" style={{ fontSize: 14 }} />
                ) : (
                  step.number
                )}
              </div>

              {/* Step content */}
              <div>
                <div
                  className="t-corpo-1"
                  style={{
                    fontWeight: step.status === 'active' ? 700 : step.status === 'done' ? 500 : 400,
                    color: step.status === 'pending' ? 'var(--fg-3)' : 'var(--fg)',
                    lineHeight: '24px',
                  }}
                >
                  {step.title}
                  {step.status === 'done' && (
                    <span className="t-legenda text-success" style={{ marginLeft: 8 }}>Concluído</span>
                  )}
                </div>
                {step.content && <div className="mt-3">{step.content}</div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── Subsection 5: LabValueInput Mockup ── */
function LabValueInputMockup() {
  const value = 1.8
  const min = 0.7
  const max = 1.3
  const rangeMin = 0
  const rangeMax = 3.0
  const normalStart = ((min - rangeMin) / (rangeMax - rangeMin)) * 100
  const normalEnd = ((max - rangeMin) / (rangeMax - rangeMin)) * 100
  const valuePos = Math.min(100, Math.max(0, ((value - rangeMin) / (rangeMax - rangeMin)) * 100))

  return (
    <div style={{ maxWidth: 360 }}>
      <div
        className="bg-surface"
        style={{
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-xl, 16px)',
          padding: 20,
        }}
      >
        <div className="t-rotulo-campo text-fg-2 mb-2" style={{ fontWeight: 600 }}>
          Creatinina Sérica
        </div>

        {/* Input with unit */}
        <div className="input-with-unit mb-3" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input
            type="text"
            className="input-field error"
            value="1.8"
            readOnly
            style={{ flex: 1, textAlign: 'center', fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, fontSize: 18 }}
          />
          <span className="t-dose-unidade text-fg-2">mg/dL</span>
        </div>

        {/* Range visualization */}
        <div className="mb-2">
          <div
            style={{
              position: 'relative',
              height: 8,
              borderRadius: 4,
              background: 'var(--bg-elevated)',
              overflow: 'visible',
            }}
          >
            {/* Normal range bar */}
            <div
              style={{
                position: 'absolute',
                left: `${normalStart}%`,
                width: `${normalEnd - normalStart}%`,
                height: '100%',
                borderRadius: 4,
                background: 'var(--success)',
                opacity: 0.4,
              }}
            />
            {/* Current value indicator */}
            <div
              style={{
                position: 'absolute',
                left: `${valuePos}%`,
                top: -4,
                width: 16,
                height: 16,
                borderRadius: '50%',
                background: 'var(--danger)',
                border: '2px solid var(--bg-surface)',
                transform: 'translateX(-50%)',
              }}
            />
          </div>
          <div className="flex" style={{ justifyContent: 'space-between', marginTop: 4 }}>
            <span className="t-legenda text-fg-3">{rangeMin}</span>
            <span className="t-legenda text-success" style={{ fontWeight: 600 }}>{min}–{max} (normal)</span>
            <span className="t-legenda text-fg-3">{rangeMax}</span>
          </div>
        </div>

        {/* Status alert */}
        <AlertCard level="critical" icon="warning" title="Acima da faixa normal">
          Valor 1.8 mg/dL está acima do limite superior (1.3 mg/dL). Considere investigação adicional.
        </AlertCard>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════ */
/*  MAIN SECTION                                                 */
/* ══════════════════════════════════════════════════════════════ */

export default function DSClinico() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <h2 className="ds-section-title" style={{ marginBottom: 0 }}>Componentes Clínicos</h2>
        <span
          style={{
            display: 'inline-block',
            fontSize: 9,
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
            padding: '2px 8px',
            borderRadius: 4,
            color: 'var(--btn-primary)',
            border: '1px solid var(--btn-primary)',
          }}
        >
          Planejado
        </span>
      </div>
      <p className="ds-section-desc">
        Componentes especializados para funcionalidades clínicas do CalcMed. Estes componentes são
        projetados para cenários de alta pressão — doses calculadas durante intubação, escores avaliados
        em trauma, protocolos seguidos em cetoacidose. Cada decisão visual prioriza legibilidade e
        segurança.
      </p>
      <p className="ds-section-desc">
        Todos os componentes abaixo estão em fase de planejamento, com mockups representando a
        estrutura visual pretendida. Eles serão implementados para as telas de Intubação, DVA,
        Escores/Glasgow e Cetoacidose Diabética.
      </p>

      {/* ── 1. DrugCard ── */}
      <div className="ds-subsection">
        <div className="flex items-center gap-3">
          <h3>Card de Droga (DrugCard)</h3>
          <span
            style={{
              display: 'inline-block',
              fontSize: 9,
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: 0.5,
              padding: '1px 6px',
              borderRadius: 4,
              color: 'var(--btn-primary)',
              border: '1px solid var(--btn-primary)',
            }}
          >
            Planejado
          </span>
        </div>
        <p className="ds-subsection-desc">
          Card expandível para drogas individuais. Mostra nome, dose calculada por peso, via de
          administração e os 5 níveis de alerta. Usado em Intubação (8 drogas) e DVA (10 drogas).
        </p>

        {/* Quando usar */}
        <div className="flex gap-8 mb-4">
          <div className="flex-1">
            <div className="t-texto-badge text-success mb-3" style={{ textTransform: 'uppercase', letterSpacing: 1 }}>Use quando</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li className="flex gap-2 items-start mb-2"><i className="ph ph-check-circle" style={{ color: 'var(--success)', flexShrink: 0, marginTop: 2 }} /><span className="t-corpo-2">Exibir droga com dose calculada por peso do paciente</span></li>
              <li className="flex gap-2 items-start mb-2"><i className="ph ph-check-circle" style={{ color: 'var(--success)', flexShrink: 0, marginTop: 2 }} /><span className="t-corpo-2">A droga tem diluição, dose e observações clínicas simultâneas</span></li>
              <li className="flex gap-2 items-start mb-2"><i className="ph ph-check-circle" style={{ color: 'var(--success)', flexShrink: 0, marginTop: 2 }} /><span className="t-corpo-2">Sequência Rápida de Intubação com múltiplas drogas em cascata</span></li>
            </ul>
          </div>
          <div className="flex-1">
            <div className="t-texto-badge text-danger mb-3" style={{ textTransform: 'uppercase', letterSpacing: 1 }}>Não use quando</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li className="flex gap-2 items-start mb-2"><i className="ph ph-x-circle" style={{ color: 'var(--danger)', flexShrink: 0, marginTop: 2 }} /><span className="t-corpo-2">O resultado é um valor único sem contexto de droga (use ResultDisplay)</span></li>
              <li className="flex gap-2 items-start mb-2"><i className="ph ph-x-circle" style={{ color: 'var(--danger)', flexShrink: 0, marginTop: 2 }} /><span className="t-corpo-2">A informação não envolve dose — use AlertCard diretamente</span></li>
            </ul>
          </div>
        </div>

        <DSPanel title="Mockup: Noradrenalina (DVA)">
          <DrugCardMockup />
        </DSPanel>
      </div>

      {/* ── 2. ResultDisplay ── */}
      <div className="ds-subsection">
        <div className="flex items-center gap-3">
          <h3>Display de Resultado (ResultDisplay)</h3>
          <span
            style={{
              display: 'inline-block',
              fontSize: 9,
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: 0.5,
              padding: '1px 6px',
              borderRadius: 4,
              color: 'var(--btn-primary)',
              border: '1px solid var(--btn-primary)',
            }}
          >
            Planejado
          </span>
        </div>
        <p className="ds-subsection-desc">
          O protagonista visual de qualquer cálculo. Número grande em JetBrains Mono Bold,
          unidade ao lado, badge de classificação abaixo. Legível a 1 metro de distância — o
          médico pode estar com as mãos ocupadas no paciente.
        </p>

        {/* Quando usar */}
        <div className="flex gap-8 mb-4">
          <div className="flex-1">
            <div className="t-texto-badge text-success mb-3" style={{ textTransform: 'uppercase', letterSpacing: 1 }}>Use quando</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li className="flex gap-2 items-start mb-2"><i className="ph ph-check-circle" style={{ color: 'var(--success)', flexShrink: 0, marginTop: 2 }} /><span className="t-corpo-2">O resultado de um cálculo é o foco principal da tela</span></li>
              <li className="flex gap-2 items-start mb-2"><i className="ph ph-check-circle" style={{ color: 'var(--success)', flexShrink: 0, marginTop: 2 }} /><span className="t-corpo-2">O valor precisa de classificação (estágio, gravidade, faixa)</span></li>
              <li className="flex gap-2 items-start mb-2"><i className="ph ph-check-circle" style={{ color: 'var(--success)', flexShrink: 0, marginTop: 2 }} /><span className="t-corpo-2">Clearance de creatinina, taxa de filtração, escore total</span></li>
            </ul>
          </div>
          <div className="flex-1">
            <div className="t-texto-badge text-danger mb-3" style={{ textTransform: 'uppercase', letterSpacing: 1 }}>Não use quando</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li className="flex gap-2 items-start mb-2"><i className="ph ph-x-circle" style={{ color: 'var(--danger)', flexShrink: 0, marginTop: 2 }} /><span className="t-corpo-2">O resultado é uma dose de droga com diluição (use DrugCard)</span></li>
              <li className="flex gap-2 items-start mb-2"><i className="ph ph-x-circle" style={{ color: 'var(--danger)', flexShrink: 0, marginTop: 2 }} /><span className="t-corpo-2">Exibir o valor em fonte menor que 20px — viola regra do projeto</span></li>
            </ul>
          </div>
        </div>

        <DSPanel title="Mockup: Clearance de Creatinina">
          <ResultDisplayMockup />
        </DSPanel>
      </div>

      {/* ── 3. ScoreCard ── */}
      <div className="ds-subsection">
        <div className="flex items-center gap-3">
          <h3>Card de Escore (ScoreCard)</h3>
          <span
            style={{
              display: 'inline-block',
              fontSize: 9,
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: 0.5,
              padding: '1px 6px',
              borderRadius: 4,
              color: 'var(--btn-primary)',
              border: '1px solid var(--btn-primary)',
            }}
          >
            Planejado
          </span>
        </div>
        <p className="ds-subsection-desc">
          Instrumento de pontuação clínica com critérios selecionáveis. Cada critério é um grupo
          de radio buttons com valores numéricos. O total atualiza em tempo real. Usado em Glasgow
          (3 critérios), NIHSS (11 critérios), RASS e outros.
        </p>

        {/* Quando usar */}
        <div className="flex gap-8 mb-4">
          <div className="flex-1">
            <div className="t-texto-badge text-success mb-3" style={{ textTransform: 'uppercase', letterSpacing: 1 }}>Use quando</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li className="flex gap-2 items-start mb-2"><i className="ph ph-check-circle" style={{ color: 'var(--success)', flexShrink: 0, marginTop: 2 }} /><span className="t-corpo-2">O escore tem critérios com valores discretos (Glasgow, NIHSS, SOFA)</span></li>
              <li className="flex gap-2 items-start mb-2"><i className="ph ph-check-circle" style={{ color: 'var(--success)', flexShrink: 0, marginTop: 2 }} /><span className="t-corpo-2">Cada critério permite apenas uma seleção (radio, não checkbox)</span></li>
              <li className="flex gap-2 items-start mb-2"><i className="ph ph-check-circle" style={{ color: 'var(--success)', flexShrink: 0, marginTop: 2 }} /><span className="t-corpo-2">O total precisa ser visível durante toda a avaliação</span></li>
            </ul>
          </div>
          <div className="flex-1">
            <div className="t-texto-badge text-danger mb-3" style={{ textTransform: 'uppercase', letterSpacing: 1 }}>Não use quando</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li className="flex gap-2 items-start mb-2"><i className="ph ph-x-circle" style={{ color: 'var(--danger)', flexShrink: 0, marginTop: 2 }} /><span className="t-corpo-2">O cálculo envolve inputs numéricos livres (use campos de entrada padrão)</span></li>
              <li className="flex gap-2 items-start mb-2"><i className="ph ph-x-circle" style={{ color: 'var(--danger)', flexShrink: 0, marginTop: 2 }} /><span className="t-corpo-2">O escore tem apenas 1 critério — use stepper ou input direto</span></li>
            </ul>
          </div>
        </div>

        <DSPanel title="Mockup: Glasgow Coma Scale (E3V3M5 = 11)">
          <ScoreCardMockup />
        </DSPanel>
      </div>

      {/* ── 4. ProtocolStepper ── */}
      <div className="ds-subsection">
        <div className="flex items-center gap-3">
          <h3>Stepper de Protocolo (ProtocolStepper)</h3>
          <span
            style={{
              display: 'inline-block',
              fontSize: 9,
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: 0.5,
              padding: '1px 6px',
              borderRadius: 4,
              color: 'var(--btn-primary)',
              border: '1px solid var(--btn-primary)',
            }}
          >
            Planejado
          </span>
        </div>
        <p className="ds-subsection-desc">
          Navegador vertical de etapas para protocolos complexos com múltiplos passos. Cada etapa
          tem número, título, conteúdo expandível e indicador de conclusão. Usado em Cetoacidose
          Diabética (9 etapas) e futuros protocolos.
        </p>

        {/* Quando usar */}
        <div className="flex gap-8 mb-4">
          <div className="flex-1">
            <div className="t-texto-badge text-success mb-3" style={{ textTransform: 'uppercase', letterSpacing: 1 }}>Use quando</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li className="flex gap-2 items-start mb-2"><i className="ph ph-check-circle" style={{ color: 'var(--success)', flexShrink: 0, marginTop: 2 }} /><span className="t-corpo-2">Protocolo com 3+ etapas sequenciais e dependentes</span></li>
              <li className="flex gap-2 items-start mb-2"><i className="ph ph-check-circle" style={{ color: 'var(--success)', flexShrink: 0, marginTop: 2 }} /><span className="t-corpo-2">Cada etapa pode conter cálculos, alertas ou instruções próprias</span></li>
              <li className="flex gap-2 items-start mb-2"><i className="ph ph-check-circle" style={{ color: 'var(--success)', flexShrink: 0, marginTop: 2 }} /><span className="t-corpo-2">O médico precisa saber onde está no protocolo e o que falta</span></li>
            </ul>
          </div>
          <div className="flex-1">
            <div className="t-texto-badge text-danger mb-3" style={{ textTransform: 'uppercase', letterSpacing: 1 }}>Não use quando</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li className="flex gap-2 items-start mb-2"><i className="ph ph-x-circle" style={{ color: 'var(--danger)', flexShrink: 0, marginTop: 2 }} /><span className="t-corpo-2">As etapas são independentes e não sequenciais (use tabs)</span></li>
              <li className="flex gap-2 items-start mb-2"><i className="ph ph-x-circle" style={{ color: 'var(--danger)', flexShrink: 0, marginTop: 2 }} /><span className="t-corpo-2">São apenas 2 passos — use layout simples com divisor</span></li>
            </ul>
          </div>
        </div>

        <DSPanel title="Mockup: Cetoacidose Diabética (4 de 9 etapas)">
          <ProtocolStepperMockup />
        </DSPanel>
      </div>

      {/* ── 5. LabValueInput ── */}
      <div className="ds-subsection">
        <div className="flex items-center gap-3">
          <h3>Input de Valor Laboratorial (LabValueInput)</h3>
          <span
            style={{
              display: 'inline-block',
              fontSize: 9,
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: 0.5,
              padding: '1px 6px',
              borderRadius: 4,
              color: 'var(--btn-primary)',
              border: '1px solid var(--btn-primary)',
            }}
          >
            Planejado
          </span>
        </div>
        <p className="ds-subsection-desc">
          Input especializado para valores de laboratório com faixa de referência visual. Mostra
          min/max da faixa clínica, destaca visualmente quando o valor está fora da normalidade.
          Usado em calculadoras e protocolos.
        </p>

        {/* Quando usar */}
        <div className="flex gap-8 mb-4">
          <div className="flex-1">
            <div className="t-texto-badge text-success mb-3" style={{ textTransform: 'uppercase', letterSpacing: 1 }}>Use quando</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li className="flex gap-2 items-start mb-2"><i className="ph ph-check-circle" style={{ color: 'var(--success)', flexShrink: 0, marginTop: 2 }} /><span className="t-corpo-2">O valor tem faixa de referência clínica conhecida</span></li>
              <li className="flex gap-2 items-start mb-2"><i className="ph ph-check-circle" style={{ color: 'var(--success)', flexShrink: 0, marginTop: 2 }} /><span className="t-corpo-2">Valores fora da faixa impactam o resultado do cálculo</span></li>
              <li className="flex gap-2 items-start mb-2"><i className="ph ph-check-circle" style={{ color: 'var(--success)', flexShrink: 0, marginTop: 2 }} /><span className="t-corpo-2">Creatinina, sódio, potássio, glicemia, pH — qualquer exame laboratorial</span></li>
            </ul>
          </div>
          <div className="flex-1">
            <div className="t-texto-badge text-danger mb-3" style={{ textTransform: 'uppercase', letterSpacing: 1 }}>Não use quando</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li className="flex gap-2 items-start mb-2"><i className="ph ph-x-circle" style={{ color: 'var(--danger)', flexShrink: 0, marginTop: 2 }} /><span className="t-corpo-2">O valor não tem faixa de referência (ex: peso, altura — use input padrão)</span></li>
              <li className="flex gap-2 items-start mb-2"><i className="ph ph-x-circle" style={{ color: 'var(--danger)', flexShrink: 0, marginTop: 2 }} /><span className="t-corpo-2">A faixa é muito ampla e a barra visual não seria informativa</span></li>
            </ul>
          </div>
        </div>

        <DSPanel title="Mockup: Creatinina Sérica (acima da faixa)">
          <LabValueInputMockup />
        </DSPanel>
      </div>

      {/* ── Boas Práticas ── */}
      <div className="ds-subsection">
        <h3>Boas Práticas</h3>
        <p className="ds-subsection-desc">
          Diretrizes para uso correto dos componentes clínicos em cenários de alta pressão.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <div className="t-texto-badge text-success mb-3" style={{ textTransform: 'uppercase', letterSpacing: 1 }}>Faça</div>
            {[
              'Doses sempre em JetBrains Mono Bold, mínimo 20px — legível a 1 metro',
              'Resultado como protagonista visual: maior, mais contrastado, centralizado',
              'Usar os 5 níveis de alerta consistentemente em todo DrugCard',
              'Manter referência bibliográfica (nível 5) em todo cálculo',
              'Touch targets de 52dp para ações de emergência (intubação, DVA)',
              'Validação de faixa clínica em todo LabValueInput — valores absurdos devem ser bloqueados',
              'ProtocolStepper deve indicar claramente a etapa atual e o progresso total',
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
              'Nunca exibir dose em fonte menor que 20px — regra inviolável do projeto',
              'Nunca usar nível 3 (vermelho/crítico) para avisos genéricos — reservado para dose máxima excedida',
              'Nunca omitir unidade junto ao valor numérico — "150" sozinho é ambíguo e perigoso',
              'Nunca usar spinners em cálculos clínicos — usar skeleton screens',
              'Nunca misturar ScoreCard com inputs de texto livre no mesmo instrumento',
              'Nunca esconder etapas concluídas no ProtocolStepper — o médico precisa de contexto completo',
            ].map(d => (
              <div key={d} className="flex gap-2 items-start mb-2">
                <i className="ph ph-x-circle" style={{ color: 'var(--danger)', flexShrink: 0, marginTop: 2 }} />
                <span className="t-corpo-2">{d}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CSS Reference Table ── */}
      <div className="ds-subsection">
        <h3>Referência de Classes CSS</h3>
        <p className="ds-subsection-desc">
          Classes do Design System utilizadas nos componentes clínicos. Todas já existem no sistema — os componentes planejados as compõem sem criar CSS adicional.
        </p>
        <table className="ds-token-table">
          <thead>
            <tr><th>Classe</th><th>Contexto</th><th>Descrição</th></tr>
          </thead>
          <tbody>
            {[
              { cls: '.t-dose-valor', ctx: 'DrugCard, ResultDisplay', desc: 'Valor numérico principal: JetBrains Mono 700, 36px/40px' },
              { cls: '.t-dose-unidade', ctx: 'DrugCard, ResultDisplay, LabValueInput', desc: 'Unidade ao lado do valor: JetBrains Mono 500, 20px/28px' },
              { cls: '.alert-card.alert-info', ctx: 'DrugCard', desc: 'Nível 1: informação/diluição (fundo slate-50, borda border)' },
              { cls: '.alert-card.alert-result', ctx: 'DrugCard, ProtocolStepper', desc: 'Nível 2: dose calculada (fundo success-bg, borda success)' },
              { cls: '.alert-card.alert-critical', ctx: 'LabValueInput', desc: 'Nível 3: valor fora da faixa (fundo danger-bg, borda danger)' },
              { cls: '.alert-card.alert-warning', ctx: 'DrugCard, ProtocolStepper', desc: 'Nível 4: observação clínica (fundo warning-bg, borda warning)' },
              { cls: '.alert-card.alert-footnote', ctx: 'DrugCard', desc: 'Nível 5: referência bibliográfica (sem fundo, texto fg-3)' },
              { cls: '.radio-group', ctx: 'ScoreCard', desc: 'Container vertical para critérios do escore' },
              { cls: '.radio-row', ctx: 'ScoreCard', desc: 'Linha: radio circle + label com valor numérico' },
              { cls: '.radio.on / .radio.off', ctx: 'ScoreCard', desc: 'Estado selecionado/não selecionado do critério' },
              { cls: '.input-field', ctx: 'LabValueInput', desc: 'Campo de entrada base: 48px altura, radius-lg, borda border' },
              { cls: '.input-field.error', ctx: 'LabValueInput', desc: 'Estado erro: borda 2px danger (valor fora da faixa)' },
              { cls: '.input-with-unit', ctx: 'LabValueInput', desc: 'Container input + unidade: posicionamento relativo' },
            ].map(r => (
              <tr key={r.cls}>
                <td><span className="ds-token">{r.cls}</span></td>
                <td className="t-legenda">{r.ctx}</td>
                <td className="text-fg-2">{r.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
