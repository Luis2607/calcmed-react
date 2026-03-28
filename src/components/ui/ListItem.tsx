import type { ReactNode, KeyboardEvent } from 'react'
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
  ariaLabel?: string
}

export default function ListItem({ icon, iconClass, title, subtitle, trailing, href, onClick, className = '', ariaLabel }: Props) {
  const content = (
    <>
      {icon && <div className={`list-icon ${iconClass || ''}`} aria-hidden="true">{icon}</div>}
      <div className="list-content">
        <div className="list-title">{title}</div>
        {subtitle && <div className="list-subtitle">{subtitle}</div>}
      </div>
      {trailing && <div className="list-trailing" aria-hidden="true">{trailing}</div>}
    </>
  )

  const handleKeyDown = (e: KeyboardEvent) => {
    if (onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault()
      onClick()
    }
  }

  if (href) {
    return (
      <Link to={href} className={`list-item ${className}`} aria-label={ariaLabel || title}>
        {content}
      </Link>
    )
  }

  return (
    <div
      className={`list-item ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? handleKeyDown : undefined}
      aria-label={ariaLabel || (subtitle ? `${title}, ${subtitle}` : title)}
    >
      {content}
    </div>
  )
}
