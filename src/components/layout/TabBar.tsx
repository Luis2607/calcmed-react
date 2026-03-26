import { useState } from 'react'

interface Props {
  tabs: string[]
  defaultActive?: number
  onChange?: (index: number) => void
}

export default function TabBar({ tabs, defaultActive = 0, onChange }: Props) {
  const [active, setActive] = useState(defaultActive)

  return (
    <div className="tabs">
      {tabs.map((label, i) => (
        <button
          key={label}
          className={`tab ${i === active ? 'active' : ''}`}
          onClick={() => { setActive(i); onChange?.(i) }}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
