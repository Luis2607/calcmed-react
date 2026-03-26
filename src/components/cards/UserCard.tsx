import Avatar from '../ui/Avatar'

interface Props {
  initials: string
  name: string
  email: string
  status: 'free' | 'premium'
}

export default function UserCard({ initials, name, email, status }: Props) {
  return (
    <div className="user-card mb-6">
      <Avatar initials={initials} size="lg" />
      <div className="flex-1">
        <div className="t-alerta-titulo">{name}</div>
        <div className="t-legenda text-fg-3 mt-1">{email}</div>
      </div>
      <span className={`tag-status ${status}`}>{status === 'free' ? 'Free' : 'Premium'}</span>
    </div>
  )
}
