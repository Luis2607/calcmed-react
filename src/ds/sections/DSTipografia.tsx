import DSPanel from '../DSPanel'

const typeStyles = [
  { cls: 't-titulo-pagina', label: 'T\u00edtulo P\u00e1gina', spec: "700 24px/32px 'Inter', ls: -0.48px", sample: 'Calculadora de Dose' },
  { cls: 't-titulo-secao', label: 'T\u00edtulo Se\u00e7\u00e3o', spec: "700 20px/28px 'Inter', ls: -0.2px", sample: 'Sequ\u00eancia R\u00e1pida de Intuba\u00e7\u00e3o' },
  { cls: 't-subtitulo', label: 'Subt\u00edtulo', spec: "600 18px/28px 'Inter'", sample: 'Drogas de Manuten\u00e7\u00e3o' },
  { cls: 't-nome-droga', label: 'Nome Droga', spec: "600 18px/28px 'Inter'", sample: 'Midazolam' },
  { cls: 't-alerta-titulo', label: 'Alerta T\u00edtulo', spec: "700 16px/24px 'Inter'", sample: 'Aten\u00e7\u00e3o: dose m\u00e1xima excedida' },
  { cls: 't-alerta-corpo', label: 'Alerta Corpo', spec: "400 14px/20px 'Inter', ls: 0.14px", sample: 'Considere redu\u00e7\u00e3o de 50% em pacientes idosos ou com insufici\u00eancia hep\u00e1tica.' },
  { cls: 't-corpo', label: 'Corpo', spec: "400 16px/24px 'Inter'", sample: 'Este c\u00e1lculo utiliza a f\u00f3rmula de Cockcroft-Gault para estimar o clearance de creatinina.' },
  { cls: 't-corpo-2', label: 'Corpo 2', spec: "400 14px/20px 'Inter', ls: 0.14px", sample: 'Valores de refer\u00eancia podem variar conforme o laborat\u00f3rio.' },
  { cls: 't-rotulo-campo', label: 'R\u00f3tulo Campo', spec: "500 14px/20px 'Inter', ls: 0.14px", sample: 'Peso do paciente' },
  { cls: 't-valor-campo', label: 'Valor Campo', spec: "400 16px/24px 'Inter'", sample: '72.5' },
  { cls: 't-valor-mono', label: 'Valor Mono', spec: "400 16px/24px 'JetBrains Mono'", sample: '1.234,56' },
  { cls: 't-rotulo-nav', label: 'R\u00f3tulo Nav', spec: "500 12px/16px 'Inter', ls: 0.24px", sample: 'In\u00edcio' },
  { cls: 't-texto-badge', label: 'Texto Badge', spec: "600 11px/16px 'Inter', ls: 0.22px", sample: 'PREMIUM' },
  { cls: 't-legenda', label: 'Legenda', spec: "400 12px/16px 'Inter', ls: 0.24px", sample: '\u00daltima atualiza\u00e7\u00e3o: 15 min atr\u00e1s' },
  { cls: 't-marca', label: 'Marca', spec: "700 28px/32px 'Outfit'", sample: 'Calc.Med' },
  { cls: 't-dose-valor', label: 'Dose Valor', spec: "700 36px/40px 'JetBrains Mono'", sample: '150' },
  { cls: 't-dose-unidade', label: 'Dose Unidade', spec: "500 20px/28px 'JetBrains Mono'", sample: 'mg/kg' },
  { cls: 't-preco-destaque', label: 'Pre\u00e7o Destaque', spec: "700 24px/32px 'Inter'", sample: 'R$ 29,90' },
  { cls: 't-valor-grande', label: 'Valor Grande', spec: "700 32px/40px 'JetBrains Mono'", sample: '98.7' },
]

