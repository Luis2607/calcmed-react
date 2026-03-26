interface Props {
  icon: string
  iconClass?: string
  title: string
  meta: string
  unread?: boolean
  variant?: 'default' | 'warning' | 'info'
}

export default function NotifItem({ icon, iconClass, title, meta, unread, variant = 'default' }: Props) {
  const bgClass = variant === 'warning' ? 'notif-unread-warning' : variant === 'info' || unread ? 'notif-unread' : ''
  return (
    <div className={`notif-item ${bgClass} mb-2`}>
      <div className={`list-icon ${iconClass || ''}`}><i className={`ph ph-${icon}`} /></div>
      <div className="list-content">
        <div className="list-title">{title}</div>
        <div className="notif-meta">{meta}</div>
      </div>
      {unread && <div className="notif-dot" />}
    </div>
  )
}
