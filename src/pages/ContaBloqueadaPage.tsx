import { useState, useEffect } from 'react'
import { Lock } from '@phosphor-icons/react'
import MobileFrame from '../components/layout/MobileFrame'
import AuthWebLayout from '../components/layout/AuthWebLayout'
import Button from '../components/ui/Button'
import { useLayout } from '../contexts/LayoutContext'

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function ContaBloqueadaPage() {
  const { layoutMode } = useLayout()
  const [remaining, setRemaining] = useState(15 * 60)

  useEffect(() => {
    if (remaining <= 0) return
    const timer = setTimeout(() => setRemaining(r => r - 1), 1000)
    return () => clearTimeout(timer)
  }, [remaining])

  const content = (
    <div className="feedback-sent p-6">
      <div className="icon-circle icon-circle-danger" aria-hidden="true"><Lock size={24} /></div>
      <div className="msg">
        Sua conta foi bloqueada temporariamente por excesso de tentativas.
        {remaining > 0
          ? <> Tente novamente em <strong>{formatTime(remaining)}</strong>.</>
          : <> Você já pode tentar novamente.</>
        }
      </div>
    </div>
  )

  if (layoutMode === 'web') {
    return (
      <AuthWebLayout>
        <div className="mb-6">
          <h2 className="t-titulo-pagina">Conta bloqueada</h2>
        </div>

        <div className="flex flex-col gap-4">
          {content}
          <Button variant="primary" size="md" href="/login/recuperar-email" fullWidth>
            Recuperar senha
          </Button>
          <div className="text-center">
            <Button variant="text" href="/app">Voltar para o login</Button>
          </div>
          <div className="text-center">
            <Button variant="discrete">Precisa de ajuda? Contate o suporte</Button>
          </div>
        </div>
      </AuthWebLayout>
    )
  }

  return (
    <MobileFrame darkFrame>
      <div className="hero-dark flex-1">
        <div className="carousel-bg" aria-hidden="true">
          <div className="slide-bg active" style={{ backgroundImage: "url('/assets/slide-1.png')" }} />
        </div>
        <div className="hero-brand">
          <img src="/assets/Icone.svg" width={72} height={72} alt="CalcMed" className="brand-icon" />
          <div className="text-center">
            <div className="t-marca">Calc<span className="dot">.</span>Med</div>
            <div className="t-texto-badge brand-sub mt-1">Urgência e Emergência</div>
          </div>
          <div className="carousel-text mt-4" aria-hidden="true">
            <div className="slide-text active">Doses calculadas em segundos no PS</div>
          </div>
          <div className="dots mt-3" aria-hidden="true">
            <div className="active" /><div className="inactive" /><div className="inactive" />
          </div>
        </div>
      </div>

      <div className="bottom-sheet bottom-sheet-lg pb-8">
        <div className="sheet-header">
          <div className="title">Conta bloqueada</div>
        </div>
        {content}
        <Button variant="primary" size="lg" href="/login/recuperar-email" fullWidth className="mt-auto">
          Recuperar senha
        </Button>
        <div className="text-center">
          <Button variant="text" href="/app">Voltar para o login</Button>
        </div>
        <div className="text-center">
          <Button variant="discrete">Precisa de ajuda? Contate o suporte</Button>
        </div>
      </div>
    </MobileFrame>
  )
}
