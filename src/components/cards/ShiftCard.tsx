import { CaretRight, CaretDown, MapPin, Clock } from '@phosphor-icons/react'

interface Props {
  hospital: string
  date: string
  time: string
  color: string
  expanded?: boolean
  onTap?: () => void
}

export default function ShiftCard({ hospital, date, time, color, expanded, onTap }: Props) {
  return (
    <div
      className={`shift-card ${expanded ? 'shift-card-expanded' : ''}`}
      onClick={onTap}
      role="button"
      tabIndex={0}
      aria-expanded={expanded}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onTap?.() } }}
    >
      <span className="shift-dot" style={{ background: color }} />
      <div className="shift-info">
        <div className="shift-hospital">{hospital}</div>
        <div className="shift-time">{date} · {time}</div>
      </div>
      {expanded ? (
        <CaretDown size={16} className="text-fg-3" />
      ) : (
        <CaretRight size={16} className="text-fg-3" />
      )}

      {/* Expanded detail */}
      {expanded && (
        <div className="shift-detail">
          <div className="shift-detail-row">
            <MapPin size={16} weight="duotone" />
            <span>{hospital}</span>
          </div>
          <div className="shift-detail-row">
            <Clock size={16} weight="duotone" />
            <span>{date} — {time}</span>
          </div>
          <div className="shift-detail-note">
            Toque para editar detalhes do plantão
          </div>
        </div>
      )}
    </div>
  )
}
