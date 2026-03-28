export default function TypingIndicator() {
  return (
    <div className="chat-bubble-wrapper ia chat-msg-enter">
      <div className="chat-bubble ia chat-typing" aria-label="CalcMed IA est\u00e1 digitando">
        <div className="typing-dots">
          <span className="typing-dot" />
          <span className="typing-dot" />
          <span className="typing-dot" />
        </div>
        <span className="t-legenda text-fg-3 typing-label">CalcMed IA est\u00e1 digitando...</span>
      </div>
    </div>
  )
}
