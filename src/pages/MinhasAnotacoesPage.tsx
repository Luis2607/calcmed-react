import { useState } from 'react'
import MobileFrame from '../components/layout/MobileFrame'
import PageHeader from '../components/layout/PageHeader'
import BottomNav from '../components/layout/BottomNav'
import { Plus, NotePencil } from '@phosphor-icons/react'

interface Nota {
  id: string
  title: string
  preview: string
  date: string
}

const mockNotas: Nota[] = [
  { id: '1', title: 'Protocolo IOT via rapida', preview: 'Fentanil 2mcg/kg + Lidocaina 1.5mg/kg + Propofol 2mg/kg + Succinilcolina 1.5mg/kg...', date: '28 mar 2026' },
  { id: '2', title: 'Doses pediatricas PCR', preview: 'Adrenalina 0.01mg/kg IV/IO a cada 3-5min. Amiodarona 5mg/kg IV/IO...', date: '25 mar 2026' },
  { id: '3', title: 'Checklist admissao UTI', preview: '1. Monitorizacao 2. Acesso venoso central 3. Gasometria arterial 4. ECG...', date: '20 mar 2026' },
]

export default function MinhasAnotacoesPage() {
  const [notas] = useState<Nota[]>(mockNotas)
  const isEmpty = notas.length === 0

  return (
    <MobileFrame>
      <PageHeader title="Minhas Anotacoes" backTo="/menu" />

      <div className="screen-content flex-1 overflow-y-auto p-5">
        {isEmpty ? (
          <div className="empty-state mt-6" role="status">
            <div className="empty-icon text-fg-3">
              <NotePencil size={48} />
            </div>
            <div className="empty-title">Nenhuma anotacao ainda</div>
            <div className="empty-desc">Crie sua primeira anotacao para organizar seus protocolos e lembretes.</div>
          </div>
        ) : (
          <div className="anotacoes-list">
            {notas.map(nota => (
              <div key={nota.id} className="anotacao-card">
                <div className="anotacao-title t-alerta-titulo">{nota.title}</div>
                <div className="anotacao-preview t-legenda text-fg-2">{nota.preview}</div>
                <div className="anotacao-date t-legenda text-fg-3">{nota.date}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FAB */}
      <button className="fab" aria-label="Criar nova anotacao">
        <Plus size={24} weight="bold" />
      </button>

      <BottomNav />
    </MobileFrame>
  )
}
