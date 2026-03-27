import MobileFrame from '../components/layout/MobileFrame'
import BottomNav from '../components/layout/BottomNav'
import ChatBubble from '../components/chat/ChatBubble'
import ChatSuggestions from '../components/chat/ChatSuggestions'
import ChatInputBar from '../components/chat/ChatInputBar'
import { Sparkle, Info } from '@phosphor-icons/react'

export default function IAChatPage() {
  return (
    <MobileFrame>
      {/* HEADER */}
      <div className="home-header">
        <Sparkle size={24} className="text-link" />
        <div className="flex-1">
          <div className="t-alerta-titulo">CalcMed IA</div>
          <div className="t-legenda text-fg-3">Assistente clínico</div>
        </div>
      </div>

      {/* DISCLAIMER */}
      <div className="disclaimer-card">
        <Info size={16} />
        <span>As respostas são sugestões baseadas em evidências. Sempre valide com seu julgamento clínico.</span>
      </div>

      {/* CHAT AREA */}
      <div className="chat-area" role="log" aria-live="polite">
        <ChatBubble>
          Olá, Dr. Rafael. Como posso ajudar no seu plantão?
        </ChatBubble>

        <ChatSuggestions
          suggestions={['Dose de Noradrenalina', 'Critérios de intubação', 'Manejo de hipercalemia']}
          onSelect={() => {}}
        />

        <ChatBubble isUser>
          Qual a dose de ataque de Noradrenalina?
        </ChatBubble>

        <ChatBubble>
          <strong>Noradrenalina - Dose de ataque</strong><br /><br />
          Iniciar com <strong>0,05 a 0,1 mcg/kg/min</strong> e titular conforme PAM alvo (&#8805;65 mmHg).<br /><br />
          <strong>Diluição padrão:</strong> 4 ampolas (16mg) + SF 234mL = 64 mcg/mL<br /><br />
          <em className="t-legenda text-fg-3">Fonte: Surviving Sepsis Campaign 2021</em>
        </ChatBubble>
      </div>

      {/* INPUT BAR */}
      <ChatInputBar onSend={() => {}} />

      <BottomNav />
    </MobileFrame>
  )
}
