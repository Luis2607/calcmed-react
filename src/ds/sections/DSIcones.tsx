import DSPanel from '../DSPanel'

const iconCategories = [
  {
    title: 'Navegacao',
    desc: 'Icones usados na navbar principal, navegacao entre telas e controles direcionais.',
    icons: ['house', 'magnifying-glass', 'calendar-blank', 'sparkle', 'list', 'arrow-left', 'caret-right', 'caret-down', 'x', 'arrow-right'],
  },
  {
    title: 'Acoes',
    desc: 'Icones para acoes do usuario como criar, editar, excluir, copiar e compartilhar conteudo.',
    icons: ['plus', 'minus', 'check', 'trash', 'pencil-simple', 'copy', 'share', 'download', 'upload', 'star'],
  },
  {
    title: 'Feedback',
    desc: 'Icones de alertas clinicos e estados do sistema. Essenciais para comunicar gravidade e seguranca ao profissional de saude.',
    icons: ['warning', 'info', 'check-circle', 'x-circle', 'shield-check', 'siren', 'heartbeat', 'first-aid'],
  },
  {
    title: 'Dominios Clinicos',
    desc: 'Icones que representam cada dominio medico do CalcMed: urgencias, diluicoes, calculadoras, protocolos, escores e conversores.',
    icons: ['syringe', 'drop', 'calculator', 'clipboard-text', 'chart-line', 'arrows-left-right', 'pill', 'thermometer'],
  },
  {
    title: 'Interface',
    desc: 'Icones de controle da interface: visibilidade, notificacoes, configuracoes, perfil e filtros.',
    icons: ['eye', 'eye-slash', 'bell', 'gear', 'sign-out', 'user', 'crown', 'bookmark-simple', 'clock', 'funnel'],
  },
  {
    title: 'Comunicacao',
    desc: 'Icones para funcionalidades de chat, mensagens, envio e ajuda contextual.',
    icons: ['chat-circle', 'envelope', 'paper-plane-tilt', 'question', 'lightbulb'],
  },
]

export default function DSIcones() {
  return (
    <div>
      <h2 className="ds-section-title">Icones</h2>
      <p className="ds-section-desc">
        O CalcMed usa a biblioteca Phosphor Icons no peso Regular como padrao. Icones sao fundamentais
        para a navegacao rapida em contexto de urgencia, permitindo que o profissional identifique
        funcoes sem precisar ler rotulos. O tamanho padrao e 24x24px, com cor herdada do elemento pai
        via currentColor. Todos os icones sao carregados via CDN usando a classe{' '}
        <span className="ds-token">ph ph-[nome]</span>.
      </p>

      <div className="ds-subsection">
        <h3>Tamanhos</h3>
        <p className="t-corpo-2 text-fg-2 mb-3">
          Cinco tamanhos disponiveis, de 16px (detalhes e badges) ate 40px (destaque em telas de
          resultado). O tamanho padrao de 24px atende ao touch target minimo quando combinado com
          padding adequado.
        </p>
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
                <div className="t-texto-badge text-fg-2 mt-1">.{s.cls}</div>
                <div className="t-valor-mono text-fg-3" style={{ fontSize: 10 }}>{s.px}</div>
              </div>
            ))}
          </div>
        </DSPanel>
      </div>

      {iconCategories.map(cat => (
        <div className="ds-subsection" key={cat.title}>
          <h3>{cat.title}</h3>
          <p className="t-corpo-2 text-fg-2 mb-3">{cat.desc}</p>
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
        <p className="t-corpo-2 text-fg-2 mb-3">
          Cada dominio clinico tem uma cor semantica associada. Use as classes utilitarias abaixo
          para colorir icones de acordo com o dominio. As cores se adaptam automaticamente entre
          Light e Dark mode.
        </p>
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
                <i className={`ph ph-${d.icon} ${d.cls} icon-lg`} />
                <div className="t-texto-badge text-fg-2 mt-1">.{d.cls}</div>
                <div className="t-legenda text-fg-3">{d.domain}</div>
              </div>
            ))}
          </div>
        </DSPanel>
      </div>

      <div className="ds-subsection">
        <h3>Diretrizes de Uso</h3>
        <p className="t-corpo-2 text-fg-2 mb-3">
          Regras para manter consistencia visual e acessibilidade na iconografia do CalcMed.
        </p>
        <div className="ds-guideline do">
          <div className="ds-guideline-label">Fazer</div>
          <p>
            Usar a classe <span className="ds-token">ph ph-[nome]</span> com peso Regular.
            Tamanho padrao 24px. Aplicar cor via classe utilitaria (text-fg, icon-urg, etc.) ou heranca de currentColor.
          </p>
        </div>
        <div className="ds-guideline dont">
          <div className="ds-guideline-label">Nao Fazer</div>
          <p>
            Usar emojis como icones. Misturar pesos (Bold, Fill) sem justificativa clinica.
            Usar icones menores que 16px. Aplicar cor diretamente via style inline.
          </p>
        </div>
      </div>
    </div>
  )
}
