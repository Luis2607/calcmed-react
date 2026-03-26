import { useLocation, Link } from 'react-router-dom'
import { House, MagnifyingGlass, CalendarBlank, Sparkle, List } from '@phosphor-icons/react'

const items = [
  { label: 'Início', icon: House, path: '/home' },
  { label: 'Busca', icon: MagnifyingGlass, path: '/busca' },
  { label: 'Escala', icon: CalendarBlank, path: '/escala' },
  { label: 'IA', icon: Sparkle, path: '/ia' },
  { label: 'Menu', icon: List, path: '/menu' },
]

export default function BottomNav() {
  const { pathname } = useLocation()

  return (
    <div className="bottom-nav">
      {items.map(({ label, icon: Icon, path }) => (
        <Link
          key={path}
          to={path}
          className={`nav-item ${pathname === path ? 'active' : ''}`}
        >
          <Icon size={24} />
          <span>{label}</span>
        </Link>
      ))}
    </div>
  )
}
