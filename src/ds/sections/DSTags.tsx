import DSPanel from '../DSPanel'

const domainTags = [
  { cls: 'urg', label: 'Urgencias' },
  { cls: 'dil', label: 'Diluicoes' },
  { cls: 'calc', label: 'Calculadoras' },
  { cls: 'prot', label: 'Protocolos' },
  { cls: 'esc', label: 'Escores' },
  { cls: 'conv', label: 'Conversores' },
]

const statusTags = [
  { cls: 'premium', label: 'PREMIUM' },
  { cls: 'experimentando', label: 'EXPERIMENTANDO' },
  { cls: 'free', label: 'GRATUITO' },
  { cls: 'novo', label: 'NOVO' },
  { cls: 'atualizado', label: 'ATUALIZADO' },
  { cls: 'warning', label: 'EXPIRA HOJE' },
]

const abbrTags = [
  { cls: 'urg', label: 'IOT' },
  { cls: 'dil', label: 'DOB' },
  { cls: 'calc', label: 'CrCl' },
  { cls: 'prot', label: 'SRI' },
  { cls: 'esc', label: 'GCS' },
  { cls: 'conv', label: 'mEq' },
]

export default function DSTags() {
  return (
    <div>
      <h2 className="ds-section-title">Tags & Chips</h2>
      <p className="ds-section-desc">
        Tags de dominio identificam categorias clinicas. Tags de status indicam nivel de acesso.
        Tag-abbr mostra abreviacoes de calculadoras. Chips sao filtros interativos.
      </p>

      {/* Domain Tags */}
      <div className="ds-subsection">
        <h3>Tag Domain</h3>
        <DSPanel>
          <div className="ds-demo-row">
            {domainTags.map(t => (
              <span className={`tag-domain ${t.cls}`} key={t.cls}>{t.label}</span>
            ))}
          </div>
        </DSPanel>
      </div>

      {/* Status Tags */}
      <div className="ds-subsection">
        <h3>Tag Status</h3>
        <DSPanel>
          <div className="ds-demo-row">
            {statusTags.map(t => (
              <span className={`tag-status ${t.cls}`} key={t.cls}>{t.label}</span>
            ))}
          </div>
        </DSPanel>
      </div>

      {/* Abbreviation Tags */}
      <div className="ds-subsection">
        <h3>Tag Abbreviation</h3>
        <DSPanel>
          <div className="ds-demo-row">
            {abbrTags.map(t => (
              <span className={`tag-abbr ${t.cls}`} key={t.cls}>{t.label}</span>
            ))}
          </div>
        </DSPanel>
      </div>

      {/* Count Tag */}
      <div className="ds-subsection">
        <h3>Tag Count</h3>
        <DSPanel>
          <div className="ds-demo-row">
            <span className="tag-count">12</span>
            <span className="tag-count">4</span>
            <span className="tag-count">99+</span>
          </div>
        </DSPanel>
      </div>

      {/* Chips */}
      <div className="ds-subsection">
        <h3>Chips (Filtros)</h3>
        <DSPanel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <div style={{ font: "600 12px 'Inter'", color: 'inherit', opacity: 0.6, marginBottom: 8 }}>Default / Active</div>
              <div className="ds-demo-row">
                <span className="chip">Todos</span>
                <span className="chip active">Ativo</span>
                <span className="chip">Inativo</span>
              </div>
            </div>
            <div>
              <div style={{ font: "600 12px 'Inter'", color: 'inherit', opacity: 0.6, marginBottom: 8 }}>Domain Colored</div>
              <div className="ds-demo-row">
                {domainTags.map(t => (
                  <span className={`chip ${t.cls}`} key={t.cls}>{t.label}</span>
                ))}
              </div>
            </div>
          </div>
        </DSPanel>
      </div>

      {/* Classes Table */}
      <div className="ds-subsection">
        <h3>Classes CSS</h3>
        <table className="ds-token-table">
          <thead>
            <tr><th>Classe</th><th>Descricao</th></tr>
          </thead>
          <tbody>
            {[
              { cls: '.tag-domain', desc: 'Pill com padding 4px 12px, font 600 12px' },
              { cls: '.tag-status', desc: 'Retangular, font 700 10px uppercase' },
              { cls: '.tag-abbr', desc: 'Quadrado arredondado, font 700 18px' },
              { cls: '.tag-count', desc: 'Badge numerico, fundo elevated' },
              { cls: '.chip', desc: 'Filtro interativo, radius pill, borda' },
              { cls: '.chip.active', desc: 'Chip ativo: fundo primary, texto on' },
              { cls: '.urg, .dil, .calc, ...', desc: 'Cor de dominio (bg + text)' },
              { cls: '.tag-status.premium', desc: 'Fundo primary, texto on' },
              { cls: '.tag-status.experimentando', desc: 'Fundo success-bg, texto success' },
              { cls: '.tag-status.free', desc: 'Fundo elevated, texto fg-2' },
            ].map(r => (
              <tr key={r.cls}>
                <td><span className="ds-token">{r.cls}</span></td>
                <td style={{ color: 'var(--fg-2)' }}>{r.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
