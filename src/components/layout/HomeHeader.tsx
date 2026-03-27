import { Link } from 'react-router-dom'
import { Bell, Sun, Moon } from '@phosphor-icons/react'
import { useTheme } from '../../contexts/ThemeContext'
import Avatar from '../ui/Avatar'

interface Props {
  greeting?: string
  userName?: string
  blur?: boolean
}

export default function HomeHeader({ greeting = 'Bom dia,', userName = 'Dr. Rafael', blur }: Props) {
  const { resolvedTheme, toggleTheme } = useTheme()

  return (
    <div className={`home-header ${blur ? 'blur-bg' : ''}`}>
      <Avatar initials="RF" size="sm" />
      <div className="flex-1">
        <div className="t-legenda text-fg-3">{greeting}</div>
        <div className="t-alerta-titulo">{userName}</div>
      </div>
      <button
        className="btn-icon-toggle"
        onClick={toggleTheme}
        aria-label={resolvedTheme === 'dark' ? 'Modo claro' : 'Modo escuro'}
      >
        {resolvedTheme === 'dark' ? <Sun size={22} /> : <Moon size={22} />}
      </button>
      <Link to="/notificacoes" className="notif-wrap">
        <Bell size={22} className="text-fg-3" />
        <div className="notif-dot" />
      </Link>
    </div>
  )
}
