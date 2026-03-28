interface Props {
  icon: string
  title: string
  meta: string
  unread?: boolean
  variant?: 'default' | 'warning' | 'info' | 'success'
  showSwipeHint?: boolean
  onMarkRead?: () => void
}

const iconCircleMap: Record<string, string> = {
  info: 'icon-circle-teal',
  warning: 'icon-circle-warning',
  success: 'icon-circle-success',
  default: 'icon-circle-teal',
}

export default function NotifItem({ icon, title, meta, unread, variant = 'default', showSwipeHint, onMarkRead }: Props) {
  const bgClass = unread
    ? variant === 'warning' ? 'notif-unread-warning' : 'notif-unread'
    : ''
  const circleClass = iconCircleMap[variant] || 'icon-circle-teal'

  return (
    <div
      className={`notif-item ${bgClass} mb-2${unread && onMarkRead ? ' cursor-pointer' : ''}`}
      onClick={unread && onMarkRead ? onMarkRead : undefined}
      role={unread && onMarkRead ? 'button' : undefined}
      tabIndex={unread && onMarkRead ? 0 : undefined}
      onKeyDown={unread && onMarkRead ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onMarkRead() } } : undefined}
      aria-label={unread && onMarkRead ? `Marcar como lida: ${title}` : undefined}
    >
      <div className={`notif-icon ${circleClass}`}>
        <i className={`ph ph-${icon}`} />
      </div>
      <div className="notif-body">
        <div className="notif-title">{title}</div>
        <div className="notif-meta">{meta}</div>
      </div>
      {unread && <div className="notif-dot notif-dot-pulse" />}
      {showSwipeHint && (
        <div className="notif-swipe-hint" aria-hidden="true">
          <i className="ph ph-caret-left" />
        </div>
      )}
    </div>
  )
}
