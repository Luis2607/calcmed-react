const iconCategories = [
  {
    title: 'Navegacao',
    icons: ['house', 'magnifying-glass', 'calendar-blank', 'sparkle', 'list', 'arrow-left', 'caret-right', 'caret-down', 'x', 'arrow-right'],
  },
  {
    title: 'Acoes',
    icons: ['plus', 'minus', 'check', 'trash', 'pencil-simple', 'copy', 'share', 'download', 'upload', 'star'],
  },
  {
    title: 'Feedback',
    icons: ['warning', 'info', 'check-circle', 'x-circle', 'shield-check', 'siren', 'heartbeat', 'first-aid'],
  },
  {
    title: 'Dominios Clinicos',
    icons: ['syringe', 'drop', 'calculator', 'clipboard-text', 'chart-line', 'arrows-left-right', 'pill', 'thermometer'],
  },
  {
    title: 'Interface',
    icons: ['eye', 'eye-slash', 'bell', 'gear', 'sign-out', 'user', 'crown', 'bookmark-simple', 'clock', 'funnel'],
  },
  {
    title: 'Comunicacao',
    icons: ['chat-circle', 'envelope', 'paper-plane-tilt', 'question', 'lightbulb'],
  },
]

export default function DSIcones() {
  return (
    <div>
      <h2 className="ds-section-title">Icones</h2>
      <p className="ds-section-desc">
        Phosphor Icons, peso Regular. Tamanho fixo 24x24px. Cor herdada do parent via currentColor.
        Icones sao carregados via CDN (classe ph ph-[nome]).
      </p>

      <div className="ds-subsection">
        <h3>Tamanhos</h3>
        <div style={{ display: 'flex', gap: 24, alignItems: 'end', marginBottom: 24 }}>
          {[
            { cls: 'icon-sm', px: '16px' },
            { cls: 'icon-md', px: '20px' },
            { cls: 'icon-lg', px: '24px (padrao)' },
            { cls: 'icon-xl', px: '32px' },
            { cls: 'icon-2xl', px: '40px' },
          ].map(s => (
            <div key={s.cls} style={{ textAlign: 'center' }}>
              <i className={`ph ph-heart ${s.cls}`} style={{ color: 'var(--fg)' }} />
              <div style={{ font: "500 11px 'JetBrains Mono'", color: 'var(--fg-2)', marginTop: 4 }}>.{s.cls}</div>
              <div style={{ font: "400 10px 'JetBrains Mono'", color: 'var(--fg-3)' }}>{s.px}</div>
            </div>
          ))}
        </div>
      </div>

      {iconCategories.map(cat => (
        <div className="ds-subsection" key={cat.title}>
          <h3>{cat.title}</h3>
          <div className="ds-icon-grid">
            {cat.icons.map(name => (
              <div className="ds-icon-item" key={name}>
                <i className={`ph ph-${name}`} />
                <span className="iname">{name}</span>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="ds-subsection">
        <h3>Cores de Dominio</h3>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          {[
            { cls: 'icon-urg', domain: 'Urgencias', icon: 'syringe' },
            { cls: 'icon-dil', domain: 'Diluicoes', icon: 'drop' },
            { cls: 'icon-calc', domain: 'Calculadoras', icon: 'calculator' },
            { cls: 'icon-prot', domain: 'Protocolos', icon: 'clipboard-text' },
            { cls: 'icon-esc', domain: 'Escores', icon: 'chart-line' },
            { cls: 'icon-conv', domain: 'Conversores', icon: 'arrows-left-right' },
          ].map(d => (
            <div key={d.cls} style={{ textAlign: 'center' }}>
              <i className={`ph ph-${d.icon} ${d.cls}`} style={{ fontSize: 24 }} />
              <div style={{ font: "500 11px 'Inter'", color: 'var(--fg-2)', marginTop: 4 }}>.{d.cls}</div>
              <div style={{ font: "400 10px 'Inter'", color: 'var(--fg-3)' }}>{d.domain}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="ds-subsection">
        <h3>Uso</h3>
        <div className="ds-guideline do">
          <div className="ds-guideline-label">Fazer</div>
          <p>Usar classe ph ph-[nome] com peso Regular. Tamanho padrao 24px. Cor via classe utilitaria ou heranca.</p>
        </div>
        <div className="ds-guideline dont">
          <div className="ds-guideline-label">Nao Fazer</div>
          <p>Usar emojis como icones. Misturar pesos (Bold, Fill) sem justificativa. Usar icones menores que 16px.</p>
        </div>
      </div>
    </div>
  )
}
