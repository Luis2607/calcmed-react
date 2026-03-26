import DSPanel from '../DSPanel'

export default function DSCategorias() {
  return (
    <div>
      <h2 className="ds-section-title">Categorias e Colapso</h2>
      <p className="ds-section-desc">
        Sistema de categorias colapsiveis da Home. Cada categoria agrupa funcionalidades por dominio clinico
        (Urgencias, Diluicoes, Calculadoras, etc.). O medico expande so o que precisa, reduzindo sobrecarga visual.
        As cores de dominio ajudam na identificacao instantanea.
      </p>

      {/* Categories */}
      <div className="ds-subsection">
        <h3>Categorias Colapsiveis</h3>
        <DSPanel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* Expanded category */}
            <div className="category-collapse">
              <div className="category-header">
                <div className="cat-icon urg"><i className="ph ph-syringe" /></div>
                <span className="cat-name">Urgencias</span>
                <span className="cat-count">8</span>
                <i className="ph ph-caret-right cat-chevron open" />
              </div>
              <div className="category-body open">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                  <div className="card-feature-mini">
                    <i className="mini-icon ph ph-heartbeat icon-urg" />
                    <span className="mini-name">Seq. Rapida</span>
                  </div>
                  <div className="card-feature-mini">
                    <i className="mini-icon ph ph-first-aid icon-urg" />
                    <span className="mini-name">PCR</span>
                  </div>
                  <div className="card-feature-mini">
                    <i className="mini-icon ph ph-lightning icon-urg" />
                    <span className="mini-name">Choque</span>
                  </div>
                  <div className="card-feature-mini">
                    <i className="mini-icon ph ph-thermometer icon-urg" />
                    <span className="mini-name">Hipotermia</span>
                  </div>
                  <div className="card-feature-mini">
                    <i className="mini-icon ph ph-drop icon-urg" />
                    <span className="mini-name">Hemoderivados</span>
                  </div>
                  <div className="card-feature-mini">
                    <i className="mini-icon ph ph-heart icon-urg" />
                    <span className="mini-name">Arritmias</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Collapsed category */}
            <div className="category-collapse">
              <div className="category-header">
                <div className="cat-icon dil"><i className="ph ph-drop" /></div>
                <span className="cat-name">Diluicoes</span>
                <span className="cat-count">12</span>
                <i className="ph ph-caret-right cat-chevron" />
              </div>
            </div>

            {/* Collapsed category */}
            <div className="category-collapse">
              <div className="category-header">
                <div className="cat-icon calc"><i className="ph ph-calculator" /></div>
                <span className="cat-name">Calculadoras</span>
                <span className="cat-count">6</span>
                <i className="ph ph-caret-right cat-chevron" />
              </div>
            </div>
          </div>
        </DSPanel>
      </div>

      {/* Section Header + Fav Scroll */}
      <div className="ds-subsection">
        <h3>Cabecalho de Secao e Favoritos</h3>
        <DSPanel>
          <div>
            <div className="section-header">
              <h2>Meu Plantao</h2>
              <a href="#" onClick={e => e.preventDefault()}>Ver todos</a>
            </div>
            <div className="fav-scroll">
              <div className="card-favorite">
                <span className="fav-abbr" style={{ color: 'var(--dom-urg)' }}>IOT</span>
                <span className="fav-name">Seq. Rapida Intubacao</span>
                <i className="ph-fill ph-bookmark-simple fav-bookmark saved" />
              </div>
              <div className="card-favorite">
                <span className="fav-abbr" style={{ color: 'var(--dom-calc)' }}>CrCl</span>
                <span className="fav-name">Cockcroft-Gault</span>
                <i className="ph ph-bookmark-simple fav-bookmark" />
              </div>
              <div className="card-favorite">
                <span className="fav-abbr" style={{ color: 'var(--dom-dil)' }}>DOB</span>
                <span className="fav-name">Dobutamina</span>
                <i className="ph ph-bookmark-simple fav-bookmark" />
              </div>
            </div>
          </div>
        </DSPanel>
      </div>

      {/* Classes */}
      <div className="ds-subsection">
        <h3>Classes CSS</h3>
        <table className="ds-token-table">
          <thead>
            <tr><th>Classe</th><th>Descricao</th></tr>
          </thead>
          <tbody>
            {[
              { cls: '.category-collapse', desc: 'Container colapsavel: radius xl, borda, fundo card' },
              { cls: '.category-header', desc: 'Cabecalho: flex, align center, gap 16px, cursor pointer' },
              { cls: '.category-body', desc: 'Corpo oculto por padrao, display block com .open' },
              { cls: '.cat-icon', desc: 'Icone 40px com circulo colorido por dominio' },
              { cls: '.cat-name', desc: 'Nome da categoria: font 600 15px, flex 1' },
              { cls: '.cat-count', desc: 'Badge circular 28px: font 600 12px, fundo elevated' },
              { cls: '.cat-chevron', desc: 'Seta que rotaciona 90deg com .open' },
              { cls: '.card-feature-mini', desc: 'Card mini 80px: flex column, icone + nome' },
              { cls: '.mini-icon', desc: 'Icone 24px do card mini' },
              { cls: '.mini-name', desc: 'Nome do card mini: font 500 10px, fg-2' },
              { cls: '.section-header', desc: 'Cabecalho de secao: flex, space-between, titulo + link' },
              { cls: '.fav-scroll', desc: 'Scroll horizontal: flex, overflow-x auto, snap' },
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
