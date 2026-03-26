import DSPanel from '../DSPanel'

const typeStyles = [
  { cls: 't-titulo-pagina', label: 'Título Página', spec: "700 24px/32px 'Inter', ls: -0.48px", sample: 'Calculadora de Dose' },
  { cls: 't-titulo-secao', label: 'Título Seção', spec: "700 20px/28px 'Inter', ls: -0.2px", sample: 'Sequência Rápida de Intubação' },
  { cls: 't-subtitulo', label: 'Subtítulo', spec: "600 18px/28px 'Inter'", sample: 'Drogas de Manutenção' },
  { cls: 't-nome-droga', label: 'Nome Droga', spec: "600 18px/28px 'Inter'", sample: 'Midazolam' },
  { cls: 't-alerta-titulo', label: 'Alerta Título', spec: "700 16px/24px 'Inter'", sample: 'Atenção: dose máxima excedida' },
  { cls: 't-alerta-corpo', label: 'Alerta Corpo', spec: "400 14px/20px 'Inter', ls: 0.14px", sample: 'Considere redução de 50% em pacientes idosos ou com insuficiência hepática.' },
  { cls: 't-corpo', label: 'Corpo', spec: "400 16px/24px 'Inter'", sample: 'Este cálculo utiliza a fórmula de Cockcroft-Gault para estimar o clearance de creatinina.' },
  { cls: 't-corpo-2', label: 'Corpo 2', spec: "400 14px/20px 'Inter', ls: 0.14px", sample: 'Valores de referência podem variar conforme o laboratório.' },
  { cls: 't-rotulo-campo', label: 'Rótulo Campo', spec: "500 14px/20px 'Inter', ls: 0.14px", sample: 'Peso do paciente' },
  { cls: 't-valor-campo', label: 'Valor Campo', spec: "400 16px/24px 'Inter'", sample: '72.5' },
  { cls: 't-valor-mono', label: 'Valor Mono', spec: "400 16px/24px 'JetBrains Mono'", sample: '1.234,56' },
  { cls: 't-rotulo-nav', label: 'Rótulo Nav', spec: "500 12px/16px 'Inter', ls: 0.24px", sample: 'Início' },
  { cls: 't-texto-badge', label: 'Texto Badge', spec: "600 11px/16px 'Inter', ls: 0.22px", sample: 'PREMIUM' },
  { cls: 't-legenda', label: 'Legenda', spec: "400 12px/16px 'Inter', ls: 0.24px", sample: 'Última atualização: 15 min atrás' },
  { cls: 't-marca', label: 'Marca', spec: "700 28px/32px 'Outfit'", sample: 'Calc.Med' },
  { cls: 't-dose-valor', label: 'Dose Valor', spec: "700 36px/40px 'JetBrains Mono'", sample: '150' },
  { cls: 't-dose-unidade', label: 'Dose Unidade', spec: "500 20px/28px 'JetBrains Mono'", sample: 'mg/kg' },
  { cls: 't-preco-destaque', label: 'Preço Destaque', spec: "700 24px/32px 'Inter'", sample: 'R$ 29,90' },
  { cls: 't-valor-grande', label: 'Valor Grande', spec: "700 32px/40px 'JetBrains Mono'", sample: '98.7' },
]

export default function DSTipografia() {
  return (
    <div>
      <h2 className="ds-section-title">Tipografia</h2>
      <p className="ds-section-desc">
        Escala tipográfica com ratio ~1.25 (Major Third) e 3 famílias: Inter para toda a interface,
        JetBrains Mono para doses e valores numéricos, e Outfit exclusivamente para a marca.
        Em contexto de emergência, legibilidade é crítica: doses NUNCA aparecem em fonte menor que 20px,
        garantindo leitura rápida mesmo sob pressão.
      </p>

      <div className="ds-subsection">
        <h3>Famílias</h3>
        <p className="t-corpo-2 text-fg-2 mb-4">
          Cada família tem um papel específico. Inter cobre toda a interface por sua excelente
          legibilidade em telas pequenas. JetBrains Mono garante que dígitos de dose sejam
          inequívocos (0 vs O, 1 vs l). Outfit é reservada apenas para o logotipo.
        </p>
        <DSPanel title="Famílias tipográficas">
          <div className="flex gap-6 flex-wrap mb-6">
            <div className="ds-bp-card" style={{ flex: '1 1 200px' }}>
              <div className="t-corpo text-fg mb-1" style={{ fontWeight: 600 }}>Inter</div>
              <div className="t-legenda text-fg-3">Interface, textos, rótulos</div>
            </div>
            <div className="ds-bp-card" style={{ flex: '1 1 200px' }}>
              <div className="t-corpo text-fg mb-1" style={{ fontWeight: 600, fontFamily: "'JetBrains Mono'" }}>JetBrains Mono</div>
              <div className="t-legenda text-fg-3">Doses, valores, códigos</div>
            </div>
            <div className="ds-bp-card" style={{ flex: '1 1 200px' }}>
              <div className="t-corpo text-fg mb-1" style={{ fontWeight: 600, fontFamily: "'Outfit'" }}>Outfit</div>
              <div className="t-legenda text-fg-3">Marca, logotipo</div>
            </div>
          </div>
        </DSPanel>
      </div>

      <div className="ds-subsection">
        <h3>Estilos de Texto</h3>
        <p className="t-corpo-2 text-fg-2 mb-4">
          19 estilos pré-definidos cobrem todos os casos de uso do app. Use sempre a classe CSS
          correspondente em vez de definir font-size/weight manualmente. Isso garante consistência
          visual e facilita ajustes globais.
        </p>
        <DSPanel title="Escala tipográfica">
          {typeStyles.map(t => (
            <div className="ds-type-row" key={t.cls}>
              <div className="ds-type-meta">
                <span className="ds-type-class">.{t.cls}</span>
                <span className="ds-type-spec">{t.spec}</span>
              </div>
              <div className={`${t.cls} text-fg`}>
                {t.sample}
              </div>
            </div>
          ))}
        </DSPanel>
      </div>
    </div>
  )
}
