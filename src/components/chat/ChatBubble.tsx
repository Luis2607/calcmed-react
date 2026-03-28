import { type ReactNode, useState, useRef, useCallback } from 'react'

interface Props {
  isUser?: boolean
  timestamp?: string
  animated?: boolean
  children: ReactNode
}

export default function ChatBubble({ isUser, timestamp, animated, children }: Props) {
  const [showCopy, setShowCopy] = useState(false)
  const [copied, setCopied] = useState(false)
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const bubbleRef = useRef<HTMLDivElement>(null)

  const handlePointerDown = useCallback(() => {
    if (isUser) return
    longPressTimer.current = setTimeout(() => {
      setShowCopy(true)
    }, 500)
  }, [isUser])

  const handlePointerUp = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }
  }, [])

  const handleCopy = useCallback(async () => {
    if (bubbleRef.current) {
      const text = bubbleRef.current.innerText || ''
      try {
        await navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => {
          setCopied(false)
          setShowCopy(false)
        }, 1200)
      } catch {
        setShowCopy(false)
      }
    }
  }, [])

  const handleDismissCopy = useCallback(() => {
    setShowCopy(false)
    setCopied(false)
  }, [])

  return (
    <div
      className={`chat-bubble-wrapper ${isUser ? 'user' : 'ia'}${animated ? ' chat-msg-enter' : ''}`}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onContextMenu={e => { if (!isUser) e.preventDefault() }}
    >
      <div ref={bubbleRef} className={`chat-bubble ${isUser ? 'user' : 'ia'}`}>
        <div className="t-corpo-2">{children}</div>
        {timestamp && (
          <time className="t-legenda chat-bubble-time">{timestamp}</time>
        )}
      </div>
      {showCopy && !isUser && (
        <div className="chat-copy-overlay" onClick={handleDismissCopy}>
          <button
            className="chat-copy-btn"
            onClick={e => { e.stopPropagation(); handleCopy() }}
            aria-label="Copiar resposta"
          >
            {copied ? 'Copiado!' : 'Copiar'}
          </button>
        </div>
      )}
    </div>
  )
}
