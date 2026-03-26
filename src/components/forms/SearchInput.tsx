import { MagnifyingGlass, X } from '@phosphor-icons/react'

interface Props {
  value: string
  onChange: (val: string) => void
  onClear: () => void
  placeholder?: string
}

export default function SearchInput({ value, onChange, onClear, placeholder = 'Buscar...' }: Props) {
  return (
    <div className="search-bar">
      <MagnifyingGlass size={20} />
      <input
        className="search-input"
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus
      />
      {value && <X size={18} className="text-fg-3 cursor-pointer" onClick={onClear} />}
    </div>
  )
}
