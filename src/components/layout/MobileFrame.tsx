import type { ReactNode } from 'react'
import { useTheme } from '../../contexts/ThemeContext'
import { useLayout } from '../../contexts/LayoutContext'

interface Props {
  children: ReactNode
  className?: string
  darkFrame?: boolean
}

export default function MobileFrame({ children, className = '', darkFrame }: Props) {
  const { resolvedTheme } = useTheme()
  const { layoutMode } = useLayout()

  if (layoutMode === 'web') {
    return (
      <div className={`web-layout ${resolvedTheme} ${darkFrame ? 'dark-frame' : ''} ${className}`}>
        {children}
      </div>
    )
  }

  return (
    <div className={`mobile-frame ${resolvedTheme} ${darkFrame ? 'dark-frame' : ''} ${className}`}>
      {children}
    </div>
  )
}
