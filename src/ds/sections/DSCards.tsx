import DSPanel from '../DSPanel'

function CardFeatureDemo({ state, label, description }: { state: string; label: string; description: string }) {
  const stateClass = state === 'locked' ? 'locked' : state === 'trial' ? 'trial' : ''
  return (
    <div className="text-center" style={{ width: 140 }}>
      <div className={`card-feature ${stateClass} mb-2`}>
        {state === 'locked' && (
          <span className="tag-status premium" style={{ position: 'absolute', top: 8, left: 8 }}>PREMIUM</span>
        )}
        {state === 'trial' && (
          <span className="tag-status experimentando" style={{ position: 'absolute', top: 8, left: 8 }}>TRIAL</span>
        )}
        <div className="mb-1" style={{ fontSize: 32 }}>
          <i className="ph ph-calculator" style={{ color: 'var(--dom-calc)' }} />
        </div>
        <div className="feat-name">CrCl Cockcroft</div>
        <button className="feat-bookmark"><i className="ph ph-bookmark-simple" /></button>
      </div>
      <span className="t-texto-badge text-fg-2" style={{ fontWeight: 600 }}>{label}</span>
      <div className="t-legenda text-fg-3 mt-1">{description}</div>
    </div>
  )
}

export default function DSCards() {
  return (
    <div>
      <h2 className="ds-section-title">Cards</h2>
      <p className="ds-section-desc">
        Cards s{"\u00e3"}o os containers visuais que apresentam funcionalidades, favoritos, hist{"\u00f3"}rico e planos
        ao m{"\u00e9"}dico. No CalcMed, a regra de ouro {"\u00e9"}: quanto mais o usu{"\u00e1"}rio paga, mais limpa fica a
        interface.
      </p>
      <p className="ds-section-desc">
        Isso se traduz em 4 estados distintos que comunicam visualmente o n{"\u00ed"}vel de acesso,
        sem necessidade de leitura. O m{"\u00e9"}dico identifica instantaneamente o que pode usar, o que est{"\u00e1"}
        bloqueado e o que est{"\u00e1"} em per{"\u00ed"}odo de teste.
      </p>

      {/* Quando usar */}
      <div className="ds-subsection">
        <h3>Quando usar</h3>
        <div className="flex gap-8 mb-6">
          <div className="flex-1">
            <div className="t-texto-badge text-success mb-3" style={{ textTransform: 'uppercase', letterSpacing: 1 }}>Use quando</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li className="flex gap-2 items-start mb-2"><i className="ph ph-check-circle" style={{ color: 'var(--success)', flexShrink: 0, marginTop: 2 }} /><span className="t-corpo-2">Exibir ferramentas cl{"\u00ed"}nicas em categorias. Use card-feature</span></li>
              <li className="flex gap-2 items-start mb-2"><i className="ph ph-check-circle" style={{ color: 'var(--success)', flexShrink: 0, marginTop: 2 }} /><span className="t-corpo-2">Listar ferramentas dentro de categorias colapsadas. Use card-feature-mini</span></li>
              <li className="flex gap-2 items-start mb-2"><i className="ph ph-check-circle" style={{ color: 'var(--success)', flexShrink: 0, marginTop: 2 }} /><span className="t-corpo-2">Permitir sele{"\u00e7\u00e3"}o durante o onboarding. Use card-selection</span></li>
            </ul>
          </div>
          <div className="flex-1">
            <div className="t-texto-badge text-danger mb-3" style={{ textTransform: 'uppercase', letterSpacing: 1 }}>N{"\u00e3"}o use quando</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li className="flex gap-2 items-start mb-2"><i className="ph ph-x-circle" style={{ color: 'var(--danger)', flexShrink: 0, marginTop: 2 }} /><span className="t-corpo-2">O conte{"\u00fa"}do n{"\u00e3"}o for cl{"\u00ed"}nico. card-feature {"\u00e9"} exclusivo para ferramentas m{"\u00e9"}dicas</span></li>
              <li className="flex gap-2 items-start mb-2"><i className="ph ph-x-circle" style={{ color: 'var(--danger)', flexShrink: 0, marginTop: 2 }} /><span className="t-corpo-2">Usar card-feature-mini fora de categorias colapsadas. Ele depende do contexto visual</span></li>
              <li className="flex gap-2 items-start mb-2"><i className="ph ph-x-circle" style={{ color: 'var(--danger)', flexShrink: 0, marginTop: 2 }} /><span className="t-corpo-2">Mostrar tag Premium para assinantes. O card do assinante deve ser completamente limpo</span></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Card Feature - 4 states */}
      <div className="ds-subsection">
        <h3>Card Feature — 4 Estados de Acesso</h3>
        <p className="ds-subsection-desc">
          O card de funcionalidade {"\u00e9"} o componente mais presente no app. Seus 4 estados refletem a
          estrat{"\u00e9"}gia de monetiza{"\u00e7\u00e3"}o: Free (sem restri{"\u00e7\u00e3"}o visual, acesso completo), Premium Bloqueado
          (overlay escuro + {"\u00ed"}cone de cadeado + tag {"\u201c"}PREMIUM{"\u201d"}, indica conte{"\u00fa"}do pago).
        </p>
        <p className="ds-subsection-desc">
          Degusta{"\u00e7\u00e3"}o
          (borda tracejada + tag {"\u201c"}TRIAL{"\u201d"}, usu{"\u00e1"}rio est{"\u00e1"} experimentando por tempo limitado) e Assinante
          (visual limpo, sem tags nem overlays — a melhor experi{"\u00ea"}ncia).
        </p>
        <DSPanel>
          <div className="ds-demo-row" style={{ alignItems: 'flex-start' }}>
            <CardFeatureDemo
              state="free"
              label="Gratuito"
              description="Sem restri\u00e7\u00e3o visual. Acesso livre a todos."
            />
            <CardFeatureDemo
              state="locked"
              label="Premium Bloqueado"
              description="Overlay escuro + cadeado. Requer assinatura."
            />
            <CardFeatureDemo
              state="trial"
              label="Degusta\u00e7\u00e3o"
              description="Borda tracejada. Acesso tempor\u00e1rio limitado."
            />
            <CardFeatureDemo
              state="subscriber"
              label="Assinante"
              description="Interface limpa. Melhor experi\u00eancia poss\u00edvel."
            />
          </div>
        </DSPanel>
      </div>

      {/* Card Selection */}
      <div className="ds-subsection">
        <h3>Card de Sele{"\u00e7\u00e3"}o (Onboarding)</h3>
        <p className="ds-subsection-desc">
          Usado durante o onboarding para o m{"\u00e9"}dico escolher sua especialidade. O card selecionado
          recebe borda 2px teal. Altura m{"\u00ed"}nima de 64px para touch target adequado.
        </p>
        <DSPanel>
          <div className="flex flex-col gap-3">
            <div className="card-selection selected">
              <div className="icon-circle"><i className="ph ph-syringe" /></div>
              <span className="card-text">Emerg{"\u00ea"}ncia</span>
            </div>
            <div className="card-selection">
              <div className="icon-circle"><i className="ph ph-heartbeat" /></div>
              <span className="card-text">Terapia Intensiva</span>
            </div>
            <div className="card-selection">
              <div className="icon-circle"><i className="ph ph-first-aid" /></div>
              <span className="card-text">Cl{"\u00ed"}nica M{"\u00e9"}dica</span>
            </div>
          </div>
        </DSPanel>
      </div>

      {/* Card Recent */}
      <div className="ds-subsection">
        <h3>Card de Recentes</h3>
        <p className="ds-subsection-desc">
          Exibe as {"\u00fa"}ltimas ferramentas acessadas com {"\u00ed"}cone de rel{"\u00f3"}gio, nome e tempo decorrido.
          Permite ao m{"\u00e9"}dico retomar rapidamente um c{"\u00e1"}lculo recente durante o plant{"\u00e3"}o.
        </p>
        <DSPanel>
          <div className="flex flex-col gap-2">
            <div className="card-recent">
              <i className="ph ph-clock recent-icon" />
              <span className="recent-name">Clearance Creatinina</span>
              <span className="recent-time">15 min</span>
            </div>
            <div className="card-recent">
              <i className="ph ph-clock recent-icon" />
              <span className="recent-name">Dose Noradrenalina</span>
              <span className="recent-time">1h</span>
            </div>
          </div>
        </DSPanel>
      </div>

      {/* Card Favorite */}
      <div className="ds-subsection">
        <h3>Card Favorito (Meu Plant{"\u00e3"}o)</h3>
        <p className="ds-subsection-desc">
          Cards verticais compactos para a se{"\u00e7\u00e3"}o {"\u201c"}Meu Plant{"\u00e3"}o{"\u201d"} na Home. O m{"\u00e9"}dico marca seus
          c{"\u00e1"}lculos e dilui{"\u00e7\u00f5"}es mais usados com o bookmark.
          A abrevia{"\u00e7\u00e3"}o usa a cor do dom{"\u00ed"}nio. O {"\u00ed"}cone preenchido (ph-fill) indica item salvo como favorito.
        </p>
        <DSPanel>
          <div className="flex gap-3">
            <div className="card-favorite" style={{ width: 140 }}>
              <span className="fav-abbr" style={{ color: 'var(--dom-urg)' }}>IOT</span>
              <span className="fav-name">Seq. R{"\u00e1"}pida Intuba{"\u00e7\u00e3"}o</span>
              <i className="ph-fill ph-bookmark-simple fav-bookmark saved" />
            </div>
            <div className="card-favorite" style={{ width: 140 }}>
              <span className="fav-abbr" style={{ color: 'var(--dom-calc)' }}>CrCl</span>
              <span className="fav-name">Cockcroft-Gault</span>
              <i className="ph ph-bookmark-simple fav-bookmark" />
            </div>
          </div>
        </DSPanel>
      </div>

      {/* Banner Editorial */}
      <div className="ds-subsection">
        <h3>Banner Editorial</h3>
        <p className="ds-subsection-desc">
          Banner com gradiente teal para comunica{"\u00e7\u00f5"}es editoriais na Home: novidades, lan{"\u00e7"}amentos
          e destaques do app (ex: {"\u201c"}CalcMed IA: seu copiloto cl{"\u00ed"}nico{"\u201d"}). Inclui tag, t{"\u00ed"}tulo e descri{"\u00e7\u00e3"}o.
        </p>
        <DSPanel>
          <div className="banner-editorial">
            <div className="banner-tag">Novidade</div>
            <div className="banner-title">CalcMed IA: seu copiloto cl{"\u00ed"}nico</div>
            <div className="banner-desc">Tire d{"\u00fa"}vidas sobre doses e protocolos com intelig{"\u00ea"}ncia artificial.</div>
          </div>
        </DSPanel>
      </div>

      {/* Plan Card */}
      <div className="ds-subsection">
        <h3>Card de Plano (Checkout)</h3>
        <p className="ds-subsection-desc">
          Cards de sele{"\u00e7\u00e3"}o de plano na tela de checkout. O plano selecionado recebe borda 2px teal
          e badge {"\u201c"}MELHOR VALOR{"\u201d"}. O plano anual {"\u00e9"} o padr{"\u00e3"}o selecionado (decis{"\u00e3"}o de neg{"\u00f3"}cio confirmada).
        </p>
        <DSPanel>
          <div className="flex gap-3">
            <div className="plan-card selected flex-1">
              <span className="tag-status premium plan-badge">MELHOR VALOR</span>
              <div className="t-subtitulo text-fg mb-1 mt-2">Anual</div>
              <div className="t-preco-destaque">R$ 29,90<span className="t-corpo-2 text-fg-3">/m{"\u00ea"}s</span></div>
            </div>
            <div className="plan-card flex-1">
              <div className="t-subtitulo text-fg mb-1">Mensal</div>
              <div className="t-preco">R$ 49,90<span className="t-corpo-2 text-fg-3">/m{"\u00ea"}s</span></div>
            </div>
          </div>
        </DSPanel>
      </div>

      {/* Card Feature Mini */}
      <div className="ds-subsection">
        <h3>Card Feature Mini</h3>
        <p className="ds-subsection-desc">
          Vers{"\u00e3"}o compacta (80px) do card de funcionalidade para grids densos. Exibe {"\u00ed"}cone e nome
          em formato vertical. Usado em se{"\u00e7\u00f5"}es como {"\u201c"}Todas as calculadoras{"\u201d"} onde o espa{"\u00e7"}o {"\u00e9"} limitado.
        </p>
        <DSPanel>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 80px)' }} className="gap-2">
            <div className="card-feature-mini">
              <i className="mini-icon ph ph-heartbeat icon-urg" />
              <span className="mini-name">Seq. R{"\u00e1"}pida</span>
            </div>
            <div className="card-feature-mini">
              <i className="mini-icon ph ph-drop icon-dil" />
              <span className="mini-name">Dobutamina</span>
            </div>
            <div className="card-feature-mini">
              <i className="mini-icon ph ph-calculator icon-calc" />
              <span className="mini-name">CrCl</span>
            </div>
            <div className="card-feature-mini">
              <i className="mini-icon ph ph-file-text icon-prot" />
              <span className="mini-name">ACLS</span>
            </div>
            <div className="card-feature-mini">
              <i className="mini-icon ph ph-chart-bar icon-esc" />
              <span className="mini-name">Glasgow</span>
            </div>
            <div className="card-feature-mini">
              <i className="mini-icon ph ph-arrows-left-right icon-conv" />
              <span className="mini-name">mEq/mL</span>
            </div>
          </div>
        </DSPanel>
      </div>

      {/* Boas Pr\u00e1ticas */}
      <div className="ds-subsection">
        <h3>Boas Pr{"\u00e1"}ticas</h3>
        <p className="ds-subsection-desc">A hierarquia visual dos cards comunica acesso sem que o m{"\u00e9"}dico precise ler.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <div className="t-texto-badge text-success mb-3" style={{ textTransform: 'uppercase', letterSpacing: 1 }}>Fa{"\u00e7"}a</div>
            {[
              'Card Premium Bloqueado: cadeado + opacidade reduzida',
              'Card Assinante: completamente limpo, sem tags',
              'Quanto mais paga, mais limpa a interface',
            ].map(d => (
              <div key={d} className="flex gap-2 items-start mb-2">
                <i className="ph ph-check-circle" style={{ color: 'var(--success)', flexShrink: 0, marginTop: 2 }} />
                <span className="t-corpo-2">{d}</span>
              </div>
            ))}
          </div>
          <div>
            <div className="t-texto-badge text-danger mb-3" style={{ textTransform: 'uppercase', letterSpacing: 1 }}>N{"\u00e3"}o fa{"\u00e7"}a</div>
            {[
              'Nunca mostrar tag Premium para assinantes',
              'Nunca usar card-feature-mini fora de categorias',
              'Nunca omitir o estado de favorito (estrela)',
            ].map(d => (
              <div key={d} className="flex gap-2 items-start mb-2">
                <i className="ph ph-x-circle" style={{ color: 'var(--danger)', flexShrink: 0, marginTop: 2 }} />
                <span className="t-corpo-2">{d}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Classes */}
      <div className="ds-subsection">
        <h3>Classes CSS</h3>
        <p className="ds-subsection-desc">
          Refer{"\u00ea"}ncia de todas as classes de cards, incluindo estados de acesso e variantes.
        </p>
        <table className="ds-token-table">
          <thead>
            <tr><th>Classe</th><th>Descri{"\u00e7\u00e3"}o</th></tr>
          </thead>
          <tbody>
            {[
              { cls: '.card-feature', desc: 'Card de funcionalidade com \u00edcone + nome' },
              { cls: '.card-feature.locked', desc: 'Premium bloqueado: overlay escuro, pointer-events none' },
              { cls: '.card-feature.trial', desc: 'Degusta\u00e7\u00e3o: borda tracejada (dashed)' },
              { cls: '.card-selection', desc: 'Card de sele\u00e7\u00e3o (onboarding), min-height 64px' },
              { cls: '.card-selection.selected', desc: 'Selecionado: borda 2px teal' },
              { cls: '.card-recent', desc: 'Item horizontal com \u00edcone rel\u00f3gio, nome e tempo' },
              { cls: '.card-favorite', desc: 'Card vertical com abrevia\u00e7\u00e3o e nome (Meu Plant\u00e3o)' },
              { cls: '.banner-editorial', desc: 'Banner gradiente teal com tag + t\u00edtulo + descri\u00e7\u00e3o' },
              { cls: '.plan-card', desc: 'Card de plano com borda e pre\u00e7o (Checkout)' },
              { cls: '.plan-card.selected', desc: 'Selecionado: borda 2px teal, badge posicionado' },
              { cls: '.card-feature-mini', desc: 'Card mini 80px: flex column, \u00edcone + nome, fundo elevated' },
              { cls: '.mini-icon', desc: '\u00cdcone 24px do card mini' },
              { cls: '.mini-name', desc: 'Nome: font 500 10px, cor fg-2' },
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
