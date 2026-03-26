import { Link } from 'react-router-dom'
import { Bell } from '@phosphor-icons/react'
import Avatar from '../ui/Avatar'

interface Props {
  greeting?: string
  userName?: string
  blur?: boolean
}

export default function HomeHeader({ greeting = 'Bom dia,', userName = 'Dr. Rafael', blur }: Props) {
  return (
    <div className={`home-header ${blur ? 'blur-bg' : ''}`}>
      <Avatar initials="RF" size="sm" />
      <div className="flex-1">
        <div className="t-legenda text-fg-3">{greeting}</div>
        <div className="t-alerta-titulo">{userName}</div>
      </div>
      <Link to="/notificacoes" className="notif-wrap">
        <Bell size={22} className="text-fg-3" />
        <div className="notif-dot" />
      </Link>
    </div>
  )
}
