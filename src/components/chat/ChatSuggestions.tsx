import Chip from '../ui/Chip'

interface Props {
  suggestions: string[]
  onSelect: (s: string) => void
}

export default function ChatSuggestions({ suggestions, onSelect }: Props) {
  return (
    <div className="chat-suggestions">
      {suggestions.map(s => <Chip key={s} label={s} onClick={() => onSelect(s)} />)}
    </div>
  )
}
