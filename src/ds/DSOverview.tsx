import { Link } from 'react-router-dom'

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
    </div>
  )
}
