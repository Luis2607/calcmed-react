import { useState } from 'react'

interface Props {
  tabs: string[]
  defaultActive?: number
  onChange?: (index: number) => void
}

export default function SubheaderBar({ tabs, defaultActive = 0, onChange }: Props) {
  const [active, setActive] = useState(defaultActive)

  return (
    <div className="subheader-bar">
      <div className="toggle-seg">
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
    </div>
  )
}
