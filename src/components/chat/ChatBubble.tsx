import type { ReactNode } from 'react'

interface Props {
  isUser?: boolean
  children: ReactNode
}

export default function ChatBubble({ isUser, children }: Props) {
  return <div className={`chat-bubble ${isUser ? 'user' : 'ia'}`}>{children}</div>
}
