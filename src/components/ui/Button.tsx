import type { ReactNode, ButtonHTMLAttributes } from 'react'
import { Link } from 'react-router-dom'

type Variant = 'primary' | 'ghost' | 'text' | 'discrete' | 'google' | 'apple' | 'danger'
type Size = 'sm' | 'md' | 'lg'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  href?: string
  fullWidth?: boolean
  loading?: boolean
  children: ReactNode
}

export default function Button({
  variant = 'primary',
  size = 'md',
  href,
  fullWidth,
  loading,
  disabled,
  children,
  className = '',
  ...rest
}: Props) {
  const classes = [
    'btn',
    `btn-${size}`,
    `btn-${variant}`,
    fullWidth && 'w-full text-center',
    disabled && 'disabled',
    loading && 'loading',
    className,
  ].filter(Boolean).join(' ')

  if (href && !disabled) {
    return <Link to={href} className={classes} aria-disabled={disabled}>{children}</Link>
  }

  return (
    <button className={classes} disabled={disabled} {...rest}>
      {loading && <span className="btn-spinner" />}
      {children}
    </button>
  )
}
