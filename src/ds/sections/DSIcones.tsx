import DSPanel from '../DSPanel'

const iconCategories = [
  {
    title: 'Navegação',
    desc: 'Ícones usados na navbar principal, navegação entre telas e controles direcionais.',
    icons: ['house', 'magnifying-glass', 'calendar-blank', 'sparkle', 'list', 'arrow-left', 'caret-right', 'caret-down', 'x', 'arrow-right'],
  },
  {
    title: 'Ações',
    desc: 'Ícones para ações do usuário como criar, editar, excluir, copiar e compartilhar conteúdo.',
    icons: ['plus', 'minus', 'check', 'trash', 'pencil-simple', 'copy', 'share', 'download', 'upload', 'star'],
  },
  {
    title: 'Feedback',
    desc: 'Ícones de alertas clínicos e estados do sistema. Essenciais para comunicar gravidade e segurança ao profissional de saúde.',
    icons: ['warning', 'info', 'check-circle', 'x-circle', 'shield-check', 'siren', 'heartbeat', 'first-aid'],
  },
  {
    title: 'Domínios Clínicos',
    desc: 'Ícones que representam cada domínio médico do CalcMed: urgências, diluições, calculadoras, protocolos, escores e conversores.',
    icons: ['syringe', 'drop', 'calculator', 'clipboard-text', 'chart-line', 'arrows-left-right', 'pill', 'thermometer'],
  },
  {
    title: 'Interface',
    desc: 'Ícones de controle da interface: visibilidade, notificações, configurações, perfil e filtros.',
    icons: ['eye', 'eye-slash', 'bell', 'gear', 'sign-out', 'user', 'crown', 'bookmark-simple', 'clock', 'funnel'],
  },
  {
    title: 'Comunicação',
    desc: 'Ícones para funcionalidades de chat, mensagens, envio e ajuda contextual.',
    icons: ['chat-circle', 'envelope', 'paper-plane-tilt', 'question', 'lightbulb'],
  },
]

export default function DSIcones() {
  return (
    <div>
      <h2 className="ds-section-title">Ícones</h2>
      <p className="ds-section-desc">
        O CalcMed usa a biblioteca Phosphor Icons no peso Regular como padrão. Ícones são fundamentais
        para a navegação rápida em contexto de urgência, permitindo que o profissional identifique
        funções sem precisar ler rótulos. O tamanho padrão é 24x24px, com cor herdada do elemento pai
        via currentColor. Todos os ícones são carregados via CDN usando a classe{' '}
        <span className="ds-token">ph ph-[nome]</span>.
      </p>

      <div className="ds-subsection">
        <h3>Tamanhos</h3>
        <p className="t-corpo-2 text-fg-2 mb-3">
          Cinco tamanhos disponíveis, de 16px (detalhes e badges) até 40px (destaque em telas de
          resultado). O tamanho padrão de 24px atende ao touch target mínimo quando combinado com
          padding adequado.
        </p>
        <DSPanel title="Escala de tamanhos">
          <div className="flex gap-6 items-end mb-6">
            {[
              { cls: 'icon-sm', px: '16px' },
              { cls: 'icon-md', px: '20px' },
              { cls: 'icon-lg', px: '24px (padrão)' },
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
        <h3>Cores de Domínio</h3>
        <p className="t-corpo-2 text-fg-2 mb-3">
          Cada domínio clínico tem uma cor semântica associada. Use as classes utilitárias abaixo
          para colorir ícones de acordo com o domínio. As cores se adaptam automaticamente entre
          Light e Dark mode.
        </p>
        <DSPanel title="Ícones por domínio">
          <div className="flex gap-6 flex-wrap">
            {[
              { cls: 'icon-urg', domain: 'Urgências', icon: 'syringe' },
              { cls: 'icon-dil', domain: 'Diluições', icon: 'drop' },
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
          Regras para manter consistência visual e acessibilidade na iconografia do CalcMed.
        </p>
        <div className="ds-guideline do">
          <div className="ds-guideline-label">Fazer</div>
          <p>
            Usar a classe <span className="ds-token">ph ph-[nome]</span> com peso Regular.
            Tamanho padrão 24px. Aplicar cor via classe utilitária (text-fg, icon-urg, etc.) ou herança de currentColor.
          </p>
        </div>
        <div className="ds-guideline dont">
          <div className="ds-guideline-label">Não Fazer</div>
          <p>
            Usar emojis como ícones. Misturar pesos (Bold, Fill) sem justificativa clínica.
            Usar ícones menores que 16px. Aplicar cor diretamente via style inline.
          </p>
        </div>
      </div>
    </div>
  )
}
