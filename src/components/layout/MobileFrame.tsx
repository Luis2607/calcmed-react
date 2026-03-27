import type { ReactNode } from 'react'
import { useTheme } from '../../contexts/ThemeContext'

interface Props {
  children: ReactNode
  className?: string
  darkFrame?: boolean
}

export default function MobileFrame({ children, className = '', darkFrame }: Props) {
  const { resolvedTheme } = useTheme()
  return (
    <div className={`mobile-frame ${resolvedTheme} ${darkFrame ? 'dark-frame' : ''} ${className}`}>
      {children}
    </div>
  )
}
