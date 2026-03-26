import DSPanel from '../DSPanel'

const domainTags = [
  { cls: 'urg', label: 'Urg\u00eancias' },
  { cls: 'dil', label: 'Dilui\u00e7\u00f5es' },
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
      <h2 className="ds-section-title">Tags &amp; Chips</h2>
      <p className="ds-section-desc">
        Tags e chips s{"\u00e3"}o elementos de categoriza{"\u00e7\u00e3"}o e filtragem essenciais para a navega{"\u00e7\u00e3"}o m{"\u00e9"}dica.
        As tags de dom{"\u00ed"}nio identificam a categoria cl{"\u00ed"}nica de cada ferramenta (Urg{"\u00ea"}ncias, Dilui{"\u00e7\u00f5"}es,
        Calculadoras, etc.) com cores {"\u00fa"}nicas por dom{"\u00ed"}nio.
      </p>
      <p className="ds-section-desc">
        As tags de status indicam o n{"\u00ed"}vel de acesso
        do usu{"\u00e1"}rio (Premium, Gratuito, Experimentando). Os chips funcionam como filtros interativos
        que o m{"\u00e9"}dico ativa/desativa para refinar buscas. Em contexto de plant{"\u00e3"}o, essa categoriza{"\u00e7\u00e3"}o
        visual acelera a localiza{"\u00e7\u00e3"}o da ferramenta certa.
      </p>

      {/* Quando usar */}
      <div className="ds-subsection">
        <h3>Quando usar</h3>
        <div className="flex gap-8 mb-6">
          <div className="flex-1">
            <div className="t-texto-badge text-success mb-3" style={{ textTransform: 'uppercase', letterSpacing: 1 }}>Use quando</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li className="flex gap-2 items-start mb-2"><i className="ph ph-check-circle" style={{ color: 'var(--success)', flexShrink: 0, marginTop: 2 }} /><span className="t-corpo-2">Precisar identificar a categoria cl{"\u00ed"}nica de uma ferramenta. Use tag-domain</span></li>
              <li className="flex gap-2 items-start mb-2"><i className="ph ph-check-circle" style={{ color: 'var(--success)', flexShrink: 0, marginTop: 2 }} /><span className="t-corpo-2">Comunicar o n{"\u00ed"}vel de acesso (Premium, Free, Trial). Use tag-status</span></li>
              <li className="flex gap-2 items-start mb-2"><i className="ph ph-check-circle" style={{ color: 'var(--success)', flexShrink: 0, marginTop: 2 }} /><span className="t-corpo-2">Permitir filtragem interativa na busca ou listagem de escores. Use chip</span></li>
            </ul>
          </div>
          <div className="flex-1">
            <div className="t-texto-badge text-danger mb-3" style={{ textTransform: 'uppercase', letterSpacing: 1 }}>N{"\u00e3"}o use quando</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li className="flex gap-2 items-start mb-2"><i className="ph ph-x-circle" style={{ color: 'var(--danger)', flexShrink: 0, marginTop: 2 }} /><span className="t-corpo-2">Misturar tags e chips para o mesmo prop{"\u00f3"}sito. Tags categorizam, chips filtram</span></li>
              <li className="flex gap-2 items-start mb-2"><i className="ph ph-x-circle" style={{ color: 'var(--danger)', flexShrink: 0, marginTop: 2 }} /><span className="t-corpo-2">Usar tag-domain como bot{"\u00e3"}o de a{"\u00e7\u00e3"}o. Tags s{"\u00e3"}o informativas, n{"\u00e3"}o interativas</span></li>
              <li className="flex gap-2 items-start mb-2"><i className="ph ph-x-circle" style={{ color: 'var(--danger)', flexShrink: 0, marginTop: 2 }} /><span className="t-corpo-2">Usar chip onde tag-status seria o correto. Status {"\u00e9"} informativo, chip {"\u00e9"} interativo</span></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Domain Tags */}
      <div className="ds-subsection">
        <h3>Tag de Dom{"\u00ed"}nio</h3>
        <p className="ds-subsection-desc">
          Cada dom{"\u00ed"}nio cl{"\u00ed"}nico tem uma cor exclusiva. A tag aparece nos cards de funcionalidade
          e nos resultados de busca para orienta{"\u00e7\u00e3"}o r{"\u00e1"}pida. Formato pill com font 600 12px.
        </p>
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
        <h3>Tag de Status</h3>
        <p className="ds-subsection-desc">
          Comunicam o n{"\u00ed"}vel de acesso de cada funcionalidade. {"\u201c"}PREMIUM{"\u201d"} indica conte{"\u00fa"}do bloqueado,
          {"\u201c"}EXPERIMENTANDO{"\u201d"} mostra que o usu{"\u00e1"}rio est{"\u00e1"} em per{"\u00ed"}odo de degusta{"\u00e7\u00e3"}o, {"\u201c"}GRATUITO{"\u201d"} confirma
          acesso livre.
        </p>
        <p className="ds-subsection-desc">
          {"\u201c"}NOVO{"\u201d"} e {"\u201c"}ATUALIZADO{"\u201d"} destacam novidades, e {"\u201c"}EXPIRA HOJE{"\u201d"} alerta sobre
          fim do trial. Formato retangular, font 700 10px uppercase.
        </p>
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
        <h3>Tag de Abrevia{"\u00e7\u00e3"}o</h3>
        <p className="ds-subsection-desc">
          Exibem siglas m{"\u00e9"}dicas conhecidas (IOT, GCS, CrCl) em formato compacto dentro dos cards.
          Usam a cor do dom{"\u00ed"}nio correspondente. Formato quadrado arredondado, font 700 18px.
        </p>
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
        <h3>Tag de Contagem</h3>
        <p className="ds-subsection-desc">
          Badge num{"\u00e9"}rico para indicar quantidade de itens (ex: resultados de busca, favoritos,
          notifica{"\u00e7\u00f5"}es). Fundo elevated com n{"\u00fa"}mero centralizado. Valores acima de 99 exibem {"\u201c"}99+{"\u201d"}.
        </p>
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
        <p className="ds-subsection-desc">
          Filtros interativos que o m{"\u00e9"}dico toca para refinar resultados. O chip ativo recebe fundo
          primary com texto branco. Chips de dom{"\u00ed"}nio herdam a cor da categoria.
          Usados na tela de busca e na listagem de escores por especialidade.
        </p>
        <DSPanel>
          <div className="flex flex-col gap-4">
            <div>
              <div className="ds-demo-label">Default / Ativo</div>
              <div className="ds-demo-row">
                <span className="chip">Todos</span>
                <span className="chip active">Ativo</span>
                <span className="chip">Inativo</span>
              </div>
            </div>
            <div>
              <div className="ds-demo-label">Coloridos por Dom{"\u00ed"}nio</div>
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
        <h3>Tag Dispens{"\u00e1"}vel</h3>
        <p className="ds-subsection-desc">
          Tags com bot{"\u00e3"}o de remo{"\u00e7\u00e3"}o (X) para filtros ativos que o usu{"\u00e1"}rio pode descartar.
          Usadas quando m{"\u00fa"}ltiplos filtros est{"\u00e3"}o aplicados simultaneamente.
        </p>
        <DSPanel>
          <div className="ds-demo-row">
            <span className="chip active tag-dismissible">
              Urg{"\u00ea"}ncias
              <button className="tag-x"><i className="ph ph-x" /></button>
            </span>
            <span className="chip tag-dismissible">
              Dilui{"\u00e7\u00f5"}es
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
        <p className="ds-subsection-desc">
          Refer{"\u00ea"}ncia de todas as classes de tags e chips, incluindo variantes de cor e estado.
        </p>
        <table className="ds-token-table">
          <thead>
            <tr><th>Classe</th><th>Descri{"\u00e7\u00e3"}o</th></tr>
          </thead>
          <tbody>
            {[
              { cls: '.tag-domain', desc: 'Pill com padding 4px 12px, font 600 12px \u2014 identifica dom\u00ednio cl\u00ednico' },
              { cls: '.tag-status', desc: 'Retangular, font 700 10px uppercase \u2014 n\u00edvel de acesso' },
              { cls: '.tag-abbr', desc: 'Quadrado arredondado, font 700 18px \u2014 sigla m\u00e9dica' },
              { cls: '.tag-count', desc: 'Badge num\u00e9rico, fundo elevated \u2014 contagem de itens' },
              { cls: '.chip', desc: 'Filtro interativo, radius pill, borda \u2014 toque para ativar' },
              { cls: '.chip.active', desc: 'Chip ativo: fundo primary, texto branco' },
              { cls: '.urg, .dil, .calc, ...', desc: 'Cor de dom\u00ednio (background + texto)' },
              { cls: '.tag-status.premium', desc: 'Fundo primary, texto branco \u2014 conte\u00fado pago' },
              { cls: '.tag-status.experimentando', desc: 'Fundo success-bg, texto success \u2014 per\u00edodo trial' },
              { cls: '.tag-status.free', desc: 'Fundo elevated, texto fg-2 \u2014 acesso gratuito' },
              { cls: '.tag-dismissible', desc: 'Tag com padding-right reduzido para bot\u00e3o X' },
              { cls: '.tag-x', desc: 'Bot\u00e3o X dentro da tag: 16px, opacidade 0.6, hover 1' },
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
