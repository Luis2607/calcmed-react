import { useState } from 'react'
import { User, Baby, Users } from '@phosphor-icons/react'
import MobileFrame from '../components/layout/MobileFrame'
import Button from '../components/ui/Button'

const options = [
  { id: 'adulto', label: 'Adulto', icon: User },
  { id: 'pediatria', label: 'Pediatria', icon: Baby },
  { id: 'ambos', label: 'Ambos', icon: Users },
]

export default function Onboarding1Page() {
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <MobileFrame>
      <div className="screen-content flex-1 flex flex-col overflow-y-auto p-6 pt-10">
        <h1 className="t-titulo-pagina mb-6">Você atende<br />principalmente...</h1>

        <div className="flex flex-col gap-5" role="listbox" aria-label="Contexto de atendimento">
          {options.map(({ id, label, icon: Icon }) => (
            <div
              key={id}
              className={`card-selection ${selected === id ? 'selected' : ''}`}
              role="option"
              tabIndex={0}
              aria-selected={selected === id}
              onClick={() => setSelected(id)}
            >
              <div className="icon-circle"><Icon size={22} /></div>
              <span className="card-text">{label}</span>
            </div>
          ))}
        </div>

        <div className="flex-1" />

        <div className="progress mb-4">Passo 1 de 2</div>
        {selected ? (
          <Button variant="primary" size="lg" href="/onboarding/2" fullWidth>
            Continuar
          </Button>
        ) : (
          <Button variant="primary" size="lg" fullWidth disabled>
            Continuar
          </Button>
        )}
      </div>
    </MobileFrame>
  )
}
