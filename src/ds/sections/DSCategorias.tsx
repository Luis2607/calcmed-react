import DSPanel from '../DSPanel'

export default function DSCategorias() {
  return (
    <div>
      <h2 className="ds-section-title">Categorias e Colapso</h2>
      <p className="ds-section-desc">
        Sistema de categorias colapsíveis da Home. Cada categoria agrupa funcionalidades por domínio clínico
        (Urgências, Diluições, Calculadoras, etc.). O médico expande somente o que precisa, reduzindo
        a sobrecarga visual durante o plantão.
      </p>
      <p className="ds-section-desc">
        As cores de domínio facilitam a identificação instantânea da área clínica.
      </p>

      {/* Quando usar */}
      <div className="ds-subsection">
        <h3>Quando usar</h3>
        <div className="flex gap-8 mb-6">
          <div className="flex-1">
            <div className="t-texto-badge text-success mb-3" style={{ textTransform: 'uppercase', letterSpacing: 1 }}>Use quando</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li className="flex gap-2 items-start mb-2"><i className="ph ph-check-circle" style={{ color: 'var(--success)', flexShrink: 0, marginTop: 2 }} /><span className="t-corpo-2">Agrupar 5 ou mais itens por domínio clínico na Home</span></li>
              <li className="flex gap-2 items-start mb-2"><i className="ph ph-check-circle" style={{ color: 'var(--success)', flexShrink: 0, marginTop: 2 }} /><span className="t-corpo-2">Expandir por padrão a categoria mais usada pelo médico</span></li>
              <li className="flex gap-2 items-start mb-2"><i className="ph ph-check-circle" style={{ color: 'var(--success)', flexShrink: 0, marginTop: 2 }} /><span className="t-corpo-2">Reduzir sobrecarga visual em listas longas de funcionalidades</span></li>
            </ul>
          </div>
          <div className="flex-1">
            <div className="t-texto-badge text-danger mb-3" style={{ textTransform: 'uppercase', letterSpacing: 1 }}>Não use quando</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li className="flex gap-2 items-start mb-2"><i className="ph ph-x-circle" style={{ color: 'var(--danger)', flexShrink: 0, marginTop: 2 }} /><span className="t-corpo-2">Houver 3 ou menos itens. Mostre-os diretamente sem colapso</span></li>
              <li className="flex gap-2 items-start mb-2"><i className="ph ph-x-circle" style={{ color: 'var(--danger)', flexShrink: 0, marginTop: 2 }} /><span className="t-corpo-2">Esconder conteúdo crítico de emergência. Ferramentas urgentes devem estar visíveis</span></li>
              <li className="flex gap-2 items-start mb-2"><i className="ph ph-x-circle" style={{ color: 'var(--danger)', flexShrink: 0, marginTop: 2 }} /><span className="t-corpo-2">Deixar todas as categorias colapsadas por padrão. Sempre abra a mais relevante</span></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Expanded vs Collapsed states */}
      <div className="ds-subsection">
        <h3>Estados: Expandido e Colapsado</h3>
        <p className="t-corpo-2 text-fg-2 mb-4">
          A primeira categoria aparece expandida por padrão para mostrar as funcionalidades disponíveis.
          As demais ficam colapsadas, exibindo apenas o cabeçalho com ícone, nome e contador.
          O chevron rotaciona 90° ao expandir, dando feedback visual imediato ao toque.
        </p>
        <DSPanel>
          <div className="flex flex-col gap-3">
            {/* Expanded category */}
            <div className="category-collapse">
              <div className="category-header">
                <div className="cat-icon urg"><i className="ph ph-syringe" /></div>
                <span className="cat-name">Urgências</span>
                <span className="cat-count">8</span>
                <i className="ph ph-caret-right cat-chevron open" />
              </div>
              <div className="category-body open">
                <div className="flex flex-wrap gap-2">
                  <div className="card-feature-mini">
                    <i className="mini-icon ph ph-heartbeat icon-urg" />
                    <span className="mini-name">Seq. Rápida</span>
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
                <span className="cat-name">Diluições</span>
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
        <h3>Cabeçalho de Seção e Favoritos</h3>
        <p className="t-corpo-2 text-fg-2 mb-4">
          O cabeçalho de seção combina título e link "Ver todos". A área de favoritos
          ("Meu Plantão") usa scroll horizontal com snap, permitindo acesso rápido
          às calculadoras mais usadas pelo médico.
        </p>
        <DSPanel>
          <div>
            <div className="section-header">
              <h2>Meu Plantão</h2>
              <a href="#" onClick={e => e.preventDefault()}>Ver todos</a>
            </div>
            <div className="fav-scroll">
              <div className="card-favorite">
                <span className="fav-abbr" style={{ color: 'var(--dom-urg)' }}>IOT</span>
                <span className="fav-name">Seq. Rápida Intubação</span>
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
            <tr><th>Classe</th><th>Descrição</th></tr>
          </thead>
          <tbody>
            {[
              { cls: '.category-collapse', desc: 'Container colapsível: border-radius xl, borda sutil, fundo card' },
              { cls: '.category-header', desc: 'Cabeçalho: flex com alinhamento central, gap 16px, cursor pointer' },
              { cls: '.category-body', desc: 'Corpo oculto por padrão (max-height 0). Com .open, expande com transição suave' },
              { cls: '.cat-icon', desc: 'Ícone 40px com círculo colorido pela cor do domínio clínico' },
              { cls: '.cat-name', desc: 'Nome da categoria: font 600 15px, ocupa espaço restante (flex 1)' },
              { cls: '.cat-count', desc: 'Badge circular 28px com quantidade de itens: font 600 12px' },
              { cls: '.cat-chevron', desc: 'Seta indicativa que rotaciona 90° com a classe .open' },
              { cls: '.card-feature-mini', desc: 'Card compacto (~80px): coluna com ícone e nome da funcionalidade' },
              { cls: '.mini-icon', desc: 'Ícone 24px do card compacto, cor do domínio' },
              { cls: '.mini-name', desc: 'Nome no card compacto: font 500 10px, cor fg-2' },
              { cls: '.section-header', desc: 'Cabeçalho de seção: flex com space-between, título + link' },
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
