import { useState, useRef, useCallback, type ReactNode, type KeyboardEvent } from 'react'
import { CaretRight, Siren, Eyedropper, Calculator, ClipboardText, ChartBar, ArrowsLeftRight } from '@phosphor-icons/react'

type Domain = 'urg' | 'dil' | 'calc' | 'prot' | 'esc' | 'conv'

const iconMap: Record<string, typeof Siren> = {
  siren: Siren,
  eyedropper: Eyedropper,
  calculator: Calculator,
  'clipboard-text': ClipboardText,
  'chart-bar': ChartBar,
  'arrows-left-right': ArrowsLeftRight,
}

interface Props {
  icon: string
  domain: Domain
  name: string
  count: number
  defaultOpen?: boolean
  children: ReactNode
}

export default function CategoryCollapse({ icon, domain, name, count, defaultOpen = false, children }: Props) {
  const [open, setOpen] = useState(defaultOpen)
  const [pulse, setPulse] = useState(false)
  const countRef = useRef<HTMLSpanElement>(null)
  const IconComponent = iconMap[icon]

  const toggle = useCallback(() => {
    const next = !open
    setOpen(next)
    if (next) {
      setPulse(true)
      setTimeout(() => setPulse(false), 250)
    }
  }, [open])

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      toggle()
    }
  }

  return (
    <div className="category-collapse">
      <div
        className="category-header"
        onClick={toggle}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-expanded={open}
        aria-label={`${name}, ${count} itens`}
      >
        <div className={`cat-icon ${domain}`}>
          {IconComponent ? <IconComponent size={20} /> : <i className={`ph ph-${icon}`} />}
        </div>
        <span className="cat-name">{name}</span>
        <span ref={countRef} className={`cat-count${pulse ? ' pulse' : ''}`}>{count}</span>
        <CaretRight size={16} className={`cat-chevron ${open ? 'open' : ''}`} />
      </div>
      <div className={`category-body ${open ? 'open' : ''}`}>
        <div className="grid-2col">
          {children}
        </div>
      </div>
    </div>
  )
}
