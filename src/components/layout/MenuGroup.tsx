import type { ReactNode } from 'react'

interface Props {
  label?: string
  children: ReactNode
}

export default function MenuGroup({ label, children }: Props) {
  return (
    <>
      {label && <div className="t-texto-badge text-fg-3 mb-3 uppercase tracking-wide">{label}</div>}
      <div className="menu-group">{children}</div>
    </>
  )
}
