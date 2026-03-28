import React, { useState, useRef, useEffect, useCallback } from 'react'
import MobileFrame from '../components/layout/MobileFrame'
import BottomNav from '../components/layout/BottomNav'
import ChatBubble from '../components/chat/ChatBubble'
import ChatSuggestions from '../components/chat/ChatSuggestions'
import ChatInputBar from '../components/chat/ChatInputBar'
import TypingIndicator from '../components/chat/TypingIndicator'
import { Info } from '@phosphor-icons/react'
import HomeHeader from '../components/layout/HomeHeader'

interface Message {
  id: number
  text: string | React.ReactElement
  isUser?: boolean
  timestamp: string
}

/** Format dose values in IA responses with monospace code tags */
function formatDoseText(text: string): React.ReactElement {
  // Match numeric dose patterns: digits with optional decimals, commas, ranges, followed by units
  const dosePattern = /(\d[\d.,]*(?:\s*(?:a|[-–])\s*\d[\d.,]*)?)\s*(mcg\/kg\/min|mcg\/mL|mg\/kg|mg\/mL|mg\/h|mg|mL|mcg|mEq|UI|mmHg|mEq\/L|mmol\/L)/g
  const parts: (string | React.ReactElement)[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = dosePattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index))
    }
    parts.push(
      <code key={match.index} className="t-valor-mono chat-dose">
        {match[1]} {match[2]}
      </code>
    )
    lastIndex = match.index + match[0].length
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }

  return <>{parts}</>
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: 1,
    text: 'Ol\u00e1, Dr. Rafael. Como posso ajudar no seu plant\u00e3o?',
    timestamp: '14:32',
  },
]

const IA_RESPONSES: Record<string, React.ReactElement> = {
  'Dose de Noradrenalina': (
    <>
      <strong>Noradrenalina - Dose de ataque</strong><br /><br />
      Iniciar com <code className="t-valor-mono chat-dose">0,05 a 0,1 mcg/kg/min</code> e titular conforme PAM alvo ({'\u2265'}<code className="t-valor-mono chat-dose">65 mmHg</code>).<br /><br />
      <strong>Dilui\u00e7\u00e3o padr\u00e3o:</strong> 4 ampolas (<code className="t-valor-mono chat-dose">16 mg</code>) + SF <code className="t-valor-mono chat-dose">234 mL</code> = <code className="t-valor-mono chat-dose">64 mcg/mL</code><br /><br />
      <em className="t-legenda text-fg-3">Fonte: Surviving Sepsis Campaign 2021</em>
    </>
  ),
  'Crit\u00e9rios de intuba\u00e7\u00e3o': (
    <>
      <strong>Crit\u00e9rios para intuba\u00e7\u00e3o orotraqueal</strong><br /><br />
      <strong>Indica\u00e7\u00f5es absolutas:</strong><br />
      - Fal\u00eancia ventilat\u00f3ria (FR {'>'} <code className="t-valor-mono chat-dose">35</code> irpm, SpO2 {'<'} <code className="t-valor-mono chat-dose">90</code>% com O2)<br />
      - Glasgow {'<='} <code className="t-valor-mono chat-dose">8</code><br />
      - Incapacidade de proteger via a\u00e9rea<br /><br />
      <strong>Sequ\u00eancia r\u00e1pida (ISR):</strong><br />
      1. Pr\u00e9-oxigena\u00e7\u00e3o com O2 a <code className="t-valor-mono chat-dose">100</code>%<br />
      2. Fentanil <code className="t-valor-mono chat-dose">3 mcg/kg</code> IV<br />
      3. Lidoca\u00edna <code className="t-valor-mono chat-dose">1,5 mg/kg</code> IV<br />
      4. Propofol <code className="t-valor-mono chat-dose">2 mg/kg</code> ou Etomidato <code className="t-valor-mono chat-dose">0,3 mg/kg</code><br />
      5. Succinilcolina <code className="t-valor-mono chat-dose">1,5 mg/kg</code><br /><br />
      <em className="t-legenda text-fg-3">Fonte: ACLS 2020, Manual de Via A\u00e9rea Dif\u00edcil</em>
    </>
  ),
  'Manejo de hipercalemia': (
    <>
      <strong>Manejo de Hipercalemia</strong><br /><br />
      <strong>K+ {'>'} <code className="t-valor-mono chat-dose">6,5 mEq/L</code> ou com altera\u00e7\u00f5es ECG:</strong><br /><br />
      1. <strong>Gluconato de C\u00e1lcio 10%</strong> - <code className="t-valor-mono chat-dose">10 mL</code> IV em 2-3 min (estabiliza membrana)<br />
      2. <strong>Insulina regular</strong> <code className="t-valor-mono chat-dose">10 UI</code> + Glicose 50% <code className="t-valor-mono chat-dose">50 mL</code> IV<br />
      3. <strong>Salbutamol</strong> <code className="t-valor-mono chat-dose">10 mg</code> NBZ ou <code className="t-valor-mono chat-dose">0,5 mg</code> IV<br />
      4. <strong>Bicarbonato de S\u00f3dio</strong> <code className="t-valor-mono chat-dose">50 mEq</code> IV se acidose<br />
      5. <strong>Furosemida</strong> <code className="t-valor-mono chat-dose">40 mg</code> IV<br /><br />
      <em className="t-legenda text-fg-3">Fonte: AHA 2020, UpToDate 2024</em>
    </>
  ),
}

