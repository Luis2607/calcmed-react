import type { KeyboardEvent } from 'react'

interface Props {
  period: 'Anual' | 'Mensal'
  price: string
  suffix: string
  dailyPrice?: string
  savings?: string
  selected?: boolean
  badge?: string
  onClick?: () => void
}

export default function PlanCard({ period, price, suffix, dailyPrice, savings, selected, badge, onClick }: Props) {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onClick?.()
    }
  }

  return (
    <div
      className={`plan-card ${selected ? 'selected' : ''}`}
      onClick={onClick}
      role="radio"
      aria-checked={selected}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label={`Plano ${period}, ${price}${suffix}${dailyPrice ? `, ${dailyPrice}` : ''}${savings ? `, ${savings}` : ''}`}
    >
      {badge && (
        <div className="plan-badge">
          <span className="tag-status premium">{badge}</span>
        </div>
      )}
      <div className="flex items-center justify-between mt-2">
        <div>
          <div className="t-alerta-titulo">{period}</div>
          <div className={`${selected ? 't-preco-destaque' : 't-preco'} mt-1`}>
            {price}<span className="t-legenda text-fg-3">{suffix}</span>
          </div>
        </div>
        {(dailyPrice || savings) && (
          <div className="text-right">
            {dailyPrice && <div className="t-texto-badge text-link">{dailyPrice}</div>}
            {savings && <div className="t-legenda text-success mt-1">{savings}</div>}
          </div>
        )}
      </div>
    </div>
  )
}
