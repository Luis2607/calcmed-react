import type { ReactNode } from 'react'

type Level = 'info' | 'result' | 'critical' | 'warning' | 'footnote'

interface Props {
  level: Level
  icon?: string
  title?: string
  children?: ReactNode
  className?: string
}

const levelMap: Record<Level, string> = {
  info: 'alert-info',
  result: 'alert-result',
  critical: 'alert-critical',
  warning: 'alert-warning',
  footnote: 'alert-footnote',
}

export default function AlertCard({ level, icon, title, children, className = '' }: Props) {
  return (
    <div className={`alert-card ${levelMap[level]} ${className}`}>
      {icon && <i className={`ph ph-${icon} alert-icon`} />}
      <div className="alert-content">
        {title && <div className="alert-title">{title}</div>}
        {children && <div className="alert-body">{children}</div>}
      </div>
    </div>
  )
}
