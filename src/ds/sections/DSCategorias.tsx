import DSPanel from '../DSPanel'

export default function DSCategorias() {
  return (
    <div>
      <h2 className="ds-section-title">Categorias e Colapso</h2>
      <p className="ds-section-desc">
        Sistema de categorias colaps\u00edveis da Home. Cada categoria agrupa funcionalidades por dom\u00ednio cl\u00ednico
        (Urg\u00eancias, Dilui\u00e7\u00f5es, Calculadoras, etc.). O m\u00e9dico expande somente o que precisa, reduzindo
        a sobrecarga visual durante o plant\u00e3o. As cores de dom\u00ednio facilitam a identifica\u00e7\u00e3o instant\u00e2nea
        da \u00e1rea cl\u00ednica.
      </p>

      {/* Expanded vs Collapsed states */}
      <div className="ds-subsection">
        <h3>Estados: Expandido e Colapsado</h3>
        <p className="t-corpo-2 text-fg-2 mb-4">
          A primeira categoria aparece expandida por padr\u00e3o para mostrar as funcionalidades dispon\u00edveis.
          As demais ficam colapsadas, exibindo apenas o cabe\u00e7alho com \u00edcone, nome e contador.
          O chevron rotaciona 90\u00b0 ao expandir, dando feedback visual imediato ao toque.
        </p>
        <DSPanel>
          <div className="flex flex-col gap-3">
            {/* Expanded category */}
            <div className="category-collapse">
              <div className="category-header">
                <div className="cat-icon urg"><i className="ph ph-syringe" /></div>
                <span className="cat-name">Urg\u00eancias</span>
                <span className="cat-count">8</span>
                <i className="ph ph-caret-right cat-chevron open" />
              </div>
              <div className="category-body open">
                <div className="flex flex-wrap gap-2">
                  <div className="card-feature-mini">
                    <i className="mini-icon ph ph-heartbeat icon-urg" />
                    <span className="mini-name">Seq. R\u00e1pida</span>
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
                <span className="cat-name">Dilui\u00e7\u00f5es</span>
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
        <h3>Cabe\u00e7alho de Se\u00e7\u00e3o e Favoritos</h3>
        <p className="t-corpo-2 text-fg-2 mb-4">
          O cabe\u00e7alho de se\u00e7\u00e3o combina t\u00edtulo e link &ldquo;Ver todos&rdquo;. A \u00e1rea de favoritos
          (&ldquo;Meu Plant\u00e3o&rdquo;) usa scroll horizontal com snap, permitindo acesso r\u00e1pido
          \u00e0s calculadoras mais usadas pelo m\u00e9dico.
        </p>
        <DSPanel>
          <div>
            <div className="section-header">
              <h2>Meu Plant\u00e3o</h2>
              <a href="#" onClick={e => e.preventDefault()}>Ver todos</a>
            </div>
            <div className="fav-scroll">
              <div className="card-favorite">
                <span className="fav-abbr" style={{ color: 'var(--dom-urg)' }}>IOT</span>
                <span className="fav-name">Seq. R\u00e1pida Intuba\u00e7\u00e3o</span>
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
            <tr><th>Classe</th><th>Descri\u00e7\u00e3o</th></tr>
          </thead>
          <tbody>
            {[
              { cls: '.category-collapse', desc: 'Container colaps\u00edvel: border-radius xl, borda sutil, fundo card' },
              { cls: '.category-header', desc: 'Cabe\u00e7alho: flex com alinhamento central, gap 16px, cursor pointer' },
              { cls: '.category-body', desc: 'Corpo oculto por padr\u00e3o (max-height 0). Com .open, expande com transi\u00e7\u00e3o suave' },
              { cls: '.cat-icon', desc: '\u00cdcone 40px com c\u00edrculo colorido pela cor do dom\u00ednio cl\u00ednico' },
              { cls: '.cat-name', desc: 'Nome da categoria: font 600 15px, ocupa espa\u00e7o restante (flex 1)' },
              { cls: '.cat-count', desc: 'Badge circular 28px com quantidade de itens: font 600 12px' },
              { cls: '.cat-chevron', desc: 'Seta indicativa que rotaciona 90\u00b0 com a classe .open' },
              { cls: '.card-feature-mini', desc: 'Card compacto (~80px): coluna com \u00edcone e nome da funcionalidade' },
              { cls: '.mini-icon', desc: '\u00cdcone 24px do card compacto, cor do dom\u00ednio' },
              { cls: '.mini-name', desc: 'Nome no card compacto: font 500 10px, cor fg-2' },
              { cls: '.section-header', desc: 'Cabe\u00e7alho de se\u00e7\u00e3o: flex com space-between, t\u00edtulo + link' },
              { cls: '.fav-scroll', desc: 'Scroll horizontal com snap: flex, overflow-x auto, scroll-snap' },
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
