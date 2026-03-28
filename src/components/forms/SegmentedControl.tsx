interface Props {
  options: { value: string; label: string }[]
  value: string
  onChange: (val: string) => void
  id?: string
}

export default function SegmentedControl({ options, value, onChange, id }: Props) {
  return (
    <div className="segmented" id={id} role="radiogroup" aria-labelledby={id ? `${id}-label` : undefined}>
      {options.map(opt => (
        <button
          key={opt.value}
          type="button"
          role="radio"
          aria-checked={value === opt.value}
          className={`seg-option ${value === opt.value ? 'active' : ''}`}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
