interface Props {
  initials: string
  size?: 'sm' | 'md' | 'lg'
  color?: string
}

export default function Avatar({ initials, size = 'sm', color = 'teal' }: Props) {
  return <div className={`avatar avatar-${size} avatar-${color}`}>{initials}</div>
}
