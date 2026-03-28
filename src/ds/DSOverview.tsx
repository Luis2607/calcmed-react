import { Link } from 'react-router-dom'

const principles = [
  {
    icon: 'ph-timer',
    title: 'Cada segundo conta',
    desc: 'Em emergência, velocidade salva vidas. Toda funcionalidade crítica está a no máximo 2 toques da Home. Sem animações que atrasem informação clínica. Sem loading spinners -- usamos skeleton screens.',
  },
  {
    icon: 'ph-eye',
    title: 'Legível a 1 metro',
    desc: 'O médico consulta doses com as mãos ocupadas, o celular no balcão. Valores numéricos usam JetBrains Mono Bold em tamanho mínimo de 20px. O resultado é sempre o protagonista visual da tela.',
  },
  {
    icon: 'ph-shield-check',
    title: 'Erro zero',
    desc: 'Todo input numérico tem validação de faixa clínica. Alertas críticos em vermelho são impossíveis de ignorar. A hierarquia de 5 níveis garante que a informação mais importante nunca se perca.',
  },
  {
    icon: 'ph-moon',
    title: 'Funciona no escuro',
    desc: 'Plantões noturnos são a realidade. O dark mode não é um extra -- é modo primário para muitos usuários. Cada token semântico tem par Light/Dark com a mesma qualidade visual.',
  },
  {
    icon: 'ph-hand-pointing',
    title: 'Médico com luvas',
    desc: 'Touch targets de 48dp no padrão, ampliados para 52dp em ações de emergência. Botões generosos, espaçamento que perdoa toques imprecisos. Projetado para mãos trêmulas, luvas cirúrgicas e pressa.',
  },
]

const stats = [
  { value: '152', label: 'Tokens primitivos' },
  { value: '50', label: 'Tokens semânticos' },
  { value: '250+', label: 'Classes CSS' },
  { value: '7:1', label: 'Contraste WCAG AAA' },
  { value: '48dp', label: 'Touch target mínimo' },
  { value: '18', label: 'Telas redesenhadas' },
  { value: '28', label: 'Componentes React' },
]

const quickLinks = [
  // Átomos
  { icon: 'ph-fingerprint', label: 'Marca e Identidade', path: '/design-system/brand', group: 'Átomos' },
  { icon: 'ph-palette', label: 'Cores', path: '/design-system/cores', group: 'Átomos' },
  { icon: 'ph-text-aa', label: 'Tipografia', path: '/design-system/tipografia', group: 'Átomos' },
  { icon: 'ph-arrows-out-line-horizontal', label: 'Espaçamento', path: '/design-system/espacamento', group: 'Átomos' },
  { icon: 'ph-grid-four', label: 'Grid', path: '/design-system/grid', group: 'Átomos' },
  { icon: 'ph-stack', label: 'Elevação', path: '/design-system/elevacao', group: 'Átomos' },
  { icon: 'ph-play', label: 'Animações', path: '/design-system/motion', group: 'Átomos' },
  { icon: 'ph-phosphor-logo', label: 'Ícones', path: '/design-system/icones', group: 'Átomos' },
  { icon: 'ph-pen-nib', label: 'Tom de Voz e Escrita', path: '/design-system/writing', group: 'Átomos' },
  // Moléculas
  { icon: 'ph-cursor-click', label: 'Botões', path: '/design-system/botoes', group: 'Moléculas' },
  { icon: 'ph-textbox', label: 'Campos de Entrada', path: '/design-system/inputs', group: 'Moléculas' },
  { icon: 'ph-tag', label: 'Tags e Chips', path: '/design-system/tags', group: 'Moléculas' },
  { icon: 'ph-warning', label: 'Alertas', path: '/design-system/alertas', group: 'Moléculas' },
  // Organismos
  { icon: 'ph-cards', label: 'Cards', path: '/design-system/cards', group: 'Organismos' },
  { icon: 'ph-chat-circle', label: 'Chat e IA', path: '/design-system/chat', group: 'Organismos' },
  { icon: 'ph-calendar', label: 'Calendário', path: '/design-system/calendario', group: 'Organismos' },
  { icon: 'ph-heartbeat', label: 'Componentes Clínicos', path: '/design-system/clinico', group: 'Organismos' },
  // Templates
  { icon: 'ph-compass', label: 'Navegação', path: '/design-system/navegacao', group: 'Templates' },
  { icon: 'ph-wheelchair', label: 'Acessibilidade', path: '/design-system/acessibilidade', group: 'Templates' },
]

