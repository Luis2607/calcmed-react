import DSPanel from '../DSPanel'

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
        <DSPanel title="Escala de tamanhos">
          <div className="flex gap-6 items-end mb-6">
            {[
              { cls: 'icon-sm', px: '16px' },
              { cls: 'icon-md', px: '20px' },
              { cls: 'icon-lg', px: '24px (padrao)' },
              { cls: 'icon-xl', px: '32px' },
              { cls: 'icon-2xl', px: '40px' },
            ].map(s => (
              <div key={s.cls} className="text-center">
                <i className={`ph ph-heart ${s.cls} text-fg`} />
                <div className="t-texto-badge text-fg-2 mt-1" style={{ fontFamily: "'JetBrains Mono'", fontWeight: 500 }}>.{s.cls}</div>
                <div className="t-texto-badge text-fg-3" style={{ fontFamily: "'JetBrains Mono'", fontWeight: 400, fontSize: 10 }}>{s.px}</div>
              </div>
            ))}
          </div>
        </DSPanel>
      </div>

      {iconCategories.map(cat => (
        <div className="ds-subsection" key={cat.title}>
          <h3>{cat.title}</h3>
          <DSPanel title={cat.title}>
            <div className="ds-icon-grid">
              {cat.icons.map(name => (
                <div className="ds-icon-item" key={name}>
                  <i className={`ph ph-${name}`} />
                  <span className="iname">{name}</span>
                </div>
              ))}
            </div>
          </DSPanel>
        </div>
      ))}

      <div className="ds-subsection">
        <h3>Cores de Dominio</h3>
        <DSPanel title="Icones por dominio">
          <div className="flex gap-6 flex-wrap">
            {[
              { cls: 'icon-urg', domain: 'Urgencias', icon: 'syringe' },
              { cls: 'icon-dil', domain: 'Diluicoes', icon: 'drop' },
              { cls: 'icon-calc', domain: 'Calculadoras', icon: 'calculator' },
              { cls: 'icon-prot', domain: 'Protocolos', icon: 'clipboard-text' },
              { cls: 'icon-esc', domain: 'Escores', icon: 'chart-line' },
              { cls: 'icon-conv', domain: 'Conversores', icon: 'arrows-left-right' },
            ].map(d => (
              <div key={d.cls} className="text-center">
                <i className={`ph ph-${d.icon} ${d.cls}`} style={{ fontSize: 24 }} />
                <div className="t-texto-badge text-fg-2 mt-1" style={{ fontWeight: 500 }}>.{d.cls}</div>
                <div className="t-texto-badge text-fg-3" style={{ fontWeight: 400, fontSize: 10 }}>{d.domain}</div>
              </div>
            ))}
          </div>
        </DSPanel>
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
