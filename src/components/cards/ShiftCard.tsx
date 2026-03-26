import { CaretRight } from '@phosphor-icons/react'

interface Props {
  hospital: string
  date: string
  time: string
  color: string
}

export default function ShiftCard({ hospital, date, time, color }: Props) {
  return (
    <div className="shift-card">
      <span className="shift-dot" style={{ background: color }} />
      <div className="shift-info">
        <div className="shift-hospital">{hospital}</div>
        <div className="shift-time">{date} · {time}</div>
      </div>
      <CaretRight size={16} className="text-fg-3" />
    </div>
  )
}
