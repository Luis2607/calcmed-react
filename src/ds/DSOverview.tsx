import { Link } from 'react-router-dom'

const principles = [
  {
    icon: 'ph-timer',
    title: 'Cada segundo conta',
    desc: 'Em emergência, velocidade salva vidas. Toda funcionalidade crítica está a no máximo 2 toques da Home. Sem animações que atrasem informação clínica. Sem loading spinners — usamos skeleton screens.',
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
    desc: 'Plantões noturnos são a realidade. O dark mode não é um extra — é modo primário para muitos usuários. Cada token semântico tem par Light/Dark com a mesma qualidade visual.',
  },
  {
    icon: 'ph-hand-pointing',
    title: 'Médico com luvas',
    desc: 'Touch targets de 48dp no padrão, ampliados para 52dp em ações de emergência. Botões generosos, espaçamento que perdoa toques imprecisos. Projetado para mãos trêmulas, luvas cirúrgicas e pressa.',
  },
]

const stats = [
  { value: '152', label: 'Tokens primitivos' },
  { value: '50', label: 'Tokens sem\u00e2nticos' },
  { value: '250+', label: 'Classes CSS' },
  { value: '7:1', label: 'Contraste WCAG AAA' },
  { value: '48dp', label: 'Touch target m\u00ednimo' },
  { value: '18', label: 'Telas redesenhadas' },
  { value: '28', label: 'Componentes React' },
]

const quickLinks = [
  { icon: 'ph-palette', label: 'Cores', path: '/design-system/cores' },
  { icon: 'ph-text-aa', label: 'Tipografia', path: '/design-system/tipografia' },
  { icon: 'ph-arrows-out-line-horizontal', label: 'Espa\u00e7amento', path: '/design-system/espacamento' },
  { icon: 'ph-grid-four', label: 'Grid', path: '/design-system/grid' },
  { icon: 'ph-stack', label: 'Eleva\u00e7\u00e3o', path: '/design-system/elevacao' },
  { icon: 'ph-play', label: 'Motion', path: '/design-system/motion' },
  { icon: 'ph-phosphor-logo', label: '\u00cdcones', path: '/design-system/icones' },
  { icon: 'ph-cursor-click', label: 'Bot\u00f5es', path: '/design-system/botoes' },
  { icon: 'ph-textbox', label: 'Inputs', path: '/design-system/inputs' },
  { icon: 'ph-tag', label: 'Tags & Chips', path: '/design-system/tags' },
  { icon: 'ph-cards', label: 'Cards', path: '/design-system/cards' },
  { icon: 'ph-warning', label: 'Alertas', path: '/design-system/alertas' },
  { icon: 'ph-compass', label: 'Navega\u00e7\u00e3o', path: '/design-system/navegacao' },
  { icon: 'ph-puzzle-piece', label: 'Patterns', path: '/design-system/patterns' },
  { icon: 'ph-wheelchair', label: 'Acessibilidade', path: '/design-system/acessibilidade' },
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
        O Design System CalcMed foi constru\u00eddo com uma premissa: em urg\u00eancia m\u00e9dica, cada segundo conta.
        Todas as decis\u00f5es de cor, tipografia, espa\u00e7amento e intera\u00e7\u00e3o priorizam tr\u00eas pilares:
        legibilidade cl\u00ednica, velocidade de acesso e seguran\u00e7a do paciente.
      </p>
      <p className="ds-section-desc">
        A tipografia usa Inter para interface, JetBrains Mono para doses e valores num\u00e9ricos (onde
        clareza \u00e9 cr\u00edtica), e Outfit para a marca. O espa\u00e7amento segue base 4px com grid de 8px.
        O contraste atinge WCAG AAA (7:1) em todo texto cl\u00ednico. Touch targets de 48dp s\u00e3o ampliados
        para 52dp em contextos de emerg\u00eancia, garantindo precis\u00e3o mesmo com m\u00e3os tr\u00eamulas ou
        luvas cir\u00fargicas.
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
                style={{ fontSize: 24, color: 'var(--primary)', display: 'block', marginBottom: 12 }}
              />
              <div className="t-titulo-card" style={{ fontWeight: 700, marginBottom: 8 }}>{p.title}</div>
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
      <h3 className="t-titulo-secao mb-4">Navega\u00e7\u00e3o r\u00e1pida</h3>
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
        <h3 className="t-titulo-secao mb-4">Conven\u00e7\u00e3o de Nomenclatura</h3>
        <p className="ds-section-desc">
          Entender a l\u00f3gica por tr\u00e1s dos nomes permite que voc\u00ea preve\u00e7a o token correto sem consultar a documenta\u00e7\u00e3o.
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
              style={{ fontSize: 24, color: 'var(--primary)', display: 'block', marginBottom: 12 }}
            />
            <div className="t-titulo-card" style={{ fontWeight: 700, marginBottom: 8 }}>Sem\u00e2ntico, n\u00e3o literal</div>
            <p className="t-corpo-2" style={{ margin: 0, marginBottom: 8 }}>
              <span className="ds-token">--btn-primary</span> em vez de <span className="ds-token">--teal-600</span>
            </p>
            <p className="t-corpo-2 text-fg-2" style={{ margin: 0 }}>
              Por qu\u00ea: se a cor prim\u00e1ria mudar de teal para azul, voc\u00ea n\u00e3o precisa renomear 200 refer\u00eancias.
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
              style={{ fontSize: 24, color: 'var(--primary)', display: 'block', marginBottom: 12 }}
            />
            <div className="t-titulo-card" style={{ fontWeight: 700, marginBottom: 8 }}>Contexto primeiro, propriedade depois</div>
            <p className="t-corpo-2" style={{ margin: 0, marginBottom: 8 }}>
              <span className="ds-token">--bg-surface</span>, <span className="ds-token">--fg-2</span>, <span className="ds-token">--dom-urg-text</span>
            </p>
            <p className="t-corpo-2 text-fg-2" style={{ margin: 0 }}>
              Por qu\u00ea: agrupamento natural. Todos os backgrounds come\u00e7am com <span className="ds-token">--bg</span>, todos os foregrounds com <span className="ds-token">--fg</span>.
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
              style={{ fontSize: 24, color: 'var(--primary)', display: 'block', marginBottom: 12 }}
            />
            <div className="t-titulo-card" style={{ fontWeight: 700, marginBottom: 8 }}>Escala num\u00e9rica para intensidade</div>
            <p className="t-corpo-2" style={{ margin: 0, marginBottom: 8 }}>
              <span className="ds-token">--shadow-0</span> a <span className="ds-token">--shadow-5</span>, <span className="ds-token">--sp-1</span> a <span className="ds-token">--sp-24</span>
            </p>
            <p className="t-corpo-2 text-fg-2" style={{ margin: 0 }}>
              Por qu\u00ea: progress\u00e3o previs\u00edvel. Quanto maior o n\u00famero, maior a intensidade.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
