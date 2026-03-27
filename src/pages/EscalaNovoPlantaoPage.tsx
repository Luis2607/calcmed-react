import { useState } from 'react'
import MobileFrame from '../components/layout/MobileFrame'
import PageHeader from '../components/layout/PageHeader'
import InputField from '../components/forms/InputField'
import Button from '../components/ui/Button'
import Chip from '../components/ui/Chip'
import { CaretDown } from '@phosphor-icons/react'

const shiftTypes = ['PS', 'UTI', 'Enfermaria', 'Outro']

export default function EscalaNovoPlantaoPage() {
  const [activeType, setActiveType] = useState('PS')

  return (
    <MobileFrame>
      <PageHeader title="Novo Plantão" backTo="/escala" />

      <div className="screen-content flex-1 overflow-y-auto p-5">
        {/* Hospital */}
        <div className="input-group mb-5">
          <label htmlFor="hospital-select" className="input-label">Hospital</label>
          <div className="select" id="hospital-select">
            <span className="select-value text-fg-3">Selecione o hospital</span>
            <CaretDown size={16} className="select-arrow" />
          </div>
        </div>

        {/* Data */}
        <div className="mb-5">
          <InputField id="data-plantao" label="Data" type="text" placeholder="DD/MM/AAAA" value="26/03/2026" />
        </div>

        {/* Horário */}
        <div className="flex gap-4 mb-5">
          <InputField id="horario-inicio" label="Início" placeholder="00:00" value="19:00" className="flex-1" />
          <InputField id="horario-fim" label="Fim" placeholder="00:00" value="07:00" className="flex-1" />
        </div>

        {/* Tipo */}
        <div className="input-group mb-5">
          <label className="input-label mb-2">Tipo</label>
          <div className="flex gap-2 flex-wrap">
            {shiftTypes.map(t => (
              <Chip
                key={t}
                label={t}
                active={activeType === t}
                onClick={() => setActiveType(t)}
              />
            ))}
          </div>
        </div>

        {/* Observações */}
        <div className="input-group mb-6">
          <label htmlFor="observacoes" className="input-label">Observações</label>
          <textarea id="observacoes" className="input-field" rows={3} placeholder="Anotações sobre o plantão..." />
        </div>

        {/* Botão */}
        <Button variant="primary" size="lg" href="/escala" fullWidth>Salvar Plantão</Button>
      </div>
    </MobileFrame>
  )
}
