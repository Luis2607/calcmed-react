interface Props {
  options: { value: string; label: string }[]
  value: string
  onChange: (val: string) => void
}

export default function SegmentedControl({ options, value, onChange }: Props) {
  return (
    <div className="segmented">
      {options.map(opt => (
        <button
          key={opt.value}
          className={`seg-option ${value === opt.value ? 'active' : ''}`}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
