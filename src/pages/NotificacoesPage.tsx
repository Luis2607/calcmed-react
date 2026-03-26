import MobileFrame from '../components/layout/MobileFrame'
import PageHeader from '../components/layout/PageHeader'
import BottomNav from '../components/layout/BottomNav'
import NotifItem from '../components/cards/NotifItem'

export default function NotificacoesPage() {
  return (
    <MobileFrame>
      <PageHeader title="Notificações" backTo="/home" />

      <div className="screen-content flex-1 overflow-y-auto p-5">
        <NotifItem
          icon="warning-circle"
          iconClass="text-warning"
          title="Sua degustação de DHE expira amanhã"
          meta="há 1 dia"
          unread
          variant="warning"
        />
        <NotifItem
          icon="megaphone"
          iconClass="text-link"
          title="Novo protocolo: Cetoacidose Diabética 2026"
          meta="há 3 dias"
          unread
          variant="info"
        />
        <NotifItem
          icon="bell-ringing"
          title="CalcMed atualizado — Confira as novidades"
          meta="há 1 semana"
        />
        <NotifItem
          icon="star"
          title="Avalie o CalcMed na App Store"
          meta="há 2 semanas"
        />
        <NotifItem
          icon="gift"
          title="Bem-vindo ao CalcMed!"
          meta="há 3 semanas"
        />
      </div>

      <BottomNav />
    </MobileFrame>
  )
}
