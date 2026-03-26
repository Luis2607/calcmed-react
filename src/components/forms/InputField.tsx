interface Props {
  id?: string
  label: string
  type?: string
  placeholder?: string
  value?: string | number
  onChange?: (val: string) => void
  unit?: string
  error?: string
  inputMode?: 'text' | 'numeric' | 'decimal'
  min?: number
  max?: number
  step?: number
  className?: string
}

export default function InputField({ id, label, type = 'text', placeholder, value, onChange, unit, error, inputMode, min, max, step, className = '' }: Props) {
  return (
    <div className={`input-group ${error ? 'error' : ''} ${className}`}>
      <label htmlFor={id} className="input-label">{label}</label>
      {unit ? (
        <div className="input-with-unit">
          <input
            className="input-field"
            id={id}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={e => onChange?.(e.target.value)}
            inputMode={inputMode}
            min={min}
            max={max}
            step={step}
          />
          <span className="input-unit">{unit}</span>
        </div>
      ) : (
        <input
          className="input-field"
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={e => onChange?.(e.target.value)}
          inputMode={inputMode}
          min={min}
          max={max}
          step={step}
        />
      )}
      {error && <div className="input-error">{error}</div>}
    </div>
  )
}
