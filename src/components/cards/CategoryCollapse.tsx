import { useState } from 'react'
import type { ReactNode } from 'react'
import { CaretRight } from '@phosphor-icons/react'

type Domain = 'urg' | 'dil' | 'calc' | 'prot' | 'esc' | 'conv'

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

  return (
    <div className="category-collapse mb-3">
      <div className="category-header" onClick={() => setOpen(!open)}>
        <div className={`cat-icon ${domain}`}><i className={`ph ph-${icon}`} /></div>
        <span className="cat-name">{name}</span>
        <span className="cat-count">{count}</span>
        <CaretRight size={16} className={`cat-chevron ${open ? 'open' : ''}`} />
      </div>
      {open && (
        <div className="category-body open">
          <div className="grid-2col">{children}</div>
        </div>
      )}
    </div>
  )
}
