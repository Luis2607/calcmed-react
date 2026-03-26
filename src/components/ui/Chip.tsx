interface Props {
  label: string
  domain?: 'urg' | 'dil' | 'calc' | 'prot' | 'esc' | 'conv'
  active?: boolean
  onClick?: () => void
}

export default function Chip({ label, domain, active, onClick }: Props) {
  const classes = ['chip', domain, active && 'active'].filter(Boolean).join(' ')
  return <button className={classes} onClick={onClick}>{label}</button>
}
