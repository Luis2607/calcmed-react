import { useState, useMemo } from 'react'
import MobileFrame from '../components/layout/MobileFrame'
import PageHeader from '../components/layout/PageHeader'
import BottomNav from '../components/layout/BottomNav'
import InputField from '../components/forms/InputField'
import SegmentedControl from '../components/forms/SegmentedControl'
import Button from '../components/ui/Button'

interface FieldState {
  value: string
  error: string
}

const ranges = {
  idade: { min: 18, max: 120, label: 'idade' },
  peso: { min: 30, max: 300, label: 'peso' },
  cr: { min: 0.1, max: 30, label: 'creatinina' },
}

function validate(val: string, range: { min: number; max: number }): string {
  if (!val) return ''
  const n = parseFloat(val)
  if (isNaN(n) || n < range.min || n > range.max) {
    return `Valor fora da faixa clínica: ${range.min}–${range.max}`
  }
  return ''
}

export default function CalculadoraInputsPage() {
  const [idade, setIdade] = useState<FieldState>({ value: '', error: '' })
  const [peso, setPeso] = useState<FieldState>({ value: '', error: '' })
  const [cr, setCr] = useState<FieldState>({ value: '', error: '' })
  const [sexo, setSexo] = useState('M')

  const updateField = (
    setter: React.Dispatch<React.SetStateAction<FieldState>>,
    range: { min: number; max: number }
  ) => (val: string) => {
    setter({ value: val, error: validate(val, range) })
  }

  const isValid = useMemo(() => {
    return (
      idade.value !== '' && !idade.error &&
      peso.value !== '' && !peso.error &&
      cr.value !== '' && !cr.error
    )
  }, [idade, peso, cr])

  return (
    <MobileFrame>
      <PageHeader
        title="Clearance de Creatinina"
        backTo="/home"
        trailing={<span className="tag-domain calc">Calculadoras</span>}
      />

      <div className="screen-content flex-1 overflow-y-auto p-5">
        <InputField
          id="idade"
          label="Idade"
          type="number"
          inputMode="numeric"
          placeholder="Ex: 65"
          value={idade.value}
          onChange={updateField(setIdade, ranges.idade)}
          unit="anos"
          error={idade.error}
          min={18}
          max={120}
          className="mb-5"
        />

        <InputField
          id="peso"
          label="Peso"
          type="number"
          inputMode="numeric"
          placeholder="Ex: 70"
          value={peso.value}
          onChange={updateField(setPeso, ranges.peso)}
          unit="kg"
          error={peso.error}
          min={30}
          max={300}
          className="mb-5"
        />

        <InputField
          id="cr"
          label="Creatinina sérica"
          type="number"
          inputMode="decimal"
          placeholder="Ex: 1.2"
          value={cr.value}
          onChange={updateField(setCr, ranges.cr)}
          unit="mg/dL"
          error={cr.error}
          min={0.1}
          max={30}
          step={0.1}
          className="mb-5"
        />

        <div className="input-group mb-6">
          <label id="sexo-label" className="input-label mb-2" htmlFor="sexo">Sexo</label>
          <SegmentedControl
            id="sexo"
            options={[
              { value: 'M', label: 'Masculino' },
              { value: 'F', label: 'Feminino' },
            ]}
            value={sexo}
            onChange={setSexo}
          />
        </div>
      </div>

      {/* CTA FIXO */}
      <div className="sticky-footer">
        {isValid ? (
          <Button variant="primary" size="lg" href="/calculadora/crcl/resultado" fullWidth>
            Calcular
          </Button>
        ) : (
          <Button variant="primary" size="lg" fullWidth disabled>
            Calcular
          </Button>
        )}
      </div>

      <BottomNav />
    </MobileFrame>
  )
}
