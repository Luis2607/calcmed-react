const typeStyles = [
  { cls: 't-titulo-pagina', label: 'Titulo Pagina', spec: "700 24px/32px 'Inter', ls: -0.48px", sample: 'Calculadora de Dose' },
  { cls: 't-titulo-secao', label: 'Titulo Secao', spec: "700 20px/28px 'Inter', ls: -0.2px", sample: 'Sequencia Rapida de Intubacao' },
  { cls: 't-subtitulo', label: 'Subtitulo', spec: "600 18px/28px 'Inter'", sample: 'Drogas de Manutencao' },
  { cls: 't-nome-droga', label: 'Nome Droga', spec: "600 18px/28px 'Inter'", sample: 'Midazolam' },
  { cls: 't-alerta-titulo', label: 'Alerta Titulo', spec: "700 16px/24px 'Inter'", sample: 'Atencao: dose maxima excedida' },
  { cls: 't-alerta-corpo', label: 'Alerta Corpo', spec: "400 14px/20px 'Inter', ls: 0.14px", sample: 'Considere reducao de 50% em pacientes idosos ou com insuficiencia hepatica.' },
  { cls: 't-corpo', label: 'Corpo', spec: "400 16px/24px 'Inter'", sample: 'Este calculo utiliza a formula de Cockcroft-Gault para estimar o clearance de creatinina.' },
  { cls: 't-corpo-2', label: 'Corpo 2', spec: "400 14px/20px 'Inter', ls: 0.14px", sample: 'Valores de referencia podem variar conforme o laboratorio.' },
  { cls: 't-rotulo-campo', label: 'Rotulo Campo', spec: "500 14px/20px 'Inter', ls: 0.14px", sample: 'Peso do paciente' },
  { cls: 't-valor-campo', label: 'Valor Campo', spec: "400 16px/24px 'Inter'", sample: '72.5' },
  { cls: 't-valor-mono', label: 'Valor Mono', spec: "400 16px/24px 'JetBrains Mono'", sample: '1.234,56' },
  { cls: 't-rotulo-nav', label: 'Rotulo Nav', spec: "500 12px/16px 'Inter', ls: 0.24px", sample: 'Inicio' },
  { cls: 't-texto-badge', label: 'Texto Badge', spec: "600 11px/16px 'Inter', ls: 0.22px", sample: 'PREMIUM' },
  { cls: 't-legenda', label: 'Legenda', spec: "400 12px/16px 'Inter', ls: 0.24px", sample: 'Ultima atualizacao: 15 min atras' },
  { cls: 't-marca', label: 'Marca', spec: "700 28px/32px 'Outfit'", sample: 'Calc.Med' },
  { cls: 't-dose-valor', label: 'Dose Valor', spec: "700 36px/40px 'JetBrains Mono'", sample: '150' },
  { cls: 't-dose-unidade', label: 'Dose Unidade', spec: "500 20px/28px 'JetBrains Mono'", sample: 'mg/kg' },
  { cls: 't-preco-destaque', label: 'Preco Destaque', spec: "700 24px/32px 'Inter'", sample: 'R$ 29,90' },
  { cls: 't-valor-grande', label: 'Valor Grande', spec: "700 32px/40px 'JetBrains Mono'", sample: '98.7' },
]

export default function DSTipografia() {
  return (
    <div>
      <h2 className="ds-section-title">Tipografia</h2>
      <p className="ds-section-desc">
        Escala com ratio ~1.25 (Major Third). 3 familias: Inter (UI), JetBrains Mono (doses/valores),
        Outfit (marca). Doses NUNCA em fonte menor que 20px.
      </p>

      <div className="ds-subsection">
        <h3>Familias</h3>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginBottom: 32 }}>
          <div style={{ padding: 20, borderRadius: 12, border: '1px solid var(--border)', background: 'var(--bg-surface)', flex: '1 1 200px' }}>
            <div style={{ font: "600 16px 'Inter'", color: 'var(--fg)', marginBottom: 4 }}>Inter</div>
            <div style={{ font: "400 13px 'Inter'", color: 'var(--fg-3)' }}>Interface, textos, rotulos</div>
          </div>
          <div style={{ padding: 20, borderRadius: 12, border: '1px solid var(--border)', background: 'var(--bg-surface)', flex: '1 1 200px' }}>
            <div style={{ font: "600 16px 'JetBrains Mono'", color: 'var(--fg)', marginBottom: 4 }}>JetBrains Mono</div>
            <div style={{ font: "400 13px 'Inter'", color: 'var(--fg-3)' }}>Doses, valores, codigos</div>
          </div>
          <div style={{ padding: 20, borderRadius: 12, border: '1px solid var(--border)', background: 'var(--bg-surface)', flex: '1 1 200px' }}>
            <div style={{ font: "600 16px 'Outfit'", color: 'var(--fg)', marginBottom: 4 }}>Outfit</div>
            <div style={{ font: "400 13px 'Inter'", color: 'var(--fg-3)' }}>Marca, logotipo</div>
          </div>
        </div>
      </div>

      <div className="ds-subsection">
        <h3>Estilos de Texto</h3>
        {typeStyles.map(t => (
          <div className="ds-type-row" key={t.cls}>
            <div className="ds-type-meta">
              <span className="ds-type-class">.{t.cls}</span>
              <span className="ds-type-spec">{t.spec}</span>
            </div>
            <div className={t.cls} style={{ color: 'var(--fg)' }}>
              {t.sample}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
