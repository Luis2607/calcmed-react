import DSPanel from '../DSPanel'

function CardFeatureDemo({ state, label, description, saved }: { state: string; label: string; description: string; saved?: boolean }) {
  const stateClass = state === 'locked' ? 'locked' : state === 'trial' ? 'trial' : ''
  return (
    <div style={{ width: 160 }}>
      <div className={`card-feature ${stateClass} mb-2`}>
        {state === 'locked' && <span className="tag-status premium">PREMIUM</span>}
        {state === 'trial' && <span className="tag-status teste">TESTE</span>}
        <span className="tag-abbr calc">CrCl</span>
        <span className="feat-name">Clearance de Creatinina</span>
        <button className={`feat-bookmark ${saved ? 'saved' : ''}`}>
          <i className={`ph ${saved ? 'ph-bookmark-simple-fill' : 'ph-bookmark-simple'}`} />
        </button>
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
        Cards são os containers visuais que apresentam funcionalidades, favoritos, histórico e planos
        ao médico. No CalcMed, a regra de ouro é: quanto mais o usuário paga, mais limpa fica a
        interface.
      </p>
      <p className="ds-section-desc">
        Isso se traduz em 4 estados distintos que comunicam visualmente o nível de acesso,
        sem necessidade de leitura. O médico identifica instantaneamente o que pode usar, o que está
        bloqueado e o que está em período de teste.
      </p>

      {/* Quando usar */}
      <div className="ds-subsection">
        <h3>Quando usar</h3>
        <div className="flex gap-8 mb-6">
          <div className="flex-1">
            <div className="t-texto-badge text-success mb-3" style={{ textTransform: 'uppercase', letterSpacing: 1 }}>Use quando</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li className="flex gap-2 items-start mb-2"><i className="ph ph-check-circle" style={{ color: 'var(--success)', flexShrink: 0, marginTop: 2 }} /><span className="t-corpo-2">Exibir ferramentas clínicas em categorias. Use card-feature</span></li>
              <li className="flex gap-2 items-start mb-2"><i className="ph ph-check-circle" style={{ color: 'var(--success)', flexShrink: 0, marginTop: 2 }} /><span className="t-corpo-2">Listar ferramentas dentro de categorias colapsadas. Use card-feature-mini</span></li>
              <li className="flex gap-2 items-start mb-2"><i className="ph ph-check-circle" style={{ color: 'var(--success)', flexShrink: 0, marginTop: 2 }} /><span className="t-corpo-2">Permitir seleção durante o onboarding. Use card-selection</span></li>
            </ul>
          </div>
          <div className="flex-1">
            <div className="t-texto-badge text-danger mb-3" style={{ textTransform: 'uppercase', letterSpacing: 1 }}>Não use quando</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li className="flex gap-2 items-start mb-2"><i className="ph ph-x-circle" style={{ color: 'var(--danger)', flexShrink: 0, marginTop: 2 }} /><span className="t-corpo-2">O conteúdo não for clínico. card-feature é exclusivo para ferramentas médicas</span></li>
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
          O card de funcionalidade é o componente mais presente no app. Seus 4 estados refletem a
          estratégia de monetização: Free (sem restrição visual, acesso completo), Premium Bloqueado
          (overlay escuro + ícone de cadeado + tag "PREMIUM", indica conteúdo pago).
        </p>
        <p className="ds-subsection-desc">
          Teste
          (borda tracejada + tag "TRIAL", usuário está em teste por tempo limitado) e Assinante
          (visual limpo, sem tags nem overlays — a melhor experiência).
        </p>
        <DSPanel>
          <div className="ds-demo-row" style={{ alignItems: 'flex-start' }}>
            <CardFeatureDemo
              state="free"
              label="Gratuito"
              description="Sem restrição visual. Acesso livre a todos."
            />
            <CardFeatureDemo
              state="locked"
              label="Premium Bloqueado"
              description="Overlay escuro + cadeado. Requer assinatura."
            />
            <CardFeatureDemo
              state="trial"
              label="Teste"
              description="Borda tracejada. Acesso temporário limitado."
            />
            <CardFeatureDemo
              state="subscriber"
              label="Assinante"
              description="Interface limpa. Melhor experiência possível."
            />
          </div>
        </DSPanel>
      </div>

      {/* Card Selection */}
      <div className="ds-subsection">
        <h3>Card de Seleção (Onboarding)</h3>
        <p className="ds-subsection-desc">
          Usado durante o onboarding para o médico escolher sua especialidade. O card selecionado
          recebe borda 2px teal. Altura mínima de 64px para touch target adequado.
        </p>
        <DSPanel>
          <div className="flex flex-col gap-3">
            <div className="card-selection selected">
              <div className="icon-circle"><i className="ph ph-syringe" /></div>
              <span className="card-text">Emergência</span>
            </div>
            <div className="card-selection">
              <div className="icon-circle"><i className="ph ph-heartbeat" /></div>
              <span className="card-text">Terapia Intensiva</span>
            </div>
            <div className="card-selection">
              <div className="icon-circle"><i className="ph ph-first-aid" /></div>
              <span className="card-text">Clínica Médica</span>
            </div>
          </div>
        </DSPanel>
      </div>

      {/* Card Recent */}
      <div className="ds-subsection">
        <h3>Card de Recentes</h3>
        <p className="ds-subsection-desc">
          Exibe as últimas ferramentas acessadas com ícone de relógio, nome e tempo decorrido.
          Permite ao médico retomar rapidamente um cálculo recente durante o plantão.
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

      {/* Banner Editorial */}
      <div className="ds-subsection">
        <h3>Banner Editorial</h3>
        <p className="ds-subsection-desc">
          Banner com gradiente teal para comunicações editoriais na Home: novidades, lançamentos
          e destaques do app (ex: "CalcMed IA: seu copiloto clínico"). Inclui tag, título e descrição.
        </p>
        <DSPanel>
          <div className="banner-editorial">
            <div className="banner-body">
              <div className="banner-tag">Novidade</div>
              <div className="banner-title">CalcMed IA: seu copiloto clínico</div>
              <div className="banner-desc">Tire dúvidas sobre doses e protocolos com inteligência artificial.</div>
            </div>
            <div className="banner-chevron" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M7.5 4.5L13 10L7.5 15.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
          </div>
        </DSPanel>
      </div>

      {/* Plan Card */}
      <div className="ds-subsection">
        <h3>Card de Plano (Checkout)</h3>
        <p className="ds-subsection-desc">
          Cards de seleção de plano na tela de checkout. O plano selecionado recebe borda 2px teal
          e badge "MELHOR VALOR". O plano anual é o padrão selecionado (decisão de negócio confirmada).
        </p>
        <DSPanel>
          <div className="flex gap-3">
            <div className="plan-card selected flex-1">
              <span className="tag-status premium plan-badge">MELHOR VALOR</span>
              <div className="t-subtitulo text-fg mb-1 mt-2">Anual</div>
              <div className="t-preco-destaque">R$ 29,90<span className="t-corpo-2 text-fg-3">/mês</span></div>
            </div>
            <div className="plan-card flex-1">
              <div className="t-subtitulo text-fg mb-1">Mensal</div>
              <div className="t-preco">R$ 49,90<span className="t-corpo-2 text-fg-3">/mês</span></div>
            </div>
          </div>
        </DSPanel>
      </div>

      {/* Card Feature Mini */}
      <div className="ds-subsection">
        <h3>Card Feature Mini</h3>
        <p className="ds-subsection-desc">
          Versão compacta (80px) do card de funcionalidade para grids densos. Exibe ícone e nome
          em formato vertical. Usado em seções como "Todas as calculadoras" onde o espaço é limitado.
        </p>
        <DSPanel>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 80px)' }} className="gap-2">
            <div className="card-feature-mini">
              <i className="mini-icon ph ph-heartbeat icon-urg" />
              <span className="mini-name">Seq. Rápida</span>
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

      {/* Boas Práticas */}
      <div className="ds-subsection">
        <h3>Boas Práticas</h3>
        <p className="ds-subsection-desc">A hierarquia visual dos cards comunica acesso sem que o médico precise ler.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <div className="t-texto-badge text-success mb-3" style={{ textTransform: 'uppercase', letterSpacing: 1 }}>Faça</div>
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
            <div className="t-texto-badge text-danger mb-3" style={{ textTransform: 'uppercase', letterSpacing: 1 }}>Não faça</div>
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
          Referência de todas as classes de cards, incluindo estados de acesso e variantes.
        </p>
        <table className="ds-token-table">
          <thead>
            <tr><th>Classe</th><th>Descrição</th></tr>
          </thead>
          <tbody>
            {[
              { cls: '.card-feature', desc: 'Card de funcionalidade com ícone + nome' },
              { cls: '.card-feature.locked', desc: 'Premium bloqueado: overlay escuro, pointer-events none' },
              { cls: '.card-feature.trial', desc: 'Teste: borda tracejada (dashed)' },
              { cls: '.card-selection', desc: 'Card de seleção (onboarding), min-height 64px' },
              { cls: '.card-selection.selected', desc: 'Selecionado: borda 2px teal' },
              { cls: '.card-recent', desc: 'Item horizontal com ícone relógio, nome e tempo' },
              { cls: '.card-favorite', desc: 'Card vertical com abreviação e nome (Meu Plantão)' },
              { cls: '.banner-editorial', desc: 'Banner gradiente teal com tag + título + descrição' },
              { cls: '.plan-card', desc: 'Card de plano com borda e preço (Checkout)' },
              { cls: '.plan-card.selected', desc: 'Selecionado: borda 2px teal, badge posicionado' },
              { cls: '.card-feature-mini', desc: 'Card mini 80px: flex column, ícone + nome, fundo elevated' },
              { cls: '.mini-icon', desc: 'Ícone 24px do card mini' },
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
