import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

interface Props {
  icon?: ReactNode
  iconClass?: string
  title: string
  subtitle?: string
  trailing?: ReactNode
  href?: string
  onClick?: () => void
  className?: string
}

export default function ListItem({ icon, iconClass, title, subtitle, trailing, href, onClick, className = '' }: Props) {
  const content = (
    <>
      {icon && <div className={`list-icon ${iconClass || ''}`}>{icon}</div>}
      <div className="list-content">
        <div className="list-title">{title}</div>
        {subtitle && <div className="list-subtitle">{subtitle}</div>}
      </div>
      {trailing && <div className="list-trailing">{trailing}</div>}
    </>
  )

  if (href) {
    return <Link to={href} className={`list-item ${className}`}>{content}</Link>
  }

  return <div className={`list-item ${className}`} onClick={onClick}>{content}</div>
}
