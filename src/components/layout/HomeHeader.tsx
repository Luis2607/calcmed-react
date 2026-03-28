import { Link, useNavigate } from 'react-router-dom'
import { Bell, Sun, Moon, MagnifyingGlass } from '@phosphor-icons/react'
import { useTheme } from '../../contexts/ThemeContext'
import Avatar from '../ui/Avatar'

interface Props {
  greeting?: string
  userName?: string
  blur?: boolean
}

export default function HomeHeader({ greeting = 'Bom dia,', userName = 'Dr. Rafael', blur }: Props) {
  const { resolvedTheme, toggleTheme } = useTheme()
  const navigate = useNavigate()

  return (
    <div className={`home-header ${blur ? 'blur-bg' : ''}`}>
      <Avatar initials="RF" size="sm" />
      <div className="flex-1">
        <div className="t-legenda text-fg-2">{greeting}</div>
        <div className="t-alerta-titulo">{userName}</div>
      </div>
      <div
        className="web-header-search"
        role="button"
        tabIndex={0}
        onClick={() => navigate('/busca')}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate('/busca') } }}
        aria-label="Buscar calculadoras, protocolos, escores..."
      >
        <MagnifyingGlass size={18} />
        <span>Buscar calculadoras, protocolos, escores...</span>
      </div>
      <button
        className="btn-icon-toggle"
        onClick={toggleTheme}
        aria-label={resolvedTheme === 'dark' ? 'Modo claro' : 'Modo escuro'}
      >
        {resolvedTheme === 'dark' ? <Sun size={22} /> : <Moon size={22} />}
      </button>
      <Link to="/notificacoes" className="notif-wrap" aria-label="Notificações (novas)">
        <Bell size={22} />
        <div className="notif-dot" aria-hidden="true" />
      </Link>
    </div>
  )
}