const DEFAULT_IA_RESPONSE = (
  <>
    Entendi sua pergunta. Deixe-me buscar as melhores evid\u00eancias para voc\u00ea.<br /><br />
    Por favor, seja mais espec\u00edfico sobre o cen\u00e1rio cl\u00ednico para que eu possa fornecer informa\u00e7\u00f5es mais precisas sobre dosagens e protocolos.<br /><br />
    <em className="t-legenda text-fg-3">Dica: tente perguntar sobre uma droga ou protocolo espec\u00edfico.</em>
  </>
)

function getCurrentTime(): string {
  const now = new Date()
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
}

/** Check if two timestamps are the same (within 1 min = same string since we use HH:MM) */
function shouldShowTimestamp(current: string, previous: string | undefined): boolean {
  if (!previous) return true
  return current !== previous
}

export default function IAChatPage() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES)
  const [isTyping, setIsTyping] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(true)
  const chatAreaRef = useRef<HTMLDivElement>(null)
  const nextId = useRef(2)

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      if (chatAreaRef.current) {
        chatAreaRef.current.scrollTo({
          top: chatAreaRef.current.scrollHeight,
          behavior: 'smooth',
        })
      }
    })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping, scrollToBottom])

  const addIAResponse = useCallback((userText: string) => {
    setIsTyping(true)
    setTimeout(() => {
      const time = getCurrentTime()
      const response = IA_RESPONSES[userText] || DEFAULT_IA_RESPONSE
      setMessages(prev => [
        ...prev,
        { id: nextId.current++, text: response, timestamp: time },
      ])
      setIsTyping(false)
    }, 1500)
  }, [])

  const handleSend = useCallback((text: string) => {
    const time = getCurrentTime()
    setMessages(prev => [
      ...prev,
      { id: nextId.current++, text: formatDoseText(text), isUser: true, timestamp: time },
    ])
    setShowSuggestions(false)
    addIAResponse(text)
  }, [addIAResponse])

  const handleSuggestionSelect = useCallback((suggestion: string) => {
    const time = getCurrentTime()
    setMessages(prev => [
      ...prev,
      { id: nextId.current++, text: suggestion, isUser: true, timestamp: time },
    ])
    setShowSuggestions(false)
    addIAResponse(suggestion)
  }, [addIAResponse])

  return (
    <MobileFrame>
      {/* HEADER */}
      <HomeHeader />

      {/* DISCLAIMER */}
      <div className="disclaimer-card" role="note" aria-label="Aviso importante">
        <Info size={16} className="disclaimer-icon" aria-hidden="true" />
        <span className="t-legenda">As respostas s\u00e3o sugest\u00f5es baseadas em evid\u00eancias. Sempre valide com seu julgamento cl\u00ednico.</span>
      </div>

      {/* CHAT AREA */}
      <div
        ref={chatAreaRef}
        className="chat-area"
        role="log"
        aria-label="Conversa com CalcMed IA"
        aria-live="polite"
        aria-relevant="additions"
      >
        {messages.map((msg, i) => {
          const prevTimestamp = i > 0 ? messages[i - 1].timestamp : undefined
          const showTime = shouldShowTimestamp(msg.timestamp, prevTimestamp)
          return (
            <ChatBubble
              key={msg.id}
              isUser={msg.isUser}
              timestamp={showTime ? msg.timestamp : undefined}
              animated
            >
              {msg.text}
            </ChatBubble>
          )
        })}

        {showSuggestions && (
          <ChatSuggestions
            suggestions={['Dose de Noradrenalina', 'Crit\u00e9rios de intuba\u00e7\u00e3o', 'Manejo de hipercalemia']}
            onSelect={handleSuggestionSelect}
          />
        )}

        {isTyping && <TypingIndicator />}
      </div>

      {/* INPUT BAR */}
      <ChatInputBar onSend={handleSend} />

      <BottomNav />
    </MobileFrame>
  )
}
