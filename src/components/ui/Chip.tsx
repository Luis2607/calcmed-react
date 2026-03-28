interface Props {
  label: string
  domain?: 'urg' | 'dil' | 'calc' | 'prot' | 'esc' | 'conv'
  active?: boolean
  onClick?: () => void
  ariaLabel?: string
}

export default function Chip({ label, domain, active, onClick, ariaLabel }: Props) {
  const classes = ['chip', 'chip-press', domain, active && 'active'].filter(Boolean).join(' ')
  return (
    <button
      type="button"
      className={classes}
      onClick={onClick}
      aria-label={ariaLabel || `Buscar ${label}`}
      aria-pressed={active}
    >
      {label}
    </button>
  )
}
