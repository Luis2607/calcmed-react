import { useState } from 'react'
import { useLocation, Link, useNavigate } from 'react-router-dom'
import { House, MagnifyingGlass, CalendarBlank, Sparkle, List, SignOut } from '@phosphor-icons/react'
import { useLayout } from '../../contexts/LayoutContext'

interface NavItem {
  label: string
  icon: typeof House
  path: string
  match: string[]
  section: 'main' | 'tools'
  badge?: boolean
  hideOnWeb?: boolean
}

const items: NavItem[] = [
  { label: 'Inicio', icon: House, path: '/home', match: ['/home', '/home/trial', '/calculadora', '/notificacoes', '/premium', '/planos'], section: 'main' },
  { label: 'Busca', icon: MagnifyingGlass, path: '/busca', match: ['/busca'], section: 'main', hideOnWeb: true },
  { label: 'Escala', icon: CalendarBlank, path: '/escala', match: ['/escala', '/escala/novo'], section: 'tools' },
  { label: 'CalcMed IA', icon: Sparkle, path: '/ia', match: ['/ia'], section: 'tools', badge: true },
  { label: 'Menu', icon: List, path: '/menu', match: ['/menu'], section: 'tools' },
]

export default function BottomNav() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { layoutMode } = useLayout()

  const isActive = (match: string[]) => match.some(m => pathname.startsWith(m))

  const [sidebarMode, setSidebarMode] = useState(0) // 0=Adulto, 1=Ped

  if (layoutMode === 'web') {
    const visibleItems = items.filter(i => !i.hideOnWeb)
    const mainItems = visibleItems.filter(i => i.section === 'main')
    const toolItems = visibleItems.filter(i => i.section === 'tools')

    return (
      <nav className="web-sidebar" aria-label="Navegacao principal">
        <Link to="/home" className="web-sidebar-logo" style={{ textDecoration: 'none', color: 'inherit' }}>
          <img src="/assets/Icone.svg" width={24} height={24} alt="" aria-hidden="true" className="web-sidebar-logo-icon" />
          <span>Calc<span className="dot">.</span>Med</span>
        </Link>

        {/* Toggle Adulto/Ped */}
        <div className="web-sidebar-toggle" role="tablist" aria-label="Modo clinico">
          <button
            className={`web-sidebar-toggle-btn ${sidebarMode === 0 ? 'active' : ''}`}
            role="tab"
            aria-selected={sidebarMode === 0}
            onClick={() => setSidebarMode(0)}
          >Adulto</button>
          <button
            className={`web-sidebar-toggle-btn ${sidebarMode === 1 ? 'active' : ''}`}
            role="tab"
            aria-selected={sidebarMode === 1}
            onClick={() => setSidebarMode(1)}
          >Ped</button>
        </div>

        <div className="web-sidebar-section">
          <span className="web-sidebar-section-label">Principal</span>
          {mainItems.map(({ label, icon: Icon, path, match, badge }) => (
            <Link
              key={path}
              to={path}
              className={`web-sidebar-item ${isActive(match) ? 'active' : ''}`}
              aria-current={isActive(match) ? 'page' : undefined}
            >
              <span className="web-sidebar-item-indicator" />
              <Icon size={20} weight={isActive(match) ? 'fill' : 'regular'} />
              <span className="web-sidebar-item-label">{label}</span>
              {badge && <span className="web-sidebar-badge-dot" />}
            </Link>
          ))}
        </div>

        <div className="web-sidebar-divider" />

        <div className="web-sidebar-section">
          <span className="web-sidebar-section-label">Ferramentas</span>
          {toolItems.map(({ label, icon: Icon, path, match, badge }) => (
            <Link
              key={path}
              to={path}
              className={`web-sidebar-item ${isActive(match) ? 'active' : ''}`}
              aria-current={isActive(match) ? 'page' : undefined}
            >
              <span className="web-sidebar-item-indicator" />
              <Icon size={20} weight={isActive(match) ? 'fill' : 'regular'} />
              <span className="web-sidebar-item-label">{label}</span>
              {badge && <span className="web-sidebar-badge-dot" />}
            </Link>
          ))}
        </div>

        {/* Sair — pushed to bottom */}
        <div className="web-sidebar-logout">
          <button className="web-sidebar-logout-btn" onClick={() => navigate('/')}>
            <SignOut size={20} />
            <span>Sair</span>
          </button>
        </div>
      </nav>
    )
  }

  return (
    <nav className="bottom-nav" aria-label="Navegacao principal">
      {items.map(({ label, icon: Icon, path, match, badge }) => {
        const active = isActive(match)
        const mobileLabel = label === 'CalcMed IA' ? 'IA' : label
        return (
          <Link
            key={path}
            to={path}
            className={`nav-item ${active ? 'active' : ''} ${badge ? 'nav-item-badge' : ''}`}
            aria-current={active ? 'page' : undefined}
          >
            <Icon size={24} weight={active ? 'fill' : 'regular'} />
            <span>{mobileLabel}</span>
          </Link>
        )
      })}
    </nav>
  )
}
