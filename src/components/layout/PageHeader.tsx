import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { CaretLeft } from '@phosphor-icons/react'

interface Props {
  title: string
  backTo?: string
  trailing?: ReactNode
}

export default function PageHeader({ title, backTo, trailing }: Props) {
  return (
    <div className="home-header">
      {backTo && (
        <Link to={backTo} className="back" aria-label="Voltar"><CaretLeft size={20} /></Link>
      )}
      <div className="t-alerta-titulo flex-1">{title}</div>
      {trailing}
    </div>
  )
}
