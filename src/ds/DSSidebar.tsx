import { useState } from 'react'
import { NavLink } from 'react-router-dom'

interface NavItem {
  label: string
  path: string
}

interface NavGroup {
  title: string
  items: NavItem[]
}

const groups: NavGroup[] = [
  {
    title: 'Funda\u00e7\u00f5es',
    items: [
      { label: 'Cores', path: 'cores' },
      { label: 'Tipografia', path: 'tipografia' },
      { label: 'Espa\u00e7amento', path: 'espacamento' },
      { label: 'Grid', path: 'grid' },
      { label: 'Eleva\u00e7\u00e3o', path: 'elevacao' },
      { label: 'Motion', path: 'motion' },
      { label: '\u00cdcones', path: 'icones' },
    ],
  },
  {
    title: 'Componentes',
    items: [
      { label: 'Bot\u00f5es', path: 'botoes' },
      { label: 'Inputs', path: 'inputs' },
      { label: 'Tags & Chips', path: 'tags' },
      { label: 'Cards', path: 'cards' },
      { label: 'Alertas', path: 'alertas' },
      { label: 'Chat / IA', path: 'chat' },
      { label: 'Calend\u00e1rio', path: 'calendario' },
      { label: 'Categorias', path: 'categorias' },
      { label: 'Menu e Perfil', path: 'menu-perfil' },
      { label: 'Premium e Checkout', path: 'premium' },
    ],
  },
  {
    title: 'Padr\u00f5es',
    items: [
      { label: 'Navega\u00e7\u00e3o', path: 'navegacao' },
      { label: 'Patterns', path: 'patterns' },
      { label: 'Acessibilidade', path: 'acessibilidade' },
    ],
  },
]

interface Props {
  isOpen: boolean
  onClose: () => void
}

export default function DSSidebar({ isOpen, onClose }: Props) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    'Funda\u00e7\u00f5es': true,
    Componentes: true,
    'Padr\u00f5es': true,
  })

  const toggle = (title: string) => {
    setExpanded(prev => ({ ...prev, [title]: !prev[title] }))
  }

  return (
    <>
      <div className={isOpen ? 'ds-overlay open' : 'ds-overlay'} onClick={onClose} />
      <aside className={`ds-sidebar${isOpen ? ' open' : ''}`}>
        <div className="ds-header">
          <NavLink to="/design-system" className="ds-header-logo" onClick={onClose}>
            Calc<span className="dot">.</span>Med
          </NavLink>
          <span className="ds-header-label">Design System</span>
        </div>

        <NavLink to="/home" className="ds-back-link" onClick={onClose}>
          <i className="ph ph-arrow-left" />
          Voltar ao App
        </NavLink>

        <nav>
          {groups.map(group => (
            <div className="ds-nav-group" key={group.title}>
              <div
                className="ds-nav-group-title"
                onClick={() => toggle(group.title)}
              >
                <span>{group.title}</span>
                <i className={`ph ph-caret-right ds-chevron${expanded[group.title] ? ' open' : ''}`} />
              </div>
              <div
                className="ds-nav-items"
                style={{
                  maxHeight: expanded[group.title] ? `${group.items.length * 40}px` : '0px',
                }}
              >
                {group.items.map(item => (
                  <NavLink
                    key={item.path}
                    to={`/design-system/${item.path}`}
                    className={({ isActive }) => `ds-nav-item${isActive ? ' active' : ''}`}
                    onClick={onClose}
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </aside>
    </>
  )
}
