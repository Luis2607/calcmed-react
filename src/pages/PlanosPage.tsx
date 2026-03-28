import { useState } from 'react'
import MobileFrame from '../components/layout/MobileFrame'
import PageHeader from '../components/layout/PageHeader'
import BottomNav from '../components/layout/BottomNav'
import PlanCard from '../components/cards/PlanCard'
import InputField from '../components/forms/InputField'
import Button from '../components/ui/Button'
import { Tag, ShieldCheck, CheckCircle, XCircle } from '@phosphor-icons/react'
import { useLayout } from '../contexts/LayoutContext'

const VALID_COUPONS: Record<string, string> = {
  EMERGENCAST: '10% de desconto',
  CALCMED20: '20% de desconto',
}

export default function PlanosPage() {
  const { layoutMode } = useLayout()
  const isWeb = layoutMode === 'web'
  const [selected, setSelected] = useState<'anual' | 'mensal'>('anual')
  const [showCoupon, setShowCoupon] = useState(false)
  const [coupon, setCoupon] = useState('')
  const [couponStatus, setCouponStatus] = useState<'idle' | 'valid' | 'invalid'>('idle')
  const [couponMsg, setCouponMsg] = useState('')

  const applyCoupon = () => {
    const code = coupon.trim().toUpperCase()
    if (!code) return
    const discount = VALID_COUPONS[code]
    if (discount) {
      setCouponStatus('valid')
      setCouponMsg(`Cupom aplicado: ${discount}`)
    } else {
      setCouponStatus('invalid')
      setCouponMsg('Cupom inválido')
    }
  }

  return (
    <MobileFrame>
      <PageHeader title="Escolha seu plano" backTo="/premium" />

      <div className="screen-content planos-screen flex-1 overflow-y-auto p-5 pb-8">
        {/* Proposta de valor */}
        <div className="text-center mb-6">
          <div className="t-titulo-pagina mb-2">Acesso completo ao seu plantão</div>
          <p className="t-corpo-2 text-fg-2">Todas as calculadoras, protocolos e escores sem limitações.</p>
        </div>

        {/* Cards de planos */}
        <div className="plan-cards-group" role="radiogroup" aria-label="Selecione o plano">
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
        </div>

        {/* Cupom */}
        <div className="mb-6">
          <button
            type="button"
            className="btn-text t-corpo-2"
            onClick={() => setShowCoupon(v => !v)}
            aria-expanded={showCoupon}
          >
            <Tag size={16} className="mr-1" aria-hidden="true" /> Tem cupom?
          </button>
          {showCoupon && (
            <div>
              <div className="flex gap-3 mt-3 items-end">
                <InputField
                  id="cupom"
                  label="Código do cupom"
                  placeholder="Digite o cupom"
                  className={`flex-1 ${couponStatus === 'valid' ? 'success' : ''} ${couponStatus === 'invalid' ? 'error' : ''}`}
                  value={coupon}
                  onChange={(val) => { setCoupon(val.toUpperCase()); if (couponStatus !== 'idle') setCouponStatus('idle') }}
                />
                <Button variant="primary" size="md" onClick={applyCoupon}>Aplicar</Button>
              </div>
              {couponStatus !== 'idle' && (
                <div className={`coupon-feedback ${couponStatus === 'valid' ? 'valid' : 'invalid'}`} role="status">
                  {couponStatus === 'valid'
                    ? <CheckCircle size={16} weight="fill" />
                    : <XCircle size={16} weight="fill" />}
                  {couponMsg}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Confianca */}
        <div className="flex items-center justify-center gap-2 text-fg-3">
          <ShieldCheck size={16} aria-hidden="true" />
          <span className="t-legenda">Pagamento seguro. Cancele quando quiser</span>
        </div>
      </div>

      {/* CTA FIXO */}
      <div className="sticky-footer">
        <Button variant="primary" size="lg" fullWidth>
          Assinar Plano {selected === 'anual' ? 'Anual' : 'Mensal'}
        </Button>
      </div>
      {isWeb && <BottomNav />}
    </MobileFrame>
  )
}
