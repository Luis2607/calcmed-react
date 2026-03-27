import { useState } from 'react'
import MobileFrame from '../components/layout/MobileFrame'
import PageHeader from '../components/layout/PageHeader'
import BottomNav from '../components/layout/BottomNav'
import PlanCard from '../components/cards/PlanCard'
import InputField from '../components/forms/InputField'
import Button from '../components/ui/Button'
import { Tag, ShieldCheck } from '@phosphor-icons/react'

export default function PlanosPage() {
  const [selected, setSelected] = useState<'anual' | 'mensal'>('anual')
  const [showCoupon, setShowCoupon] = useState(false)

  return (
    <MobileFrame>
      <PageHeader title="Escolha seu plano" backTo="/premium" />

      <div className="screen-content flex-1 overflow-y-auto p-5 pb-8">
        {/* Proposta de valor */}
        <div className="text-center mb-6">
          <div className="t-titulo-pagina mb-2">Acesso completo ao seu plantão</div>
          <p className="t-corpo-2 text-fg-2">Todas as calculadoras, protocolos e escores sem limitações.</p>
        </div>

        {/* Card Anual */}
        <div className="mb-3">
          <PlanCard
            period="Anual"
            price="R$ 149,90"
            suffix="/ano"
            dailyPrice="R$ 0,41/dia"
            savings="Economia de R$ 28,90"
            badge="Mais escolhido"
            selected={selected === 'anual'}
            onClick={() => setSelected('anual')}
          />
        </div>

        {/* Card Mensal */}
        <div className="mb-6">
          <PlanCard
            period="Mensal"
            price="R$ 14,90"
            suffix="/mês"
            selected={selected === 'mensal'}
            onClick={() => setSelected('mensal')}
          />
        </div>

        {/* Cupom */}
        <div className="mb-6">
          <button
            type="button"
            className="btn-text t-corpo-2"
            onClick={() => setShowCoupon(v => !v)}
          >
            <Tag size={16} className="mr-1" /> Tem cupom?
          </button>
          {showCoupon && (
            <div className="flex gap-3 mt-3 items-end">
              <InputField id="cupom" label="Código do cupom" placeholder="Digite o cupom" className="flex-1" />
              <Button variant="primary" size="md">Aplicar</Button>
            </div>
          )}
        </div>

        {/* Confiança */}
        <div className="flex items-center justify-center gap-2 text-fg-3">
          <ShieldCheck size={16} />
          <span className="t-legenda">Pagamento seguro · Cancele quando quiser</span>
        </div>
      </div>

      {/* CTA FIXO */}
      <div className="sticky-footer">
        <Button variant="primary" size="lg" fullWidth>
          Assinar Plano {selected === 'anual' ? 'Anual' : 'Mensal'}
        </Button>
      </div>

      <BottomNav />
    </MobileFrame>
  )
}
