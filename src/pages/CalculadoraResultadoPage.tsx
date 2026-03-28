import { useEffect, useState, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import MobileFrame from '../components/layout/MobileFrame'
import PageHeader from '../components/layout/PageHeader'
import BottomNav from '../components/layout/BottomNav'
import AlertCard from '../components/ui/AlertCard'
import Chip from '../components/ui/Chip'
import Button from '../components/ui/Button'

interface ResultState {
  idade?: string
  peso?: string
  cr?: string
  sexo?: string
  result?: number
}

function classifyResult(crcl: number): { label: string; warning: boolean } {
  if (crcl >= 90) return { label: 'Normal', warning: false }
  if (crcl >= 60) return { label: 'Est\u00e1gio 2 \u2013 Redu\u00e7\u00e3o leve', warning: false }
  if (crcl >= 30) return { label: 'Est\u00e1gio 3 \u2013 Redu\u00e7\u00e3o moderada', warning: true }
  if (crcl >= 15) return { label: 'Est\u00e1gio 4 \u2013 Redu\u00e7\u00e3o severa', warning: true }
  return { label: 'Est\u00e1gio 5 \u2013 Fal\u00eancia renal', warning: true }
}

function useCountUp(target: number, duration: number): number {
  const [current, setCurrent] = useState(0)
  const startRef = useRef<number | null>(null)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    startRef.current = null
    const animate = (timestamp: number) => {
      if (startRef.current === null) startRef.current = timestamp
      const elapsed = timestamp - startRef.current
      const progress = Math.min(elapsed / duration, 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setCurrent(Math.round(eased * target * 10) / 10)
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate)
      }
    }
    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
  }, [target, duration])

  return current
}

function formatNumber(n: number): string {
  // Brazilian format: comma as decimal separator
  const parts = n.toFixed(1).split('.')
  return parts[0] + ',' + parts[1]
}

export default function CalculadoraResultadoPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const state = (location.state as ResultState) || {}

  // Fallback values if navigated directly
  const idade = state.idade || '65'
  const peso = state.peso || '70'
  const cr = state.cr || '1.2'
  const sexo = state.sexo || 'M'
  const result = state.result ?? 72.5

  const classification = classifyResult(result)
  const animatedValue = useCountUp(result, 500)
  const isElderly = parseFloat(idade) >= 65

  const handleRecalcular = () => {
    navigate('/calculadora/crcl', {
      state: { idade, peso, cr, sexo },
    })
  }

  const handleSuggestion = (calc: string) => {
    // Navigate to related calculator — placeholder routes
    navigate(`/busca`, { state: { query: calc } })
  }

  return (
    <MobileFrame>
      <PageHeader
        title="Clearance de Creatinina"
        backTo="/calculadora/crcl"
        trailing={<span className="tag-domain calc">Calculadoras</span>}
      />

      <div className="screen-content flex-1 overflow-y-auto p-5">
        {/* Resumo dos inputs */}
        <div className="flex flex-wrap gap-3 mb-5" aria-label="Par\u00e2metros utilizados">
          <Chip label={`${idade} anos`} />
          <Chip label={`${peso} kg`} />
          <Chip label={`Cr ${cr.replace('.', ',')} mg/dL`} />
          <Chip label={sexo === 'M' ? 'Masculino' : 'Feminino'} />
        </div>

        {/* RESULTADO (PROTAGONISTA) */}
        <section aria-live="polite" aria-atomic="true" aria-label="Resultado do c\u00e1lculo">
          <AlertCard level="result" className="mb-4 result-entrance">
            <div className="text-center w-full">
              <div className="t-dose-valor">
                {formatNumber(animatedValue)}
                <span className="t-dose-unidade ml-2">mL/min</span>
              </div>
              <div className="result-badge mt-2">{classification.label}</div>
            </div>
          </AlertCard>
        </section>

        {/* INFO */}
        <AlertCard level="info" icon="info" title="F\u00f3rmula aplicada" className="mb-3">
          Cockcroft-Gault. Resultado ajustado para sexo e idade do paciente.
        </AlertCard>

        {/* WARNING — contextual */}
        {isElderly && (
          <AlertCard level="warning" icon="warning" title="Aten\u00e7\u00e3o" className="mb-3">
            Paciente &gt;65 anos: considerar ajuste de dose em medica\u00e7\u00f5es nefrot\u00f3xicas.
          </AlertCard>
        )}

        {classification.warning && (
          <AlertCard level="warning" icon="warning" title="Fun\u00e7\u00e3o renal reduzida" className="mb-3">
            CrCl &lt;60 mL/min: revisar doses de medicamentos com elimina\u00e7\u00e3o renal.
          </AlertCard>
        )}

        {/* FOOTNOTE */}
        <AlertCard level="footnote" icon="book-open" title="Ref: Cockcroft & Gault, 1976. Nephron 16(1):31-41." className="mb-6" />

        {/* Sugest\u00f5es relacionadas */}
        <div className="t-legenda text-fg-3 mb-2">M\u00e9dicos que usam CrCl tamb\u00e9m usam:</div>
        <div className="flex gap-2 mb-5">
          <Chip label="IRA KDIGO" domain="calc" onClick={() => handleSuggestion('IRA KDIGO')} />
          <Chip label="Osmolaridade" domain="calc" onClick={() => handleSuggestion('Osmolaridade')} />
        </div>

        {/* Recalcular */}
        <Button variant="ghost" size="lg" fullWidth onClick={handleRecalcular}>Recalcular</Button>
      </div>

      <BottomNav />
    </MobileFrame>
  )
}
