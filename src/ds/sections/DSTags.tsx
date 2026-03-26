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
          <div className="flex flex-col gap-4">
            <div>
              <div className="t-legenda mb-2" style={{ fontWeight: 600, opacity: 0.6 }}>Default / Active</div>
              <div className="ds-demo-row">
                <span className="chip">Todos</span>
                <span className="chip active">Ativo</span>
                <span className="chip">Inativo</span>
              </div>
            </div>
            <div>
              <div className="t-legenda mb-2" style={{ fontWeight: 600, opacity: 0.6 }}>Domain Colored</div>
              <div className="ds-demo-row">
                {domainTags.map(t => (
                  <span className={`chip ${t.cls}`} key={t.cls}>{t.label}</span>
                ))}
              </div>
            </div>
          </div>
        </DSPanel>
      </div>

      {/* Dismissible Tag */}
      <div className="ds-subsection">
        <h3>Tag Dismissivel</h3>
        <DSPanel>
          <div className="ds-demo-row">
            <span className="chip active tag-dismissible">
              Urgencias
              <button className="tag-x"><i className="ph ph-x" /></button>
            </span>
            <span className="chip tag-dismissible">
              Diluicoes
              <button className="tag-x"><i className="ph ph-x" /></button>
            </span>
            <span className="chip tag-dismissible">
              Calculadoras
              <button className="tag-x"><i className="ph ph-x" /></button>
            </span>
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
              { cls: '.tag-dismissible', desc: 'Tag com padding-right reduzido para botao X' },
              { cls: '.tag-x', desc: 'Botao X dentro da tag: 16px, opacity 0.6, hover 1' },
            ].map(r => (
              <tr key={r.cls}>
                <td><span className="ds-token">{r.cls}</span></td>
                <td className="text-fg-2">{r.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
