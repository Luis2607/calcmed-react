import DSPanel from '../DSPanel'

function CardFeatureDemo({ state, label }: { state: string; label: string }) {
  const stateClass = state === 'locked' ? 'locked' : state === 'trial' ? 'trial' : ''
  return (
    <div className="text-center" style={{ width: 140 }}>
      <div className={`card-feature ${stateClass} mb-2`}>
        {state === 'premium' && (
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
      <span className="t-texto-badge text-fg-3" style={{ fontWeight: 500 }}>{label}</span>
    </div>
  )
}

export default function DSCards() {
  return (
    <div>
      <h2 className="ds-section-title">Cards</h2>
      <p className="ds-section-desc">
        4 estados de card. Quanto mais paga, mais limpa a interface.
        Free = sem restricao visual. Premium = overlay + lock. Trial = borda dashed. Assinante = limpo.
      </p>

      {/* Card Feature - 4 states */}
      <div className="ds-subsection">
        <h3>Card Feature — 4 Estados</h3>
        <DSPanel>
          <div className="ds-demo-row" style={{ alignItems: 'flex-start' }}>
            <CardFeatureDemo state="free" label="Gratuito" />
            <CardFeatureDemo state="locked" label="Premium Bloqueado" />
            <CardFeatureDemo state="trial" label="Degustacao" />
            <CardFeatureDemo state="subscriber" label="Assinante" />
          </div>
        </DSPanel>
      </div>

      {/* Card Selection */}
      <div className="ds-subsection">
        <h3>Card Selection (Onboarding)</h3>
        <DSPanel>
          <div className="flex flex-col gap-3">
            <div className="card-selection selected">
              <div className="icon-circle"><i className="ph ph-syringe" /></div>
              <span className="card-text">Emergencia</span>
            </div>
            <div className="card-selection">
              <div className="icon-circle"><i className="ph ph-heartbeat" /></div>
              <span className="card-text">Terapia Intensiva</span>
            </div>
            <div className="card-selection">
              <div className="icon-circle"><i className="ph ph-first-aid" /></div>
              <span className="card-text">Clinica Medica</span>
            </div>
          </div>
        </DSPanel>
      </div>

      {/* Card Recent */}
      <div className="ds-subsection">
        <h3>Card Recent</h3>
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
        <h3>Card Favorite (Meu Plantao)</h3>
        <DSPanel>
          <div className="flex gap-3">
            <div className="card-favorite" style={{ width: 140 }}>
              <span className="fav-abbr" style={{ color: 'var(--dom-urg)' }}>IOT</span>
              <span className="fav-name">Seq. Rapida Intubacao</span>
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
        <DSPanel>
          <div className="banner-editorial">
            <div className="banner-tag">Novidade</div>
            <div className="banner-title">CalcMed IA: seu copiloto clinico</div>
            <div className="banner-desc">Tire duvidas sobre doses e protocolos com inteligencia artificial.</div>
          </div>
        </DSPanel>
      </div>

      {/* Plan Card */}
      <div className="ds-subsection">
        <h3>Plan Card (Checkout)</h3>
        <DSPanel>
          <div className="flex gap-3">
            <div className="plan-card selected flex-1">
              <span className="tag-status premium plan-badge">MELHOR VALOR</span>
              <div className="t-subtitulo text-fg mb-1 mt-2">Anual</div>
              <div className="t-preco-destaque">R$ 29,90<span className="t-corpo-2 text-fg-3">/mes</span></div>
            </div>
            <div className="plan-card flex-1">
              <div className="t-subtitulo text-fg mb-1">Mensal</div>
              <div className="t-preco">R$ 49,90<span className="t-corpo-2 text-fg-3">/mes</span></div>
            </div>
          </div>
        </DSPanel>
      </div>

      {/* Card Feature Mini */}
      <div className="ds-subsection">
        <h3>Card Feature Mini</h3>
        <DSPanel>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 80px)' }} className="gap-2">
            <div className="card-feature-mini">
              <i className="mini-icon ph ph-heartbeat icon-urg" />
              <span className="mini-name">Seq. Rapida</span>
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

      {/* Classes */}
      <div className="ds-subsection">
        <h3>Classes CSS</h3>
        <table className="ds-token-table">
          <thead>
            <tr><th>Classe</th><th>Descricao</th></tr>
          </thead>
          <tbody>
            {[
              { cls: '.card-feature', desc: 'Card de funcionalidade com icone + nome' },
              { cls: '.card-feature.locked', desc: 'Overlay escuro, pointer-events none' },
              { cls: '.card-feature.trial', desc: 'Borda dashed' },
              { cls: '.card-selection', desc: 'Card de selecao (onboarding), min-h 64px' },
              { cls: '.card-selection.selected', desc: 'Borda 2px teal' },
              { cls: '.card-recent', desc: 'Item horizontal com icone, nome e tempo' },
              { cls: '.card-favorite', desc: 'Card vertical com abbr e nome' },
              { cls: '.banner-editorial', desc: 'Banner gradiente teal com tag + titulo' },
              { cls: '.plan-card', desc: 'Card de plano com borda e preco' },
              { cls: '.plan-card.selected', desc: 'Borda 2px teal, badge posicionado' },
              { cls: '.card-feature-mini', desc: 'Card mini 80px: flex column, icone + nome, fundo elevated' },
              { cls: '.mini-icon', desc: 'Icone 24px do card mini' },
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
