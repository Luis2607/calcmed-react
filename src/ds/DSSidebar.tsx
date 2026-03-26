import { useState } from 'react'
import { NavLink } from 'react-router-dom'

type NavStatus = 'beta' | 'new'

const statusConfig: Record<NavStatus, { color: string; label: string }> = {
  beta: { color: 'var(--warning)', label: 'Beta' },
  new: { color: 'var(--primary)', label: 'Novo' },
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
    title: '\u00c1tomos',
    items: [
      { label: 'Cores', path: 'cores' },
      { label: 'Tipografia', path: 'tipografia' },
      { label: 'Espa\u00e7amento', path: 'espacamento' },
      { label: 'Grid', path: 'grid' },
      { label: 'Eleva\u00e7\u00e3o', path: 'elevacao' },
      { label: 'Anima\u00e7\u00f5es', path: 'motion' },
      { label: '\u00cdcones', path: 'icones' },
    ],
  },
  {
    title: 'Mol\u00e9culas',
    items: [
      { label: 'Bot\u00f5es', path: 'botoes' },
      { label: 'Campos de Entrada', path: 'inputs' },
      { label: 'Controles de Sele\u00e7\u00e3o', path: 'selecao' },
      { label: 'Tags e Chips', path: 'tags' },
      { label: 'Alertas', path: 'alertas' },
    ],
  },
  {
    title: 'Organismos',
    items: [
      { label: 'Cards', path: 'cards' },
      { label: 'Categorias', path: 'categorias' },
      { label: 'Chat e IA', path: 'chat' },
      { label: 'Calend\u00e1rio', path: 'calendario' },
      { label: 'Menu e Perfil', path: 'menu-perfil' },
      { label: 'Premium e Checkout', path: 'premium' },
    ],
  },
  {
    title: 'Templates',
    items: [
      { label: 'Navega\u00e7\u00e3o', path: 'navegacao' },
      { label: 'Overlays', path: 'overlays' },
      { label: 'Estados de Conte\u00fado', path: 'estados' },
      { label: 'Headers', path: 'headers' },
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
    '\u00c1tomos': true,
    'Mol\u00e9culas': false,
    'Organismos': false,
    'Templates': false,
  })

  const toggle = (title: string) => {
    setExpanded(prev => {
      const allClosed = Object.fromEntries(Object.keys(prev).map(k => [k, false]))
      return { ...allClosed, [title]: !prev[title] }
    })
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
                    {item.status && (
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
