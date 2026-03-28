import { useRef, useEffect } from 'react'
import { MagnifyingGlass, X } from '@phosphor-icons/react'

interface Props {
  value: string
  onChange: (val: string) => void
  onClear: () => void
  placeholder?: string
  id?: string
  autoFocus?: boolean
}

export default function SearchInput({ value, onChange, onClear, placeholder = 'Buscar...', id = 'search-input', autoFocus = false }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      // Small delay to ensure DOM is ready (helps on mobile)
      const timer = setTimeout(() => inputRef.current?.focus(), 50)
      return () => clearTimeout(timer)
    }
  }, [autoFocus])

  const handleClear = () => {
    onClear()
    inputRef.current?.focus()
  }

  return (
    <div className="search-bar" role="search" aria-label="Busca de calculadoras e protocolos">
      <MagnifyingGlass size={20} aria-hidden="true" className="search-bar-icon" />
      <input
        ref={inputRef}
        id={id}
        className="search-input"
        type="search"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        aria-label={placeholder}
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
      />
      {value && (
        <button
          type="button"
          className="search-clear-btn search-clear-animated"
          onClick={handleClear}
          aria-label="Limpar busca"
        >
          <X size={18} aria-hidden="true" />
        </button>
      )}
    </div>
  )
}
