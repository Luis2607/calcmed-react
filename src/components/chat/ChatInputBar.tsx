import { useState } from 'react'
import { PaperPlaneRight } from '@phosphor-icons/react'

interface Props {
  onSend: (msg: string) => void
}

export default function ChatInputBar({ onSend }: Props) {
  const [msg, setMsg] = useState('')

  const send = () => {
    if (!msg.trim()) return
    onSend(msg.trim())
    setMsg('')
  }

  return (
    <div className="chat-input-bar">
      <input
        type="text"
        placeholder="Pergunte algo..."
        value={msg}
        onChange={e => setMsg(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && send()}
      />
      <button className="btn-send" onClick={send}><PaperPlaneRight size={20} /></button>
    </div>
  )
}
