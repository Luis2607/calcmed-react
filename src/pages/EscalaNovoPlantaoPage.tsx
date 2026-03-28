import { useState, useCallback, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import MobileFrame from '../components/layout/MobileFrame'
import PageHeader from '../components/layout/PageHeader'
import BottomNav from '../components/layout/BottomNav'
import InputField from '../components/forms/InputField'
import Button from '../components/ui/Button'
import Chip from '../components/ui/Chip'
import { CaretDown } from '@phosphor-icons/react'

const shiftTypes = ['PS', 'UTI', 'Enfermaria', 'Outro']
const hospitals = ['Hospital São Lucas', 'UPA Centro', 'Hospital Regional', 'SAMU Base']

/** Format date as DD/MM/YYYY */
function formatDate(d: Date): string {
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  return `${dd}/${mm}/${d.getFullYear()}`
}

/** Mask time input to HH:MM */
function maskTime(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 4)
  if (digits.length <= 2) return digits
  return `${digits.slice(0, 2)}:${digits.slice(2)}`
}

export default function EscalaNovoPlantaoPage() {
  const navigate = useNavigate()
  const [activeType, setActiveType] = useState('PS')
  const [hospitalOpen, setHospitalOpen] = useState(false)
  const [selectedHospital, setSelectedHospital] = useState('')
  const [dateValue, setDateValue] = useState(formatDate(new Date(2026, 2, 28)))
  const [timeStart, setTimeStart] = useState('19:00')
  const [timeEnd, setTimeEnd] = useState('07:00')
  const [saving, setSaving] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown on outside click
  useEffect(() => {
    if (!hospitalOpen) return
    function handler(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setHospitalOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [hospitalOpen])

  const handleSave = useCallback(() => {
    setSaving(true)
    setTimeout(() => {
      navigate('/escala')
    }, 600)
  }, [navigate])

  return (
    <MobileFrame>
      <PageHeader title="Novo Plantão" backTo="/escala" />

      <div className="screen-content flex-1 overflow-y-auto p-5">
        <form className="novo-plantao-form" onSubmit={e => { e.preventDefault(); handleSave() }}>
          {/* Hospital */}
          <div className="input-group mb-5 relative" ref={dropdownRef}>
            <label htmlFor="hospital-select" className="input-label">Hospital</label>
            <button
              type="button"
              className={`select w-full ${hospitalOpen ? 'open' : ''}`}
              id="hospital-select"
              role="combobox"
              aria-expanded={hospitalOpen}
              aria-haspopup="listbox"
              aria-label="Selecione o hospital"
              onClick={() => setHospitalOpen(!hospitalOpen)}
            >
              <span className={`select-value ${!selectedHospital ? 'text-fg-3' : ''}`}>
                {selectedHospital || 'Selecione o hospital'}
              </span>
              <CaretDown size={20} className="select-arrow" aria-hidden="true" />
            </button>
            {hospitalOpen && (
              <div className="select-options" role="listbox">
                {hospitals.map(h => (
                  <div
                    key={h}
                    className={`select-option ${selectedHospital === h ? 'selected' : ''}`}
                    role="option"
                    aria-selected={selectedHospital === h}
                    onClick={() => { setSelectedHospital(h); setHospitalOpen(false) }}
                  >
                    {h}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Data */}
          <div className="mb-5">
            <InputField
              id="data-plantao"
              label="Data"
              type="text"
              placeholder="DD/MM/AAAA"
              value={dateValue}
              onChange={setDateValue}
              inputMode="numeric"
            />
          </div>

          {/* Horário */}
          <div className="flex gap-4 mb-5">
            <InputField
              id="horario-inicio"
              label="Início"
              placeholder="00:00"
              value={timeStart}
              onChange={v => setTimeStart(maskTime(v))}
              inputMode="numeric"
              className="flex-1"
            />
            <InputField
              id="horario-fim"
              label="Fim"
              placeholder="00:00"
              value={timeEnd}
              onChange={v => setTimeEnd(maskTime(v))}
              inputMode="numeric"
              className="flex-1"
            />
          </div>

          {/* Tipo */}
          <fieldset className="input-group mb-5">
            <legend className="input-label mb-2">Tipo</legend>
            <div className="flex gap-2 flex-wrap" role="radiogroup">
              {shiftTypes.map(t => (
                <Chip
                  key={t}
                  label={t}
                  active={activeType === t}
                  onClick={() => setActiveType(t)}
                />
              ))}
            </div>
          </fieldset>

          {/* Observações */}
          <div className="input-group mb-6">
            <label htmlFor="observacoes" className="input-label">Observações</label>
            <textarea id="observacoes" className="input-field" rows={3} placeholder="Anotações sobre o plantão..." />
          </div>

          {/* Botão */}
          <Button
            variant="primary"
            size="lg"
            fullWidth
            loading={saving}
            disabled={saving}
            onClick={handleSave}
            type="button"
          >
            {saving ? 'Salvando...' : 'Salvar Plantão'}
          </Button>
        </form>
      </div>
      <BottomNav />
    </MobileFrame>
  )
}
