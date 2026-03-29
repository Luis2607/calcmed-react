import { useState } from 'react'
import MobileFrame from '../components/layout/MobileFrame'
import PageHeader from '../components/layout/PageHeader'
import BottomNav from '../components/layout/BottomNav'
import { EnvelopeSimple, WhatsappLogo, Question, PaperPlaneRight, CheckCircle } from '@phosphor-icons/react'

export default function SuportePage() {
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)

  const handleSend = () => {
    if (message.trim()) {
      setSent(true)
      setMessage('')
    }
  }

  return (
    <MobileFrame>
      <PageHeader title="Sugestao e Suporte" backTo="/menu" />

      <div className="screen-content flex-1 overflow-y-auto p-5">
        {sent ? (
          <div className="empty-state mt-6 feedback-sent" role="status" aria-live="polite">
            <div className="empty-icon text-success">
              <CheckCircle size={48} weight="duotone" />
            </div>
            <div className="empty-title">Mensagem enviada!</div>
            <div className="empty-desc">Obrigado pelo seu feedback. Responderemos em ate 48 horas.</div>
            <button
              className="btn btn-secondary mt-4"
              onClick={() => setSent(false)}
            >
              Enviar outra mensagem
            </button>
          </div>
        ) : (
          <>
            {/* Message form */}
            <div className="suporte-form">
              <label className="t-legenda text-fg-3 mb-2 block" htmlFor="suporte-msg">
                Descreva sua sugestao ou problema
              </label>
              <textarea
                id="suporte-msg"
                className="suporte-textarea"
                placeholder="Conte-nos como podemos melhorar o CalcMed..."
                value={message}
                onChange={e => setMessage(e.target.value)}
                rows={5}
              />
              <button
                className="btn btn-primary w-full mt-4"
                onClick={handleSend}
                disabled={!message.trim()}
              >
                <PaperPlaneRight size={18} />
                <span>Enviar</span>
              </button>
            </div>

            {/* Divider */}
            <div className="suporte-divider">
              <span className="suporte-divider-text t-legenda text-fg-3">ou entre em contato</span>
            </div>

            {/* Contact options */}
            <div className="suporte-options">
              <a href="mailto:suporte@calcmed.com.br" className="suporte-option">
                <div className="suporte-option-icon icon-circle-teal">
                  <EnvelopeSimple size={20} />
                </div>
                <div className="suporte-option-content">
                  <div className="t-alerta-titulo">Email</div>
                  <div className="t-legenda text-fg-3">suporte@calcmed.com.br</div>
                </div>
              </a>

              <a href="https://wa.me/5500000000000" target="_blank" rel="noopener noreferrer" className="suporte-option">
                <div className="suporte-option-icon" style={{ background: 'var(--success-bg)', color: 'var(--success)' }}>
                  <WhatsappLogo size={20} />
                </div>
                <div className="suporte-option-content">
                  <div className="t-alerta-titulo">WhatsApp</div>
                  <div className="t-legenda text-fg-3">Resposta rapida</div>
                </div>
              </a>

              <a href="#" className="suporte-option">
                <div className="suporte-option-icon" style={{ background: 'var(--warning-bg)', color: 'var(--warning)' }}>
                  <Question size={20} />
                </div>
                <div className="suporte-option-content">
                  <div className="t-alerta-titulo">Perguntas Frequentes</div>
                  <div className="t-legenda text-fg-3">Tire duvidas comuns</div>
                </div>
              </a>
            </div>
          </>
        )}
      </div>

      <BottomNav />
    </MobileFrame>
  )
}
