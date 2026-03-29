import { CheckCircle } from '@phosphor-icons/react'
import MobileFrame from '../components/layout/MobileFrame'
import AuthWebLayout from '../components/layout/AuthWebLayout'
import Button from '../components/ui/Button'
import { useLayout } from '../contexts/LayoutContext'

export default function SenhaAlteradaPage() {
  const { layoutMode } = useLayout()

  if (layoutMode === 'web') {
    return (
      <AuthWebLayout>
        <div className="mb-6">
          <h2 className="t-titulo-pagina">Senha alterada!</h2>
        </div>

        <div className="flex flex-col gap-4">
          <div className="feedback-sent p-6">
            <div className="icon-circle icon-circle-teal" aria-hidden="true"><CheckCircle size={24} /></div>
            <div className="msg">Sua senha foi redefinida com sucesso. Você já pode fazer login com a nova senha.</div>
          </div>
          <Button variant="primary" size="md" href="/app" fullWidth>Fazer login</Button>
        </div>
      </AuthWebLayout>
    )
  }

  return (
    <MobileFrame darkFrame>
      <div className="hero-dark flex-1">
        <div className="carousel-bg" aria-hidden="true">
          <div className="slide-bg active" style={{ backgroundImage: "url('/assets/slide-2.png')" }} />
        </div>
        <div className="hero-brand">
          <img src="/assets/Icone.svg" width={72} height={72} alt="CalcMed" className="brand-icon" />
          <div className="text-center">
            <div className="t-marca">Calc<span className="dot">.</span>Med</div>
            <div className="t-texto-badge brand-sub mt-1">Urgência e Emergência</div>
          </div>
          <div className="carousel-text mt-4" aria-hidden="true">
            <div className="slide-text active">Funciona 100% offline na UTI</div>
          </div>
          <div className="dots mt-3" aria-hidden="true">
            <div className="inactive" /><div className="active" /><div className="inactive" />
          </div>
        </div>
      </div>

      <div className="bottom-sheet bottom-sheet-lg pb-8">
        <div className="sheet-header">
          <div className="title">Senha alterada!</div>
        </div>
        <div className="feedback-sent">
          <div className="icon-circle icon-circle-teal" aria-hidden="true"><CheckCircle size={24} /></div>
          <div className="msg">Sua senha foi redefinida com sucesso. Você já pode fazer login com a nova senha.</div>
        </div>
        <Button variant="primary" size="lg" href="/app" fullWidth className="mt-auto">Fazer login</Button>
      </div>
    </MobileFrame>
  )
}
