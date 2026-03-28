import { useState, useCallback } from 'react'
import MobileFrame from '../components/layout/MobileFrame'
import PageHeader from '../components/layout/PageHeader'
import BottomNav from '../components/layout/BottomNav'
import NotifItem from '../components/cards/NotifItem'

interface NotifData {
  id: string
  icon: string
  title: string
  meta: string
  unread: boolean
  variant: 'default' | 'warning' | 'info' | 'success'
}

const initialNotifs: NotifData[] = [
  { id: 'n1', icon: 'megaphone', title: 'Novo protocolo: Cetoacidose Diabética 2026', meta: 'há 2 horas', unread: true, variant: 'info' },
  { id: 'n2', icon: 'warning-circle', title: 'Seu teste de DHE expira amanhã', meta: 'há 5 horas', unread: true, variant: 'warning' },
  { id: 'n3', icon: 'check-circle', title: 'Assinatura Premium confirmada', meta: 'há 2 dias', unread: false, variant: 'success' },
  { id: 'n4', icon: 'bell-ringing', title: 'CalcMed atualizado - Confira as novidades', meta: 'há 3 dias', unread: false, variant: 'info' },
  { id: 'n5', icon: 'star', title: 'Avalie o CalcMed na App Store', meta: 'há 5 dias', unread: false, variant: 'default' },
  { id: 'n6', icon: 'gift', title: 'Bem-vindo ao CalcMed!', meta: 'há 7 dias', unread: false, variant: 'default' },
]

export default function NotificacoesPage() {
  const [notifs, setNotifs] = useState(initialNotifs)

  const markRead = useCallback((id: string) => {
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n))
  }, [])

  const todayNotifs = notifs.filter(n => n.id === 'n1' || n.id === 'n2')
  const weekNotifs = notifs.filter(n => n.id !== 'n1' && n.id !== 'n2')
  const allRead = !notifs.some(n => n.unread)

  return (
    <MobileFrame>
      <PageHeader title="Notificações" backTo="/home" />

      <div className="screen-content flex-1 overflow-y-auto p-5">
        {/* Hoje */}
        <div className="notif-section-label">Hoje</div>
        <div className="notif-divider" />

        {todayNotifs.map((n, i) => (
          <NotifItem
            key={n.id}
            icon={n.icon}
            title={n.title}
            meta={n.meta}
            unread={n.unread}
            variant={n.variant}
            showSwipeHint={i === 0 && n.unread}
            onMarkRead={() => markRead(n.id)}
          />
        ))}

        {/* Esta semana */}
        <div className="notif-section-label mt-4">Esta semana</div>
        <div className="notif-divider" />

        {weekNotifs.map(n => (
          <NotifItem
            key={n.id}
            icon={n.icon}
            title={n.title}
            meta={n.meta}
            unread={n.unread}
            variant={n.variant}
            onMarkRead={() => markRead(n.id)}
          />
        ))}

        {/* Empty state - shown when all notifications are read */}
        {allRead && (
          <div className="empty-state mt-6" role="status" aria-live="polite">
            <div className="empty-icon text-success">
              <svg
                className="empty-checkmark-svg"
                width="48"
                height="48"
                viewBox="0 0 48 48"
                fill="none"
                aria-hidden="true"
              >
                <circle
                  className="empty-checkmark-circle"
                  cx="24"
                  cy="24"
                  r="21"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <path
                  className="empty-checkmark-tick"
                  d="M15 24.5L21 30.5L33 18.5"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="empty-title">Você está em dia!</div>
            <div className="empty-desc">Nenhuma notificação pendente.</div>
          </div>
        )}
      </div>

      <BottomNav />
    </MobileFrame>
  )
}
