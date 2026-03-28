import Chip from '../ui/Chip'

interface Props {
  suggestions: string[]
  onSelect: (s: string) => void
}

export default function ChatSuggestions({ suggestions, onSelect }: Props) {
  return (
    <div className="chat-suggestions" role="group" aria-label="Sugestões de perguntas">
      {suggestions.map(s => <Chip key={s} label={s} onClick={() => onSelect(s)} ariaLabel={`Perguntar: ${s}`} />)}
    </div>
  )
}