export default function DSOverview() {
  return (
    <div>
      {/* Brand lockup */}
      <div className="mb-6">
        <h1 className="t-marca mb-1">
          Calc<span className="dot">.</span>Med
        </h1>
        <p className="ds-header-label">
          Design System v1.0
        </p>
      </div>

      <p className="ds-section-desc">
        Construímos o Design System CalcMed com uma premissa: em urgência médica, cada segundo conta. Cada decisão de cor, tipografia e interação existe para servir três pilares: legibilidade clínica, velocidade de acesso e segurança do paciente.
      </p>
      <p className="ds-section-desc">
        A tipografia usa Inter para interface, JetBrains Mono para doses e valores numéricos (onde
        clareza é crítica), e Outfit para a marca. O espaçamento segue base 4px com grid de 8px.
        O contraste atinge WCAG AAA (7:1) em todo texto clínico. Touch targets de 48dp são ampliados
        para 52dp em contextos de emergência, garantindo precisão mesmo com mãos trêmulas ou
        luvas cirúrgicas.
      </p>

      {/* Princípios de Design */}
      <div className="mb-8">
        <h3 className="t-titulo-secao mb-4">Princípios de Design</h3>
        <p className="ds-section-desc">
          Cinco regras que guiam todas as decisões do sistema. Cada componente, token e padrão existe para servir a estes princípios.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {principles.map(p => (
            <div
              key={p.title}
              className="bg-surface"
              style={{
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-xl, 16px)',
                padding: 24,
              }}
            >
              <i
                className={`ph ${p.icon}`}
                style={{ fontSize: 24, color: 'var(--btn-primary)', display: 'block', marginBottom: 12 }}
              />
              <div className="t-corpo text-fg" style={{ fontWeight: 700, marginBottom: 8 }}>{p.title}</div>
              <p className="t-corpo-2 text-fg-2" style={{ margin: 0 }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="ds-stat-grid">
        {stats.map(s => (
          <div className="ds-stat" key={s.label}>
            <div className="value">{s.value}</div>
            <div className="label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <h3 className="t-titulo-secao mb-4">Navegação rápida</h3>
      <div className="ds-quick-links">
        {quickLinks.map(l => (
          <Link to={l.path} className="ds-quick-link" key={l.path}>
            <i className={`ph ${l.icon}`} />
            <span>{l.label}</span>
          </Link>
        ))}
      </div>

      {/* Convenção de Nomenclatura */}
      <div className="mb-8" style={{ marginTop: 32 }}>
        <h3 className="t-titulo-secao mb-4">Convenção de Nomenclatura</h3>
        <p className="ds-section-desc">
          Entender a lógica por trás dos nomes permite que você preveja o token correto sem consultar a documentação.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          <div
            className="bg-surface"
            style={{
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-xl, 16px)',
              padding: 24,
            }}
          >
            <i
              className="ph ph-tag"
              style={{ fontSize: 24, color: 'var(--btn-primary)', display: 'block', marginBottom: 12 }}
            />
            <div className="t-corpo text-fg" style={{ fontWeight: 700, marginBottom: 8 }}>Semântico, não literal</div>
            <p className="t-corpo-2" style={{ margin: 0, marginBottom: 8 }}>
              <span className="ds-token">--btn-primary</span> em vez de <span className="ds-token">--teal-600</span>
            </p>
            <p className="t-corpo-2 text-fg-2" style={{ margin: 0 }}>
              Por quê: se a cor primária mudar de teal para azul, você não precisa renomear 200 referências.
            </p>
          </div>
          <div
            className="bg-surface"
            style={{
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-xl, 16px)',
              padding: 24,
            }}
          >
            <i
              className="ph ph-sort-ascending"
              style={{ fontSize: 24, color: 'var(--btn-primary)', display: 'block', marginBottom: 12 }}
            />
            <div className="t-corpo text-fg" style={{ fontWeight: 700, marginBottom: 8 }}>Contexto primeiro, propriedade depois</div>
            <p className="t-corpo-2" style={{ margin: 0, marginBottom: 8 }}>
              <span className="ds-token">--bg-surface</span>, <span className="ds-token">--fg-2</span>, <span className="ds-token">--dom-urg-text</span>
            </p>
            <p className="t-corpo-2 text-fg-2" style={{ margin: 0 }}>
              Por quê: agrupamento natural. Todos os backgrounds começam com <span className="ds-token">--bg</span>, todos os foregrounds com <span className="ds-token">--fg</span>.
            </p>
          </div>
          <div
            className="bg-surface"
            style={{
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-xl, 16px)',
              padding: 24,
            }}
          >
            <i
              className="ph ph-chart-line-up"
              style={{ fontSize: 24, color: 'var(--btn-primary)', display: 'block', marginBottom: 12 }}
            />
            <div className="t-corpo text-fg" style={{ fontWeight: 700, marginBottom: 8 }}>Escala numérica para intensidade</div>
            <p className="t-corpo-2" style={{ margin: 0, marginBottom: 8 }}>
              <span className="ds-token">--shadow-0</span> a <span className="ds-token">--shadow-5</span>, <span className="ds-token">--sp-1</span> a <span className="ds-token">--sp-24</span>
            </p>
            <p className="t-corpo-2 text-fg-2" style={{ margin: 0 }}>
              Por quê: progressão previsível. Quanto maior o número, maior a intensidade.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
