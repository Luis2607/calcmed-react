import { Link } from 'react-router-dom'

const stats = [
  { value: '152', label: 'Tokens primitivos' },
  { value: '50', label: 'Tokens semânticos' },
  { value: '250+', label: 'Classes CSS' },
  { value: '18', label: 'Telas' },
  { value: '28', label: 'Componentes React' },
]

const quickLinks = [
  { icon: 'ph-palette', label: 'Cores', path: '/design-system/cores' },
  { icon: 'ph-text-aa', label: 'Tipografia', path: '/design-system/tipografia' },
  { icon: 'ph-arrows-out-line-horizontal', label: 'Espaçamento', path: '/design-system/espacamento' },
  { icon: 'ph-grid-four', label: 'Grid', path: '/design-system/grid' },
  { icon: 'ph-stack', label: 'Elevação', path: '/design-system/elevacao' },
  { icon: 'ph-play', label: 'Motion', path: '/design-system/motion' },
  { icon: 'ph-phosphor-logo', label: 'Ícones', path: '/design-system/icones' },
  { icon: 'ph-cursor-click', label: 'Botões', path: '/design-system/botoes' },
  { icon: 'ph-textbox', label: 'Inputs', path: '/design-system/inputs' },
  { icon: 'ph-tag', label: 'Tags & Chips', path: '/design-system/tags' },
  { icon: 'ph-cards', label: 'Cards', path: '/design-system/cards' },
  { icon: 'ph-warning', label: 'Alertas', path: '/design-system/alertas' },
  { icon: 'ph-compass', label: 'Navegação', path: '/design-system/navegacao' },
  { icon: 'ph-puzzle-piece', label: 'Patterns', path: '/design-system/patterns' },
  { icon: 'ph-wheelchair', label: 'Acessibilidade', path: '/design-system/acessibilidade' },
]

export default function DSOverview() {
  return (
    <div>
      {/* Brand lockup */}
      <div className="mb-8">
        <h1 className="t-marca mb-1">
          Calc<span className="dot">.</span>Med
        </h1>
        <p className="t-texto-badge text-fg-3" style={{ letterSpacing: 2, textTransform: 'uppercase' }}>
          Design System v1.0
        </p>
      </div>

      <p className="ds-section-desc mb-8">
        Sistema de design construído para o app CalcMed, focado em urgência e emergência médica.
        Cada decisão prioriza legibilidade clínica, velocidade de acesso e segurança do paciente.
        Tipografia Inter para UI, JetBrains Mono para doses e valores, Outfit para marca.
        Base espaçamento 4px. Contraste WCAG AAA (7:1) para texto clínico. Touch targets de 48dp,
        ampliados para 52dp em contexto de emergência.
      </p>

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
    </div>
  )
}
