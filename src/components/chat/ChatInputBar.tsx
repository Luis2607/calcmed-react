import { useState, useCallback } from 'react'
import { PaperPlaneRight } from '@phosphor-icons/react'

interface Props {
  onSend: (msg: string) => void
}

export default function ChatInputBar({ onSend }: Props) {
  const [msg, setMsg] = useState('')
  const [sending, setSending] = useState(false)

  const send = useCallback(() => {
    if (!msg.trim() || sending) return
    setSending(true)
    onSend(msg.trim())
    setMsg('')
    // Reset animation state after animation completes
    setTimeout(() => setSending(false), 400)
  }, [msg, sending, onSend])

  return (
    <div className="chat-input-bar">
      <label htmlFor="chat-input" className="sr-only">Mensagem para CalcMed IA</label>
      <input
        id="chat-input"
        type="text"
        placeholder="Pergunte algo..."
        value={msg}
        onChange={e => setMsg(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && send()}
      />
      <button
        className={`btn-send${sending ? ' btn-send-animate' : ''}`}
        onClick={send}
        aria-label="Enviar mensagem"
        disabled={!msg.trim() && !sending}
      >
        <PaperPlaneRight size={20} aria-hidden="true" className={sending ? 'icon-spin' : ''} />
      </button>
    </div>
  )
}
