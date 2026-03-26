import { useState } from 'react'
import { NavLink } from 'react-router-dom'

type NavStatus = 'stable' | 'beta' | 'new' | 'deprecated'

const statusConfig: Record<NavStatus, { color: string; label: string }> = {
  stable: { color: 'var(--success)', label: 'Est\u00e1vel' },
  beta: { color: 'var(--warning)', label: 'Beta' },
  new: { color: 'var(--primary)', label: 'Novo' },
  deprecated: { color: 'var(--danger)', label: 'Deprecado' },
}

interface NavItem {
  label: string
  path: string
  status?: NavStatus
}

interface NavGroup {
  title: string
  items: NavItem[]
}

const groups: NavGroup[] = [
  {
    title: 'Funda\u00e7\u00f5es',
    items: [
      { label: 'Cores', path: 'cores', status: 'stable' },
      { label: 'Tipografia', path: 'tipografia', status: 'stable' },
      { label: 'Espa\u00e7amento', path: 'espacamento', status: 'stable' },
      { label: 'Grid', path: 'grid', status: 'stable' },
      { label: 'Eleva\u00e7\u00e3o', path: 'elevacao', status: 'stable' },
      { label: 'Motion', path: 'motion', status: 'stable' },
      { label: '\u00cdcones', path: 'icones', status: 'stable' },
    ],
  },
  {
    title: 'Componentes',
    items: [
      { label: 'Bot\u00f5es', path: 'botoes', status: 'stable' },
      { label: 'Inputs', path: 'inputs', status: 'stable' },
      { label: 'Tags & Chips', path: 'tags', status: 'stable' },
      { label: 'Cards', path: 'cards', status: 'stable' },
      { label: 'Alertas', path: 'alertas', status: 'stable' },
      { label: 'Chat / IA', path: 'chat', status: 'stable' },
      { label: 'Calend\u00e1rio', path: 'calendario', status: 'stable' },
      { label: 'Categorias', path: 'categorias', status: 'stable' },
      { label: 'Menu e Perfil', path: 'menu-perfil', status: 'stable' },
      { label: 'Premium e Checkout', path: 'premium', status: 'stable' },
    ],
  },
  {
    title: 'Padr\u00f5es',
    items: [
      { label: 'Navega\u00e7\u00e3o', path: 'navegacao', status: 'stable' },
      { label: 'Patterns', path: 'patterns', status: 'stable' },
      { label: 'Acessibilidade', path: 'acessibilidade', status: 'stable' },
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
                    <span>{item.label}</span>
                    {item.status && item.status !== 'stable' && (
                      <span
                        className="ds-nav-status"
                        style={{
                          display: 'inline-block',
                          fontSize: 9,
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: 0.5,
                          padding: '1px 6px',
                          borderRadius: 4,
                          marginLeft: 8,
                          color: statusConfig[item.status].color,
                          border: `1px solid ${statusConfig[item.status].color}`,
                        }}
                      >
                        {statusConfig[item.status].label}
                      </span>
                    )}
                    {item.status === 'stable' && (
                      <span
                        className="ds-nav-status-dot"
                        style={{
                          display: 'inline-block',
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          backgroundColor: 'var(--success)',
                          marginLeft: 8,
                          flexShrink: 0,
                        }}
                        title="Est\u00e1vel"
                      />
                    )}
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
