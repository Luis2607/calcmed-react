import DSPanel from '../DSPanel'

const domainTags = [
  { cls: 'urg', label: 'Urgências' },
  { cls: 'dil', label: 'Diluições' },
  { cls: 'calc', label: 'Calculadoras' },
  { cls: 'prot', label: 'Protocolos' },
  { cls: 'esc', label: 'Escores' },
  { cls: 'conv', label: 'Conversores' },
]

const statusTags = [
  { cls: 'premium', label: 'PREMIUM' },
  { cls: 'teste', label: 'TESTE' },
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
        Tags e chips são elementos de categorização e filtragem essenciais para a navegação médica.
        As tags de domínio identificam a categoria clínica de cada ferramenta (Urgências, Diluições,
        Calculadoras, etc.) com cores únicas por domínio.
      </p>
      <p className="ds-section-desc">
        As tags de status indicam o nível de acesso
        do usuário (Premium, Gratuito, Teste). Os chips funcionam como filtros interativos
        que o médico ativa/desativa para refinar buscas. Em contexto de plantão, essa categorização
        visual acelera a localização da ferramenta certa.
      </p>

      {/* Quando usar */}
      <div className="ds-subsection">
        <h3>Quando usar</h3>
        <div className="flex gap-8 mb-6">
          <div className="flex-1">
            <div className="t-texto-badge text-success mb-3" style={{ textTransform: 'uppercase', letterSpacing: 1 }}>Use quando</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li className="flex gap-2 items-start mb-2"><i className="ph ph-check-circle" style={{ color: 'var(--success)', flexShrink: 0, marginTop: 2 }} /><span className="t-corpo-2">Precisar identificar a categoria clínica de uma ferramenta. Use tag-domain</span></li>
              <li className="flex gap-2 items-start mb-2"><i className="ph ph-check-circle" style={{ color: 'var(--success)', flexShrink: 0, marginTop: 2 }} /><span className="t-corpo-2">Comunicar o nível de acesso (Premium, Free, Trial). Use tag-status</span></li>
              <li className="flex gap-2 items-start mb-2"><i className="ph ph-check-circle" style={{ color: 'var(--success)', flexShrink: 0, marginTop: 2 }} /><span className="t-corpo-2">Permitir filtragem interativa na busca ou listagem de escores. Use chip</span></li>
            </ul>
          </div>
          <div className="flex-1">
            <div className="t-texto-badge text-danger mb-3" style={{ textTransform: 'uppercase', letterSpacing: 1 }}>Não use quando</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li className="flex gap-2 items-start mb-2"><i className="ph ph-x-circle" style={{ color: 'var(--danger)', flexShrink: 0, marginTop: 2 }} /><span className="t-corpo-2">Misturar tags e chips para o mesmo propósito. Tags categorizam, chips filtram</span></li>
              <li className="flex gap-2 items-start mb-2"><i className="ph ph-x-circle" style={{ color: 'var(--danger)', flexShrink: 0, marginTop: 2 }} /><span className="t-corpo-2">Usar tag-domain como botão de ação. Tags são informativas, não interativas</span></li>
              <li className="flex gap-2 items-start mb-2"><i className="ph ph-x-circle" style={{ color: 'var(--danger)', flexShrink: 0, marginTop: 2 }} /><span className="t-corpo-2">Usar chip onde tag-status seria o correto. Status é informativo, chip é interativo</span></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Domain Tags */}
      <div className="ds-subsection">
        <h3>Tag de Domínio</h3>
        <p className="ds-subsection-desc">
          Cada domínio clínico tem uma cor exclusiva. A tag aparece nos cards de funcionalidade
          e nos resultados de busca para orientação rápida. Formato pill com font 600 12px.
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
          Comunicam o nível de acesso de cada funcionalidade. {"\u201c"}PREMIUM{"\u201d"} indica conteúdo bloqueado,
          {"\u201c"}TESTE{"\u201d"} mostra que o usuário está em período de teste, {"\u201c"}GRATUITO{"\u201d"} confirma
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
        <h3>Tag de Abreviação</h3>
        <p className="ds-subsection-desc">
          Exibem siglas médicas conhecidas (IOT, GCS, CrCl) em formato compacto dentro dos cards.
          Usam a cor do domínio correspondente. Formato quadrado arredondado, font 700 18px.
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
          Badge numérico para indicar quantidade de itens (ex: resultados de busca, favoritos,
          notificações). Fundo elevated com número centralizado. Valores acima de 99 exibem {"\u201c"}99+{"\u201d"}.
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
          Filtros interativos que o médico toca para refinar resultados. O chip ativo recebe fundo
          primary com texto branco. Chips de domínio herdam a cor da categoria.
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
              <div className="ds-demo-label">Coloridos por Domínio</div>
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
        <h3>Tag Dispensável</h3>
        <p className="ds-subsection-desc">
          Tags com botão de remoção (X) para filtros ativos que o usuário pode descartar.
          Usadas quando múltiplos filtros estão aplicados simultaneamente.
        </p>
        <DSPanel>
          <div className="ds-demo-row">
            <span className="chip active tag-dismissible">
              Urgências
              <button className="tag-x"><i className="ph ph-x" /></button>
            </span>
            <span className="chip tag-dismissible">
              Diluições
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
          Referência de todas as classes de tags e chips, incluindo variantes de cor e estado.
        </p>
        <table className="ds-token-table">
          <thead>
            <tr><th>Classe</th><th>Descrição</th></tr>
          </thead>
          <tbody>
            {[
              { cls: '.tag-domain', desc: 'Pill com padding 4px 12px, font 600 12px \u2014 identifica domínio clínico' },
              { cls: '.tag-status', desc: 'Retangular, font 700 10px uppercase \u2014 nível de acesso' },
              { cls: '.tag-abbr', desc: 'Quadrado arredondado, font 700 18px \u2014 sigla médica' },
              { cls: '.tag-count', desc: 'Badge numérico, fundo elevated \u2014 contagem de itens' },
              { cls: '.chip', desc: 'Filtro interativo, radius pill, borda \u2014 toque para ativar' },
              { cls: '.chip.active', desc: 'Chip ativo: fundo primary, texto branco' },
              { cls: '.urg, .dil, .calc, ...', desc: 'Cor de domínio (background + texto)' },
              { cls: '.tag-status.premium', desc: 'Fundo primary, texto branco \u2014 conteúdo pago' },
              { cls: '.tag-status.teste', desc: 'Fundo success-bg, texto success \u2014 período teste' },
              { cls: '.tag-status.free', desc: 'Fundo elevated, texto fg-2 \u2014 acesso gratuito' },
              { cls: '.tag-dismissible', desc: 'Tag com padding-right reduzido para botão X' },
              { cls: '.tag-x', desc: 'Botão X dentro da tag: 16px, opacidade 0.6, hover 1' },
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
