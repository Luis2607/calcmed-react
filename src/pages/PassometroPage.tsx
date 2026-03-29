import { useState } from 'react'
import MobileFrame from '../components/layout/MobileFrame'
import PageHeader from '../components/layout/PageHeader'
import BottomNav from '../components/layout/BottomNav'
import { Minus, Plus, ArrowCounterClockwise } from '@phosphor-icons/react'

export default function PassometroPage() {
  const [count, setCount] = useState(12)

  const increment = () => setCount(prev => prev + 1)
  const decrement = () => setCount(prev => Math.max(0, prev - 1))
  const reset = () => setCount(0)

  return (
    <MobileFrame>
      <PageHeader title="Passometro" backTo="/menu" />

      <div className="screen-content flex-1 overflow-y-auto p-5">
        <div className="passometro-container">
          <div className="passometro-label t-legenda text-fg-3">Pacientes atendidos hoje</div>

          <div className="passometro-counter">
            <button
              className="passometro-btn passometro-btn-minus"
              onClick={decrement}
              aria-label="Diminuir contagem"
              disabled={count === 0}
            >
              <Minus size={24} weight="bold" />
            </button>

            <div className="passometro-number" aria-live="polite" aria-atomic="true">
              {count}
            </div>

            <button
              className="passometro-btn passometro-btn-plus"
              onClick={increment}
              aria-label="Aumentar contagem"
            >
              <Plus size={24} weight="bold" />
            </button>
          </div>

          <button
            className="passometro-reset"
            onClick={reset}
            aria-label="Zerar contagem"
          >
            <ArrowCounterClockwise size={18} />
            <span>Zerar contagem</span>
          </button>
        </div>
      </div>

      <BottomNav />
    </MobileFrame>
  )
}
