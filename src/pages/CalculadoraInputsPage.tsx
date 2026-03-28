import { useState, useMemo, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import MobileFrame from '../components/layout/MobileFrame'
import PageHeader from '../components/layout/PageHeader'
import BottomNav from '../components/layout/BottomNav'
import InputField from '../components/forms/InputField'
import SegmentedControl from '../components/forms/SegmentedControl'
import Button from '../components/ui/Button'

interface FieldState {
  value: string
  error: string
  touched: boolean
}

interface ClinicalRange {
  min: number
  max: number
  unit: string
}

const ranges: Record<string, ClinicalRange> = {
  idade: { min: 18, max: 120, unit: 'anos' },
  peso: { min: 30, max: 300, unit: 'kg' },
  cr: { min: 0.1, max: 30, unit: 'mg/dL' },
}

function validate(val: string, range: ClinicalRange): string {
  if (!val) return ''
  const n = parseFloat(val)
  if (isNaN(n) || n < range.min || n > range.max) {
    return `Faixa cl\u00ednica: ${range.min}\u2013${range.max} ${range.unit}`
  }
  return ''
}

interface PrefillState {
  idade?: string
  peso?: string
  cr?: string
  sexo?: string
}

export default function CalculadoraInputsPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const prefill = (location.state as PrefillState) || {}

  const [idade, setIdade] = useState<FieldState>({ value: prefill.idade || '', error: '', touched: false })
  const [peso, setPeso] = useState<FieldState>({ value: prefill.peso || '', error: '', touched: false })
  const [cr, setCr] = useState<FieldState>({ value: prefill.cr || '', error: '', touched: false })
  const [sexo, setSexo] = useState(prefill.sexo || 'M')
  const [loading, setLoading] = useState(false)

  // Per-field change handlers with correct clinical range
  const onChangeIdade = useCallback((val: string) => {
    setIdade(prev => ({ ...prev, value: val, error: prev.touched ? validate(val, ranges.idade) : '' }))
  }, [])

  const onChangePeso = useCallback((val: string) => {
    setPeso(prev => ({ ...prev, value: val, error: prev.touched ? validate(val, ranges.peso) : '' }))
  }, [])

  const onChangeCr = useCallback((val: string) => {
    setCr(prev => ({ ...prev, value: val, error: prev.touched ? validate(val, ranges.cr) : '' }))
  }, [])

  const onBlurIdade = useCallback(() => {
    setIdade(prev => ({ ...prev, touched: true, error: validate(prev.value, ranges.idade) }))
  }, [])

  const onBlurPeso = useCallback(() => {
    setPeso(prev => ({ ...prev, touched: true, error: validate(prev.value, ranges.peso) }))
  }, [])

  const onBlurCr = useCallback(() => {
    setCr(prev => ({ ...prev, touched: true, error: validate(prev.value, ranges.cr) }))
  }, [])

  const isValid = useMemo(() => {
    const idadeNum = parseFloat(idade.value)
    const pesoNum = parseFloat(peso.value)
    const crNum = parseFloat(cr.value)
    return (
      idade.value !== '' && !isNaN(idadeNum) && idadeNum >= ranges.idade.min && idadeNum <= ranges.idade.max &&
      peso.value !== '' && !isNaN(pesoNum) && pesoNum >= ranges.peso.min && pesoNum <= ranges.peso.max &&
      cr.value !== '' && !isNaN(crNum) && crNum >= ranges.cr.min && crNum <= ranges.cr.max
    )
  }, [idade.value, peso.value, cr.value])

  const handleCalcular = useCallback(() => {
    if (!isValid || loading) return
    setLoading(true)

    // Cockcroft-Gault formula
    const idadeNum = parseFloat(idade.value)
    const pesoNum = parseFloat(peso.value)
    const crNum = parseFloat(cr.value)
    const crcl = ((140 - idadeNum) * pesoNum) / (72 * crNum) * (sexo === 'F' ? 0.85 : 1)
    const result = Math.round(crcl * 10) / 10

    setTimeout(() => {
      navigate('/calculadora/crcl/resultado', {
        state: {
          idade: idade.value,
          peso: peso.value,
          cr: cr.value,
          sexo,
          result,
        },
      })
    }, 200)
  }, [isValid, loading, idade.value, peso.value, cr.value, sexo, navigate])

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
          onChange={onChangeIdade}
          onBlur={onBlurIdade}
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
          onChange={onChangePeso}
          onBlur={onBlurPeso}
          unit="kg"
          error={peso.error}
          min={30}
          max={300}
          className="mb-5"
        />

        <InputField
          id="cr"
          label="Creatinina s\u00e9rica"
          type="number"
          inputMode="decimal"
          placeholder="Ex: 1.2"
          value={cr.value}
          onChange={onChangeCr}
          onBlur={onBlurCr}
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
        <Button
          variant="primary"
          size="lg"
          fullWidth
          disabled={!isValid}
          loading={loading}
          onClick={handleCalcular}
        >
          {loading ? 'Calculando...' : 'Calcular'}
        </Button>
      </div>

      <BottomNav />
    </MobileFrame>
  )
}
