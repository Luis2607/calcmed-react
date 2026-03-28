import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

type LayoutMode = 'mobile' | 'web'

interface LayoutContextValue {
  layoutMode: LayoutMode
  setLayoutMode: (mode: LayoutMode) => void
  toggleLayout: () => void
  isDesktop: boolean
}

const LayoutContext = createContext<LayoutContextValue>({
  layoutMode: 'mobile',
  setLayoutMode: () => {},
  toggleLayout: () => {},
  isDesktop: false,
})

export function LayoutProvider({ children }: { children: ReactNode }) {
  const [layoutMode, setLayoutMode] = useState<LayoutMode>(
    () => (localStorage.getItem('calcmed-layout') as LayoutMode) || 'mobile'
  )
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    localStorage.setItem('calcmed-layout', layoutMode)
  }, [layoutMode])

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    const handler = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsDesktop(e.matches)
      if (!e.matches) {
        setLayoutMode(prev => prev === 'web' ? 'mobile' : prev)
      }
    }
    handler(mq)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const toggleLayout = () => setLayoutMode(m => (m === 'mobile' ? 'web' : 'mobile'))

  return (
    <LayoutContext.Provider value={{ layoutMode, setLayoutMode, toggleLayout, isDesktop }}>
      {children}
    </LayoutContext.Provider>
  )
}

export const useLayout = () => useContext(LayoutContext)
