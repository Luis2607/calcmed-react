import { useLocation, Link } from 'react-router-dom'
import { House, MagnifyingGlass, CalendarBlank, Sparkle, List } from '@phosphor-icons/react'

const items = [
  { label: 'Início', icon: House, path: '/home', match: ['/home', '/calculadora', '/notificacoes', '/premium', '/planos'] },
  { label: 'Busca', icon: MagnifyingGlass, path: '/busca', match: ['/busca'] },
  { label: 'Escala', icon: CalendarBlank, path: '/escala', match: ['/escala'] },
  { label: 'IA', icon: Sparkle, path: '/ia', match: ['/ia'] },
  { label: 'Menu', icon: List, path: '/menu', match: ['/menu'] },
]

export default function BottomNav() {
  const { pathname } = useLocation()

  const isActive = (match: string[]) => match.some(m => pathname.startsWith(m))

  return (
    <div className="bottom-nav">
      {items.map(({ label, icon: Icon, path, match }) => (
        <Link
          key={path}
          to={path}
          className={`nav-item ${isActive(match) ? 'active' : ''}`}
        >
          <Icon size={24} />
          <span>{label}</span>
        </Link>
      ))}
    </div>
  )
}