export default function DSTipografia() {
  return (
    <div>
      <h2 className="ds-section-title">Tipografia</h2>
      <p className="ds-section-desc">
        Escala tipogr{"\u00e1"}fica com ratio ~1.25 (Major Third) e 3 fam{"\u00ed"}lias: Inter para toda a interface,
        JetBrains Mono para doses e valores num{"\u00e9"}ricos, e Outfit exclusivamente para a marca.
      </p>
      <p className="ds-section-desc">
        Em contexto de emerg{"\u00ea"}ncia, legibilidade {"\u00e9"} cr{"\u00ed"}tica: doses NUNCA aparecem em fonte menor que 20px,
        garantindo leitura r{"\u00e1"}pida mesmo sob press{"\u00e3"}o.
      </p>

      {/* Quando usar */}
      <div className="ds-subsection">
        <h3>Quando usar</h3>
        <div className="flex gap-8 mb-6">
          <div className="flex-1">
            <div className="t-texto-badge text-success mb-3" style={{ textTransform: 'uppercase', letterSpacing: 1 }}>Use quando</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li className="flex gap-2 items-start mb-2"><i className="ph ph-check-circle" style={{ color: 'var(--success)', flexShrink: 0, marginTop: 2 }} /><span className="t-corpo-2">Exibir doses e resultados num{"\u00e9"}ricos com t-dose-valor (m{"\u00ed"}nimo 20px obrigat{"\u00f3"}rio)</span></li>
              <li className="flex gap-2 items-start mb-2"><i className="ph ph-check-circle" style={{ color: 'var(--success)', flexShrink: 0, marginTop: 2 }} /><span className="t-corpo-2">Escrever par{"\u00e1"}grafos e descri{"\u00e7\u00f5"}es com t-corpo ou t-corpo-2</span></li>
              <li className="flex gap-2 items-start mb-2"><i className="ph ph-check-circle" style={{ color: 'var(--success)', flexShrink: 0, marginTop: 2 }} /><span className="t-corpo-2">Exibir valores monet{"\u00e1"}rios ou n{"\u00fa"}meros tabulares com JetBrains Mono (t-valor-mono)</span></li>
            </ul>
          </div>
          <div className="flex-1">
            <div className="t-texto-badge text-danger mb-3" style={{ textTransform: 'uppercase', letterSpacing: 1 }}>N{"\u00e3"}o use quando</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li className="flex gap-2 items-start mb-2"><i className="ph ph-x-circle" style={{ color: 'var(--danger)', flexShrink: 0, marginTop: 2 }} /><span className="t-corpo-2">Usar t-dose-valor para texto corrido. Reserve exclusivamente para doses e resultados</span></li>
              <li className="flex gap-2 items-start mb-2"><i className="ph ph-x-circle" style={{ color: 'var(--danger)', flexShrink: 0, marginTop: 2 }} /><span className="t-corpo-2">Usar t-corpo para t{"\u00ed"}tulos e cabe{"\u00e7"}alhos. Use t-titulo-pagina ou t-titulo-secao</span></li>
              <li className="flex gap-2 items-start mb-2"><i className="ph ph-x-circle" style={{ color: 'var(--danger)', flexShrink: 0, marginTop: 2 }} /><span className="t-corpo-2">Definir font-size/weight manualmente. Sempre use a classe CSS correspondente</span></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="ds-subsection">
        <h3>Fam{"\u00ed"}lias</h3>
        <p className="t-corpo-2 text-fg-2 mb-4">
          Cada fam{"\u00ed"}lia tem um papel espec{"\u00ed"}fico. Inter cobre toda a interface por sua excelente
          legibilidade em telas pequenas. JetBrains Mono garante que d{"\u00ed"}gitos de dose sejam
          inequ{"\u00ed"}vocos (0 vs O, 1 vs l). Outfit {"\u00e9"} reservada apenas para o logotipo.
        </p>
        <DSPanel title="Fam\u00edlias tipogr\u00e1ficas">
          <div className="flex gap-6 flex-wrap mb-6">
            <div className="ds-bp-card" style={{ flex: '1 1 200px' }}>
              <div className="t-corpo text-fg mb-1" style={{ fontWeight: 600 }}>Inter</div>
              <div className="t-legenda text-fg-3">Interface, textos, r{"\u00f3"}tulos</div>
            </div>
            <div className="ds-bp-card" style={{ flex: '1 1 200px' }}>
              <div className="t-corpo text-fg mb-1" style={{ fontWeight: 600, fontFamily: "'JetBrains Mono'" }}>JetBrains Mono</div>
              <div className="t-legenda text-fg-3">Doses, valores, c{"\u00f3"}digos</div>
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
          19 estilos pr{"\u00e9"}-definidos cobrem todos os casos de uso do app. Use sempre a classe CSS
          correspondente em vez de definir font-size/weight manualmente.
          Isso garante consist{"\u00ea"}ncia visual e facilita ajustes globais.
        </p>
        <DSPanel title="Escala tipogr\u00e1fica">
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
