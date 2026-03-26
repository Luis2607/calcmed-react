import { PlayCircle } from '@phosphor-icons/react'

interface Props {
  icon: string
  title: string
  subtitle: string
  href?: string
}

export default function MenuHeroCard({ icon, title, subtitle }: Props) {
  return (
    <a className="menu-hero-card" href="#">
      <div className="hero-icon"><i className={`ph ph-${icon}`} /></div>
      <div className="hero-content">
        <div className="hero-title">{title}</div>
        <div className="hero-sub">{subtitle}</div>
      </div>
      <PlayCircle size={24} className="hero-arrow" />
    </a>
  )
}
