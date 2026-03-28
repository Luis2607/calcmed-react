interface Props {
  id: string
  label: string
  type?: string
  placeholder?: string
  value?: string | number
  onChange?: (val: string) => void
  onBlur?: () => void
  unit?: string
  error?: string
  inputMode?: 'text' | 'numeric' | 'decimal'
  min?: number
  max?: number
  step?: number
  className?: string
  autoFocus?: boolean
}

export default function InputField({ id, label, type = 'text', placeholder, value, onChange, onBlur, unit, error, inputMode, min, max, step, className = '', autoFocus }: Props) {
  const errorId = error ? `${id}-error` : undefined

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
            onBlur={onBlur}
            inputMode={inputMode}
            min={min}
            max={max}
            step={step}
            aria-invalid={error ? true : undefined}
            aria-describedby={errorId}
            autoFocus={autoFocus}
          />
          <span className="input-unit t-legenda text-fg-3">{unit}</span>
        </div>
      ) : (
        <input
          className="input-field"
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={e => onChange?.(e.target.value)}
          onBlur={onBlur}
          inputMode={inputMode}
          min={min}
          max={max}
          step={step}
          aria-invalid={error ? true : undefined}
          aria-describedby={errorId}
          autoFocus={autoFocus}
        />
      )}
      {error && <div className="input-error" id={errorId} role="alert">{error}</div>}
    </div>
  )
}
