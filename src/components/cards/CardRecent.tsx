import { ClockCounterClockwise } from '@phosphor-icons/react'

interface Props {
  name: string
  time: string
}

export default function CardRecent({ name, time }: Props) {
  return (
    <div className="card-recent">
      <ClockCounterClockwise size={18} className="recent-icon" />
      <span className="recent-name">{name}</span>
      <span className="recent-time">{time}</span>
    </div>
  )
}
