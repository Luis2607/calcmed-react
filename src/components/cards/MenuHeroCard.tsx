import type { ReactNode, KeyboardEvent } from 'react'
import { Link } from 'react-router-dom'
import { PlayCircle } from '@phosphor-icons/react'

interface Props {
  icon: ReactNode
  title: string
  subtitle: string
  href?: string
  onClick?: () => void
}

export default function MenuHeroCard({ icon, title, subtitle, href, onClick }: Props) {
  const inner = (
    <>
      <div className="hero-icon" aria-hidden="true">{icon}</div>
      <div className="hero-content">
        <div className="hero-title">{title}</div>
        <div className="hero-sub">{subtitle}</div>
      </div>
      <PlayCircle size={24} className="hero-arrow" aria-hidden="true" />
    </>
  )

  if (href) {
    return (
      <Link to={href} className="menu-hero-card" aria-label={title}>
        {inner}
      </Link>
    )
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onClick?.()
    }
  }

  return (
    <div
      className="menu-hero-card"
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      aria-label={title}
    >
      {inner}
    </div>
  )
}
