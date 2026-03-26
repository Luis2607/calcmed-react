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
    title: 'Fundacoes',
    items: [
      { label: 'Cores', path: 'cores' },
      { label: 'Tipografia', path: 'tipografia' },
      { label: 'Espacamento', path: 'espacamento' },
      { label: 'Grid', path: 'grid' },
      { label: 'Elevacao', path: 'elevacao' },
      { label: 'Motion', path: 'motion' },
      { label: 'Icones', path: 'icones' },
    ],
  },
  {
    title: 'Componentes',
    items: [
      { label: 'Botoes', path: 'botoes' },
      { label: 'Inputs', path: 'inputs' },
      { label: 'Tags & Chips', path: 'tags' },
      { label: 'Cards', path: 'cards' },
      { label: 'Alertas', path: 'alertas' },
    ],
  },
  {
    title: 'Padroes',
    items: [
      { label: 'Navegacao', path: 'navegacao' },
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
    Fundacoes: true,
    Componentes: true,
    Padroes: true,
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
