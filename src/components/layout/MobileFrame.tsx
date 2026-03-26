import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
  className?: string
  darkFrame?: boolean
}

export default function MobileFrame({ children, className = '', darkFrame }: Props) {
  return (
    <div className={`mobile-frame light ${darkFrame ? 'dark-frame' : ''} ${className}`}>
      {children}
    </div>
  )
}
