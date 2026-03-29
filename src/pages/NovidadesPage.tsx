import MobileFrame from '../components/layout/MobileFrame'
import PageHeader from '../components/layout/PageHeader'
import BottomNav from '../components/layout/BottomNav'
import { Megaphone, ArrowUp, Sparkle, ListChecks } from '@phosphor-icons/react'

interface NovidadeItem {
  id: string
  icon: React.ReactNode
  tag: string
  tagType: 'novo' | 'atualizado'
  title: string
  description: string
  date: string
}

const novidades: NovidadeItem[] = [
  {
    id: 'n1',
    icon: <ArrowUp size={20} />,
    tag: 'ATUALIZADO',
    tagType: 'atualizado',
    title: 'Cetoacidose Diabetica atualizada',
    description: 'Novo protocolo baseado nas diretrizes 2026',
    date: 'Ha 2 dias',
  },
  {
    id: 'n2',
    icon: <Sparkle size={20} />,
    tag: 'NOVO',
    tagType: 'novo',
    title: 'CalcMed IA disponivel',
    description: 'Tire duvidas clinicas com inteligencia artificial',
    date: 'Ha 1 semana',
  },
  {
    id: 'n3',
    icon: <ListChecks size={20} />,
    tag: 'NOVO',
    tagType: 'novo',
    title: 'Novos escores adicionados',
    description: 'FOUR Score e Aldrete agora disponiveis',
    date: 'Ha 2 semanas',
  },
  {
    id: 'n4',
    icon: <Megaphone size={20} />,
    tag: 'NOVO',
    tagType: 'novo',
    title: 'Modo escuro aprimorado',
    description: 'Contraste AAA em todas as telas clinicas',
    date: 'Ha 3 semanas',
  },
]

export default function NovidadesPage() {
  return (
    <MobileFrame>
      <PageHeader title="Novidades e Lancamentos" backTo="/menu" />

      <div className="screen-content flex-1 overflow-y-auto p-5">
        <div className="novidades-list">
          {novidades.map(item => (
            <div key={item.id} className="novidade-card">
              <div className="novidade-icon-wrap">
                <div className={`novidade-icon ${item.tagType === 'novo' ? 'icon-circle-teal' : 'icon-circle-warning'}`}>
                  {item.icon}
                </div>
              </div>
              <div className="novidade-content">
                <div className="novidade-header">
                  <span className={`tag-status ${item.tagType}`}>{item.tag}</span>
                  <span className="novidade-date t-legenda text-fg-3">{item.date}</span>
                </div>
                <div className="novidade-title t-alerta-titulo">{item.title}</div>
                <div className="novidade-desc t-legenda text-fg-2">{item.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </MobileFrame>
  )
}
